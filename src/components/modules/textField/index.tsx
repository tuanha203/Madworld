import { useState, FC, MouseEventHandler, ReactNode } from 'react';
import { FilledInputProps, InputBaseProps, MenuItem, Select, makeStyles, TextareaAutosize } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { HeartIconFilled, IconDynamic } from '../../common/iconography/IconBundle';
import { Field, getIn } from 'formik';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface ITextFieldProps {
  helperText?: string;
  scheme?: string;
  type?: string;
  value?: any;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  label?: string;
  iconElement?: React.ReactNode;
  onBlur?: () => any;
  classNameForm?: string;
  style?: any;
  classNameFilledInput?: string;
}

interface SelectFieldProps {
  helperText?: string;
  scheme?: string;
  type?: string;
  value?: any;
  handleChange?: () => any;
  name?: string;
  label?: string;
  iconElement?: React.ReactNode;
  classNameForm?: string;
  style?: any;
  classNameFilledInput?: string;
  children: React.ReactNode;
}

export const TextFieldOutlined: FC<ITextFieldProps> = ({ helperText, scheme }) => {
  const [values, setValues] = useState({
    amount: '',
    password: '',
    showPassword: false,
  });

  const handleChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <FormControl
      className={`text-field text-field-outlined ${scheme}`}
      fullWidth
      variant="outlined"
    >
      <InputLabel htmlFor="outlined-adornment-password">Label</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={values.showPassword ? 'text' : 'password'}
        value={values.password}
        onChange={handleChange('password')}
        // startAdornment={
        //   <InputAdornment position="start">
        //     <HeartIconFilled />
        //   </InputAdornment>
        // }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {values.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export const TextFieldFilledIcon: FC<ITextFieldProps> = ({ helperText, scheme }) => {
  const [values, setValues] = useState({
    amount: '',
    password: '',
    showPassword: false,
  });

  const handleChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <FormControl
      className={`text-field text-field-filled text-field-icon ${scheme}`}
      fullWidth
      variant="filled"
    >
      <InputLabel htmlFor="filled-adornment-password" className="text-field-label">
        Label
      </InputLabel>
      <FilledInput
        sx={{
          '&::after, &::before': {
            display: 'none',
          },
        }}
        id="filled-adornment-password"
        type={values.showPassword ? 'text' : 'password'}
        value={values.password}
        onChange={handleChange('password')}
        // label="Password"
        // startAdornment={
        //   <InputAdornment position="start">
        //     <HeartIconFilled />
        //   </InputAdornment>
        // }
        endAdornment={
          <InputAdornment position="end">
            <div className="heart-icon">
              <HeartIconFilled />
            </div>
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {values.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export const TextFieldFilled: FC<ITextFieldProps> = ({ helperText, scheme }) => {
  const [values, setValues] = useState({
    amount: '',
    password: '',
    showPassword: false,
  });

  const handleChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <FormControl className={`text-field text-field-filled ${scheme}`} fullWidth variant="filled">
      <InputLabel htmlFor="filled-adornment-password">Label</InputLabel>
      <FilledInput
        sx={{
          '&::after, &::before': {
            display: 'none',
          },
        }}
        id="filled-adornment-password"
        type={values.showPassword ? 'text' : 'password'}
        value={values.password}
        onChange={handleChange('password')}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {values.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

interface TextFieldFilledCustomProps {
  label?: ReactNode;
  scheme?: string;
  helperText?: ReactNode | any;
  required?: boolean;
  disableUnderline?: boolean;
  classCustomError?: any;
  isRequiredStar?: any;
  customClassName?: any;
  sx?: any;
}

export const TextFieldFilledCustom: FC<TextFieldFilledCustomProps & InputBaseProps> = (props) => {
  const { helperText, label, scheme, required, error,sx, classCustomError, customClassName, isRequiredStar = true,  ...rest } = props;

  return (
    <div>
      {label && (
        <div className="mb-2 text--label-large">
          {label}
          {required && isRequiredStar && <span className="text-error-60">*</span>}
        </div>
      )}
      <FormControl sx={sx} className={`text-field text-field-filled ${scheme} ${customClassName}`} fullWidth variant="filled">
        <FilledInput
          sx={{
            '&::after, &::before': {
              display: 'none',
            },
            fontFamily: 'Chakra Petch',
          }}
          id="filled-adornment-password"
          hiddenLabel
          {...rest}
        />
        <FormHelperText className={`text--body-small pl-4 ${classCustomError}`} error={error}>
          {helperText}
        </FormHelperText>
      </FormControl>
    </div>
  );
};

interface TextFieldPropertyProps {
  label?: ReactNode;
  scheme?: string;
  helperText?: ReactNode | any;
  required?: boolean;
  disableUnderline?: boolean;
  classCustomError?: any;
}

const ErrorMessage = ({ name }: any) => (
  <Field
    name={name}
    render={({ form }: any) => {
      const error = getIn(form?.errors, name);
      const touch = getIn(form?.touched, name);
      return  error ? <span className="text--body-small !text-xs !font-normal !text-error-60 pl-4">{error}</span> : null;
    }}
  />
);

export const TextFieldProperty: FC<any> = (props) => {
  const { helperText, label, scheme, required, errorName, errorMessage, name, classCustom, ...rest } =
    props;
  
  return (
    <div className='relative'>
      {label && (
        <div className="mb-2 text--label-large absolute top-0">
          {label}
          {required && <span className="text-error-60">*</span>}
        </div>
      )}
      <div className={`${label && 'pt-[32px]'}`}>
        <Field className={`text-field-formik ${classCustom}`} name={name} hiddenLabel {...rest} />
        <ErrorMessage name={errorName} />
      </div>
    </div>
  );
};


export const NumberProperty: FC<any> = (props) => {
  const { helperText, onUp, onDown, label, scheme, required, errorName, errorMessage, name, classCustom, ...rest } =
    props;
  
  return (
    <div>
      {label && (
        <div className="mb-2 text--label-large">
          {label}
          {required && <span className="text-error-60">*</span>}
        </div>
      )}
        <div>
          <div className={`flex imput-number-wrapper ${classCustom}`}>
            <Field className="imput-number w-full" name={name} hiddenLabel {...rest} />
            <div className="imput-number-arrow">
              <KeyboardArrowUpIcon className="text-secondary-60 cursor-pointer h-[20px]" onClick={onUp} />
              <KeyboardArrowDownIcon className="text-secondary-60 cursor-pointer h-[20px]" onClick={onDown} />
            </div>
          </div>
        </div>
        <ErrorMessage name={errorName} />
    </div>
  );
};

export const TextFieldCustom: FC<ITextFieldProps> = ({
  helperText,
  scheme,
  type,
  value,
  handleChange,
  name,
  label,
  iconElement,
  onBlur,
  classNameForm,
  style,
  classNameFilledInput,
}) => {
  const [values, setValues] = useState({
    amount: '',
    password: '',
    showPassword: false,
  });

  // const handleChange = (prop: string) => (event: any) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <FormControl
      className={`text-field text-field-filled ${scheme} ${classNameForm}`}
      style={style}
      fullWidth
      variant="filled"
    >
      <InputLabel htmlFor="filled-adornment-password">{label}</InputLabel>
      <FilledInput
        sx={{
          '&::after, &::before': {
            display: 'none',
          },
        }}
        id="filled-adornment-password"
        type={type}
        value={value}
        onChange={handleChange}
        name={name}
        autoComplete="off"
        onBlur={onBlur}
        endAdornment={<InputAdornment position="end">{iconElement}</InputAdornment>}
        className={classNameFilledInput}
        endAdornment={iconElement && <InputAdornment position="end">{iconElement}</InputAdornment>}
      />
      {helperText && (
        <FormHelperText>
          <span className="text-error-60 font-bold text-xs pl-4"> {helperText}</span>
        </FormHelperText>
      )}
    </FormControl>
  );
};

export const SelectField: FC<SelectFieldProps> = ({
  helperText,
  scheme,
  type,
  value,
  handleChange,
  name,
  label,
  classNameForm,
  style,
  classNameFilledInput,
  children,
}) => {
  return (
    <FormControl
      className={`text-field text-field-filled select-field ${scheme} ${classNameForm}`}
      style={style}
      fullWidth
      variant="filled"
    >
      <InputLabel htmlFor="filled-adornment-password">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        type={type}
        value={value}
        onChange={handleChange}
        name={name}
        className={classNameFilledInput}
        autoComplete="off"
      >
        {children}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

interface TextareaCustomProps {
  label?: ReactNode;
  scheme?: string;
  helperText?: ReactNode | any;
  required?: boolean;
  disableUnderline?: boolean;
  classCustomError?: any;
  classNameTextarea?: string;
  customClassName?: string;
}

export const TextareaCustom: FC<TextareaCustomProps & InputBaseProps> = (props) => {
  const { helperText, label, scheme, required, error, classNameTextarea, customClassName, classCustomError, ...rest } = props;

  return (
    <div>
      {label && (
        <div className="mb-2 text--label-large">
          {label}
          {required && <span className="text-error-60">*</span>}
        </div>
      )}
      <FormControl className={`text-field text-field-filled ${scheme} ${customClassName}`} fullWidth variant="filled">
        <TextareaAutosize
          id="filled-adornment-password"
          aria-label="minimum height"
          className={`text-area-custom ${classNameTextarea}`}
          minRows={2}
          maxRows={2}
          {...rest}
        />
        <FormHelperText className={`text--body-small pl-4 ${classCustomError}`} error={error}>
          {helperText}
        </FormHelperText>
      </FormControl>
    </div>
  );
};