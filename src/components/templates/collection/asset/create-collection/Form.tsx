import { FC, useCallback, useState } from 'react';
import { FormHelperText, Stack } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import get from 'lodash/get';
import collectionService from 'service/collectionService';
import { toastError } from 'store/actions/toast';
import { IMAGE_TYPE_UPLOAD, SUPPORTED_FORMATS_PREVIEW_IMAGE, URL_SOCIAL } from 'constants/app';
import {
  createCollectionERC721,
  createCollectionERC1155,
  genMetadataContractUri,
} from 'blockchain/utils-created';
import { updateRoyaltyInfoForCollectionIfSetter, checkForCollectionSetter } from 'blockchain/utils';
import { convertPriceToBigDecimals } from 'blockchain/ether';

import { ClosingIcon } from 'components/common/iconography/IconBundle';
import UploadFiles from 'components/modules/upload/UploadFiles';
import { TextareaCustom, TextFieldFilledCustom } from 'components/modules/textField';
import { FilledButton, OutlinedButton } from 'components/common/buttons';
import {
  WebSiteIcon,
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
} from 'components/common/iconography/SocialMediaIcon';

import MenuAddSocial, { ISocialOptionsItem } from './MenuAddSocial';
import ModalFollowStep, { StepType } from './ModalFollowStep';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { validateFile } from 'utils/file';

type SocialType = 'web' | 'discord' | 'telegram' | 'twitter';
type UtilityType = 'staking' | 'vr' | 'governance' | 'game';

interface IInitialValues {
  name: string;
  symbol: string;
  description: string;
  shortUrl: string;
  royalty?: string;
  payoutAddress?: string;
  bannerUrl?: File | Blob;
  thumbnailUrl?: File | Blob;
  social: Record<SocialType, string | null>;
  utility: Record<UtilityType, string | null>;
}

interface INewCollectionFormProps {
  onClose: () => void;
  nftType?: 'ERC721' | 'ERC1155';
}

const SOCIAL_OPTIONS: ISocialOptionsItem<Record<SocialType, string | null>>[] = [
  {
    icon: <WebSiteIcon />,
    label: 'Website',
    field: 'web',
  },
  {
    icon: <DiscordIcon />,
    label: 'Discord',
    field: 'discord',
  },
  {
    icon: <TelegramIcon />,
    label: 'Telegram',
    field: 'telegram',
  },
  {
    icon: <TwitterIcon />,
    label: 'Twitter',
    field: 'twitter',
  },
];

const UTILITY_OPTIONS: ISocialOptionsItem<Record<UtilityType, string | null>>[] = [
  {
    icon: <img className="w-6" src="/social/Staking.svg" alt="" />,
    label: 'Staking',
    field: 'staking',
  },
  {
    icon: <img className="w-6" src="/social/VR.svg" alt="" />,
    label: 'VR',
    field: 'vr',
  },
  {
    icon: <img className="w-6" src="/social/Governance.svg" alt="" />,
    label: 'Governance',
    field: 'governance',
  },
  {
    icon: <img className="w-6" src="/social/Game.svg" alt="" />,
    label: 'Game',
    field: 'game',
  },
];

