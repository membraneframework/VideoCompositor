"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceContextStore = void 0;
class InstanceContextStore {
    constructor() {
        this.context = {
            inputs: {},
        };
        this.onChangeCallbacks = new Set();
        // callback for useSyncExternalStore
        this.getSnapshot = () => {
            return this.context;
        };
        // callback for useSyncExternalStore
        this.subscribe = (onStoreChange) => {
            this.onChangeCallbacks.add(onStoreChange);
            return () => {
                this.onChangeCallbacks.delete(onStoreChange);
            };
        };
    }
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
    runBlocking(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            this.eventQueue = [];
            try {
                return yield fn(a => this.applyUpdate(a));
            }
            finally {
                for (const event of this.eventQueue) {
                    this.applyUpdate(event);
                }
                this.eventQueue = undefined;
            }
        });
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
        this.context = Object.assign(Object.assign({}, this.context), { inputs: Object.assign(Object.assign({}, this.context.inputs), { [input.inputId]: input }) });
        this.signalUpdate();
    }
    updateInput(update) {
        const oldInput = this.context.inputs[update.inputId];
        if (!oldInput) {
            console.warn(`Updating input ${update.inputId}. Input does not exist.`);
            return;
        }
        this.context = Object.assign(Object.assign({}, this.context), { inputs: Object.assign(Object.assign({}, this.context.inputs), { [update.inputId]: Object.assign(Object.assign({}, oldInput), update) }) });
        this.signalUpdate();
    }
    removeInput(inputId) {
        const inputs = Object.assign({}, this.context.inputs);
        delete inputs[inputId];
        this.context = Object.assign(Object.assign({}, this.context), { inputs });
        this.signalUpdate();
    }
    signalUpdate() {
        for (const cb of this.onChangeCallbacks) {
            cb();
        }
    }
}
exports.InstanceContextStore = InstanceContextStore;
