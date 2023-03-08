import { Button, CircularProgress, FormHelperText, Modal, Stack, Switch } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { TextFieldFilledCustom } from 'components/modules/textField';
import { FilledButton, OutlinedButton, TextButton } from 'components/common/buttons';
import { useFormik } from 'formik';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WebIcon from '@mui/icons-material/Web';
import TwitterIcon from '@mui/icons-material/Twitter';
import * as Yup from 'yup';
import { ClosingIcon } from 'components/common/iconography/IconBundle';
import collectionService from 'service/collectionService';
import { IMAGE_TYPE_UPLOAD, URL_SOCIAL, WINDOW_MODE } from 'constants/app';
import { AWS_CLOUDFRONT_API_ENDPOINT } from 'constants/envs';
import images from 'themes/images';
import artistService from 'service/artist';
import userService from 'service/userService';
import { toastError } from 'store/actions/toast';
import { useDispatch, useSelector } from 'react-redux';
import ImageBase from 'components/common/ImageBase';
import Link from 'next/link';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { validateFile } from 'utils/file';
import { CheckedSvg, DiscordSvg, TelegramSvg } from 'components/common/iconography/iconsComponentSVG';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: '24px',
  padding: '60px',
  paddingTop: '32px',
} as React.CSSProperties;

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
interface INewCollectionFormProps {
  // TODO: Generic Type here follow Values Interface
  dataUserInfo: any;
  onCloseUpdateSuccess: () => void;
}
export interface IInitialUpdateValues {
  email: string;
  username: string;
  phoneNumber: string;
  description: string;
  avatarImg: string;
  coverImg: string;
  twitterUrl: string;
  websiteUrl: string;
  telegramUrl: string;
  discordUrl: string;
}

