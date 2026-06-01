import StatsDragInput from "./DragInput";
import type Scene from "../../scene/Scene";
import type { AppState } from "../../types";
import { getStepSizedValue } from "./utils";
import {
  getNormalizedGridStep,
  getNormalizedGridColor,
  getNormalizedGridOpacity,
} from "../../scene";

interface PositionProps {
  property: "gridStep";
  scene: Scene;
  appState: AppState;
  setAppState: React.Component<any, AppState>["setState"];
}

const STEP_SIZE = 5;

const CanvasGrid = ({
  property,
  scene,
  appState,
  setAppState,
}: PositionProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      <StatsDragInput
        label="Grid step"
        sensitivity={8}
        elements={[]}
        dragInputCallback={({
          nextValue,
          instantChange,
          shouldChangeByStepSize,
          setInputValue,
        }) => {
          setAppState((state) => {
            let nextGridStep;

            if (nextValue) {
              nextGridStep = nextValue;
            } else if (instantChange) {
              nextGridStep = shouldChangeByStepSize
                ? getStepSizedValue(
                    state.gridStep + STEP_SIZE * Math.sign(instantChange),
                    STEP_SIZE,
                  )
                : state.gridStep + instantChange;
            }

            if (!nextGridStep) {
              setInputValue(state.gridStep);
              return null;
            }

            nextGridStep = getNormalizedGridStep(nextGridStep);
            setInputValue(nextGridStep);
            return {
              gridStep: nextGridStep,
            };
          });
        }}
        scene={scene}
        value={appState.gridStep}
        property={property}
        appState={appState}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "12px", whiteSpace: "nowrap" }}>Grid color</span>
        <input
          type="color"
          value={appState.gridColor}
          onChange={(e) => {
            const color = getNormalizedGridColor(e.target.value);
            setAppState({ gridColor: color });
          }}
          style={{
            width: "32px",
            height: "20px",
            padding: "1px",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
            cursor: "pointer",
            background: "none",
          }}
          title="Grid color"
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
          Opacity {appState.gridOpacity}%
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={appState.gridOpacity}
          onChange={(e) => {
            const opacity = getNormalizedGridOpacity(Number(e.target.value));
            setAppState({ gridOpacity: opacity });
          }}
          style={{ flex: 1, maxWidth: "80px" }}
          title="Grid opacity"
        />
      </div>
    </div>
  );
};

export default CanvasGrid;
