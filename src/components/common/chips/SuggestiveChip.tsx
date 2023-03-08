import React from 'react';
import Chip from '@mui/material/Chip';

interface SuggestiveChipProp{
  label: string
  scheme: string
  color: string
  state: string
  elevated: string
}

export const SuggestiveChip = ({label, scheme, color, state, elevated}: SuggestiveChipProp) => {
    return (
      <Chip
        label={label}
        clickable
        disabled= {state == 'disabled'}
        className={`basic-chip suggestive-chip ${scheme} ${color} ${state} ${elevated}`} />
    )
}
