import clsx from "clsx";
import { normalizeWheelColor } from "./colorWheelStorage";

interface ColorSwatchGridProps {
  colors: string[];
  activeColor: string;
  onSelect: (color: string) => void;
  onDoubleClick?: (color: string) => void;
  emptyHint?: string;
  doubleClickHint?: string;
}

export function ColorSwatchGrid({
  colors,
  activeColor,
  onSelect,
  onDoubleClick,
  emptyHint,
  doubleClickHint,
}: ColorSwatchGridProps) {
  const activeNorm = normalizeWheelColor(activeColor || "transparent");

  if (colors.length === 0 && emptyHint) {
    return <p className="color-picker-wheel-hint">{emptyHint}</p>;
  }

  return (
    <div className="color-picker-content--default">
      {colors.map((swatch, index) => {
        const normalized = normalizeWheelColor(swatch);
        const titleParts = [
          swatch.startsWith("#") ? swatch : normalized,
          doubleClickHint,
        ].filter(Boolean);

        return (
          <button
            key={`${normalized}-${index}`}
            tabIndex={-1}
            type="button"
            className={clsx(
              "color-picker__button color-picker__button--large",
              {
                active: activeNorm === normalized,
                "is-transparent": normalized === "transparent" || !normalized,
              },
            )}
            onClick={() => onSelect(normalized)}
            onDoubleClick={
              onDoubleClick
                ? (e) => {
                    e.preventDefault();
                    onDoubleClick(normalized);
                  }
                : undefined
            }
            title={titleParts.join(" ")}
            aria-label={titleParts.join(" ")}
            style={
              normalized && normalized !== "transparent"
                ? { "--swatch-color": normalized }
                : undefined
            }
          >
            <div className="color-picker__button-outline" />
          </button>
        );
      })}
    </div>
  );
}
