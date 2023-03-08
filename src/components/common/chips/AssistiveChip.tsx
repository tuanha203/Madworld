import React, { ReactElement } from 'react';
import Chip from '@mui/material/Chip';
interface AssistiveChipProp {
  label: string
  scheme: string
  state?: string
  elevated?: string
}
interface AssistiveChipIconProp {
  label: string
  scheme: string
  state: string
  elevated: string
  children: ReactElement
}

export const AssistiveChip = ({ label, scheme, state, elevated }: AssistiveChipProp) => {
  return (
    <Chip
      label={label}
      clickable
      disabled={state === 'disabled'}
      className={`basic-chip assistive-chip ${scheme} ${state} ${elevated}`}
    />
  );
};

export const AssistiveChipIcon = ({ label, scheme, state, elevated, children }: AssistiveChipIconProp) => {
  return (
    <Chip
      label={label}
      clickable
      disabled={state == 'disabled'}
      className={`basic-chip assistive-chip assistive-chip-icon ${scheme} ${state} ${elevated}`}
      avatar={children}
    />
  );
};
