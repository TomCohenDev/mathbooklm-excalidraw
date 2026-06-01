import { isTransparent } from "../../utils";
import type { ExcalidrawElement } from "../../element/types";
import type { AppState } from "../../types";
import { Picker, useColorWheel } from "./Picker";
import * as Popover from "@radix-ui/react-popover";
import type { ColorPickerType } from "./colorPickerUtils";
import { activeColorPickerSectionAtom } from "./colorPickerUtils";
import { useExcalidrawContainer } from "../App";
import type { ColorPaletteCustom } from "../../colors";
import { COLOR_PALETTE } from "../../colors";
import { t } from "../../i18n";
import clsx from "clsx";
import { useAtom } from "../../editor-jotai";
import { activeEyeDropperAtom } from "../EyeDropper";
import { PropertiesPopover } from "../PropertiesPopover";
import { normalizeWheelColor, removeFromColorWheel, addToColorWheel } from "./colorWheelStorage";

import "./ColorPicker.scss";

const isValidColor = (color: string) => {
  const style = new Option().style;
  style.color = color;
  return !!style.color;
};

export const getColor = (color: string): string | null => {
  if (isTransparent(color)) {
    return color;
  }

  return isValidColor(`#${color}`)
    ? `#${color}`
    : isValidColor(color)
    ? color
    : null;
};

interface ColorPickerProps {
  type: ColorPickerType;
  color: string;
  onChange: (color: string) => void;
  label: string;
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  palette?: ColorPaletteCustom | null;
  updateData: (formData?: any) => void;
}

const ColorPickerPopupContent = ({
  type,
  color,
  onChange,
  label,
  palette = COLOR_PALETTE,
  updateData,
  wheelColors,
  onWheelChange,
}: Pick<
  ColorPickerProps,
  | "type"
  | "color"
  | "onChange"
  | "label"
  | "palette"
  | "updateData"
> & {
  wheelColors: string[];
  onWheelChange: (colors: string[]) => void;
}) => {
  const { container } = useExcalidrawContainer();
  const [, setActiveColorPickerSection] = useAtom(activeColorPickerSectionAtom);
  const [eyeDropperState, setEyeDropperState] = useAtom(activeEyeDropperAtom);

  return (
    <PropertiesPopover
      container={container}
      style={{ maxWidth: "13rem" }}
      onFocusOutside={(event) => {
        event.preventDefault();
      }}
      onPointerDownOutside={(event) => {
        if (eyeDropperState) {
          event.preventDefault();
        }
      }}
      onClose={() => {
        updateData({ openPopup: null });
        setActiveColorPickerSection(null);
      }}
    >
      {palette ? (
        <Picker
          palette={palette}
          color={color}
          onChange={onChange}
          onEyeDropperToggle={(force) => {
            setEyeDropperState((state) => {
              if (force) {
                state = state || {
                  keepOpenOnAlt: true,
                  onSelect: onChange,
                  colorPickerType: type,
                };
                state.keepOpenOnAlt = true;
                return state;
              }

              return force === false || state
                ? null
                : {
                    keepOpenOnAlt: false,
                    onSelect: onChange,
                    colorPickerType: type,
                  };
            });
          }}
          onEscape={(event) => {
            if (eyeDropperState) {
              setEyeDropperState(null);
            } else {
              updateData({ openPopup: null });
            }
          }}
          label={label}
          type={type}
          updateData={updateData}
          customColors={wheelColors}
          onAddToWheel={(swatch) =>
            onWheelChange(addToColorWheel(type, swatch))
          }
        />
      ) : null}
    </PropertiesPopover>
  );
};

function WheelSwatch({
  swatch,
  onChange,
  onRemove,
}: {
  swatch: string;
  onChange: (color: string) => void;
  onRemove: () => void;
}) {
  const normalized = normalizeWheelColor(swatch);
  return (
    <button
      type="button"
      className={clsx("color-picker__button color-picker__wheel-inline", {
        "is-transparent": normalized === "transparent" || !normalized,
      })}
      style={
        normalized && normalized !== "transparent"
          ? { "--swatch-color": normalized }
          : undefined
      }
      title={`${normalized} — ${t("colorPicker.colorWheelRemoveHint")}`}
      aria-label={normalized}
      onClick={() => onChange(normalized)}
      onDoubleClick={(e) => {
        e.preventDefault();
        onRemove();
      }}
    >
      <div className="color-picker__button-outline" />
    </button>
  );
}

const ColorPickerTrigger = ({
  label,
  color,
  type,
}: {
  color: string;
  label: string;
  type: ColorPickerType;
}) => {
  return (
    <Popover.Trigger
      type="button"
      className={clsx("color-picker__button active-color properties-trigger", {
        "is-transparent": color === "transparent" || !color,
      })}
      aria-label={label}
      style={color ? { "--swatch-color": color } : undefined}
      title={
        type === "elementStroke"
          ? t("labels.showStroke")
          : t("labels.showBackground")
      }
    >
      <div className="color-picker__button-outline" />
    </Popover.Trigger>
  );
};

export const ColorPicker = ({
  type,
  color,
  onChange,
  label,
  elements,
  palette = COLOR_PALETTE,
  updateData,
  appState,
}: ColorPickerProps) => {
  const [wheelColors, setWheelColors] = useColorWheel(type);

  return (
    <div>
      <div role="dialog" aria-modal="true" className="color-picker-container">
        <Popover.Root
          open={appState.openPopup === type}
          onOpenChange={(open) => {
            updateData({ openPopup: open ? type : null });
          }}
        >
          {wheelColors.map((swatch) => (
            <WheelSwatch
              key={swatch}
              swatch={swatch}
              onChange={onChange}
              onRemove={() =>
                setWheelColors(removeFromColorWheel(type, swatch))
              }
            />
          ))}
          <ColorPickerTrigger color={color} label={label} type={type} />
          {appState.openPopup === type && (
            <ColorPickerPopupContent
              type={type}
              color={color}
              onChange={onChange}
              label={label}
              palette={palette}
              updateData={updateData}
              wheelColors={wheelColors}
              onWheelChange={setWheelColors}
            />
          )}
        </Popover.Root>
      </div>
    </div>
  );
};
