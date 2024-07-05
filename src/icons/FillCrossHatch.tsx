import React from "react";

export default function FillCrossHatch() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g clipPath="url(#a)">
        <path
          d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
          stroke="currentColor"
          strokeWidth="1.25"
        ></path>
        <mask
          id="FillCrossHatchIcon"
          maskUnits="userSpaceOnUse"
          x="-1"
          y="-1"
          width="22"
          height="22"
          style={{ maskType: "alpha" }}
        >
          <path
            d="M2.426 15.044 15.044 2.426M7.383 20 20 7.383M0 12.617 12.617 0m-7.98 17.941L17.256 5.324m-2.211 12.25L2.426 4.956M20 12.617 7.383 0m5.234 20L0 7.383m17.941 7.98L5.324 2.745"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </mask>
        <g mask="url(#FillCrossHatchIcon)">
          <path
            d="M14.121 2H5.88A3.879 3.879 0 0 0 2 5.879v8.242A3.879 3.879 0 0 0 5.879 18h8.242A3.879 3.879 0 0 0 18 14.121V5.88A3.879 3.879 0 0 0 14.121 2Z"
            fill="currentColor"
          ></path>
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h20v20H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}
