import { IconProps } from "../types";
import { getIconColorProps } from "../utilities";

export default function Rectangle({ isSelected }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...getIconColorProps(isSelected)}
    >
      <g strokeWidth="1.5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
      </g>
    </svg>
  );
}
