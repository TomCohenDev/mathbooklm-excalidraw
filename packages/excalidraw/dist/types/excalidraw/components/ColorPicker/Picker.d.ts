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
    wheelColors: string[];
    onWheelChange: (colors: string[]) => void;
}
export declare const Picker: ({ color, onChange, label, type, palette, updateData, onEyeDropperToggle, onEscape, wheelColors, onWheelChange, }: PickerProps) => import("react/jsx-runtime").JSX.Element;
/** Hook: persisted color wheel for a picker type. */
export declare function useColorWheel(type: ColorPickerType): [
    string[],
    (colors: string[]) => void
];
export {};
