import { useAtom } from "../../editor-jotai";
import { useEffect, useRef } from "react";
import {
  activeColorPickerSectionAtom,
  getColorNameAndShadeFromColor,
} from "./colorPickerUtils";
import type { ColorPaletteCustom } from "../../colors";
import { ColorSwatchGrid } from "./ColorSwatchGrid";
import { flattenPaletteColors, normalizeWheelColor } from "./colorWheelStorage";
import { t } from "../../i18n";

interface PickerColorListProps {
  palette: ColorPaletteCustom;
  color: string;
  onChange: (color: string) => void;
  label: string;
  onAddToWheel: (color: string) => void;
}

const PickerColorList = ({
  palette,
  color,
  onChange,
  onAddToWheel,
}: PickerColorListProps) => {
  const colorObj = getColorNameAndShadeFromColor({
    color: color || "transparent",
    palette,
  });
  const [activeColorPickerSection, setActiveColorPickerSection] = useAtom(
    activeColorPickerSectionAtom,
  );

  const btnRef = useRef<HTMLDivElement>(null);
  const swatches = flattenPaletteColors(palette);

  useEffect(() => {
    if (btnRef.current && activeColorPickerSection === "baseColors") {
      btnRef.current.querySelector<HTMLButtonElement>("button")?.focus();
    }
  }, [colorObj?.colorName, activeColorPickerSection]);

  return (
    <div ref={btnRef}>
      <ColorSwatchGrid
        colors={swatches}
        activeColor={color}
        onSelect={(swatch) => {
          onChange(swatch);
          setActiveColorPickerSection("baseColors");
        }}
        onDoubleClick={(swatch) => onAddToWheel(normalizeWheelColor(swatch))}
        doubleClickHint={t("colorPicker.colorWheelAddHint")}
      />
    </div>
  );
};

export default PickerColorList;
