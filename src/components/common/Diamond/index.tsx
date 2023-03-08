import * as React from 'react';

const Diamond = (props:any) => (
  <svg width={88} height={84} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#a)">
      <path
        d="M58 24H30l-6 12 20 24 20-24-6-12ZM39.24 34l3-6h3.52l3 6h-9.52ZM42 38v13.36L30.88 38H42Zm4 0h11.12L46 51.36V38Zm12.52-4h-5.3l-3-6h5.3l3 6Zm-26.04-6h5.3l-3 6h-5.3l3-6Z"
        fill={props.color || "#F4B1A3"}
      />
    </g>
    <defs>
      <filter
        id="a"
        x={-4}
        y={-6}
        width={96}
        height={96}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={12} />
        <feColorMatrix values="0 0 0 0 0.956863 0 0 0 0 0.694118 0 0 0 0 0.639216 0 0 0 0.5 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2966_56081" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={3} />
        <feColorMatrix values="0 0 0 0 0.956863 0 0 0 0 0.694118 0 0 0 0 0.639216 0 0 0 0.5 0" />
        <feBlend in2="effect1_dropShadow_2966_56081" result="effect2_dropShadow_2966_56081" />
        <feBlend in="SourceGraphic" in2="effect2_dropShadow_2966_56081" result="shape" />
      </filter>
    </defs>
  </svg>
);

export default Diamond;
