import type { Signal } from "./signal";

let activeTracker: Set<Signal<any>> | null = null;

export function track(fn: () => void): Set<Signal<any>> {
    const deps = new Set<Signal<any>>();
    const previous = activeTracker;
    activeTracker = deps;

    try {
        fn();
    } finally {
        activeTracker = previous;
    }

    return deps;
}

export function registerRead(signal: Signal<any>): void {
    if (activeTracker) {
        activeTracker.add(signal);
    }
}
