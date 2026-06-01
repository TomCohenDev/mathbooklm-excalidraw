import React from "react";
import { t } from "../../i18n";

import PickerColorList from "./PickerColorList";
import { useAtom } from "../../editor-jotai";
import { colorPickerKeyNavHandler } from "./keyboardNavHandlers";
import type { ColorPickerType } from "./colorPickerUtils";
import { activeColorPickerSectionAtom } from "./colorPickerUtils";
import type { ColorPaletteCustom } from "../../colors";
import { KEYS } from "../../keys";
import { EVENT } from "../../constants";
import {
  loadColorWheel,
  saveColorWheel,
} from "./colorWheelStorage";

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

export const Picker = ({
  color,
  onChange,
  label,
  type,
  palette,
  updateData,
  onEyeDropperToggle,
  onEscape,
  customColors,
  onAddToWheel,
}: PickerProps) => {
  const [, setActiveColorPickerSection] = useAtom(activeColorPickerSectionAtom);

  React.useEffect(() => {
    setActiveColorPickerSection("baseColors");
  }, [setActiveColorPickerSection]);

  React.useEffect(() => {
    const keyup = (event: KeyboardEvent) => {
      if (event.key === KEYS.ALT) {
        onEyeDropperToggle(false);
      }
    };
    document.addEventListener(EVENT.KEYUP, keyup, { capture: true });
    return () => {
      document.removeEventListener(EVENT.KEYUP, keyup, { capture: true });
    };
  }, [onEyeDropperToggle]);

  const pickerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div role="dialog" aria-modal="true" aria-label={t("labels.colorPicker")}>
      <div
        ref={pickerRef}
        onKeyDown={(event) => {
          const handled = colorPickerKeyNavHandler({
            event,
            activeColorPickerSection: "baseColors",
            palette,
            color,
            onChange,
            onEyeDropperToggle,
            customColors,
            setActiveColorPickerSection,
            updateData,
            onEscape,
          });

          if (handled) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        className="color-picker-content properties-content"
        tabIndex={-1}
      >
        <PickerColorList
          color={color}
          label={label}
          palette={palette}
          onChange={onChange}
          onAddToWheel={onAddToWheel}
        />
      </div>
    </div>
  );
};

/** Hook: persisted color wheel for a picker type. */
export function useColorWheel(type: ColorPickerType): [
  string[],
  (colors: string[]) => void,
] {
  const [wheel, setWheel] = React.useState(() => loadColorWheel(type));

  React.useEffect(() => {
    setWheel(loadColorWheel(type));
  }, [type]);

  const persist = React.useCallback(
    (colors: string[]) => {
      setWheel(saveColorWheel(type, colors));
    },
    [type],
  );

  return [wheel, persist];
}
