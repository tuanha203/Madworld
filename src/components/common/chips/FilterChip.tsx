import { Chip } from "@mui/material"
import { ReactElement } from "react"

interface AssistiveChipIconProp {
  label: string
  scheme: string
  state: string
  elevated: string
  color: string
  children: ReactElement
}
export const AssistiveChipIcon = ({label, scheme, color, state, elevated, children}: AssistiveChipIconProp) => {
  return (
    <Chip
      label={label}
      clickable
      disabled= {state == 'disabled'}
      className={`basic-chip assistive-chip assistive-chip-icon ${scheme} ${color} ${state} ${elevated}`}
      avatar={children}
    />
  )
}
