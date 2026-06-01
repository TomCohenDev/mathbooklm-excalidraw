import type { GridType } from "../constants";
import type { NormalizedZoomValue } from "../types";
export declare const getNormalizedZoom: (zoom: number) => NormalizedZoomValue;
export declare const getNormalizedGridSize: (gridStep: number) => number;
export declare const getNormalizedGridStep: (gridStep: number) => number;
export declare const getNormalizedGridType: (gridType: unknown) => GridType;
export declare const getNormalizedGridColor: (color: unknown) => string;
export declare const getNormalizedGridOpacity: (opacity: unknown) => number;
