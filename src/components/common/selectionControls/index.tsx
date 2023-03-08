import React, { FC, useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import { SwitchProps } from '@mui/material';

export const CheckBoxControl = (props: any) => {
  const [checked, setChecked] = useState(false);

  // const handleChange = (event: any) => {
  //     setChecked(event.target.checked);
  //     onChange(!checked)
  //     console.log("in check")
  // };

  // console.log({ ...props })

  const label = { inputProps: { 'aria-label': 'Checkbox ' } };

  return <Checkbox {...props} className="Madcheckbox" />;
};

interface SwitchControlProp {
  disabled: boolean;
  parentCallback: (value: boolean) => void;
  isChecked: boolean;
}

export const SwitchControl = ({ disabled, parentCallback, isChecked }: SwitchControlProp) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    parentCallback(event.target.checked);
  };

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  // console.log('switch ' + checked);

  return (
    <Switch
      disabled={disabled}
      className="mad-switch"
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
};

SwitchControl.defaultProps = {
  disabled: false,
  parentCallback: (value: boolean) => {},
  isChecked: false,
};

interface RadioButtonsProps {
  disabled: boolean;
}

export default function RadioButtons({ disabled }: RadioButtonsProps) {
  const [selectedValue, setSelectedValue] = useState('a');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <Radio
        disabled={disabled}
        className="madRadioButtons"
        checked={selectedValue === 'a'}
        onChange={handleChange}
        value="a"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'A' }}
      />
      <Radio
        disabled={disabled}
        className="madRadioButtons"
        checked={selectedValue === 'b'}
        onChange={handleChange}
        value="b"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'B' }}
      />
    </div>
  );
}
