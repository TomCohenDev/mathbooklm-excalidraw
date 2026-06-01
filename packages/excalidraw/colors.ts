import oc from "open-color";
import type { Merge } from "./utility-types";

// FIXME can't put to utils.ts rn because of circular dependency
const pick = <R extends Record<string, any>, K extends readonly (keyof R)[]>(
  source: R,
  keys: K,
) => {
  return keys.reduce((acc, key: K[number]) => {
    if (key in source) {
      acc[key] = source[key];
    }
    return acc;
  }, {} as Pick<R, K[number]>) as Pick<R, K[number]>;
};

export type ColorPickerColor =
  | Exclude<keyof oc, "indigo" | "lime">
  | "transparent"
  | "bronze";
export type ColorTuple = readonly [string, string, string, string, string];
export type ColorPalette = Merge<
  Record<ColorPickerColor, ColorTuple>,
  { black: "#1e1e1e"; white: "#ffffff"; transparent: "transparent" }
>;

// used general type instead of specific type (ColorPalette) to support custom colors
export type ColorPaletteCustom = { [key: string]: ColorTuple | string };
export type ColorShadesIndexes = [number, number, number, number, number];

export const MAX_CUSTOM_COLORS_USED_IN_CANVAS = 5;
export const COLORS_PER_ROW = 5;

export const DEFAULT_CHART_COLOR_INDEX = 4;

export const DEFAULT_ELEMENT_STROKE_COLOR_INDEX = 4;
export const DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX = 1;
export const ELEMENTS_PALETTE_SHADE_INDEXES = [0, 2, 4, 6, 8] as const;
export const CANVAS_PALETTE_SHADE_INDEXES = [0, 1, 2, 3, 4] as const;

export const getSpecificColorShades = (
  color: Exclude<
    ColorPickerColor,
    "transparent" | "white" | "black" | "bronze"
  >,
  indexArr: Readonly<ColorShadesIndexes>,
) => {
  return indexArr.map((index) => oc[color][index]) as any as ColorTuple;
};

export const COLOR_PALETTE = {
  transparent: "transparent",
  black: "#1e1e1e",
  white: "#ffffff",
  // open-colors
  gray: getSpecificColorShades("gray", ELEMENTS_PALETTE_SHADE_INDEXES),
  red: getSpecificColorShades("red", ELEMENTS_PALETTE_SHADE_INDEXES),
  pink: getSpecificColorShades("pink", ELEMENTS_PALETTE_SHADE_INDEXES),
  grape: getSpecificColorShades("grape", ELEMENTS_PALETTE_SHADE_INDEXES),
  violet: getSpecificColorShades("violet", ELEMENTS_PALETTE_SHADE_INDEXES),
  blue: getSpecificColorShades("blue", ELEMENTS_PALETTE_SHADE_INDEXES),
  cyan: getSpecificColorShades("cyan", ELEMENTS_PALETTE_SHADE_INDEXES),
  teal: getSpecificColorShades("teal", ELEMENTS_PALETTE_SHADE_INDEXES),
  green: getSpecificColorShades("green", ELEMENTS_PALETTE_SHADE_INDEXES),
  yellow: getSpecificColorShades("yellow", ELEMENTS_PALETTE_SHADE_INDEXES),
  orange: getSpecificColorShades("orange", ELEMENTS_PALETTE_SHADE_INDEXES),
  // radix bronze shades 3,5,7,9,11
  bronze: ["#f8f1ee", "#eaddd7", "#d2bab0", "#a18072", "#846358"],
} as ColorPalette;

const COMMON_ELEMENT_SHADES = pick(COLOR_PALETTE, [
  "cyan",
  "blue",
  "violet",
  "grape",
  "pink",
  "green",
  "teal",
  "yellow",
  "orange",
  "red",
]);

// -----------------------------------------------------------------------------
// quick picks defaults
// -----------------------------------------------------------------------------

// ORDER matters for positioning in quick picker
export const DEFAULT_ELEMENT_STROKE_PICKS = [
  COLOR_PALETTE.black,
  COLOR_PALETTE.red[DEFAULT_ELEMENT_STROKE_COLOR_INDEX],
  COLOR_PALETTE.green[DEFAULT_ELEMENT_STROKE_COLOR_INDEX],
  COLOR_PALETTE.blue[DEFAULT_ELEMENT_STROKE_COLOR_INDEX],
  COLOR_PALETTE.yellow[DEFAULT_ELEMENT_STROKE_COLOR_INDEX],
] as ColorTuple;

