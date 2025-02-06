export class InstanceContextStore {
    context = {
        inputs: {},
    };
    onChangeCallbacks = new Set();
    eventQueue;
    /**
     * Apply update immediately if there are no `runBlocking` calls in progress.
     * Otherwise wait for `runBlocking call to finish`.
     */
    dispatchUpdate(update) {
        if (this.eventQueue) {
            this.eventQueue.push(update);
        }
        else {
            this.applyUpdate(update);
        }
    }
    /**
     * No dispatch events will be processed while `fn` function executes.
     * Argument passed to the callback should be used instead of `this.dispatchUpdate`
     * to update the store from inside `fn`
     */
    async runBlocking(fn) {
        this.eventQueue = [];
        try {
            return await fn(a => this.applyUpdate(a));
        }
        finally {
            for (const event of this.eventQueue) {
                this.applyUpdate(event);
            }
            this.eventQueue = undefined;
        }
    }
    applyUpdate(update) {
        if (update.type === 'add_input') {
            this.addInput(update.input);
        }
        else if (update.type === 'update_input') {
            this.updateInput(update.input);
        }
        else if (update.type === 'remove_input') {
            this.removeInput(update.inputId);
        }
    }
    addInput(input) {
        if (this.context.inputs[input.inputId]) {
            console.warn(`Adding input ${input.inputId}. Input already exists.`);
        }
        this.context = {
            ...this.context,
            inputs: { ...this.context.inputs, [input.inputId]: input },
        };
        this.signalUpdate();
    }
    updateInput(update) {
        const oldInput = this.context.inputs[update.inputId];
        if (!oldInput) {
            console.warn(`Updating input ${update.inputId}. Input does not exist.`);
            return;
        }
        this.context = {
            ...this.context,
            inputs: {
                ...this.context.inputs,
                [update.inputId]: { ...oldInput, ...update },
            },
        };
        this.signalUpdate();
    }
    removeInput(inputId) {
        const inputs = { ...this.context.inputs };
        delete inputs[inputId];
        this.context = { ...this.context, inputs };
        this.signalUpdate();
    }
    signalUpdate() {
        for (const cb of this.onChangeCallbacks) {
            cb();
        }
    }
    // callback for useSyncExternalStore
    getSnapshot = () => {
        return this.context;
    };
    // callback for useSyncExternalStore
    subscribe = (onStoreChange) => {
        this.onChangeCallbacks.add(onStoreChange);
        return () => {
            this.onChangeCallbacks.delete(onStoreChange);
        };
    };
}
