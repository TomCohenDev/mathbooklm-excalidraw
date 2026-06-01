import { CalculatorIcon } from "./icons";

export const MATHBOOK_TOGGLE_CALC_EVENT = "mathbook:toggle-calc";

export const dispatchToggleCalculator = () => {
  window.dispatchEvent(new CustomEvent(MATHBOOK_TOGGLE_CALC_EVENT));
};

type CalculatorButtonProps = {
  className?: string;
  onClick?(): void;
};

export const CalculatorButton = (props: CalculatorButtonProps) => (
  <button
    className={props.className ?? "help-icon calc-icon"}
    onClick={props.onClick ?? dispatchToggleCalculator}
    type="button"
    title="Toggle scientific calculator"
    aria-label="Toggle scientific calculator"
  >
    {CalculatorIcon}
  </button>
);
