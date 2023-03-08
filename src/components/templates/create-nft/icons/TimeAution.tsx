import * as React from "react"

interface ITimeAuctionProps {
  color?: string
}

const TimeAuction: React.FC<ITimeAuctionProps> = (props) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 18.182h10.91V20H0v-1.818ZM3.855 6.427l2.572-2.572 12.855 12.854-2.573 2.573L3.855 6.427ZM10.29 0l5.145 5.145-2.572 2.573-5.146-5.145L10.291 0ZM2.573 7.71l5.145 5.144-2.573 2.573L0 10.282l2.573-2.573Z"
      fill={props.color}
    />
  </svg>
)

export default TimeAuction;