// ORDER matters for positioning in quick picker
export const DEFAULT_ELEMENT_BACKGROUND_PICKS = [
  COLOR_PALETTE.transparent,
  COLOR_PALETTE.red[DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX],
  COLOR_PALETTE.green[DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX],
  COLOR_PALETTE.blue[DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX],
  COLOR_PALETTE.yellow[DEFAULT_ELEMENT_BACKGROUND_COLOR_INDEX],
] as ColorTuple;

// ORDER matters for positioning in quick picker
export const DEFAULT_CANVAS_BACKGROUND_PICKS = [
  COLOR_PALETTE.white,
  // radix slate2
  "#f8f9fa",
  // radix blue2
  "#f5faff",
  // radix yellow2
  "#fffce8",
  // radix bronze2
  "#fdf8f6",
] as ColorTuple;

// -----------------------------------------------------------------------------
// palette defaults (flat — 5×5 grid, one swatch per color)
// -----------------------------------------------------------------------------

export const DEFAULT_ELEMENT_STROKE_COLOR_PALETTE = {
  transparent: COLOR_PALETTE.transparent,
  white: COLOR_PALETTE.white,
  black: COLOR_PALETTE.black,
  gray: oc.gray[6],
  bronze: COLOR_PALETTE.bronze[4],
  red: oc.red[5],
  orange: oc.orange[5],
  yellow: oc.yellow[4],
  lime: oc.lime[5],
  green: oc.green[5],
  teal: oc.teal[5],
  cyan: oc.cyan[5],
  blue: oc.blue[5],
  indigo: oc.indigo[5],
  violet: oc.violet[5],
  grape: oc.grape[5],
  pink: oc.pink[5],
  navy: oc.blue[8],
  forest: oc.green[8],
  magenta: oc.grape[8],
  brown: oc.orange[8],
  sky: oc.cyan[3],
  lavender: oc.violet[2],
  mint: oc.teal[3],
  sand: oc.yellow[2],
} as const;

export const DEFAULT_ELEMENT_BACKGROUND_COLOR_PALETTE = {
  transparent: COLOR_PALETTE.transparent,
  white: COLOR_PALETTE.white,
  gray: oc.gray[1],
  bronze: COLOR_PALETTE.bronze[0],
  cream: "#fffce8",
  red: oc.red[1],
  orange: oc.orange[1],
  yellow: oc.yellow[1],
  lime: oc.lime[1],
  green: oc.green[1],
  teal: oc.teal[1],
  cyan: oc.cyan[1],
  blue: oc.blue[1],
  indigo: oc.indigo[1],
  violet: oc.violet[1],
  grape: oc.grape[1],
  pink: oc.pink[1],
  blush: oc.red[0],
  sand: oc.yellow[0],
  mint: oc.green[0],
  sky: oc.cyan[0],
  lavender: oc.violet[0],
  peach: oc.orange[0],
  ice: oc.blue[0],
  rose: oc.pink[0],
} as const;

/** Canvas page background — light tints only (5×5). */
export const DEFAULT_CANVAS_BACKGROUND_COLOR_PALETTE = {
  white: COLOR_PALETTE.white,
  gray: oc.gray[0],
  cream: "#fffce8",
  sand: "#fdf8f6",
  sky: "#f5faff",
  red: oc.red[0],
  orange: oc.orange[0],
  yellow: oc.yellow[0],
  lime: oc.lime[0],
  green: oc.green[0],
  teal: oc.teal[0],
  cyan: oc.cyan[0],
  blue: oc.blue[0],
  indigo: oc.indigo[0],
  violet: oc.violet[0],
  grape: oc.grape[0],
  pink: oc.pink[0],
  blush: oc.red[1],
  peach: oc.orange[1],
  mint: oc.green[1],
  ice: oc.blue[1],
  lavender: oc.violet[1],
  rose: oc.pink[1],
  bronze: COLOR_PALETTE.bronze[0],
  fog: oc.gray[1],
} as const;

// -----------------------------------------------------------------------------
// helpers
// -----------------------------------------------------------------------------

// !!!MUST BE WITHOUT GRAY, TRANSPARENT AND BLACK!!!
export const getAllColorsSpecificShade = (index: 0 | 1 | 2 | 3 | 4) =>
  [
    // 2nd row
    COLOR_PALETTE.cyan[index],
    COLOR_PALETTE.blue[index],
    COLOR_PALETTE.violet[index],
    COLOR_PALETTE.grape[index],
    COLOR_PALETTE.pink[index],

    // 3rd row
    COLOR_PALETTE.green[index],
    COLOR_PALETTE.teal[index],
    COLOR_PALETTE.yellow[index],
    COLOR_PALETTE.orange[index],
    COLOR_PALETTE.red[index],
  ] as const;

export const rgbToHex = (r: number, g: number, b: number) =>
  `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

// -----------------------------------------------------------------------------
