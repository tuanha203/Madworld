import { Button, CircularProgress, FormHelperText, Modal, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { FC, useEffect, useState } from 'react';
import { TextareaCustom, TextFieldFilledCustom } from 'components/modules/textField';
import { FilledButton, OutlinedButton } from 'components/common/buttons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  WebSiteIcon,
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
} from 'components/common/iconography/SocialMediaIcon';
import MenuAddSocial, { IFieldSocial, ISocialOptionsItem } from './MenuAddSocial';
import { ClosingIcon, IconDynamic } from 'components/common/iconography/IconBundle';
import { IInitialUpdateValues, ISocialValues, IUtilityValues } from '.';
import collectionService from 'service/collectionService';
import { IMAGE_TYPE_UPLOAD, URL_SOCIAL } from 'constants/app';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { toastError } from 'store/actions/toast';
import { useDispatch, useSelector } from 'react-redux';
import ImageBase from 'components/common/ImageBase';
import { updateRoyaltyInfoForCollectionIfSetter } from 'blockchain/utils';
import { convertPriceToBigDecimals } from 'blockchain/ether';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import Web3 from 'web3';
import socket from 'configsocket';
import { EventSocket } from 'constants/text';
import { LINK_SCAN } from 'constants/envs';
import { validateFile } from 'utils/file';
import LanguageIcon from '@mui/icons-material/Language';
import { DiscordIconCustomSVG, GameSVG, GovernanceSvg, StakingSvg, TelegramIconCustomSVG, TwitterIconCustomSVG, VRSvg } from 'components/common/iconography/iconsComponentSVG';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: '24px',
} as React.CSSProperties;
interface INewCollectionFormProps {
  // TODO: Generic Type here follow Values Interface
  dataCollection: any;
  onCloseUpdateSuccess: (shortUrl: string) => void;
  handleCloseEdit: () => void;
  addressSetter: string;
}


