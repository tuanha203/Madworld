import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { IconWallet } from '../iconography/IconBundle';
import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

interface IButton {
  text?: string;
  onClick?: any;
  icon?: any;
  disabled?: boolean;
  customClass?: string;
  children?: any;
  fullWidth?: boolean;
  type?: any;
  loading?: boolean;
  style?: any;
}

export const FilledButton = ({
  text,
  onClick,
  icon,
  disabled,
  customClass,
  children,
  fullWidth,
  type,
  loading,
  style,
}: IButton) => {
  const { button } = useSelector((state:any) => state.theme);
  return (
    <Button
      disabled={disabled || loading}
      onClick={onClick}
      variant="contained"
      type={type}
      fullWidth={fullWidth}
      className={`filled-button mad-button !text-white gap-2 ${customClass}`}
      style={style}
    >
      {icon ? <AddOutlinedIcon /> : ''}
      {loading && (
        <CircularProgress sx={{ svg: { margin: '0px !important' } }} color="inherit" size={20} />
      )}
      {text}
      {children}
    </Button>
  );
};
FilledButton.defaultProps = {
  disabled: false,
};

export const FilledButtonDark = ({
  text,
  onClick,
  icon,
  disabled,
  customClass,
  children,
  loading,
}: any) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="contained"
      className={`filled-button  mad-button button-dark  ${customClass}`}
    >
      {icon ? <AddOutlinedIcon /> : ''}
      {loading && (
        <CircularProgress sx={{ svg: { margin: '0px !important' } }} color="inherit" size={20} />
      )}
      {text}
      {children}
    </Button>
  );
};

FilledButtonDark.defaultProps = {
  disabled: false,
  customClass: '',
};

export const OutlinedButton = ({
  text,
  onClick,
  icon,
  disabled,
  customClass,
  children,
  fullWidth,
  dark = false,
  loading,
  style,
}: any) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="outlined"
      fullWidth={fullWidth}
      className={`outlined-button mad-button gap-2 ${dark ? 'dark' : 'light'} ${customClass} `}
      sx={{...style}}
    >
      {icon == 'plus' ? <AddOutlinedIcon /> : icon == 'wallet' ? <IconWallet /> : icon}
      {loading && (
        <CircularProgress sx={{ svg: { margin: '0px !important' } }} color="inherit" size={20} />
      )}
      {text}
      {children}
    </Button>
  );
};

OutlinedButton.defaultProps = {
  disabled: false,
  customClass: '',
};

export const TextButton = ({
  text,
  onClick,
  icon,
  disabled,
  customClass,
  usage,
  children,
  dark = false,
  loading,
}: any) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="text"
      className={`text-button mad-button gap-2 ${customClass} ${dark ? 'dark' : 'light'}`}
    >
      {icon == 'plus' ? <AddOutlinedIcon /> : icon && icon}
      {loading && (
        <CircularProgress sx={{ svg: { margin: '0px !important' } }} color="inherit" size={20} />
      )}
      {text}
      {children}
    </Button>
  );
};

TextButton.defaultProps = {
  disabled: false,
  text: null,
  usage: null,
  dark: false,
};

export const TextButtonSquare = ({
  text,
  onClick,
  disabled,
  customClass,
  scheme,
  children,
  loading,
}: any) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="text"
      className={`text-button-square mad-button ${scheme}  gap-2 ${customClass}`}
    >
      {loading && (
        <CircularProgress sx={{ svg: { margin: '0px !important' } }} color="inherit" size={20} />
      )}
      {text}
      {children}
    </Button>
  );
};

TextButtonSquare.defaultProps = {
  disabled: false,
  text: null,
  scheme: 'dark', // light || dark
  usage: null,
};

export const TonalButton = ({
  text,
  onClick,
  icon,
  disabled,
  customClass,
  children,
  loading,
  sx,
  isActive,
}: any) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="contained"
      className={`tonal-button mad-button ${customClass} ${!isActive && 'none-active'}`}
      sx={sx}
    >
      {icon ? <AddOutlinedIcon /> : ''}
      {loading && (
        <CircularProgress sx={{ svg: { margin: '0px !important' } }} color="inherit" size={20} />
      )}
      <div className={`${loading && 'pl-1'}`}>{text}</div>
      {children}
    </Button>
  );
};
TonalButton.defaultProps = {
  disabled: false,
};
