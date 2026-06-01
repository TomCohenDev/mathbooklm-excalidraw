import type { ColorPickerType } from "./colorPickerUtils";

export const COLOR_WHEEL_STORAGE_KEY = "mathbooklm:colorWheel";
export const MAX_WHEEL_COLORS = 20;

type ColorWheelStore = Partial<Record<ColorPickerType, string[]>>;

export function normalizeWheelColor(color: string): string {
  const trimmed = color.trim();
  if (!trimmed || trimmed === "transparent") {
    return "transparent";
  }
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return `#${trimmed.toLowerCase()}`;
  }
  return trimmed;
}

function readStore(): ColorWheelStore {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(COLOR_WHEEL_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as ColorWheelStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: ColorWheelStore): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(COLOR_WHEEL_STORAGE_KEY, JSON.stringify(store));
}

export function loadColorWheel(type: ColorPickerType): string[] {
  const list = readStore()[type];
  if (!Array.isArray(list)) {
    return [];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of list) {
    if (typeof c !== "string") {
      continue;
    }
    const normalized = normalizeWheelColor(c);
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= MAX_WHEEL_COLORS) {
      break;
    }
  }
  return out;
}

export function saveColorWheel(
  type: ColorPickerType,
  colors: string[],
): string[] {
  const normalized = colors
    .map(normalizeWheelColor)
    .filter((c, i, arr) => arr.indexOf(c) === i)
    .slice(0, MAX_WHEEL_COLORS);
  const store = readStore();
  store[type] = normalized;
  writeStore(store);
  return normalized;
}

export function addToColorWheel(
  type: ColorPickerType,
  color: string,
): string[] {
  const normalized = normalizeWheelColor(color);
  const current = loadColorWheel(type);
  if (current.includes(normalized)) {
    return current;
  }
  return saveColorWheel(type, [...current, normalized]);
}

export function removeFromColorWheel(
  type: ColorPickerType,
  color: string,
): string[] {
  const normalized = normalizeWheelColor(color);
  return saveColorWheel(
    type,
    loadColorWheel(type).filter((c) => c !== normalized),
  );
}

export function flattenPaletteColors(
  palette: Record<string, string | readonly string[]>,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of Object.values(palette)) {
    const swatch = (Array.isArray(value) ? value[0] : value) || "transparent";
    const normalized = normalizeWheelColor(swatch);
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}