const CreateCollectionForm: FC<INewCollectionFormProps> = (props) => {
  const { onClose, nftType = 'ERC1155' } = props;
  const dispatch = useDispatch();

  const [toggleFollowStep, setToggleFollowStep] = useState(false);
  const [royaltySuggestion, setRoyaltySuggestion] = useState(false);
  const [shortUrlError, setShortUrlError] = useState<string | undefined>('');
  const [currentStep, setCurrentStep] = useState<StepType | undefined>();
  const [hashCreateCollection, setHashCreateColllection] = useState<string>('');
  const [hashUpdateRoyaltyFee, setHashUpdateRoyaltyFee] = useState<string>('');
  const [openTooltip, setOpenTooltip] = useState(false);

  const { walletAddress } = useSelector((state: any) => ({
    walletAddress: state?.user?.data?.walletAddress,
  }));

  const validationSchema = Yup.object({
    name: Yup.string().required('Display name is not allowed to be empty'),
    symbol: Yup.string().required('Symbol is not allowed to be empty'),
    bannerUrl: Yup.mixed()
      .test('fileSize', 'The uploaded file is too large. The  max file is 15mb', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 15000000;
      })
      .required('Collection Banner was not chosen'),
    thumbnailUrl: Yup.mixed()
      .test('fileSize', 'The uploaded file is too large. The  max file is 5mb', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 5000000;
      })
      .required('Collection Thumbnail was not chosen'),
    shortUrl: Yup.string().matches(
      /^[a-zA-Z0-9]+$/,
      'URL cannot contain special characters except "-","_",".","~"',
    ),
    royalty: Yup.number()
      .required('Royalty percentage is not allowed to be empty')
      .typeError('Royalty percentage must be a number')
      .nullable()
      .max(50, 'Royalty percentage cannot be greater than 50%'),
    payoutAddress: Yup.string()
      .required('Payout wallet address is not allowed to be empty')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid address'),
    social: Yup.object({
      web: Yup.string()
        .transform((v) => (v === null || v === undefined ? 'err.com' : v))
        .matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          'Website url must be a valid url',
        ),
    }),
  });

  const initialValues: IInitialValues = {
    name: '',
    payoutAddress: '',
    description: '',
    symbol: '',
    shortUrl: '',
    royalty: '',
    bannerUrl: undefined,
    thumbnailUrl: undefined,
    social: {
      web: null,
      discord: null,
      telegram: null,
      twitter: null,
    },
    utility: {
      staking: null,
      vr: null,
      governance: null,
      game: null,
    },
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleCreateCollection(values);
    },
  });

  const {
    values,
    errors,
    touched,
    getFieldProps,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    isValid,
  } = formik;

  const errorHandler = (error: any) => {
    if (
      error?.code === 4001 ||
      String(error)?.includes('User rejected') ||
      String(error)?.includes('User denied')
    ) {
      dispatch(toastError('You declined the action in your wallet.'));
    } else {
      dispatch(toastError('Something went wrong.'));
    }
    setToggleFollowStep(false);
  };

  const handleClose = () => {
    onClose();
  };

  const handleCallSCByNftType = async (
    name: string,
    symbol: string,
    metadataContractUri: string,
  ) => {
    if (nftType === 'ERC1155') {
      return await createCollectionERC1155(name, symbol, metadataContractUri);
    }
    return await createCollectionERC721(name, symbol, metadataContractUri);
  };

  const handleDeployCollection = async (
    name: string,
    symbol: string,
    metadataContractUri: string,
  ) => {
    try {
      const [contract, error] = await handleCallSCByNftType(name, symbol, metadataContractUri);
      if (error) {
        throw error;
      } else if(contract) {
        setHashCreateColllection((contract as any)?.hash);
        const result = await (contract as any).wait(1);
        const data = {
          collectionAddress: result?.events[0]?.address,
          transactionHash: result?.transactionHash,
        };
        return data as {
          collectionAddress: string;
          transactionHash: string;
        };
      }
    } catch (error) {
      return errorHandler(error);
    }
  };

  const handleUpdateRoyalty = async (collection: {
    royalty: number;
    address: string;
    creator: { walletAddress: string };
  }) => {
    try {
      if (collection) {
        const [collectionAddressSetter, _] = await checkForCollectionSetter(collection?.address);
        const [proxy, error] = await updateRoyaltyInfoForCollectionIfSetter(
          collection?.address,
          get(collectionAddressSetter as string[], '0'),
          collection?.creator?.walletAddress,
          convertPriceToBigDecimals(values?.royalty || 0, 2),
        );
        if (error) {
          throw error;
        }
        setHashUpdateRoyaltyFee(proxy?.hash);

        const response = await proxy.wait(1);

        if (response) {
          setCurrentStep('finished');
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleCreateCollection = async (values: IInitialValues) => {
    try {
      setToggleFollowStep(true);
      setCurrentStep('uploadDeploySC');
      const metadataContractUri = genMetadataContractUri(values.shortUrl, walletAddress);
      const deploySCResponse = await handleDeployCollection(
        values.name,
        values.symbol,
        metadataContractUri,
      );
      if (deploySCResponse) {
        setCurrentStep('createCollection');
        const [response, error] = await collectionService.postCollection({
          payoutAddress: values.payoutAddress,
          title: values.name,
          name: values.name,
          symbol: values.symbol,
          description: values.description,
          shortUrl: values.shortUrl || '',
          address: deploySCResponse.collectionAddress,
          transactionHash: deploySCResponse.transactionHash,
          royalty: parseFloat(values.royalty as string),
          type: nftType,
          website: values.social.web,
          discordLink: values.social.discord,
          telegramLink: values.social.telegram,
          twitterLink: values.social.twitter,
          externalLink: values.social.web,
          stakingUrl: values.utility.staking,
          vrUrl: values.utility.vr,
          governanceUrl: values.utility.governance,
          gameUrl: values.utility.game,
          contractUriId: metadataContractUri,
        });

        if (error) {
          throw new Error(error as any);
        }
        if (response) {
          const collectionId = get(response, 'collection.id');
          const dataBannerImg = {
            imgFile: values.bannerUrl,
            nftId: '',
            collectionId,
            previewImgId: '',
            type: IMAGE_TYPE_UPLOAD.COLLECTION_COVER,
          };
          const dataThumbnailImg = {
            imgFile: values.thumbnailUrl,
            nftId: '',
            collectionId,
            previewImgId: '',
            type: IMAGE_TYPE_UPLOAD.COLLECTION,
          };

          /**
           * * Waiting socket fire to update step
           */
          const responseUploadBanner = await collectionService.uploadCollectionCover(dataBannerImg);
          const responseUploadThumb = await collectionService.uploadCollection(dataThumbnailImg);
          const params = {
            bannerUrl: responseUploadBanner,
            thumbnailUrl: responseUploadThumb,
          };
          await collectionService.uploadCollectionImage(collectionId, params);
          if (responseUploadThumb && responseUploadBanner) {
            setCurrentStep('finished');
          }
        }
      }
    } catch (error: any) {
      setToggleFollowStep(false);
      dispatch(toastError(error.toString()));
    }
  };

  const handleItemSocialClick = (field: SocialType) => {
    setFieldValue(`social.${field}`, '');
  };

  const handleItemUtilityClick = (field: UtilityType) => {
    setFieldValue(`utility.${field}`, '');
  };

  const handleRemoveSocialField = (field: keyof Record<SocialType, string | null>) => {
    setFieldValue(`social.${field}`, null);
  };

  const handleRemoveUtilityField = (field: keyof Record<UtilityType, string | null>) => {
    setFieldValue(`utility.${field}`, null);
  };

  const handleChangeThumbnailImage = (name: string, e: any) => {
    const files = e.target.files;
    const hasFiles = files && files.length > 0;

    const file = files[0];
    if (file && !validateFile(file.type.split('/')[1])) {
      return dispatch(toastError('Invalid format'));
    }

    if (hasFiles) {
      setFieldTouched(`${name}`, true);
      setFieldValue(`${name}`, files[0]);
    }
  };

  const handleChangeBannerImage = async (file: File | null) => {
    if (file && SUPPORTED_FORMATS_PREVIEW_IMAGE.includes(file.type)) {
      setFieldTouched('bannerUrl', true);
      setFieldValue('bannerUrl', file);
    }
  };

  const handleChangeRoyalty = useCallback((e: any) => {
    let value = e.target?.value;
    value = value.replace(/[^0-9\.]/g, '');

    let splitValue = value.split('.');
    if (splitValue.length === 2 && splitValue[1].length > 2) {
      value = parseFloat(value).toFixed(2);
    }
    if (splitValue.length > 2) {
      value = value.replace(/\.+$/, '');
    }
    setFieldValue('royalty', value);
  }, []);

  const onValidateDuplicateShortUrl = async () => {
    if (values.shortUrl) {
      if (/^0x[a-fA-F0-9]{40}$/.test(values.shortUrl)) {
        setShortUrlError('URL invalid.');
        return;
      }

      const checkUrl = await collectionService.checkUrlAlreadyTaken(values.shortUrl);
      if (checkUrl) {
        setShortUrlError('The URL name is already taken.');
      } else {
        setShortUrlError(undefined);
      }
    } else {
      setShortUrlError(undefined);
    }
  };

  const handleCheckFiledCreateCollection = () => {
    const { bannerUrl, thumbnailUrl, name, symbol, royalty, payoutAddress } = values;
    if (!bannerUrl || !thumbnailUrl || !name || !symbol || !royalty || !payoutAddress) {
      if (!bannerUrl) {
        setFieldTouched('bannerUrl', true);
      }

      if (!thumbnailUrl) {
        setFieldTouched('thumbnailUrl', true);
      }

      if (!name) {
        setFieldTouched('name', true);
      }

      if (!symbol) {
        setFieldTouched('symbol', true);
      }

      if (!royalty) {
        setFieldTouched('royalty', true);
      }

      if (!payoutAddress) {
        setFieldTouched('payoutAddress', true);
      }
      return;
    }

    handleSubmit();
  };

  return (
    <div>
      <div className="lg:block lg:mb-6 mb-4 flex justify-center text--headline-small lg:pt-14 pt-[72px] mx-auto">
        Create New Collection
      </div>
      <div className="lg:px-0 md:px-6 px-2 flex h-full mx-auto lg:gap-11 justify-center lg:flex-row sm:flex-col-reverse">
        <div className="pb-16">
          <Stack spacing={3}>
            <div className="lg:mt-0 mt-6">
              <TextFieldFilledCustom
                scheme="dark"
                required
                label="Display Name"
                placeholder="Enter Collection Name"
                {...getFieldProps('name')}
                className="font-Chakra"
                error={Boolean(touched.name && errors.name)}
                classCustomError="text-yellow"
                helperText={touched.name && errors.name ? errors.name : ''}
              />

              <div className="pl-4 text--body-small text-archive-Neutral-Variant70 mb-2.5">
                Collection name cannot be changed in future on smart contract
              </div>
            </div>
            <TextFieldFilledCustom
              scheme="dark"
              required
              label="Symbol"
              placeholder="Enter Token Symbol"
              {...getFieldProps('symbol')}
              onChange={(e) => setFieldValue('symbol', String(e.target.value).toUpperCase())}
              className="font-Chakra"
              error={Boolean(touched.symbol && errors.symbol)}
              helperText={touched.symbol && errors.symbol}
            />
            <TextareaCustom
              customClassName="custom-field"
              classNameTextarea="custom-field"
              scheme="dark"
              label="Description"
              placeholder="Write some words about your token collection"
              {...getFieldProps('description')}
            />
            <div>  {/* <TextareaCustom
              customClassName="custom-field"
              classNameTextarea="custom-field"
              scheme="dark"
              label={
                <>
                  <p className="text-sm flex gap-x-[6px] font-bold">Description</p>
                  <p className="text-archive-Neutral-Variant70 text-xs mb-[8px] mt-[6px] font-normal">
                    Provide a detailed description of your item. The description will be included on the
                    item's detail page underneath its image.
                  </p>
                </>
              }
              placeholder="Description"
              error={Boolean(errors?.description)}
              helperText={errors?.description}
              {...getFieldProps('description')}
              value={values.description}
            /> */}
              <TextFieldFilledCustom
                scheme="dark"
                label="Short url"
                disableUnderline
                startAdornment={
                  <span className="text-white pr-1 leading-5">
                    {window?.location?.hostname}/collections/
                  </span>
                }
                placeholder="Enter short url"
                className="font-Chakra"
                name="shortUrl"
                value={values.shortUrl}
                onChange={(e) => {
                  setFieldValue('shortUrl', e.target.value);
                  setShortUrlError(undefined);
                }}
                onBlur={onValidateDuplicateShortUrl}
                error={Boolean(errors.shortUrl) || Boolean(shortUrlError)}
                helperText={(errors.shortUrl && errors.shortUrl) || shortUrlError}
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
                        open={openTooltip}
                        onClose={() => setOpenTooltip(false)}
                        title={
                          <div className="text--body-small">
                            Royalties are payments that compensate original NFT creators for the use
                            of their NFTs
                          </div>
                        }
                      >
                        <InfoOutlinedIcon onClick={() => setOpenTooltip(true)} className="text-primary-60" style={{ fontSize: 16 }} />
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
                onChange={handleChangeRoyalty}
                onBlur={() => {
                  setRoyaltySuggestion(false);
                  setFieldTouched('royalty', true);
                }}
                name="royalty"
                value={values.royalty}
                helperText={touched.royalty && errors.royalty}
                error={Boolean(touched.royalty && errors.royalty)}
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
                  endAdornment={
                    <span className="cursor-pointer">
                      <ClosingIcon onClick={() => handleRemoveSocialField('web')} />
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
                  error={Boolean(errors?.social?.web)}
                  helperText={errors?.social && errors?.social?.web}
                />
              )}
              {(values.social.discord === '' || values.social.discord) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Discord"
                  disableUnderline
                  className="font-Chakra"
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
                  error={Boolean(errors?.social?.discord)}
                  helperText={errors?.social && errors?.social?.discord}
                />
              )}
              {(values.social.telegram === '' || values.social.telegram) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Telegram"
                  disableUnderline
                  className="font-Chakra"
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
                  error={Boolean(errors?.social?.telegram)}
                  helperText={errors?.social && errors?.social?.telegram}
                />
              )}
              {(values.social.twitter === '' || values.social.twitter) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Twitter"
                  disableUnderline
                  className="font-Chakra"
                  endAdornment={
                    <span className="cursor-pointer">
                      <ClosingIcon onClick={() => handleRemoveSocialField('twitter')} />
                    </span>
                  }
                  startAdornment={
                    <div className="text-white pr-1 flex align-center leading-5">
                      <span className="mr-4 w-[22px] h-[22px]">
                        <TwitterIcon />
                      </span>
                      {URL_SOCIAL.twitter}
                    </div>
                  }
                  {...getFieldProps('social.twitter')}
                  error={Boolean(errors?.social?.twitter)}
                  helperText={errors?.social && errors?.social?.twitter}
                />
              )}
              <MenuAddSocial
                onItemClick={handleItemSocialClick}
                valueField={formik.values.social}
                socialOptions={SOCIAL_OPTIONS}
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
                  error={Boolean(errors?.utility?.staking)}
                  helperText={errors?.utility && errors?.utility?.staking}
                />
              )}
              {(values?.utility?.vr === '' || values?.utility?.vr) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="VR"
                  disableUnderline
                  className="font-Chakra"
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
                  error={Boolean(errors?.utility?.vr)}
                  helperText={errors?.utility && errors?.utility?.vr}
                />
              )}
              {(values?.utility?.governance === '' || values?.utility?.governance) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Governance"
                  disableUnderline
                  className="font-Chakra"
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
                  error={Boolean(errors?.utility?.governance)}
                  helperText={errors?.utility && errors?.utility?.governance}
                />
              )}
              {(values?.utility?.game === '' || values?.utility?.game) && (
                <TextFieldFilledCustom
                  scheme="dark mb-2.5"
                  label="Game"
                  disableUnderline
                  className="font-Chakra"
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
                  error={Boolean(errors?.utility?.game)}
                  helperText={errors?.utility && errors?.utility?.game}
                />
              )}
              <MenuAddSocial
                onItemClick={handleItemUtilityClick}
                valueField={formik.values.utility}
                socialOptions={UTILITY_OPTIONS}
              />
            </div>
            <div className="hidden lg:flex">
              <Stack direction={'row'} spacing={3}>
                <OutlinedButton
                  text="Cancel"
                  onClick={handleClose}
                  customClass="!text--label-large dark"
                />
                <FilledButton
                  text="Create New Collection"
                  customClass="!text--label-large"
                  onClick={handleCheckFiledCreateCollection}
                  disabled={!isValid || Boolean(shortUrlError)}
                />
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => setFieldValue('thumbnailUrl', e.target.files)}
                />
              </Stack>
            </div>
            <div className="lg:hidden">
              <FilledButton
                text="Create New Collection"
                customClass="!text--label-large w-[100%]"
                onClick={handleCheckFiledCreateCollection}
                disabled={!isValid || Boolean(shortUrlError)}
              />
              <OutlinedButton
                text="Cancel"
                onClick={handleClose}
                customClass="!text--label-large dark w-[100%] mt-[20px]"
              />
            </div>
          </Stack>
        </div>
        <div className="lg:mt-[-112px] lg:pt-[9rem] lg:w-[693px] flex flex-col py-6 sm:w-auto bg-[url('/images/bg-collection.png')]">
          <div className="lg:px-16 sm:px-4">
            <Stack spacing={4} className="lg:w-[562px] sm:w-full">
              <div>
                <div className="lg:mb-7 mb-12 text--label-large">
                  Collection Thumbnail <span className="text-red-600">*</span>
                  <div className="lg:hidden block w-[280px] text--body-small text-archive-Neutral-Variant80 mt-1">
                    We recommend an image of at least 300x300. Gifs work too. Max 5mb.
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4 lg:mx-0 mx-4">
                  <div className="relative flex justify-center items-center w-[110px] h-[110px] border-2 border-dashed rounded-full bg-black">
                    <FileUploadOutlinedIcon className="text-primary-60" style={{ fontSize: 40 }} />
                    {values.thumbnailUrl && (
                      <div className="absolute overflow-hidden flex justify-center items-center w-full h-full rounded-full z-100">
                        <img
                          className="w-full h-full object-cover"
                          src={URL.createObjectURL(values.thumbnailUrl as Blob)}
                          alt="Thumbnail"
                        />
                      </div>
                    )}
                  </div>
                  <div className="lg:block hidden w-[280px] text--body-small text-archive-Neutral-Variant80">
                    We recommend an image of at least 300x300. Gifs work too. Max 5mb.
                  </div>
                  <div className="relative">
                    <input
                      className="absolute p-2.5 w-full opacity-0 z-10 cursor-pointer"
                      accept="image/*"
                      type="file"
                      name="thumbnailUrl"
                      onClickCapture={(e) => {
                        if (!values.thumbnailUrl) {
                          setFieldValue('thumbnailUrl', '');
                        }
                      }}
                      onChange={(e) => handleChangeThumbnailImage('thumbnailUrl', e)}
                    />
                    <OutlinedButton text="Choose file" customClass="!text--label-large dark" />
                  </div>
                </div>
                {touched.thumbnailUrl && errors.thumbnailUrl && (
                  <FormHelperText
                    className={`text--body-small font-medium !text-error-60 pl-4`}
                    error={touched.thumbnailUrl && Boolean(errors.thumbnailUrl)}
                  >
                    {errors.thumbnailUrl}
                  </FormHelperText>
                )}
              </div>
              <UploadFiles
                required
                onRemove={() => {
                  setFieldValue('bannerUrl', undefined);
                  setFieldTouched('bannerUrl', false);
                }}
                inputProps={{
                  onClickCapture: (e) => {
                    if (!values.bannerUrl) {
                      setFieldValue('bannerUrl', '');
                    }
                  },
                }}
                onChange={handleChangeBannerImage}
                value={values.bannerUrl}
                title="Collection Banner"
                error={touched.bannerUrl && Boolean(errors.bannerUrl)}
                helperText={errors.bannerUrl && errors.bannerUrl}
                description={
                  <div className="text--body-small text-archive-Neutral-Variant80">
                    Upload new cover for your collection page. <br />
                    We recommend to upload images in 1440x260 resolution. <br />
                    Max 15mb.
                  </div>
                }
              />
            </Stack>
          </div>
        </div>
        <ModalFollowStep
          open={toggleFollowStep}
          onClose={() => {
            setToggleFollowStep(false);
            setTimeout(() => {
              handleClose();
            }, 100);
          }}
          values={values}
          currentStep={currentStep}
          processedSteps={[]}
          hashCreateCollection={hashCreateCollection}
          hashUpdateRoyaltyFee={hashUpdateRoyaltyFee}
        />
      </div>
    </div>
  );
};

export default CreateCollectionForm;
