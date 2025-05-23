import React from "react";
import { IconProps } from "../types";
import { getIconColorProps } from "../utilities";

export default function Select({ isSelected }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 22 22"
      strokeWidth="1.25"
      {...getIconColorProps(isSelected)}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M6 6l4.153 11.793a0.365 .365 0 0 0 .331 .207a0.366 .366 0 0 0 .332 -.207l2.184 -4.793l4.787 -1.994a0.355 .355 0 0 0 .213 -.323a0.355 .355 0 0 0 -.213 -.323l-11.787 -4.36z"></path>
        <path d="M13.5 13.5l4.5 4.5"></path>
      </g>
    </svg>
  );
}
