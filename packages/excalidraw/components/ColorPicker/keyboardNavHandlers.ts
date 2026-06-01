import { KEYS } from "../../keys";
import type {
  ColorPickerColor,
  ColorPaletteCustom,
} from "../../colors";
import { COLORS_PER_ROW } from "../../colors";
import type { ActiveColorPickerSectionAtomType } from "./colorPickerUtils";
import {
  colorPickerHotkeyBindings,
  getColorNameAndShadeFromColor,
} from "./colorPickerUtils";

const arrowHandler = (
  eventKey: string,
  currentIndex: number | null,
  length: number,
) => {
  const rows = Math.ceil(length / COLORS_PER_ROW);

  currentIndex = currentIndex ?? -1;

  switch (eventKey) {
    case "ArrowLeft": {
      const prevIndex = currentIndex - 1;
      return prevIndex < 0 ? length - 1 : prevIndex;
    }
    case "ArrowRight": {
      return (currentIndex + 1) % length;
    }
    case "ArrowDown": {
      const nextIndex = currentIndex + COLORS_PER_ROW;
      return nextIndex >= length ? currentIndex % COLORS_PER_ROW : nextIndex;
    }
    case "ArrowUp": {
      const prevIndex = currentIndex - COLORS_PER_ROW;
      const newIndex =
        prevIndex < 0 ? COLORS_PER_ROW * rows + prevIndex : prevIndex;
      return newIndex >= length ? undefined : newIndex;
    }
  }
};

interface HotkeyHandlerProps {
  e: React.KeyboardEvent;
  colorObj: { colorName: ColorPickerColor; shade: number | null } | null;
  onChange: (color: string) => void;
  palette: ColorPaletteCustom;
  customColors: string[];
  setActiveColorPickerSection: (
    update: React.SetStateAction<ActiveColorPickerSectionAtomType>,
  ) => void;
}

const paletteColorAt = (
  palette: ColorPaletteCustom,
  key: string,
): string => {
  const value = palette[key];
  return (Array.isArray(value) ? value[0] : value) || "transparent";
};

/**
 * @returns true if the event was handled
 */
const hotkeyHandler = ({
  e,
  onChange,
  palette,
  customColors,
  setActiveColorPickerSection,
}: HotkeyHandlerProps): boolean => {
  if (["1", "2", "3", "4", "5"].includes(e.key)) {
    const c = customColors[Number(e.key) - 1];
    if (c) {
      onChange(c);
      setActiveColorPickerSection("custom");
      return true;
    }
  }

  if (colorPickerHotkeyBindings.includes(e.key)) {
    const index = colorPickerHotkeyBindings.indexOf(e.key);
    const paletteKey = Object.keys(palette)[index];
    if (paletteKey) {
      onChange(paletteColorAt(palette, paletteKey));
      setActiveColorPickerSection("baseColors");
      return true;
    }
  }
  return false;
};

interface ColorPickerKeyNavHandlerProps {
  event: React.KeyboardEvent;
  activeColorPickerSection: ActiveColorPickerSectionAtomType;
  palette: ColorPaletteCustom;
  color: string;
  onChange: (color: string) => void;
  customColors: string[];
  setActiveColorPickerSection: (
    update: React.SetStateAction<ActiveColorPickerSectionAtomType>,
  ) => void;
  updateData: (formData?: any) => void;
  onEyeDropperToggle: (force?: boolean) => void;
  onEscape: (event: React.KeyboardEvent | KeyboardEvent) => void;
}

/**
 * @returns true if the event was handled
 */
export const colorPickerKeyNavHandler = ({
  event,
  activeColorPickerSection,
  palette,
  color,
  onChange,
  customColors,
  setActiveColorPickerSection,
  updateData,
  onEyeDropperToggle,
  onEscape,
}: ColorPickerKeyNavHandlerProps): boolean => {
  if (event[KEYS.CTRL_OR_CMD]) {
    return false;
  }

  if (event.key === KEYS.ESCAPE) {
    onEscape(event);
    return true;
  }

  // checkt using `key` to ignore combos with Alt modifier
  if (event.key === KEYS.ALT) {
    onEyeDropperToggle(true);
    return true;
  }

  if (event.key === KEYS.I) {
    onEyeDropperToggle();
    return true;
  }

  const colorObj = getColorNameAndShadeFromColor({ color, palette });

  if (event.key === KEYS.TAB) {
    event.preventDefault();
    event.stopPropagation();
    return true;
  }

  if (
    hotkeyHandler({
      e: event,
      colorObj,
      onChange,
      palette,
      customColors,
      setActiveColorPickerSection,
    })
  ) {
    return true;
  }

  if (activeColorPickerSection === "baseColors") {
    if (colorObj) {
      const { colorName } = colorObj;
      const colorNames = Object.keys(palette);
      const indexOfColorName = colorNames.indexOf(colorName);

      const newColorIndex = arrowHandler(
        event.key,
        indexOfColorName,
        colorNames.length,
      );

      if (newColorIndex !== undefined) {
        const newColorName = colorNames[newColorIndex];
        onChange(paletteColorAt(palette, newColorName));
        return true;
      }
    }
  }

  if (activeColorPickerSection === "custom") {
    const indexOfColor = customColors.indexOf(color);

    const newColorIndex = arrowHandler(
      event.key,
      indexOfColor,
      customColors.length,
    );

    if (newColorIndex !== undefined) {
      const newColor = customColors[newColorIndex];
      onChange(newColor);
      return true;
    }
  }

  return false;
};
