"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InnerImage = void 0;
const react_1 = require("react");
const component_js_1 = require("../component.js");
const index_js_1 = require("../index.js");
const imageRef_js_1 = require("../types/refs/imageRef.js");
const internalImageIdManager_js_1 = require("../context/internalImageIdManager.js");
const hooks_js_1 = require("../hooks.js");
const index_js_2 = require("../context/index.js");
const utils_js_1 = require("../types/utils.js");
exports.InnerImage = (0, component_js_1.createCompositorComponent)(sceneBuilder);
function Image(props) {
    const ctx = (0, react_1.useContext)(index_js_2.LiveCompositorContext);
    const [internalImageId, setInternalImageId] = (0, react_1.useState)(0);
    const [isImageRegistered, setIsImageRegistered] = (0, react_1.useState)(!!props.imageId);
    if ((props.imageId && props.source) || (!props.imageId && !props.source)) {
        throw new Error('Either "imageId" or "source" must be provided, but not both.');
    }
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        if (props.imageId) {
            setIsImageRegistered(true);
            return;
        }
        setIsImageRegistered(false);
        const newImageId = (0, internalImageIdManager_js_1.newInternalImageId)();
        setInternalImageId(newImageId);
        const task = (0, hooks_js_1.newBlockingTask)(ctx);
        const pathOrUrl = ((_a = props.source) === null || _a === void 0 ? void 0 : _a.startsWith('http://')) || ((_b = props.source) === null || _b === void 0 ? void 0 : _b.startsWith('https://'))
            ? { url: props.source }
            : { path: props.source };
        const extension = (_c = props.source) === null || _c === void 0 ? void 0 : _c.split('.').pop();
        const assetType = extension && (0, utils_js_1.isValidImageType)(extension) ? extension : undefined;
        let registerPromise;
        if (!assetType) {
            throw new Error('Unsupported image type');
        }
        void (async () => {
            try {
                registerPromise = ctx.registerImage(newImageId, {
                    ...pathOrUrl,
                    assetType,
                });
                await registerPromise;
                setIsImageRegistered(true);
            }
            finally {
                task.done();
            }
        })();
        return () => {
            task.done();
            void (async () => {
                await registerPromise.catch(() => { });
                await ctx.unregisterImage(newImageId);
            })();
        };
    }, [props.source, props.imageId]);
    if (!isImageRegistered) {
        return (0, react_1.createElement)(index_js_1.View, {});
    }
    else if (props.source) {
        return (0, react_1.createElement)(exports.InnerImage, {
            ...props,
            imageId: (0, imageRef_js_1.imageRefIntoRawId)({
                type: 'output-specific-image',
                id: internalImageId,
                outputId: ctx.outputId,
            }),
        });
    }
    else if (props.imageId) {
        return (0, react_1.createElement)(exports.InnerImage, {
            ...props,
            imageId: (0, imageRef_js_1.imageRefIntoRawId)({ type: 'global', id: props.imageId }),
        });
    }
    return (0, react_1.createElement)(index_js_1.View, {});
}
function sceneBuilder(props, _children) {
    return {
        type: 'image',
        id: props.id,
        image_id: props.imageId,
    };
}
exports.default = Image;
