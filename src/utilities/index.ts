import { ICON_FILL_COLOR } from "../constants";

export const getNumericVal = (val: number | undefined) => val || 0;

export const getIconColorProps = (isSelected: boolean | undefined) => ({
  fill: isSelected ? ICON_FILL_COLOR : "none",
  stroke: isSelected ? ICON_FILL_COLOR : "currentColor",
});
