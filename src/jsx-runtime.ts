import { Signal } from "./signal";

export type ComponentFn = (props: any) => Node;

function applyStyle(el: HTMLElement, styleProps: Record<string, any>) {
    for (const key in styleProps) {
        const value = styleProps[key];

        if (value instanceof Signal) {
            value.subscribe((next) => {
                (el.style as any)[key] = next;
            });
            continue;
        }

        (el.style as any)[key] = value;
    }
}

function applyProp(el: HTMLElement, key: string, value: any) {
    if (value instanceof Signal) {
        value.subscribe((next) => applyProp(el, key, next));

        return;
    }

    if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();

        el.addEventListener(eventName, value);

        return;
    }

    if (key === "className") {
        el.setAttribute("class", value);

        return;
    }

    if (key === "style" && typeof value === "object" && value !== null) {
        applyStyle(el, value);

        return;
    }

    const propKeys = new Set(["value", "checked", "disabled", "selected"]);

    if (propKeys.has(key)) {
        (el as any)[key] = value;

        return;
    }

    el.setAttribute(key, value);
}

function appendChild(el: Element | DocumentFragment, child: any) {
    if (Array.isArray(child)) {
        child.forEach((c) => appendChild(el, c));

        return;
    }

    if (child instanceof Signal) {
        const textNode = document.createTextNode(String(child.get()));

        child.subscribe((next) => {
            textNode.textContent = String(next);
        });

        el.append(textNode);

        return;
    }

    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
}

export function jsx(type: string | ComponentFn, props: Record<string, any>) {
    if (typeof type === "function") {
        return type(props);
    }

    const el = document.createElement(type);

    for (const key in props) {
        if (key === "children") continue;
        applyProp(el, key, props[key]);
    }

    const children = props.children;
    if (children) {
        (Array.isArray(children) ? children : [children]).forEach((child) => appendChild(el, child));
    }

    return el;
}

export const jsxs = jsx;

export function Fragment(props: { children?: any }) {
    const frag = document.createDocumentFragment();
    const children = props.children;
    if (children) {
        (Array.isArray(children) ? children : [children]).forEach((child) => appendChild(frag, child));
    }
    return frag;
}

export namespace JSX {
    export interface IntrinsicElements {
        [elemName: string]: any;
    }
    export type Element = Node;
}
