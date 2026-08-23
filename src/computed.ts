import { Signal } from "./signal";
import { track } from "./tracking";

export function computed<T>(calc: () => T): Signal<T> {
    const result = new Signal<T>(undefined as T);
    let unsubscribers: (() => void)[] = [];

    const recompute = () => {
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

    recompute();

    return result;
}
