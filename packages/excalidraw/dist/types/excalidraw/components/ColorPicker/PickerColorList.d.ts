import type { ColorPaletteCustom } from "../../colors";
interface PickerColorListProps {
    palette: ColorPaletteCustom;
    color: string;
    onChange: (color: string) => void;
    label: string;
    onAddToWheel: (color: string) => void;
}
declare const PickerColorList: ({ palette, color, onChange, onAddToWheel, }: PickerColorListProps) => import("react/jsx-runtime").JSX.Element;
export default PickerColorList;
