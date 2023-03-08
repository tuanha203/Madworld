import { FC, ReactNode } from 'react';
import { FormControl, Select, MenuItem, FormHelperText, SelectProps } from '@mui/material';

interface IOption {
  label: string | ReactNode;
  value: string | number;
}

interface ISelectCustomProps {
  options: IOption[];
  label?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
  optionClassName?: string;
  selectClassName?: string;
  classNameLabel?: string;
}

const SelectCustom: FC<ISelectCustomProps & SelectProps> = (props) => {
  const {
    options = [],
    label,
    error,
    helperText,
    className,
    optionClassName,
    selectClassName,
    classNameLabel,
    ...rest
  } = props;

  const isEmpty = !options.length;

  return (
    <FormControl className={`text-white w-full ${className || ''} font-normal text-base font-Chakra`}>
      {label && <div className={`font-bold text-base mb-2 font-Chakra ${classNameLabel}`}>{label}</div>}
      <Select
        className={`!font-Chakra select-custom ${selectClassName || ''}`}
        {...rest}
      >
        {isEmpty ? (
          <MenuItem disabled className={optionClassName}>
            {'No Data'}
          </MenuItem>
        ) : (
          options.map((item) => (
            <MenuItem value={item.value} className={optionClassName}>
              {item.label || '-'}
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && (
        <FormHelperText className="text-white" error={error}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectCustom;
