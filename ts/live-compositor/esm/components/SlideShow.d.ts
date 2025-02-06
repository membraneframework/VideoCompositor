import type React from 'react';
import { ChildrenLifetimeContext } from '../context/childrenLifetimeContext.js';
import type { ComponentBaseProps } from '../component.js';
export type SlideProps = Omit<ComponentBaseProps, 'id'> & {
    /**
     * Duration in milliseconds how long this component should be shown.
     * If not specified defaults to value of an Input stream
     */
    durationMs?: number;
};
export type SlideShowProps = {
    children: React.ReactNode;
};
export declare function SlideShow(props: SlideShowProps): React.FunctionComponentElement<React.ProviderProps<ChildrenLifetimeContext>>;
export declare function Slide(props: SlideProps): string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.FunctionComponentElement<React.ProviderProps<ChildrenLifetimeContext>> | null | undefined;
