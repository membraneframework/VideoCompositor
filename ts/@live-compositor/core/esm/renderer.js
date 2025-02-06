// eslint-disable-next-line import/no-named-as-default
import Reconciler from 'react-reconciler';
import { DefaultEventPriority, LegacyRoot } from 'react-reconciler/constants.js';
export class LiveCompositorHostComponent {
    props;
    sceneBuilder;
    children = [];
    constructor(props, sceneBuilder) {
        this.props = props;
        this.sceneBuilder = sceneBuilder;
    }
    scene() {
        const children = this.children.map(child => typeof child === 'string' ? child : child.scene());
        return this.sceneBuilder(this.props, groupTextComponents(children));
    }
}
const HostConfig = {
    getPublicInstance(instance) {
        return instance;
    },
    getRootHostContext(_rootContainer) {
        return null;
    },
    getChildHostContext(parentHostContext, _type, _rootContainer) {
        return parentHostContext;
    },
    prepareForCommit(_containerInfo) {
        return null;
    },
    resetAfterCommit(container) {
        container.onUpdate();
    },
    createInstance(type, props, _rootContainer, _hostContext, _internalHandle) {
        if (type === 'compositor') {
            return new LiveCompositorHostComponent(props.props, props.sceneBuilder);
        }
        else {
            throw new Error(`Unknown type ${type}`);
        }
    },
    appendInitialChild(parentInstance, child) {
        parentInstance.children.push(child);
    },
    finalizeInitialChildren(_instance, _type, _props, _rootContainer, _hostContext) {
        // if true commitMount will be called
        return false;
    },
    prepareUpdate(_instance, _type, _oldProps, newProps, _rootContainer, _hostContext) {
        // TODO: optimize, it always triggers update
        return newProps;
    },
    shouldSetTextContent(_type, _props) {
        return false;
    },
    createTextInstance(text, _rootContainer, _hostContext, _internalHandle) {
        return text;
    },
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    noTimeout: -1,
    isPrimaryRenderer: true,
    warnsIfNotActing: true,
    supportsMutation: false,
    supportsPersistence: true,
    supportsHydration: false,
    getInstanceFromNode(_node) {
        throw new Error(`getInstanceFromNode not implemented`);
    },
    beforeActiveInstanceBlur() { },
    afterActiveInstanceBlur() { },
    preparePortalMount(_container) {
        throw new Error(`preparePortalMount not implemented`);
    },
    prepareScopeUpdate(_scopeInstance, _instance) {
        throw new Error(`prepareScopeUpdate not implemented`);
    },
    getInstanceFromScope(_scopeInstance) {
        throw new Error(`getInstanceFromScope not implemented`);
    },
    getCurrentEventPriority() {
        return DefaultEventPriority;
    },
    detachDeletedInstance(_node) { },
    //
    // Persistence methods
    //
    cloneInstance(instance, _updatePayload, _type, _oldProps, newProps, _internalInstanceHandle, keepChildren, _recyclableInstance) {
        const newInstance = new LiveCompositorHostComponent(newProps.props, newProps.sceneBuilder);
        if (keepChildren) {
            newInstance.children = [...instance.children];
            return newInstance;
        }
        else {
            return newInstance;
        }
    },
    createContainerChildSet(_container) {
        return [];
    },
    appendChildToContainerChildSet(childSet, child) {
        childSet.push(child);
    },
    finalizeContainerChildren(_container, _newChildren) { },
    replaceContainerChildren(_container, _newChildren) { },
    cloneHiddenInstance(_instance, _type, props, _internalInstanceHandle) {
        return new LiveCompositorHostComponent(props.props, props.sceneBuilder);
    },
    cloneHiddenTextInstance(_instance, text, _internalInstanceHandle) {
        return text;
    },
};
const CompositorRenderer = Reconciler(HostConfig);
class Renderer {
    root;
    onUpdate;
    logger;
    lastScene;
    constructor({ rootElement, onUpdate, idPrefix, logger }) {
        this.logger = logger;
        this.onUpdate = onUpdate;
        this.root = CompositorRenderer.createContainer(this, // container tag
        LegacyRoot, null, // hydrationCallbacks
        false, // isStrictMode
        null, // concurrentUpdatesByDefaultOverride
        idPrefix, // identifierPrefix
        logger.error, // onRecoverableError
        null // transitionCallbacks
        );
        CompositorRenderer.updateContainer(rootElement, this.root, null, () => { });
    }
    scene() {
        if (this.lastScene) {
            // Renderer was already stopped just return old scene
            return this.lastScene;
        }
        // When resetAfterCommit is called `this.root.current` is not updated yet, so we need to rely
        // on `pendingChildren`. I'm not sure it is always populated, so there is a fallback to
        // `root.current`.
        const rootComponent = this.root.pendingChildren[0] ?? rootHostComponent(this.root.current, this.logger);
        return rootComponent.scene();
    }
    stop() {
        this.lastScene = this.scene();
        CompositorRenderer.updateContainer(null, this.root, null, () => { });
    }
}
function rootHostComponent(root, logger) {
    logger.error('No pendingChildren found, this might be an error.');
    let current = root;
    while (current) {
        if (current?.stateNode instanceof LiveCompositorHostComponent) {
            return current?.stateNode;
        }
        current = current.child;
    }
    throw new Error('No live compositor host component found in the tree.');
}
function groupTextComponents(components) {
    const groupedComponents = [];
    let currentString = null;
    for (const component of components) {
        if (typeof component === 'string') {
            if (currentString === null) {
                currentString = component;
            }
            else {
                currentString = `${currentString}${component}`;
            }
        }
        else {
            if (currentString !== null) {
                groupedComponents.push(currentString);
                currentString = null;
            }
            groupedComponents.push(component);
        }
    }
    if (currentString !== null) {
        groupedComponents.push(currentString);
    }
    return groupedComponents;
}
export default Renderer;
