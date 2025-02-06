import { createElement, useContext, useEffect, useState } from 'react';
import { createCompositorComponent } from '../component.js';
import { View } from '../index.js';
import { imageRefIntoRawId } from '../types/refs/imageRef.js';
import { newInternalImageId } from '../context/internalImageIdManager.js';
import { newBlockingTask } from '../hooks.js';
import { LiveCompositorContext } from '../context/index.js';
import { isValidImageType } from '../types/utils.js';
export const InnerImage = createCompositorComponent(sceneBuilder);
function Image(props) {
    const ctx = useContext(LiveCompositorContext);
    const [internalImageId, setInternalImageId] = useState(0);
    const [isImageRegistered, setIsImageRegistered] = useState(!!props.imageId);
    if ((props.imageId && props.source) || (!props.imageId && !props.source)) {
        throw new Error('Either "imageId" or "source" must be provided, but not both.');
    }
    useEffect(() => {
        if (props.imageId) {
            setIsImageRegistered(true);
            return;
        }
        setIsImageRegistered(false);
        const newImageId = newInternalImageId();
        setInternalImageId(newImageId);
        const task = newBlockingTask(ctx);
        const pathOrUrl = props.source?.startsWith('http://') || props.source?.startsWith('https://')
            ? { url: props.source }
            : { path: props.source };
        const extension = props.source?.split('.').pop();
        const assetType = extension && isValidImageType(extension) ? extension : undefined;
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
        return createElement(View, {});
    }
    else if (props.source) {
        return createElement(InnerImage, {
            ...props,
            imageId: imageRefIntoRawId({
                type: 'output-specific-image',
                id: internalImageId,
                outputId: ctx.outputId,
            }),
        });
    }
    else if (props.imageId) {
        return createElement(InnerImage, {
            ...props,
            imageId: imageRefIntoRawId({ type: 'global', id: props.imageId }),
        });
    }
    return createElement(View, {});
}
function sceneBuilder(props, _children) {
    return {
        type: 'image',
        id: props.id,
        image_id: props.imageId,
    };
}
export default Image;
