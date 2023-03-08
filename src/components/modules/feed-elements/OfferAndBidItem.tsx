import { FC, useCallback, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import get from 'lodash/get';
import Stack from '@mui/material/Stack';

import CircularProgressIndicator from 'components/common/progress-indicator';
import { MadPriceMedium } from 'components/common/price';
import { abbreviateNumber, shortenNameNoti } from 'utils/func';
import { PAYMENT_TOKEN } from 'constants/app';
import { WethPriceMedium } from '../../common/price/index';
import { AvatarOwned } from '../thumbnail/index';
import { useSelector } from 'react-redux';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { addCommaToNumberHasApproximately } from 'utils/currencyFormat';
import BigNumber from 'bignumber.js';
import { formatNumber } from 'utils/formatNumber';

interface IOfferAndBidItemProps {
  accept: () => void;
  cancel: () => void;
  offer: any;
  cancelOfferLoadingId: number;
  assetDataDetail: any;
  isERC1155?: boolean;
}

const OfferAndBidItem: FC<IOfferAndBidItemProps> = (props) => {
  const { accept, cancel, offer, assetDataDetail, cancelOfferLoadingId, isERC1155 } = props;
  const { sellHash, user, quantity, expireDate } = offer || {};
  const { avatarImg, walletAddress, isVerify } = user || {};
  const { text } = useSelector((state:any) => state.theme);
  const { walletAddress: walletOwner, userProfile } = useSelector((state: any) => ({
    walletAddress: state.user.data.walletAddress,
    userProfile: state.user.profile,
  }));

  const isUserFillFullInfo =
    get(userProfile, 'artist.email') && get(userProfile, 'artist.username');

  const isOwner = useMemo(() => {
    const ownerAccount = assetDataDetail.ownerNft.find(
      (owner: any) => owner?.user?.walletAddress === walletOwner,
    );
    return !!ownerAccount;
  }, [walletOwner, assetDataDetail]);

  const showCurrency = offer?.currencyToken?.toUpperCase();
  const totalPrice = new BigNumber(offer?.price).multipliedBy(quantity).toFixed().toString();
  const handleAcceptOffer = useCallback(() => {
    if (!isUserFillFullInfo) return;
    accept();
  }, [isUserFillFullInfo, userProfile]);

  return (
    <div className="offering-list w-full xl:py-5 xl:pl-6 xl:pr-7 py-4 px-3 rounded-xl bg-background-dark-700">
      <div className="flex xl:items-center items-end">
        <div className="lg:w-[30%] w-[35%] shrink-0">
          <AvatarOwned
            position="Offer by"
            className="text--label-small gap-2"
            srcAvatar={avatarImg}
            userId={null}
            link={`/artist/${walletAddress}`}
            verified={isVerify}
            ownerAsset={true}
            customTooltip={
              get(offer, 'user.username', '') || get(offer, 'user.walletAddress', '') || 'Unknown'
            }
            artist={
              <Stack
                direction={'row'}
                alignItems={'flex-end'}
                className="text--body-medium font-normal mt-2 tracking-wider"
              >
                <span className="text-primary-90" style={text}>
                  {(get(offer, 'user.username', '') &&
                    `${shortenNameNoti(get(offer, 'user.username', ''), 7)}`) ||
                    `${get(offer, 'user.walletAddress')?.slice(0, 6)}` ||
                    'Unknown'}
                </span>
              </Stack>
            }
            isDisableToolTip={
              get(offer, 'user.username.length', 0) <= 7 ||
              get(offer, 'user.walletAddress.length', 0) <= 7
            }
          />
        </div>

        <div className="text-sm w-[20%] sm:w-[25%] xl:mr-0 px-2">
          {isERC1155 && (
            <div className="text-[10px] opacity-[.38] translate-y-[-8px]">
              for {formatNumber(quantity)} {Number(quantity) > 1 ? `editions` : `edition`}
            </div>
          )}
          <div>{moment(offer.createdAt).fromNow()}</div>{' '}
        </div>
        <div className="pr-2 w-[40%] ml-auto lg:ml-0 sm:w-[35%] sm:justify-end xl:block flex flex-col break-words">
          {showCurrency === PAYMENT_TOKEN.WETH ? (
            <ContentTooltip
              title={`${addCommaToNumberHasApproximately(totalPrice, 20)} ${showCurrency}`}
              arrow
            >
              <div>
                <WethPriceMedium weth={String(abbreviateNumber(totalPrice))} />
              </div>
            </ContentTooltip>
          ) : (
            <ContentTooltip
              title={`${addCommaToNumberHasApproximately(totalPrice, 20)} ${showCurrency}`}
              arrow
            >
              <div>
                <MadPriceMedium umad={String(abbreviateNumber(totalPrice))} />
              </div>
            </ContentTooltip>
          )}
          <div className="ml-auto xl:hidden block">
            {offer.user.walletAddress === walletOwner && (
              <div
                className={`flex items-center text-primary-90 text--label-large capitalize  ${
                  cancelOfferLoadingId === offer.id ? '' : 'cursor-pointer'
                }`}
                onClick={() => {
                  if (cancelOfferLoadingId === offer.id) return;
                  cancel();
                }}
              >
                {cancelOfferLoadingId === offer.id ? (
                  <CircularProgressIndicator className="mr-1 !p-0" size={18} />
                ) : (
                  ''
                )}
                Cancel
              </div>
            )}
            {isOwner && offer.user.walletAddress !== walletOwner && (
              <div
                className={`flex items-cente text--label-large capitalize ${
                  isUserFillFullInfo ? 'cursor-pointer text-primary-90' : 'text-[#c7c7c7d8]'
                } `}
                onClick={handleAcceptOffer}
              >
                Accept
              </div>
            )}
          </div>
        </div>
        {offer.user.walletAddress === walletOwner && (
          <div className="ml-3 xl:block hidden">
            <div
              className={`flex items-center text-primary-90 text--label-large capitalize  ${
                cancelOfferLoadingId === offer.id ? '' : 'cursor-pointer'
              }`}
              onClick={() => {
                if (cancelOfferLoadingId === offer.id) return;
                cancel();
              }}
            >
              {cancelOfferLoadingId === offer.id ? (
                <CircularProgressIndicator className="mr-1 !p-0" size={18} />
              ) : (
                ''
              )}
              Cancel
            </div>
          </div>
        )}
        {isOwner && offer.user.walletAddress !== walletOwner && (
          <div className="w-[10%] sm:w-[10%] ml-3 xl:block hidden">
            <div
              className={`flex items-cente text--label-large capitalize ${
                isUserFillFullInfo ? 'cursor-pointer text-primary-90' : 'text-[#c7c7c7d8]'
              } `}
              onClick={handleAcceptOffer}
            >
              Accept
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferAndBidItem;
