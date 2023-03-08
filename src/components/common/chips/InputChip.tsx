import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ReactElement, ReactNode } from 'react';
import { useSelector } from 'react-redux';

interface InputChipProp {
  label?: string | Element | ReactNode;
  scheme?: string;
  className?: string;
  color?: string;
  icon?: ReactElement;
  onClick?: () => void;
  style?: any;
  hover?: boolean;
}
interface InputChipIconProp {
  label?: string;
  scheme?: string;
  color?: string;
  onClick?: any;
  icon?: any;
}
export const InputChip = ({
  label,
  scheme,
  color,
  icon,
  className,
  onClick,
  style,
  hover = true,
}: InputChipProp) => {
  const { button } = useSelector((state:any) => state.theme);
  return (
    <Chip
      sx={
        hover
          ? {
              '&:hover': {
                backgroundColor: `${button?.default?.background} !important`,
              },
            }
          : {}
      }
      onClick={onClick}
      label={label}
      icon={icon}
      clickable
      className={`basic-chip basic-chip ${scheme} ${color} ${className}`}
      style={style}
    />
  );
};

export const InputChipIcon = ({ label, scheme, icon, color, onClick }: InputChipIconProp) => {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <Chip
      label={label}
      clickable
      className={`basic-chip ${scheme} ${color}`}
      deleteIcon={icon}
      onDelete={handleDelete}
      onClick={onClick}
    />
  );
};

export const InputChipAvatar = ({ label, scheme, color }: InputChipIconProp) => {
  return (
    <Chip
      label={label}
      clickable
      className={`basic-chip ${scheme} ${color}`}
      avatar={color == 'red' ? <CheckCircleIcon /> : <AccountCircleIcon />}
    />
  );
};

export const InputChipIconAvatar = ({ label, scheme, color }: InputChipIconProp) => {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };
  return (
    <Chip
      label={label}
      clickable
      className={`basic-chip ${scheme} ${color}`}
      deleteIcon={<ClearIcon />}
      avatar={color == 'red' ? <CheckCircleIcon /> : <AccountCircleIcon />}
      onDelete={handleDelete}
    />
  );
};

export const SmallInputChip = ({ state, children }: any) => {
  return (
    <div
      className={`${
        state == 'green' ? 'bg-primary-dark text-background-dark-500' : 'bg-secondary-60 text-white'
      } rounded 
     text--label-medium text-center max-content-width py-1 px-2 capitalize `}
    >
      {children}
    </div>
  );
};

SmallInputChip.defaultProps = {
  state: 'green',
};
