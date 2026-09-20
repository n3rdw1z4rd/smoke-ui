const cleanupRegistry = new WeakMap<Node, Set<() => void>>();

export function onCleanup(node: Node, cleanup: () => void): void {
    let callbacks = cleanupRegistry.get(node);

    if (!callbacks) {
        callbacks = new Set();
        cleanupRegistry.set(node, callbacks);
    }

    callbacks.add(cleanup);
}

export function unmount(node: Node): void {
    for (const child of Array.from(node.childNodes)) {
        unmount(child);
    }

    const callbacks = cleanupRegistry.get(node);

    if (callbacks) {
        for (const cleanup of callbacks) {
            cleanup();
        }

        cleanupRegistry.delete(node);
    }

    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
