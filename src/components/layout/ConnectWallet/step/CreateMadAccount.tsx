import { FC, memo } from 'react';
import { useFormik } from 'formik';

import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import * as Yup from 'yup';
import { TextFieldFilledCustom } from 'components/modules/textField';
import { FilledButton } from 'components/common/buttons';
import userService from 'service/userService';
import { EMAIL_REGEX } from 'constants/app';
import Link from 'next/link';

interface ICreateMadAccountProps {
  address?: string | null | undefined;
  onSignUp: ({ email, username }: { email: string; username: string }) => void;
  loading?: boolean;
}

const CreateMadAccount: FC<ICreateMadAccountProps> = (props) => {
  const { address, onSignUp, loading } = props;

  const validationSchema = Yup.object({
    username: Yup.string()
      .trim()
      .min(1, 'Invalid username')
      .required('Username is not allowed to be empty'),
    email: Yup.string()
      .trim()
      .matches(EMAIL_REGEX, 'Invalid email address')
      .required('Email is not allowed to be empty'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: (values) => {
      onSignUp({ username: values.username.trim(), email: values.email.trim() });
    },
  });

  const { errors, values, getFieldProps, handleSubmit, setFieldValue } = formik;

  return (
    <div className="w-full mt-5">
      <form onSubmit={handleSubmit}>
        <div className="px-3.5 py-4 rounded-lg bg-background-dark-800">
          <div className="text--title-small text-archive-Neutral-Variant70">Address</div>
          <div className="mt-2 text--title-small text-[10px]">{address}</div>
        </div>
        <Stack spacing={3} className="mt-6">
          <TextFieldFilledCustom
            scheme="dark"
            className="text--body-large relative"
            label="Username"
            required
            placeholder={`Username (Display name)`}
            {...getFieldProps('username')}
            onChange={(e) => setFieldValue('username', e.target.value)}
            onBlur={() => setFieldValue('username', values.username.trim())}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
          <TextFieldFilledCustom
            scheme="dark"
            className="text--body-large"
            label="Email"
            required
            placeholder="Email"
            {...getFieldProps('email')}
            onChange={(e) => setFieldValue('email', e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email && errors.email}
          />

          <FilledButton
            text="Sign Up"
            type="submit"
            fullWidth
            customClass="font-bold"
            disabled={Boolean(Object.keys(errors).length)}
            loading={loading}
          />
          <Stack spacing={1}>
            <div className="flex justify-center items-center text--body-large text-white">
              <Checkbox className="Madcheckbox" defaultChecked={true} />
              Follow us for MADnews
            </div>
            <div className="text-center text--body-medium">
              By clicking sign up you indicate that you have read and agree to our{' '}
              <Link href="https://madworld.io/terms">
                <a target="_blank">
                  <span className="text-primary-90">Terms of Service</span>
                </a>
              </Link>{' '}
              and{' '}
              <Link href="https://madworld.io/privacy">
                <a target="_blank">
                  <span className="text-primary-90">Privacy Policy</span>
                </a>
              </Link>
            </div>
          </Stack>
        </Stack>
      </form>
    </div>
  );
};

CreateMadAccount.defaultProps = {
  address: 'address',
};

export default memo(CreateMadAccount);
