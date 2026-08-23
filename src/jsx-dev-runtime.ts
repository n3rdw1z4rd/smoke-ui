import { jsx, Fragment, JSX } from "./jsx-runtime";

export function jsxDEV(
    type: string | ((props: any) => Node),
    props: Record<string, any>,
    _key?: string,
    _isStaticChildren?: boolean,
    _source?: unknown,
    _self?: unknown
) {
    return jsx(type, props);
}

export { Fragment };
export type { JSX };
