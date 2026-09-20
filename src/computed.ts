import { Signal } from "./signal";
import { track } from "./tracking";

export type ComputedSignal<T> = Signal<T> & { dispose(): void };

export function computed<T>(calc: () => T): ComputedSignal<T> {
    const result = new Signal<T>(undefined as T) as ComputedSignal<T>;
    let unsubscribers: (() => void)[] = [];
    let disposed = false;

    const recompute = () => {
        if (disposed) return;

        unsubscribers.forEach((unsub) => unsub());
        unsubscribers = [];

        let value!: T;
        const deps = track(() => {
            value = calc();
        });

        for (const dep of deps) {
            let isInitialNotify = true;

            const unsub = dep.subscribe(() => {
                if (isInitialNotify) {
                    isInitialNotify = false;
                    return;
                }

                recompute();
            });

            unsubscribers.push(unsub);
        }

        result.set(value);
    };

    result.dispose = () => {
        disposed = true;
        unsubscribers.forEach((unsub) => unsub());
        unsubscribers = [];
    };

    recompute();
    return result;
}
