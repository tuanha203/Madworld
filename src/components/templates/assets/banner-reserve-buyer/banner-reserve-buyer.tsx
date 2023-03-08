import { FC } from 'react';
import Link from 'next/link';
import { Avatar } from 'components/modules/thumbnail';
import { IconVerifiedFullFill } from 'components/common/iconography/IconBundle';
import { shortenNameNoti } from 'utils/func';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';

interface IEditAndSellAssetProps {
  isUserReserveBuyer: boolean;
  reserveBuyer: any;
  isOwnerNft: boolean;
}

const BannerReserveBuyer: FC<IEditAndSellAssetProps> = (props) => {
  const { reserveBuyer, isUserReserveBuyer, isOwnerNft } = props;
  const { username, walletAddress, avatarImg, isVerify } = reserveBuyer || {};

  return (
    <div className="bg-background-black-pearl flex xl:justify-center justify-start items-center font-Chakra font-bold text-sm ">
      <div className="p-5">
        {isUserReserveBuyer
          ? 'This listing is reserved for you!'
          : 'This is a private listing that you made for'}
      </div>
      {isOwnerNft && !isUserReserveBuyer && (
        <Link href={`/artist/${walletAddress || 'unknown'}`}>
          <div className="flex items-center justify-center">
            <Avatar
              customClass="!w-[24px] !h-[24px] rounded-full border-primary-dark cursor-pointer z-10"
              rounded
              src={avatarImg}
            />
            {isVerify ? (
              <div className="scale-[0.6] -translate-x-[10px] translate-y-[8px] z-50">
                <IconVerifiedFullFill />
              </div>
            ) : null}
            <ContentTooltip title={username || walletAddress || 'Unknown'}>
              <span className={`text-primary-90 cursor-pointer ${isVerify ? '' : 'pl-2'}`}>
                {username ? shortenNameNoti(username, 20) : walletAddress?.slice(0, 6) || 'Unknown'}
              </span>
            </ContentTooltip>
          </div>
        </Link>
      )}
    </div>
  );
};

export default BannerReserveBuyer;
