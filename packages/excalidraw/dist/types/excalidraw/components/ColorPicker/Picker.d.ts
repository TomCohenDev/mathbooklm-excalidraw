import React from "react";
import type { ColorPickerType } from "./colorPickerUtils";
import type { ColorPaletteCustom } from "../../colors";
interface PickerProps {
    color: string;
    onChange: (color: string) => void;
    label: string;
    type: ColorPickerType;
    palette: ColorPaletteCustom;
    updateData: (formData?: any) => void;
    onEyeDropperToggle: (force?: boolean) => void;
    onEscape: (event: React.KeyboardEvent | KeyboardEvent) => void;
    customColors: string[];
    onAddToWheel: (color: string) => void;
}
export declare const Picker: ({ color, onChange, label, type, palette, updateData, onEyeDropperToggle, onEscape, customColors, onAddToWheel, }: PickerProps) => import("react/jsx-runtime").JSX.Element;
/** Hook: persisted color wheel for a picker type. */
export declare function useColorWheel(type: ColorPickerType): [
    string[],
    (colors: string[]) => void
];
export {};
