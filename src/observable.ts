type Observer = (...args: any[]) => void;

export class Observable {
    private readonly observers = new Set<Observer>();

    subscribe(observer: Observer): () => void {
        this.observers.add(observer);

        return () => this.observers.delete(observer);
    }

    once(observer: Observer): () => void {
        const unsubscribe = this.subscribe((...args: any[]) => {
            unsubscribe();
            observer(...args);
        });

        return unsubscribe;
    }

    notify(...args: any[]): void {
        for (const observer of [...this.observers]) {
            observer(...args);
        }
    }

    clear(): void {
        this.observers.clear();
    }

    get size(): number {
        return this.observers.size;
    }
}
