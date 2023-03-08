import React from 'react';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import Button from '@mui/material/Button';
import { IconDynamic } from '../iconography/IconBundle';
import { useSelector } from 'react-redux';

interface BigButtonProp {
  disabled?: boolean;
  text: string;
  Icon: JSX.Element;
  className?: string;
  onClick?: () => void;
}

export const BigButton = ({ disabled, text, Icon, className, onClick }: BigButtonProp) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`big-button flex gap-2 !rounded-none ${className}`}
      variant="outlined"
    >
      {Icon}
      <div className={`!font-Chakra text text--headline-14 ${disabled ? '' : 'text-white'}`}>
        {text}
      </div>
    </Button>
  );
};

BigButton.defaultProps = {
  disabled: false,
  text: 'Fixed Price',
  Icon: <LocalOfferOutlinedIcon />,
};

interface BigButtonWithTextProp {
  disabled?: boolean;
  text?: string;
  description?: string;
  onClick?: () => void;
  customClass?: string;
}
export const BigButtonWithText = ({
  disabled,
  text,
  description,
  onClick,
  customClass,
}: BigButtonWithTextProp) => {
  const { button } = useSelector((state:any) => state.theme);
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      className={`${customClass} big-button flex flex-col items-center justify-center gap-2 !rounded-none`}
      style={customClass === 'big-button-text-select' ? button?.outline : {}}
    >
      <div className=" w-24 flex flex-col justify-center items-center gap-1 text-center">
        <div className={`!font-Chakra text--headline-14`}>{text}</div>
        <div className={`!font-Chakra text--body-small`}>{description}</div>
      </div>
    </Button>
  );
};

BigButtonWithText.defaultProps = {
  disabled: false,
  text: 'Fixed Price',
  description: 'Sell at a fixed or declining price',
  customClass: 'big-button-text-select',
};
