import * as React from "react"

const RefreshBtn = (props:any) => (
  <svg
    width={17}
    height={17}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.65 3.35A8 8 0 1 0 16.4 12h-2.22a6 6 0 1 1-1-7.22L10 8h7V1l-2.35 2.35Z"
      fill={props?.color || "#F4B1A3"}
    />
  </svg>
)

export default RefreshBtn