const EditArtistForm: FC<INewCollectionFormProps> = (props) => {
  const dispatch = useDispatch();
  const windowMode = useDetectWindowMode();
  const isMobileInSmMd = [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode);
  const inputAvatarRef: any = useRef();
  const inputCoverRef: any = useRef();
  const { dataUserInfo, onCloseUpdateSuccess } = props;
  const [selectedImageAvatar, setSelectedImageAvatar] = useState();
  const [selectedImageCover, setSelectedImageCover] = useState();
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { icon, text, button } = useSelector((state:any) => state.theme);
  const handleOpenUpdateModal = () => setOpenUpdateModal(true);
  const handleCloseUpdateModal = () => {
    onCloseUpdateSuccess();
    setOpenUpdateModal(false);
  };

  const [toggleAgree, setToggleAgree] = useState(false);
  const validationSchema = Yup.object({
    email: Yup.string()
      .nullable()
      .email('Invalid email')
      .required('Email is not allowed to be empty'),
    username: Yup.mixed().nullable().required('Display Name is not allowed to be empty'),
    phoneNumber: Yup.string().nullable().notRequired().matches(phoneRegExp, 'Invalid phone number'),
    description: Yup.mixed().nullable().notRequired(),
    avatarImg: Yup.mixed().test(
      'fileSize',
      'The uploaded file is too large. The  max file is 15mb',
      (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 15000000;
      },
    ),
    coverImg: Yup.mixed().test(
      'fileSize',
      'The uploaded file is too large. The  max file is 15mb',
      (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 15000000;
      },
    ),
    websiteUrl: Yup.string()
      .transform((v) => (v === null || v === undefined ? 'err.com' : v))
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Website url must be a valid URL',
      ),
    twitterUrl: Yup.mixed().nullable().notRequired(),
    telegramUrl: Yup.mixed().nullable().notRequired(),
    discordUrl: Yup.mixed().nullable().notRequired(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: dataUserInfo?.email,
      username: dataUserInfo?.username,
      phoneNumber: dataUserInfo?.phoneNumber,
      avatarImg: dataUserInfo?.avatarImg,
      coverImg: dataUserInfo?.coverImg,
      websiteUrl: dataUserInfo?.websiteUrl,
      twitterUrl: dataUserInfo?.twitterUrl,
      telegramUrl: dataUserInfo?.telegramUrl,
      discordUrl: dataUserInfo?.discordUrl,
      description: dataUserInfo?.description,
      avatar: null, //for avatarImg Error
      cover: null, //for coverImg Error
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleUpdateCollection(values);
    },
  });

  const { values, errors, touched, getFieldProps, handleSubmit, setFieldValue } = formik;

  const handleUpdateCollection = async (values: IInitialUpdateValues) => {
    try {
      setIsUpdateSuccess(false);
      handleOpenUpdateModal();
      let avatarPath, coverImagePath;
      if (values.avatarImg !== null && typeof values.avatarImg === 'object') {
        const dataAvatarImg = {
          imgFile: values.avatarImg,
          nftId: '',
          userId: dataUserInfo.id,
          previewImgId: '',
          type: IMAGE_TYPE_UPLOAD.USER_AVATAR,
        };
        avatarPath = await artistService.uploadAvatar(dataAvatarImg);
      }
      if (values.coverImg !== null && typeof values.coverImg === 'object') {
        const dataCoverImg = {
          imgFile: values.coverImg,
          nftId: '',
          userId: dataUserInfo.id,
          previewImgId: '',
          type: IMAGE_TYPE_UPLOAD.USER_COVER,
        };
        coverImagePath = await artistService.uploadCover(dataCoverImg);
      }
      const params = {
        coverImg: coverImagePath,
        avatarImg: avatarPath,
      };
      await artistService.uploadProfileImage(params);
      let updateProfileDto: any = {
        email: values?.email?.trim(),
        username: values?.username?.trim(),
        phoneNumber: values?.phoneNumber?.trim(),
        websiteUrl: values?.websiteUrl?.trim(),
        twitterUrl: values?.twitterUrl?.trim(),
        telegramUrl: values?.telegramUrl?.trim(),
        discordUrl: values?.discordUrl?.trim(),
        description: values?.description?.trim(),
      };
      if (values.avatarImg === null) {
        updateProfileDto['avatarImg'] = null;
      }
      if (values.coverImg === null) {
        updateProfileDto['coverImg'] = null;
      }

      const [response, error] = await userService.updateUserProfile(updateProfileDto);

      if (response) {
        setIsUpdateSuccess(true);
      }
      if (error) {
        dispatch(toastError(error));
        throw new Error(error);
      }
    } catch (error) {
      setOpenUpdateModal(false);
    }
  };
  const imageAvatarChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && !validateFile(file.type.split('/')[1])) {
      return dispatch(toastError('Invalid format'));
    }
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImageAvatar(e.target.files[0]);
      setFieldValue('avatarImg', e.target.files[0]);
    }
  };
  const imageCoverChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && !validateFile(file.type.split('/')[1])) {
      return dispatch(toastError('Invalid format'));
    }
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImageCover(e.target.files[0]);
      setFieldValue('coverImg', e.target.files[0]);
    }
  };

  return (
    <div className="flex h-full mx-auto lg:w-[500px] sm:w-full justify-center">
      <div className="pt-14 pb-16 w-full">
        <div className="lg:text--display-small sm:text--headline-small lg:text-left sm:text-center lg:mb-12 sm:mb-6">
          Edit Profile
        </div>
        <div className="flex flex-col justify-between bg-[url('/images/bg-collection.png')] lg:py-9 lg:px-12 sm:p-3">
          <div className="flex lg:flex-row sm:flex-col lg:justify-between">
            <div className="w-[180px]">
              <div className="mt-5 mb-2 text--label-large">Profile Image</div>
              <div className="text--body-small text-archive-Neutral-Variant70">
                Recommended 350px x 350px Max Size: 15 Mb
              </div>
            </div>
            <div className="lg:w-auto sm:w-full flex sm:justify-end">
              <div
                className={`relative ${
                  selectedImageAvatar ? 'bg-background-dark-900' : 'border border-1 border-dashed'
                } h-[150px] w-[150px] flex flex-col items-center justify-center`}
              >
                {selectedImageAvatar ? (
                  <div className="absolute opacity-50 overflow-hidden flex justify-center items-center w-full h-full">
                    <img
                      className="w-full"
                      src={URL.createObjectURL(selectedImageAvatar)}
                      alt="Banner"
                    />
                  </div>
                ) : (
                  <>
                    {dataUserInfo?.avatarImg && values.avatarImg && (
                      <div className="absolute overflow-hidden flex justify-center items-center w-full h-full">
                        <ImageBase
                          className="w-full"
                          type="HtmlImage"
                          url={dataUserInfo?.avatarImg}
                          errorImg="Avatar"
                          alt="Banner"
                        />
                      </div>
                    )}
                  </>
                )}
                {(selectedImageAvatar || values.avatarImg) && (
                  <div className="absolute top-3.5 right-3.5 cursor-pointer">
                    <ClosingIcon
                      onClick={() => {
                        setSelectedImageAvatar(undefined);
                        inputAvatarRef.current.value = null;
                        setFieldValue('avatarImg', null);
                      }}
                      style={icon}
                    />
                  </div>
                )}
                <Stack spacing={3} alignItems="center">
                  {!selectedImageAvatar && (
                    <div className="text-center">
                      <FileUploadIcon
                        className="text-red"
                        style={icon || { color: '#F4B1A3', fontSize: 40 }}
                      />
                    </div>
                  )}
                  <div className="relative overflow-hidden" style={{ marginTop: 0 }}>
                    <input
                      className="absolute p-5 w-full translate-y-full scale-[3] opacity-0 z-10 cursor-pointer"
                      accept="image/*"
                      type="file"
                      ref={inputAvatarRef}
                      {...getFieldProps('avatar')}
                      onChange={imageAvatarChange}
                    />
                    <OutlinedButton
                      dark
                      text="Choose file"
                      customClass="!text--label-large text-secondary-60"
                      style={button?.outline}
                    />
                  </div>
                </Stack>
              </div>
            </div>
          </div>
          <FormHelperText className="mt-4" error={Boolean(touched.avatar && errors.avatarImg)}>
            {touched.avatar && errors.avatarImg}
          </FormHelperText>
          <div className="w-[180px]">
            <div className="mt-5 mb-2 text--label-large">Profile Cover</div>
          </div>
          {isMobileInSmMd && (
            <div className="text-left mb-4 text-archive-Neutral-Variant70">
              <div className="text--body-small max-w-[240px]">
                Upload new cover for your profile page.
                <br />
                We recommend to upload images in 1440x260 resolution.
                <br />
                Max 15mb.
              </div>
            </div>
          )}
          <div
            className={`relative ${
              selectedImageCover ? 'bg-background-dark-900' : 'border border-1 border-dashed'
            } h-[150px] flex flex-col items-center justify-center`}
          >
            {selectedImageCover ? (
              <div className="absolute opacity-50 overflow-hidden flex justify-center items-center w-full h-full">
                <div className="relative h-full w-full">
                  <img
                    className="w-full h-full object-cover"
                    src={URL.createObjectURL(selectedImageCover)}
                    alt="Banner"
                  />
                </div>
              </div>
            ) : (
              <>
                {dataUserInfo?.coverImg && values.coverImg && (
                  <div className="absolute overflow-hidden flex justify-center items-center w-full h-full">
                    <ImageBase
                      className="w-full"
                      type="HtmlImage"
                      url={dataUserInfo?.coverImg}
                      errorImg="Banner"
                      alt="Banner"
                    />
                  </div>
                )}
              </>
            )}
            {(selectedImageCover || values.coverImg) && (
              <div className="absolute top-3.5 right-3.5 cursor-pointer">
                <ClosingIcon
                  onClick={() => {
                    inputCoverRef.current.value = null;
                    setSelectedImageCover(undefined);
                    setFieldValue('coverImg', null);
                  }}
                  style={icon}
                />
              </div>
            )}
            <Stack spacing={3} alignItems="center">
              {!selectedImageCover && (
                <div className="text-center">
                  <FileUploadIcon
                    className="text-red"
                    style={icon || { color: '#F4B1A3', fontSize: 40 }}
                  />
                  {!isMobileInSmMd && (
                    <div className="text--body-small w-[340px]">
                      Upload new cover for your profile page.
                      <br />
                      We recommend to upload images in 1440x260 resolution. Max 15mb.
                      <br />
                    </div>
                  )}
                </div>
              )}
              <div className="relative overflow-hidden" style={{ marginTop: 0 }}>
                <input
                  className="absolute p-5 w-full translate-y-full scale-[3] opacity-0 z-10 cursor-pointer"
                  accept="image/*"
                  type="file"
                  {...getFieldProps('cover')}
                  ref={inputCoverRef}
                  onChange={imageCoverChange}
                />
                <OutlinedButton
                  text="Choose file"
                  customClass="!text--label-large"
                  dark
                  style={button?.outline}
                />
              </div>
            </Stack>
          </div>
          <FormHelperText className="mt-4" error={Boolean(touched.cover && errors.coverImg)}>
            {touched.cover && errors.coverImg}
          </FormHelperText>
        </div>
        <TextFieldFilledCustom
          scheme="dark mt-8"
          required
          disableUnderline
          className="font-Chakra"
          startAdornment={
            <FavoriteIcon
              className="text-red mr-3.5"
              style={icon || { color: '#F4B1A3', fontSize: 25 }}
            />
          }
          placeholder="Display name"
          {...getFieldProps('username')}
          error={Boolean(touched.username && errors.username)}
          helperText={touched.username && errors.username}
        />
        <TextFieldFilledCustom
          scheme="dark mt-8"
          className="font-Chakra"
          disableUnderline
          startAdornment={
            <FavoriteIcon
              className="text-red mr-3.5"
              style={icon || { color: '#F4B1A3', fontSize: 25 }}
            />
          }
          placeholder="Phone Number"
          {...getFieldProps('phoneNumber')}
          error={Boolean(touched.phoneNumber && errors.phoneNumber)}
          helperText={touched.phoneNumber && errors.phoneNumber}
        />
        <TextFieldFilledCustom
          scheme="dark mt-8"
          required
          className="font-Chakra"
          disableUnderline
          placeholder="Email"
          startAdornment={
            <FavoriteIcon
              className="text-red mr-3.5"
              style={icon || { color: '#F4B1A3', fontSize: 25 }}
            />
          }
          {...getFieldProps('email')}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />
        <TextFieldFilledCustom
          scheme="dark mt-8"
          disableUnderline
          className="font-Chakra"
          startAdornment={
            <FavoriteIcon
              className="text-red mr-3.5"
              style={icon || { color: '#F4B1A3', fontSize: 25 }}
            />
          }
          placeholder="Description"
          error={Boolean(touched.description && errors.description)}
          helperText={touched.description && errors.description}
          {...getFieldProps('description')}
        />
        <div>
          <div className="mt-8 flex items-center text--title-large text-[22px]">Social link</div>
          <TextFieldFilledCustom
            scheme="dark mt-8"
            required
            disableUnderline
            className="font-Chakra"
            startAdornment={
              <WebIcon
                className="text-red mr-3.5"
                style={icon || { color: '#F4B1A3', fontSize: 25 }}
              />
            }
            placeholder="Website"
            {...getFieldProps('websiteUrl')}
            error={Boolean(touched.websiteUrl && errors.websiteUrl)}
            helperText={touched.websiteUrl && errors.websiteUrl}
          />
          <TextFieldFilledCustom
            scheme="dark mt-8"
            className="font-Chakra"
            disableUnderline
            startAdornment={
              <div className="text-white pr-1 flex items-center leading-5">
                <span className="">
                  <TwitterIcon
                    className="text-red mr-3.5"
                    style={icon || { color: '#F4B1A3', fontSize: 25 }}
                  />
                </span>
                {URL_SOCIAL.twitter}
              </div>
            }
            placeholder="Twitter"
            {...getFieldProps('twitterUrl')}
            error={Boolean(touched.twitterUrl && errors.twitterUrl)}
            helperText={touched.twitterUrl && errors.twitterUrl}
          />
          <TextFieldFilledCustom
            scheme="dark mt-8"
            className="font-Chakra"
            required
            placeholder="Discord"
            disableUnderline
            startAdornment={
              <div className="text-white pr-1 flex items-center leading-5">
                <span className="mr-3.5 w-[25px]">
                  <DiscordSvg className="w-6" color={icon?.color} />
                </span>
                {URL_SOCIAL.discord}
              </div>
            }
            {...getFieldProps('discordUrl')}
            error={Boolean(touched.discordUrl && errors.discordUrl)}
            helperText={touched.discordUrl && errors.discordUrl}
          />
          <TextFieldFilledCustom
            scheme="dark mt-8"
            className="font-Chakra"
            disableUnderline
            startAdornment={
              <div className="text-white pr-1 flex items-center leading-5">
                <span className="mr-3.5 w-[25px]">
                  <TelegramSvg className="w-6" color={icon?.color} />
                </span>
                {URL_SOCIAL.telegram}
              </div>
            }
            placeholder="Telegram"
            error={Boolean(touched.telegramUrl && errors.telegramUrl)}
            helperText={touched.telegramUrl && errors.telegramUrl}
            {...getFieldProps('telegramUrl')}
          />
        </div>
        <Stack className="mt-8" direction={'row'} justifyContent="space-between">
          <div>
            <div className="mb-2 flex items-center text--label-large">
              By checking the switch, I agree to MADworld's
            </div>
            <Link href="https://madworld.io/terms">
              <a target="_blank">
                <div className="text-primary-90 text-[14px] font-bold" style={text}>Terms of Service</div>
              </a>
            </Link>
          </div>
          <div>
            <Switch className="mad-switch" style={icon} onChange={() => setToggleAgree(!toggleAgree)} />
          </div>
        </Stack>

        <Stack className="justify-end" direction={'row'} spacing={3}>
          <FilledButton
            disabled={!toggleAgree}
            text="Save changes"
            customClass="!text--label-large mt-8 lg:w-auto sm:w-full"
            onClick={handleSubmit} 
            style={button?.default}
          />
        </Stack>
      </div>
      {openUpdateModal && (
        <Modal
          open={openUpdateModal}
          onClose={(e: any, reason: string) => {
            if (reason !== 'backdropClick' && isUpdateSuccess) {
              handleCloseUpdateModal();
            }
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div
            style={style}
            className="bg-background-dark-600 rounded-[28px] flex flex-col text-center items-center font-Chakra p-[30px]"
          >
            <p className="font-bold text-lg mb-6 text-dark-on-surface text-[24px]">
              {isUpdateSuccess ? 'Updated Successfully' : 'Update Profile'}
            </p>
            <div>
              {isUpdateSuccess ? (
                <>
                  <CheckedSvg  className="inline-block mb-6 w-[60px] h-[60px]" />
                  <p className="text-sm text-archive-Neutral-Variant70 mb-6">
                    Congratulations! Your profile was successfully updated.
                  </p>
                  <Button
                    style={{...button?.default,
                      display: 'inline-block',
                      width: '100%',
                    }}
                    className={`filled-button mad-button !text-white `}
                    onClick={handleCloseUpdateModal}
                    
                  >
                    Close
                  </Button>
                </>
              ) : (
                <div className="bg-background-variant-dark rounded-lg flex py-4 px-5">
                  <CircularProgress className="text-secondary-60" size={20} />
                  <div className="text-left pl-2">
                    <h4 className="text-dark-on-surface font-bold pt-1 pb-3.5">Uploading</h4>
                    <p className="text-sm text-archive-Neutral-Variant70">
                      Please wait to upload processing
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditArtistForm;