const EditCollectionForm: FC<INewCollectionFormProps> = (props) => {
  const dispatch = useDispatch();
  const { dataCollection, onCloseUpdateSuccess, handleCloseEdit, addressSetter } = props;
  const [selectedImageAvatar, setSelectedImageAvatar] = useState();
  const [selectedImageBanner, setSelectedImageBanner] = useState();
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [royaltySuggestion, setRoyaltySuggestion] = useState(false);
  const [valueRoyalty, setValueRoyalty] = useState(dataCollection?.royalty);
  const [valueShortUrl, setValueShortUrl] = useState();
  const [isUpdateCollection, setUpdateCollection] = useState<boolean>(false);
  const [isUpdateRoyalty, setLoadingUpdateRoyalty] = useState<boolean>(false);
  const [editRoyaltyTx, setEditRoyaltyTx] = useState<string>('');
  const [openTooltip, setOpenTooltip] = useState(false);
  const { icon, buttom } = useSelector((state:any) => state.theme);

  const handleOpenUpdateModal = () => setOpenUpdateModal(true);

  const SOCIAL_OPTIONS: ISocialOptionsItem[] = [
    {
      icon: <LanguageIcon style={icon} />,
      label: 'Website',
      field: 'web',
    },
    {
      icon: <DiscordIconCustomSVG color={icon?.color} />,
      label: 'Discord',
      field: 'discord',
    },
    {
      icon: <TelegramIconCustomSVG color={icon?.color} />,
      label: 'Telegram',
      field: 'telegram',
    },
    {
      icon: <TwitterIconCustomSVG color={icon?.color} />,
      label: 'Twitter',
      field: 'twitter',
    },
  ];


  const UTILITY_OPTIONS: ISocialOptionsItem[] = [
    {
      icon: <StakingSvg color={icon.color} />,
      label: 'Staking',
      field: 'staking',
    },
    {
      icon: <VRSvg color={icon.color} />,
      label: 'VR',
      field: 'vr',
    },
    {
      icon: <GovernanceSvg color={icon.color} />,
      label: 'Governance',
      field: 'governance',
    },
    {
      icon: <GameSVG color={icon.color} />,
      label: 'Game',
      field: 'game',
    },
  ];

  const handleError = (error: any) => {
    if (
      error?.code === 4001 ||
      String(error)?.includes('User rejected') ||
      String(error)?.includes('User denied')
    ) {
      dispatch(toastError('You declined the action in your wallet.'));
    } else {
      dispatch(toastError('Something went wrong.'));
    }
    setOpenUpdateModal(false);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Display name is not allowed to be empty'),
    bannerUrl: Yup.mixed()
      .nullable()
      .test('fileSize', 'The uploaded file is too large. The  max file is 15mb', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 15000000;
      })
      .required('Collection Banner was not chosen'),
    thumbnailUrl: Yup.mixed()
      .nullable()
      .test('fileSize', 'The uploaded file is too large. The  max file is 5mb', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 5000000;
      })
      .required('Collection Thumbnail was not chosen'),
    shortUrl: Yup.string()
      .nullable()
      // .matches(/^[\w,-_.~]+$/g, 'URL cannot contain special characters except "-","_",".","~"'),
      .matches(/^[a-zA-Z0-9]+$/, 'URL cannot contain special characters except "-","_",".","~"')
      .test('shortUrl', 'URL invalid', (value: any) => {
        if (!value) return true;
        return !Web3.utils.isAddress(value);
      }),
    payoutAddress: Yup.string()
      .required('Payout wallet address is not allowed to be empty')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid address'),
    royalty: Yup.number()
      .required('Royalty percentage is not allowed to be empty')
      .nullable()
      .max(50, 'Royalty percentage cannot be greater than 50%'),
    social: Yup.object({
      web: Yup.string()
        .transform((v) => (v === null || v === undefined ? 'err.com' : v))
        .matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          'Website url must be a valid url',
        ),
    }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: dataCollection.title || dataCollection.name || '',
      payoutAddress: dataCollection.payoutAddress || '',
      description: dataCollection.description,
      shortUrl: dataCollection.shortUrl,
      royalty: dataCollection.royalty,
      bannerUrl: dataCollection.bannerUrl,
      thumbnailUrl: dataCollection.thumbnailUrl,
      banner: null, //for bannerUrl Error
      thumbnail: null, //for thumbnailUrl Error
      social: {
        web: !!dataCollection.externalLink ? dataCollection.externalLink : null,
        discord: !!dataCollection.discordLink ? dataCollection.discordLink : null,
        telegram: !!dataCollection.telegramLink ? dataCollection.telegramLink : null,
        twitter: !!dataCollection.twitterLink ? dataCollection.twitterLink : null,
      },
      utility: {
        staking: !!dataCollection.stakingUrl ? dataCollection.stakingUrl : null,
        vr: !!dataCollection.vrUrl ? dataCollection.vrUrl : null,
        governance: !!dataCollection.governanceUrl ? dataCollection.governanceUrl : null,
        game: !!dataCollection.gameUrl ? dataCollection.gameUrl : null,
      },
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleUpdateCollection(values);
    },
  });

  const {
    values,
    errors,
    touched,
    getFieldProps,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    isValid
  } = formik;

  const handleCloseUpdateModal = () => {
    onCloseUpdateSuccess(values.shortUrl);
    setOpenUpdateModal(false);
  };

  const handleUpdateCollection = async (values: IInitialUpdateValues) => {
    try {
      setIsUpdateSuccess(false);
      setUpdateCollection(true);
      handleOpenUpdateModal();
      let responseUploadBanner;
      let responseUploadThumb;
      if (values.bannerUrl !== null && typeof values.bannerUrl === 'object') {
        const dataBannerImg = {
          imgFile: values.bannerUrl,
          nftId: '',
          collectionId: dataCollection.id,
          previewImgId: '',
          type: IMAGE_TYPE_UPLOAD.COLLECTION_COVER,
        };
        responseUploadBanner = await collectionService.uploadCollectionCover(dataBannerImg);
      }
      if (values.thumbnailUrl !== null && typeof values.thumbnailUrl === 'object') {
        const dataThumbnailImg = {
          imgFile: values.thumbnailUrl,
          nftId: '',
          collectionId: dataCollection.id,
          previewImgId: '',
          type: IMAGE_TYPE_UPLOAD.COLLECTION,
        };
        responseUploadThumb = await collectionService.uploadCollection(dataThumbnailImg);
      }
      const params = {
        bannerUrl: responseUploadBanner,
        thumbnailUrl: responseUploadThumb,
      };
      await collectionService.uploadCollectionImage(dataCollection.id, params);
      setUpdateCollection(false);

      const [response, error] = await collectionService.updateCollection(dataCollection.id, {
        title: values.name,
        payoutAddress: values.payoutAddress,
        description: values.description,
        shortUrl: values.shortUrl || '',
        website: values.social.web,
        discordLink: values.social.discord,
        telegramLink: values.social.telegram,
        twitterLink: values.social.twitter,
        externalLink: values.social.web,
        stakingUrl: values.utility.staking,
        vrUrl: values.utility.vr,
        governanceUrl: values.utility.governance,
        gameUrl: values.utility.game,
      });
      if (error) {
        throw new Error(error);
      }
      const checkRoyaltyChange =
        Number(values.royalty) !== Number(dataCollection?.royalty) ||
        String(values.payoutAddress) !== String(dataCollection?.payoutAddress);

      if (checkRoyaltyChange) {
        setLoadingUpdateRoyalty(true);
        const [proxy, error] = await updateRoyaltyInfoForCollectionIfSetter(
          dataCollection?.address,
          addressSetter[0],
          values.payoutAddress || dataCollection?.creator?.walletAddress,
          convertPriceToBigDecimals(values?.royalty || 0, 2),
        );
        if (error) {
          handleError(error);
          // return;
        }
        setEditRoyaltyTx(proxy?.hash);
        await proxy.wait(1);
      }

      if (response && !checkRoyaltyChange) {
        setLoadingUpdateRoyalty(false);
        setIsUpdateSuccess(true);
      }
    } catch (error: any) {
      setOpenUpdateModal(false);
      dispatch(toastError(error.toString()));
    }
  };

  const handleItemSocialClick = (field: keyof IFieldSocial) => {
    setFieldValue(`social.${field}`, '');
  };

  const handleItemUtilityClick = (field: keyof IFieldSocial) => {
    setFieldValue(`utility.${field}`, '');
  };

  const handleRemoveSocialField = (field: keyof ISocialValues) => {
    setFieldValue(`social.${field}`, null);
  };

  const handleRemoveUtilityField = (field: keyof IUtilityValues) => {
    setFieldValue(`utility.${field}`, null);
  };

  const imageChangeAvatar = async (e: any) => {
    const file = e.target.files[0];
    if (file && !validateFile(file.type.split('/')[1])) {
      return dispatch(toastError('Invalid format'))
    }
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImageAvatar(e.target.files[0]);
      setFieldValue('thumbnailUrl', e.target.files[0]);
    }
  };

  const imageChangeBanner = async (e: any) => {
    const file = e.target.files[0];
    if (file && !validateFile(file.type.split('/')[1])) {
      return dispatch(toastError('Invalid format'))
    }
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImageBanner(e.target.files[0]);
      setFieldValue('bannerUrl', e.target.files[0]);
    }
  };

  const handleChangeRoyalty = (el: any) => {
    var val = el?.target?.value;
    if (val === '.') {
      val = val.substring(0, 0);

      setValueRoyalty(val);
      setFieldValue('royalty', val);
    }
    val = val.replace(/[^0-9\.]/g, '');

    if (val.split('.').length > 2) {
      val = val.replace(/\.+$/, '');
    }
    if (val.split('.').length === 2 && val.split('.')[1].length > 2) {
      val = val.slice(0, -1);
    }

    setValueRoyalty(val);
    setFieldValue('royalty', val);
  };

  const handleChangeShortUrl = async (el: any) => {
    var val = el?.target?.value;
    setValueShortUrl(val);
    setFieldValue('shortUrl', val);
  };

  const onCheckShortUrl = async () => {
    if (values.shortUrl && values.shortUrl !== dataCollection.shortUrl) {
      const checkUrl = await collectionService.checkUrlAlreadyTaken(values.shortUrl);
      if (checkUrl) {
        setFieldError('shortUrl', 'The URL name is already taken.');
      }
    }
  };

  useEffect(() => {
    if (socket) {
      const userId = localStorage.getItem('userId');
      socket.on(EventSocket.UPDATED_PAYOUT_ADDRESS, (res) => {
        if (res?.data.user[0] === Number(userId)) {
          setLoadingUpdateRoyalty(false);
          setIsUpdateSuccess(true);
        }
      });

      return () => {
        socket.off(EventSocket.UPDATED_PAYOUT_ADDRESS);
      };
    }
  }, []);

  function clearFileInput(fieldInput: any) {
    try {
      fieldInput.value = null;
    } catch (ex) { }
    if (fieldInput.value) {
      fieldInput.parentNode.replaceChild(fieldInput.cloneNode(true), fieldInput);
    }
  }

  return (
    <div>
      <div className="lg:block lg:mb-6 mb-4 flex justify-center text--headline-small lg:pt-14 pt-[72px] mx-auto">
        Edit Collection
      </div>
      <div className="flex h-full mx-auto justify-between lg:flex-row sm:flex-col-reverse">
        <div className="lg:pt-0 pt-6 lg:pb-14 pb-6 xl:px-0 px-3 lg:w-[35%]">
          <Stack spacing={3}>
            <TextFieldFilledCustom
              scheme="dark"
              required
              label="Display Name"
              placeholder="Enter Collection Name"
              {...getFieldProps('name')}
              className="font-Chakra"
              error={Boolean(errors.name)}
              helperText={errors.name ? errors.name : ''}
            />
            <TextareaCustom
              scheme="dark"
              label="Description"
              customClassName="custom-field"
              classNameTextarea="custom-field"
              placeholder="Write some words about your token collection"
              {...getFieldProps('description')}
            />
            <div>
              <TextFieldFilledCustom
                scheme="dark"
                label="Short url"
                disableUnderline
                startAdornment={
                  <span className="text-white leading-5">
                    {' '}
                    {window?.location?.hostname}/collections/
                  </span>
                }
                placeholder="Enter short url"
                error={Boolean(errors?.shortUrl)}
                helperText={errors?.shortUrl}
                className="font-Chakra"
                {...getFieldProps('shortUrl')}
                value={valueShortUrl || values.shortUrl}
                onChange={handleChangeShortUrl}
                onBlur={() => {
                  onCheckShortUrl();
                  if (errors?.shortUrl) {
                    setFieldError('shortUrl', errors?.shortUrl?.toString());
                  }
                }}
              />
              <div className="pl-4 text--body-small text-archive-Neutral-Variant70 mb-2.5">
                Will be used as public URL
              </div>
            </div>
            <div>
              <TextFieldFilledCustom
                scheme="dark"
                required
                isRequiredStar={false}
                label={
                  <>
                    <div>
                      Royalty for collection<span className="text-red-600">*</span>{' '}
                      <ContentTooltip
                        placement="top"
                        title="Royalties are payments that compensate original NFT creators for the use of their NFTs"
                        arrow
                        open={openTooltip}
                        onClose={() => setOpenTooltip(false)}
                      >
                        <InfoOutlinedIcon onClick={() => setOpenTooltip(true)} className="text-primary-60" style={{ fontSize: 16, ...icon }} />
                      </ContentTooltip>
                    </div>
                    <div className="text--body-small text-archive-Neutral-Variant70 mb-2.5">
                      Apply unique royalty percentage to whole collection content
                    </div>
                  </>
                }
                disableUnderline
                className="font-Chakra"
                onFocus={() => setRoyaltySuggestion(true)}
                placeholder="Add Royalty Percentage"
                error={Boolean(errors.royalty)}
                helperText={errors.royalty}
                {...getFieldProps('royalty')}
                value={valueRoyalty}
                onChange={handleChangeRoyalty}
                onBlur={() => setRoyaltySuggestion(false)}
                name="royalty"
              />
              {royaltySuggestion && (
                <div className="pl-4 text--body-small text-archive-Neutral-Variant70 mb-2.5">
                  Suggested: 0%, 10%, 20%, 30%. Maximum is 50%
                </div>
              )}
            </div>
            <TextFieldFilledCustom
              scheme="dark"
              label={
                <span>
                  <div>
                    <span>Your payout wallet address</span>
                    <span className="text-error-60">*</span>
                  </div>
                  <div className="text--body-small text-archive-Neutral-Variant70 mb-2.5">
                    Payout address where you wish to receive the fees
                  </div>
                </span>
              }
              placeholder="0x3dE5700..."
              className="font-Chakra"
              error={touched.payoutAddress && Boolean(errors.payoutAddress)}
              helperText={touched.payoutAddress && errors.payoutAddress}
              {...getFieldProps('payoutAddress')}
            />
            <div>
              <div className="mb-2 flex items-center text--label-large">Social link</div>
              <div className="text--body-small text-archive-Neutral-Variant70 mb-2.5">
                Add your existing social links to build a stronger reputation
              </div>
              {(values.social.web === '' || values.social.web) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Website"
                  disableUnderline
                  className="font-Chakra"
                  sx={{
                    '& button': {
                      border: '0 none',
                    }
                  }}
                  error={Boolean(touched?.social?.web && errors?.social?.web)}
                  helperText={touched?.social?.web && errors?.social?.web}
                  endAdornment={
                    <span className="cursor-pointer">
                      <CloseIcon
                        style={icon} className="text-primary-60" onClick={() => handleRemoveSocialField('web')} />
                    </span>
                  }
                  startAdornment={
                    <div className="text-white flex align-center pr-1 leading-5">
                      <span className="mr-4 w-[22px] h-[22px]">
                        <WebSiteIcon />
                      </span>
                    </div>
                  }
                  {...getFieldProps('social.web')}
                />
              )}
              {(values.social.discord === '' || values.social.discord) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Discord"
                  disableUnderline
                  className="font-Chakra"
                  error={Boolean(touched?.social?.discord && errors?.social?.discord)}
                  helperText={touched?.social?.discord && errors?.social?.discord}
                  endAdornment={
                    <span className="cursor-pointer">
                      <ClosingIcon onClick={() => handleRemoveSocialField('discord')} />
                    </span>
                  }
                  startAdornment={
                    <div className="text-white pr-1 flex align-center leading-5">
                      <span className="mr-4 w-[22px] h-[22px]">
                        <DiscordIcon />
                      </span>
                      {URL_SOCIAL.discord}
                    </div>
                  }
                  {...getFieldProps('social.discord')}
                />
              )}
              {(values.social.telegram === '' || values.social.telegram) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Telegram"
                  disableUnderline
                  className="font-Chakra"
                  error={Boolean(touched?.social?.telegram && errors?.social?.telegram)}
                  helperText={touched?.social?.telegram && errors?.social?.telegram}
                  endAdornment={
                    <span className="cursor-pointer">
                      <ClosingIcon onClick={() => handleRemoveSocialField('telegram')} />
                    </span>
                  }
                  startAdornment={
                    <div className="text-white pr-1 flex align-center leading-5">
                      <span className="mr-4 w-[22px] h-[22px]">
                        <TelegramIcon />
                      </span>
                      {URL_SOCIAL.telegram}
                    </div>
                  }
                  {...getFieldProps('social.telegram')}
                />
              )}
              {(values.social.twitter === '' || values.social.twitter) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Twitter"
                  disableUnderline
                  className="font-Chakra"
                  error={Boolean(touched?.social?.twitter && errors?.social?.twitter)}
                  helperText={touched?.social?.twitter && errors?.social?.twitter}
                  endAdornment={
                    <span className="cursor-pointer">
                      <ClosingIcon onClick={() => handleRemoveSocialField('twitter')} />
                    </span>
                  }
                  startAdornment={
                    <div className="text-white pr-1 flex align-center leading-5">
                      <span className="mr-4 w-[22px] h-[22px]">
                        <DiscordIcon />
                      </span>
                      {URL_SOCIAL.twitter}
                    </div>
                  }
                  {...getFieldProps('social.twitter')}
                />
              )}
              <MenuAddSocial
                onItemClick={handleItemSocialClick}
                valueField={formik.values.social}
                socialOptions={SOCIAL_OPTIONS}
                style={{ buttom, icon }}
              />
            </div>
            <div>
              <div className="mb-2 flex items-center text--label-large">Utility</div>
              <div className="text--body-small text-archive-Neutral-Variant70">
                Add Utility links for your collection
              </div>
              {(values.utility.staking === '' || values.utility.staking) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Staking"
                  disableUnderline
                  className="font-Chakra"
                  error={Boolean(touched?.utility?.staking && errors?.utility?.staking)}
                  helperText={touched?.utility?.staking && errors?.utility?.staking}
                  endAdornment={
                    <span className="cursor-pointer">
                      <ClosingIcon onClick={() => handleRemoveUtilityField('staking')} />
                    </span>
                  }
                  startAdornment={
                    <div className="text-white flex align-center pr-1 leading-5">
                      <span className="mr-4 w-[22px] h-[22px]">
                        <img className="w-6" src="/social/Staking.svg" alt="" />
                      </span>
                    </div>
                  }
                  {...getFieldProps('utility.staking')}
                />
              )}
              {(values?.utility?.vr === '' || values?.utility?.vr) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="VR"
                  disableUnderline
                  className="font-Chakra"
                  error={Boolean(touched?.utility?.vr && errors?.utility?.vr)}
                  helperText={touched?.utility?.vr && errors?.utility?.vr}
                  endAdornment={
                    <span className="cursor-pointer">
                      <ClosingIcon onClick={() => handleRemoveUtilityField('vr')} />
                    </span>
                  }
                  startAdornment={
                    <div className="text-white pr-1 flex align-center leading-5">
                      <span className="mr-4 w-[22px] h-[22px]">
                        <img className="w-6" src="/social/VR.svg" alt="" />
                      </span>
                    </div>
                  }
                  {...getFieldProps('utility.vr')}
                />
              )}
              {(values?.utility?.governance === '' || values?.utility?.governance) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Governance"
                  disableUnderline
                  className="font-Chakra"
                  error={Boolean(touched?.utility?.governance && errors?.utility?.governance)}
                  helperText={touched?.utility?.governance && errors?.utility?.governance}
                  endAdornment={
                    <span className="cursor-pointer">
                      <ClosingIcon onClick={() => handleRemoveUtilityField('governance')} />
                    </span>
                  }
                  startAdornment={
                    <div className="text-white pr-1 flex align-center leading-5">
                      <span className="mr-4 w-[22px] h-[22px]">
                        <img className="w-6" src="/social/Governance.svg" alt="" />
                      </span>
                    </div>
                  }
                  {...getFieldProps('utility.governance')}
                />
              )}
              {(values?.utility?.game === '' || values?.utility?.game) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Game"
                  disableUnderline
                  className="font-Chakra"
                  error={Boolean(touched?.utility?.game && errors?.utility?.game)}
                  helperText={touched?.utility?.game && errors?.utility?.game}
                  endAdornment={
                    <span className="cursor-pointer">
                      <ClosingIcon onClick={() => handleRemoveUtilityField('game')} />
                    </span>
                  }
                  startAdornment={
                    <div className="text-white pr-1 flex align-center leading-5">
                      <span className="mr-4 w-[22px] h-[22px]">
                        <img className="w-6" src="/social/Game.svg" alt="" />
                      </span>
                    </div>
                  }
                  {...getFieldProps('utility.game')}
                />
              )}
              <MenuAddSocial
                onItemClick={handleItemUtilityClick}
                valueField={formik.values.utility}
                socialOptions={UTILITY_OPTIONS}
                style={{ buttom, icon }}
              />
            </div>
            <Stack direction={'row'} spacing={3}>
              <OutlinedButton
                text="Cancel"
                onClick={() => handleCloseEdit()}
                customClass="!text--label-large dark xl:w-fit w-[50%]"
                style={buttom.outline}
              />
              <FilledButton
                text="Save changes"
                customClass="!text--label-large xl:w-fit w-[50%]"
                onClick={handleSubmit}
                disabled={!isValid}
                style={buttom.filled}
              />
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => setFieldValue('thumbnailUrl', e.target.files)}
              />
            </Stack>
          </Stack>
        </div>
        <div className="lg:mx-0 lg:mt-[-112px] lg:pt-[9rem] sm:pt-6 pb-6 mx-3 flex flex-col lg:pt-[9rem] lg:w-[693px] sm:w-auto bg-[url('/images/bg-collection.png')]">
          <div className="lg:px-16 sm:px-4">
            <Stack spacing={4}>
              <div>
                <div className="mb-8 text--label-large">
                  Collection Thumbnail <span className="text-red-600">*</span>
                  <div className="lg:hidden block w-[280px] text--body-small text-archive-Neutral-Variant80 mt-1">
                    We recommend an image of at least 300x300. Gifs work too. Max 5mb.
                  </div>
                </div>
                <div className="flex items-center justify-between lg:gap-none sm:gap-4">
                  <div className="relative flex justify-center items-center min-w-[110px] h-[110px] border-2 border-dashed rounded-full bg-black">
                    <FileUploadIcon
                      className="text-red"
                      style={{ color: '#F4B1A3', fontSize: 40 }}
                    />
                    {selectedImageAvatar ? (
                      <div className="absolute overflow-hidden flex justify-center items-center w-full h-full rounded-full">
                        <img
                          className="w-full h-full object-cover"
                          src={URL.createObjectURL(selectedImageAvatar)}
                          alt="Thumbnail"
                        />
                      </div>
                    ) : (
                      <>
                        {dataCollection?.thumbnailUrl && (
                          <div className="absolute overflow-hidden flex justify-center items-center w-full h-full rounded-full">
                            <ImageBase
                              type="HtmlImage"
                              url={dataCollection?.thumbnailUrl}
                              alt="Thumbnail"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex lg:flex-row">
                    <div className="lg:block hidden lg:w-[280px] sm:w-full text-xs text-archive-Neutral-Variant80">
                      We recommend an image of at least 300x300. Gifs work too. Max 5mb.
                      <FormHelperText
                        className="mt-4 !font-Chakra font-Chakra font-normal !text-error-60"
                        error={touched.thumbnailUrl && Boolean(errors.thumbnailUrl)}
                      >
                        {touched.thumbnailUrl && errors.thumbnailUrl}
                      </FormHelperText>
                    </div>
                    <div className="relative ml-2">
                      <input
                        className="absolute p-2.5 w-full opacity-0 z-10 cursor-pointer"
                        accept="image/*"
                        type="file"
                        {...getFieldProps('thumbnail')}
                        onChange={imageChangeAvatar}
                      />
                      <OutlinedButton style={buttom.outline} text="Choose file" customClass="!text--label-large dark" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-8 text--label-large">
                  Collection Banner <span className="text-red-600">*</span>
                  <div className="lg:hidden block text--body-small text-dark-on-surface-variant lg:text-left sm:text-left mb-2">
                    Upload new cover for your collection page. <br />
                    We recommend to upload images in 1440x260 resolution. <br />
                    Max 15mb.
                  </div>
                </div>
                <div
                  className={`relative 
                  } border border-1 border-dashed lg:h-[180px] sm:h-[130px] lg:w-[564px] sm:w-full p-3`}
                >
                  {selectedImageBanner ? (
                    <div className="opacity-75 overflow-hidden flex justify-center items-center w-full h-full">
                      <img
                        className="object-cover w-full h-full"
                        src={URL.createObjectURL(selectedImageBanner)}
                        alt="Banner"
                      />
                    </div>
                  ) : (
                    <>
                      {dataCollection?.bannerUrl && values.bannerUrl && (
                        <div className="image-upload-nft h-full flex flex-col justify-center items-center relative">
                          <ImageBase
                            className="w-full object-cover z-20 overflow-hidden"
                            type="HtmlImage"
                            url={dataCollection?.bannerUrl}
                            alt="Banner"
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="absolute top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]">
                    {!selectedImageBanner && (
                      <div className="text-center">
                        <FileUploadIcon
                          className="text-red"
                          style={{ color: icon ? icon.color : '#F4B1A3', fontSize: 40 }}
                        />
                      </div>
                    )}
                    <div className="relative">
                      <input
                        className="absolute p-2.5 w-full opacity-0 z-10 cursor-pointer"
                        accept="image/*"
                        type="file"
                        {...getFieldProps('banner')}
                        onChange={imageChangeBanner}
                        id="uploadImage"
                      />
                      <OutlinedButton
                        style={buttom.outline}
                        text="Choose file"
                        customClass="!text--label-large dark mt-0"
                      />
                    </div>
                  </div>

                  {(selectedImageBanner || values.bannerUrl) && (
                    <CloseIcon
                      style={icon}
                      className="absolute top-5 right-5 cursor-pointer z-50 text-primary-60" onClick={() => {
                        setSelectedImageBanner(undefined);
                        setFieldTouched('bannerUrl', true);
                        setFieldValue('bannerUrl', null);
                        clearFileInput(document.getElementById('uploadImage'));
                      }} />

                  )}
                </div>
                <FormHelperText
                  className="mt-4 !font-Chakra font-normal !text-error-60"
                  error={touched.bannerUrl && Boolean(errors.bannerUrl)}
                >
                  {Boolean(touched.bannerUrl) && errors.bannerUrl}
                </FormHelperText>
                <div className="lg:block hidden text--body-small text-dark-on-surface-variant lg:text-left sm:text-left mb-2">
                  Upload new cover for your collection page. <br />
                  We recommend to upload images in 1440x260 resolution. <br />
                  Max 15mb.
                </div>
              </div>
            </Stack>
          </div>
        </div>
        <Modal
          open={openUpdateModal}
          onClose={(e: any, reason: string) => {
            if (reason !== 'backdropClick') {
              if (isUpdateSuccess) {
                handleCloseUpdateModal();
              }
            }
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div
            style={style}
            className="lg:px-16 lg:py-8 py-6 px-2 bg-background-dark-600 rounded-[28px] flex flex-col text-center items-center font-Chakra md:w-[479px] w-[95%]"
          >
            <p className="font-bold text-lg mb-6 text-dark-on-surface text-[24px]">
              {isUpdateSuccess ? 'Updated Successfully' : 'Update Collection'}
            </p>
            <div className='w-full'>
              {isUpdateSuccess ? (
                <>
                  <img className="inline-block mb-6" src="/icons/check-circle-outline.svg" alt="" />
                  <p className="text-sm text-archive-Neutral-Variant70 mb-6 text-center">
                    Congratulations! Your collection was successfully updated.
                  </p>
                  <Button
                    style={{
                      display: 'inline-block',
                    }}
                    className={`filled-button mad-button !text-white w-full`}
                    onClick={handleCloseUpdateModal}
                  >
                    Close
                  </Button>
                </>
              ) : (
                <div className="flex flex-col">
                  <div className="flex bg-background-sell-step-popup-selected py-4 px-5 rounded-lg">
                    {isUpdateCollection && !isUpdateRoyalty ? (
                      <CircularProgress className="text-secondary-60" size={20} />
                    ) : !isUpdateCollection && isUpdateRoyalty ? (
                      <CheckIcon style={{ color: '#F4B1A3' }} />
                    ) : (
                      <CheckIcon className="text-archive-Neutral-Variant50" />
                    )}
                    <div className="text-left pl-2">
                      <h4 className="text-dark-on-surface font-bold pt-1 pb-3.5">
                        1. Update collection
                      </h4>
                      <p className="text-sm text-archive-Neutral-Variant70">
                        Please wait to upload processing
                      </p>
                    </div>
                  </div>
                  {(Number(values?.royalty) !== Number(dataCollection?.royalty) ||
                    String(values.payoutAddress) !== String(dataCollection?.payoutAddress)) && (
                      <div className="flex bg-background-sell-step-popup-selected mt-4 py-4 px-5 rounded-lg">
                        {isUpdateCollection === true ? (
                          <div className="w-[24px]" />
                        ) : isUpdateRoyalty ? (
                          <CircularProgress className="text-secondary-60" size={20} />
                        ) : (
                          <CheckIcon style={{ color: '#F4B1A3' }} />
                        )}
                        <div className="text-left pl-2">
                          <h4 className="text-dark-on-surface font-bold pt-1 pb-3.5">
                            2. Update royalty information
                          </h4>
                          <p className="text-sm text-archive-Neutral-Variant70">
                            Send transactions to update royalty
                          </p>
                          {editRoyaltyTx && (
                            <div className="mt-2">
                              <a href={`${LINK_SCAN}tx/${editRoyaltyTx}`} target="_blank">
                                <OutlinedButton
                                  customClass="!text-secondary-60 h-[40px] font-bold"
                                  target="_blank"
                                  fullWidth
                                  text="View on Etherscan"
                                />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EditCollectionForm;
