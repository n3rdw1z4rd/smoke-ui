import { registerRead } from "./tracking";

type Subscriber<T> = (value: T) => void;

export class Signal<T> {
    private value: T;
    private readonly subscribers = new Set<Subscriber<T>>();

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    get(): T {
        registerRead(this);
        return this.value;
    }

    set(value: T): void {
        if (Object.is(this.value, value)) return;

        this.value = value;

        for (const subscriber of [...this.subscribers]) {
            subscriber(value);
        }
    }

    subscribe(subscriber: Subscriber<T>): () => void {
        this.subscribers.add(subscriber);

        subscriber(this.value); // immediately notify

        return () => this.subscribers.delete(subscriber);
    }
}
