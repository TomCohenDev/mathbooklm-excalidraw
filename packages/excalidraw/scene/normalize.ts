import { clamp, round } from "@excalidraw/math";
import {
  DEFAULT_GRID_COLOR,
  DEFAULT_GRID_OPACITY,
  DEFAULT_GRID_TYPE,
  GRID_TYPES,
  MAX_ZOOM,
  MIN_ZOOM,
} from "../constants";
import type { GridType } from "../constants";
import type { NormalizedZoomValue } from "../types";

export const getNormalizedZoom = (zoom: number): NormalizedZoomValue => {
  return clamp(round(zoom, 6), MIN_ZOOM, MAX_ZOOM) as NormalizedZoomValue;
};

export const getNormalizedGridSize = (gridStep: number) => {
  return clamp(Math.round(gridStep), 1, 100);
};

export const getNormalizedGridStep = (gridStep: number) => {
  return clamp(Math.round(gridStep), 1, 100);
};

export const getNormalizedGridType = (gridType: unknown): GridType => {
  // Legacy value before "lines" was renamed to "boxes".
  if (gridType === "lines") {
    return "boxes";
  }
  if (
    typeof gridType === "string" &&
    (GRID_TYPES as readonly string[]).includes(gridType)
  ) {
    return gridType as GridType;
  }
  return DEFAULT_GRID_TYPE;
};

export const getNormalizedGridColor = (color: unknown): string => {
  if (typeof color === "string" && /^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }
  return DEFAULT_GRID_COLOR;
};

export const getNormalizedGridOpacity = (opacity: unknown): number => {
  if (typeof opacity === "number" && isFinite(opacity)) {
    return clamp(Math.round(opacity), 0, 100);
  }
  return DEFAULT_GRID_OPACITY;
};
