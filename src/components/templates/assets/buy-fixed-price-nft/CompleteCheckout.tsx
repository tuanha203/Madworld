import { useState, memo, FC, useCallback, useEffect, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import FormHelperText from '@mui/material/FormHelperText';
import { FilledButton, OutlinedButton } from 'components/common/buttons';
import { NFTPrice } from 'components/common/price';
import Divider from 'components/common/divider';
import TermsAcknowledge from 'components/common/terms-acknowledge';
import { MARKET_RAW_FEE_BUY_TOKEN, NFT_SALE_TYPES, REGEX_QUANTITY } from 'constants/index';
import BigNumber from 'bignumber.js';
import { SWAP_UMAD_UNISWAP } from 'constants/text';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import {
  abbreviateNumberFromMillion,
  checkTypeMedia,
  roundNumber,
  shortenNameNoti,
} from 'utils/func';
import { TextFieldFilledCustom } from 'components/modules/textField';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import ImageBase from 'components/common/ImageBase';
import Link from 'next/link';
import coingeckoService from 'service/coingeckoService';
import { TYPE_IMAGE, WINDOW_MODE } from 'constants/app';
import { calculateDecliningPrice, delay } from 'utils/utils';
import { CircularProgress } from '@mui/material';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';

interface ICompleteCheckout {
  itemName: string;
  onConfirmCheckout: (quantity?: number) => void;
  assetDataDetail?: any;
  nftSale?: any;
  isApproveUMAD?: boolean | undefined;
  onApproveUMAD?: () => void;
  loadingApproveUMAD?: boolean;
  isERC721?: boolean;
  loadingCheckout?: boolean;
  bestNftSale: any;
  totalAllowanceUMAD?: string;
}

const CompleteCheckout: FC<ICompleteCheckout> = (props) => {
  const {
    onConfirmCheckout,
    assetDataDetail,
    nftSale,
    isApproveUMAD,
    onApproveUMAD,
    loadingApproveUMAD,
    isERC721,
    loadingCheckout,
    bestNftSale,
    totalAllowanceUMAD = '0',
  } = props;
  const { collection } = assetDataDetail as any;
  const [checked, setChecked] = useState(false);
  const typeImage = checkTypeMedia(assetDataDetail?.nftUrl);
  const [loadingCheckBalance, setLoadingCheckBalance] = useState<boolean>(true);
  const { walletAddress: userLogin } = useSelector((state) => (state as any)?.user?.data || '');
  const { text, button } = useSelector((state:any) => state.theme);
  const { umadBalance, ethBalance } = useSelector((state: any) => ({
    umadBalance: get(state, 'user.data.umadBalance', 0),
    ethBalance: get(state, 'user.data.ethBalance', 0),
  }));

  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const [insufficient, setInsufficient] = useState<boolean>(false);

  const renderCurrency = useCallback(() => {
    const currency = nftSale?.currencyToken === 'umad' ? 'UMAD' : 'ETH';
    return currency;
  }, [nftSale]);

  const windowMode = useDetectWindowMode();
  const isMobile = [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode);

  const renderAmountServiceFee = useCallback(() => {
    const serviceFee =
      nftSale?.currencyToken === 'umad'
        ? MARKET_RAW_FEE_BUY_TOKEN.umad
        : MARKET_RAW_FEE_BUY_TOKEN.eth;
    return new BigNumber(nftSale?.price)
      .multipliedBy(serviceFee / 100)
      .toFixed()
      .toString();
  }, [nftSale]);

  const totalAmount = useMemo(() => {
    const serviceFee =
      nftSale?.currencyToken === 'umad'
        ? MARKET_RAW_FEE_BUY_TOKEN.umad
        : MARKET_RAW_FEE_BUY_TOKEN.eth;
    return new BigNumber(nftSale?.price)
      .multipliedBy(1 - serviceFee / 100)
      .toFixed()
      .toString();
  }, [nftSale]);

  useEffect(() => {
    if (typeof isApproveUMAD === 'boolean') {
      setTimeout(() => {
        setLoadingCheckBalance(false);
      }, 1200);
    }
  }, [isApproveUMAD]);

  const validationSchema = Yup.object({
    quantity: Yup.number()
      .integer('Quantity must be an integer')
      .positive(`Quantity must be greater than 0`)
      .required('Quantity is not allowed to be empty')
      .max(bestNftSale?.quantity || 1, `The quantity cannot exceed ${bestNftSale?.quantity || 1}`),
  });

  const formik = useFormik({
    initialValues: {
      quantity: 1,
    },
    validationSchema,
    onSubmit: (values) => {
    },
  });

  const { errors, setFieldValue, values, isValid } = formik;

  const { quantity } = values;

  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (REGEX_QUANTITY.test(value) || !value) {
      setFieldValue('quantity', value);
    }
  };

  const nftSalePrice = useMemo(() => {
    return nftSale?.type !== NFT_SALE_TYPES?.DUTCH_AUCTION
      ? nftSale?.price
      : calculateDecliningPrice({
          startPrice: nftSale?.startPrice,
          endPrice: nftSale?.endPrice,
          expireDate: nftSale?.expireDate,
          startDate: nftSale?.startDate,
        });
  }, [nftSale?.id, userLogin, nftSale?.user?.id]);

  useEffect(() => {
    const getPriceCurrencyToken = async () => {
      const symbol = nftSale?.currencyToken === 'umad' ? 'madworld' : 'ethereum';
      const data = await coingeckoService.getPriceCoingecko(symbol, 'usd');
      const price = get(data[symbol], 'usd');
      setTokenPrice(price);
      if (nftSale?.currencyToken === 'umad') {
        setInsufficient(+nftSalePrice * quantity > +umadBalance);
      } else {
        setInsufficient(+nftSalePrice * quantity > +ethBalance);
      }
    };
    getPriceCurrencyToken();
  }, [nftSale?.currencyToken, umadBalance, ethBalance, quantity]);

  return (
    <div className="w-full">
      <div className="w-full flex-col py-6">
        <div className="flex justify-between items-center">
          <h3 className="text--headline-xsmall justify-self-start">Item</h3>
          <Tooltip
            title={nftSale?.currencyToken === 'umad' ? String(umadBalance) : String(ethBalance)}
            disableHoverListener={
              nftSale?.currencyToken === 'umad'
                ? String(roundNumber(umadBalance, 8)).length < 20
                : String(roundNumber(ethBalance, 8)).length < 20
            }
            arrow
          >
            <div className="lg:text--body-medium sm:text--label-medium text-right text-medium-emphasis">
              Wallet balance:{' '}
              {nftSale?.currencyToken === 'umad'
                ? shortenNameNoti(String(roundNumber(umadBalance, 8)), 15)
                : shortenNameNoti(String(roundNumber(ethBalance, 8)), 15)}{' '}
              {renderCurrency()}
            </div>
          </Tooltip>
        </div>
        <div className="modal-information w-full flex items-center justify-between">
          <div className="w-1/2 flex items-center gap-3">
            <div className="h-[72px] w-[72px] flex rounded-lg items-center justify-center">
              <div className="relative">
                <ImageBase
                  url={assetDataDetail?.nftImagePreview || assetDataDetail?.nftUrl}
                  type="HtmlImage"
                  style={{
                    minWidth: '10px',
                    maxWidth: '72px',
                    height: '72px',
                    objectFit: 'contain',
                  }}
                />
                <div className={`flex absolute top-[4px] justify-between right-[3px]`}>
                  {typeImage === TYPE_IMAGE.MP3 && (
                    <img className="w-[13px] h-[13px] ml-auto" src="/icons/mp3_icons_card.svg" />
                  )}
                  {typeImage === TYPE_IMAGE.MP4 && (
                    <img className="w-[13px] h-[13px] ml-auto" src="/icons/mp4_icons_card.svg" />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="mb-2 lg:text-inherit sm:text--title-medium flex">
                <span className="font-normal">Collection&nbsp;</span>
                <div className="max-w-[100px] flex">
                  <OverflowTooltip
                    style={{ ...text, cursor: 'pointer' }}
                    title={`${collection?.title || collection?.name}`}
                    arrow
                    className="lg:text-primary-90 sm:text-primary-60 "
                  >
                    <span>
                      <Link href={`/collection/${collection?.address}`}>
                        <a target="_blank" className="cursor-pointer">
                          {collection?.title || collection?.name || 'Unknown'}
                        </a>
                      </Link>
                    </span>
                  </OverflowTooltip>
                </div>
              </div>
              <span>
                <Link href={`/asset/${collection?.address}/${assetDataDetail?.tokenId}`}>
                  <a target="_blank">
                    <OverflowTooltip
                      style={{ cursor: 'pointer' }}
                      title={`${assetDataDetail?.title}`}
                      arrow
                      className="max-w-[100px] lg:max-w-[185px] text-primary-90"
                    >
                      <h3 className="text--headline-xsmall inline" style={text}>
                        {isMobile
                          ? shortenNameNoti(assetDataDetail?.title || 'Unknown', 13)
                          : assetDataDetail?.title ?? 'Unknown'}
                      </h3>
                    </OverflowTooltip>
                  </a>
                </Link>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end lg:min-w-fit sm:min-w-fit">
            <NFTPrice
              className="text--title-medium"
              amountFull={isERC721 ? String(nftSalePrice) : String(nftSalePrice * quantity)}
              // amount={nftSalePrice}
              amount={
                isERC721
                  ? String(roundNumber(nftSalePrice, 8))
                  : String(roundNumber(nftSalePrice, 8))
              }
              dollarfull={String(nftSalePrice * tokenPrice)}
              dollar={String(roundNumber(nftSalePrice * tokenPrice, 8))}
              icon={false}
              currency={renderCurrency()}
              classToolTip={'w-[125px] text-ellipsis'}
            />
          </div>
        </div>
      </div>
      <Stack spacing={3}>
        {!isERC721 && (
          <TextFieldFilledCustom
            scheme="dark"
            label={
              <>
                Quantity
                <div className="text-archive-Neutral-Variant70 font-normal text-xs mb-2">
                  {bestNftSale?.quantity || 1} available
                </div>
              </>
            }
            name="quantity"
            value={values.quantity}
            onChange={handleChangeQuantity}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            placeholder="1"
          />
        )}

        <Divider />
        <div className="flex w-full justify-between">
          <h3 className="text--headline-xsmall">Total</h3>
          <div className="flex flex-col items-end">
            <NFTPrice
              amountFull={isERC721 ? String(nftSalePrice) : String(nftSalePrice * quantity)}
              amount={
                isERC721
                  ? String(roundNumber(nftSalePrice, 8))
                  : String(roundNumber(nftSalePrice * quantity, 8))
              }
              dollar={
                isERC721
                  ? String(roundNumber(nftSalePrice * tokenPrice, 8))
                  : String(roundNumber(nftSalePrice * tokenPrice * quantity, 8))
              }
              currency={renderCurrency()}
              dollarfull={
                isERC721
                  ? String(nftSalePrice * tokenPrice)
                  : String(nftSalePrice * tokenPrice * quantity)
              }
            />
          </div>
        </div>
        <Divider />
      </Stack>

      <TermsAcknowledge onChange={(_, value) => setChecked(value)} checked={checked} />

      <FormHelperText
        error={true}
        className="lg:text--body-medium sm:text--title-medium mb-6 !text-[#FF5449] !text-xs !font-normal"
      >
        {insufficient && !loadingCheckBalance
          ? `Insufficient ${nftSale?.currencyToken?.toUpperCase()} in wallet!`
          : null}
      </FormHelperText>

      <div className="flex gap-4 lg:justify-end sm:justify-center w-full pb-5">
        {insufficient && nftSale?.currencyToken === 'umad' && (
          <OutlinedButton
            text="BUY UMAD"
            customClass={`!text--label-large ml-3 ${button?.outline ? '' : '!text-secondary-60'} `}
            onClick={() => window.open(SWAP_UMAD_UNISWAP, '_blank')}
            style={button?.outline}
          />
        )}

        {nftSale?.currencyToken === 'umad' &&
        !loadingCheckBalance &&
        new BigNumber(totalAllowanceUMAD).lt(nftSalePrice * quantity * 1e8) ? (
          <FilledButton
            text="Approve UMAD"
            disabled={!checked}
            customClass="font-bold"
            onClick={onApproveUMAD}
            loading={loadingApproveUMAD}
            style={!loadingApproveUMAD && checked ? button?.default : {}}
          />
        ) : loadingCheckBalance ? (
          <CircularProgress color="inherit" />
        ) : (
          <FilledButton
            text="Confirm Checkout"
            disabled={!isValid || !checked || insufficient || (!isERC721 && quantity < 1)}
            customClass="font-bold"
            onClick={() => onConfirmCheckout(quantity)}
            loading={loadingCheckout}
            style={!loadingApproveUMAD && checked ? button?.default : {}}
          />
        )}
      </div>
    </div>
  );
};

CompleteCheckout.defaultProps = {
  itemName: 'default item',
};

export default CompleteCheckout;
