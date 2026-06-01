import type { AppClassProperties, Device, UIAppState } from "../types";
import "./HintViewer.scss";
interface HintViewerProps {
    appState: UIAppState;
    isMobile: boolean;
    device: Device;
    app: AppClassProperties;
}
export declare const HintViewer: (_props: HintViewerProps) => null;
export {};
