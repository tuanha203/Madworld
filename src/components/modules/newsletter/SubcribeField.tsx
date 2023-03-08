import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { validateEmail } from 'utils/validateEmail';
import homePageService from 'service/homePageService';
import { toastError, toastSuccess } from 'store/actions/toast';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { toastMsgActons } from 'store/constants/toastMsg';

const SubscribeField = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsvalidEmail] = useState(true);
  const [isValidRequired, setIsValidRequired] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { button, icon } = useSelector((state:any) => state.theme);

  const handleChange = (e: any) => {
    setEmail(e.target.value);
    if (validateEmail(e.target.value) || e.target.value === '') return setIsvalidEmail(true);
    if (e.target.value === '') {
      setIsValidRequired(false)
    } else {
      setIsValidRequired(true)
    }
    return setIsvalidEmail(false);
  };

  const subscribeAction = async () => {
    if (email === '') {
      setIsValidRequired(false)
    }
    if (isValidEmail && email !== '') {
      setIsLoading(true);
      const [result, error] = await homePageService.subscribeEmail({ email });
      setIsLoading(false);

      if (error) {
        dispatch(toastError('Something went wrong!'));
        console.log(error);
        return;
      }

      setEmail('');
      dispatch(
        toastSuccess(
          'Subcribed! Stay tuned for more interesting news from MADworld NFT Marketplace.',
        ),
      );
      setTimeout(() => {
        dispatch({ type: toastMsgActons.CLOSE });
      }, 5000);
      console.log('success');
    }
  };
  return (
    <div className={`${isValidEmail && 'mb-4'}`}>
      <div className="flex flex-row">
        <TextField
          value={email}
          className="bg-white w-full !border-none"
          placeholder="Email Address"
          id="outlined-basic"
          label=""
          variant="outlined"
          onChange={handleChange}
          sx={{
            input: {
              fontFamily: 'Chakra Petch',
              fontWeight: 700,
              cursor: 'auto',
              fontSize: '14px'
            },
            '> div': {
              borderRadius: 0,
            },
            fieldset: {
              border: 'none',
            },
          }}
        />
        <div
          onClick={subscribeAction}
          style={button?.default}
          className="subscribe-action w-14 h-14 flex flex-col items-center justify-center z-[1]
                      cursor-pointer text-black bg-primary-dark hover:shadow-elevation-dark-1"
        >
          {isLoading ? (
            <CircularProgress className="text-white" color="inherit" size={20} />
          ) : (
            <ArrowForwardOutlinedIcon className="text-white" />
          )}
        </div>
      </div>
      {!isValidEmail && <p className="text-[#FF5449] text-sm mt-2">Invalid email address.</p>}
      {!isValidRequired && <p className="text-[#FF5449] text-sm mt-2">Email is not allowed to be empty</p>}
    </div>
  );
};

export default SubscribeField;
