import type { ComponentBaseProps } from '../component.js';
export type ShowProps = Omit<ComponentBaseProps, 'id'> & {
    /**
     * Optional range in milliseconds defining when the child should be visible.
     */
    timeRangeMs?: {
        start?: number;
        end?: number;
    };
    /**
     * Delay of the child being shown in milliseconds.
     */
    delayMs?: number;
};
declare function Show(props: ShowProps): import("react").ReactNode;
export default Show;
