import * as React from "react"

interface FixedPrice {
  color?: string
}

const FixedPrice: React.FC<FixedPrice> = (props) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m22.41 11.58-9-9C13.05 2.22 12.55 2 12 2H5c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42ZM14 20.01 5 11V4h7v-.01l9 9-7 7.02Z"
      fill={props.color}
    />
    <path d="M8.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill={props.color} />
  </svg>
)

export default FixedPrice