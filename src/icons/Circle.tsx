import React from "react";
import { IconProps } from "../types";
import { getIconColorProps } from "../utilities";

export default function Circle({ isSelected }: IconProps) {
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
        <circle cx="12" cy="12" r="9"></circle>
      </g>
    </svg>
  );
}
