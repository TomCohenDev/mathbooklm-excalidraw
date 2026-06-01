import type { ElementOrToolType } from "../types";
export declare const hasBackground: (type: ElementOrToolType) => boolean;
/** Fillable shapes only (excludes pen / freedraw). */
export declare const isFillableShape: (type: ElementOrToolType) => boolean;
export declare const hasStrokeColor: (type: ElementOrToolType) => boolean;
export declare const hasStrokeWidth: (type: ElementOrToolType) => boolean;
export declare const hasStrokeStyle: (type: ElementOrToolType) => boolean;
export declare const canChangeRoundness: (type: ElementOrToolType) => boolean;
export declare const toolIsArrow: (type: ElementOrToolType) => boolean;
export declare const canHaveArrowheads: (type: ElementOrToolType) => boolean;
