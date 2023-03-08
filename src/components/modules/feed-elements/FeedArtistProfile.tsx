import { Tooltip } from '@material-ui/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconEth, IconMadOutlined } from 'components/common/iconography/IconBundle';
import { FC, useState } from 'react';
import { shortenName, shortenPersonalSite } from 'utils/func';
import { Avatar } from '../thumbnail';

const bidIcon = '/icons/asset-detail/activity-bid.svg';
const mintedIcon = '/icons/asset-detail/activity-minted.svg';
const saleIcon = '/icons/asset-detail/activity-sale.svg';
const tagIcon = '/icons/asset-detail/activity-tag.svg';
const transferIcon = '/icons/asset-detail/activity-transfer.svg';
const offerIcon = '/icons/asset-detail/activity-offer.svg';

interface Feed {
  price_umad: string;
  activityType: string;
  blockTimestamp: number;
  currencyToken: string;
  fromUser: object;
  toUser: object;
  transactionHash: string;
  quantity: number;
  price: number;
  fromAddress: string;
  toAddress: string;
  nft: any;
}

interface FeedArtistProfileProps {
  type: string;
  data: Feed;
  removed?: boolean;
}

interface IFilter {
  label: string;
  value: string;
  icon: string;
}

const FeedArtistProfile: FC<FeedArtistProfileProps> = ({ type, removed, data }) => {
  const typeConditionArray = [type == 'sale', type == 'offer', type == 'listings'];
  const quantityConditionArray = [type == 'offer', type == 'listings'];
  const [show, setShow] = useState(false);

  const renderIcon = (type: string, icon: any) => {
    return (
      <div className="text--label-small flex flex-col items-center gap-1">
        <img src={icon} alt="" />
        <span>{type}</span>
      </div>
    );
  };
  return (
    <div className="rounded-xl bg-background-dark-600">
      <div className="feed-artist-profile flex w-[100%] xl:w-[744px] items-center py-4 px-6 justify-between xl:justify-start">
        <div className="avatar flex items-center gap-2 w-2/5 min-w-[40%]">
          <div className="w-12 md:flex hidden">
            {type == 'sale'
              ? renderIcon('Sale', saleIcon)
              : type == 'transfer'
              ? renderIcon('Transfer', transferIcon)
              : type == 'offer'
              ? renderIcon('Offer', offerIcon)
              : type == 'list'
              ? renderIcon('List', tagIcon)
              : type == 'minted'
              ? renderIcon('Mint', mintedIcon)
              : type == 'bid'
              ? renderIcon('Bid', bidIcon)
              : ''}
          </div>

          <Avatar rounded={false} src={data?.nft?.nftUrl} />
          <div className="flex flex-col justify-between min-w-[10px]">
            <div className="text-white text--title-medium truncate ">{data?.nft?.title}</div>
            <div className="text--label-small text-archive-Neutral-Variant70 truncate">2h ago</div>
          </div>
        </div>
        <div className="flex items-center justify-end md:justify-between xl:justify-start md:gap-6 w-[50%] xl:w-[unset]">
          <div className="md:flex hidden flex-col justify-between gap-2 xl:w-24 min-w-[10px]">
            <div className="text--label-small">From</div>
            <div className="text-[#D6C7F2] text--label-medium truncate ">
              {shortenPersonalSite(data?.fromAddress, 8, 4)}
            </div>
          </div>
          <div className="lg:flex hidden flex-col justify-between gap-2 min-w-[10px]">
            <div className="text--label-small w-24">To</div>
            <div className="text-[#D6C7F2] text--body-medium truncate">
              {data?.toAddress ? shortenName(data?.toAddress, 8) : '-'}
            </div>
          </div>
          <div className="lg:flex hidden flex-col justify-between gap-2 min-w-[10px]">
            <div className="text--label-small w-12">Quantity</div>
            <div className=" text-secondary-60 text--body-medium truncate ">{data?.quantity}</div>
          </div>
          <div className="flex flex-col justify-between gap-2">
            <div className="text--body-medium flex gap-1 min-w-[10px]">
              {data?.currencyToken === 'umad' ? (
                <Tooltip title={`${data?.price} UMAD`}>
                  <a className="flex">
                    <IconMadOutlined />
                    <div className="min-w-[10px] w-[90px] truncate pl-[5px]">
                      {data?.price} UMAD
                    </div>
                  </a>
                </Tooltip>
              ) : (
                <Tooltip title={`${data?.price} ETH`}>
                  <a className="flex">
                    <IconEth /> 
                    <div className="min-w-[10px] w-[90px] truncate pl-[5px]">{data?.price} ETH</div>
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
          <div
            className="flex lg:hidden flex-col justify-between gap-2"
            onClick={() => setShow(!show)}
          >
            {!show ? (
              <KeyboardArrowDownIcon sx={{ color: '#F4B1A3' }} />
            ) : (
              <KeyboardArrowUpIcon sx={{ color: '#F4B1A3' }} />
            )}
          </div>
        </div>
      </div>
      <div
        className={`lg:hidden w-[100%] rounded-xl  px-6 ${
          !show ? 'view-hidden' : 'view-hidden-disable'
        } overflow-hidden`}
      >
        <div className="flex items-center justify-between gap-6 pb-4">
          <div className="md:hidden flex flex-col gap-2 truncate">
            <div className="text--label-small">From</div>
            <div className="text-[#D6C7F2] text--label-medium truncate">
              {shortenPersonalSite(data?.fromAddress, 8, 4)}
            </div>
          </div>
          <div className="flex flex-col gap-2 truncate">
            <div className="text--label-small">To</div>
            <div className="text-[#D6C7F2] text--body-medium truncate minw-[20px]">
              {data?.toAddress ? shortenName(data?.toAddress, 8) : '-'}
            </div>
          </div>
          <div className="flex flex-col  gap-2 truncate text-center">
            <div className="text--label-small ">Quantity</div>
            <div className=" text-secondary-60 text--body-medium truncate">{data?.quantity}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

FeedArtistProfile.defaultProps = {
  // type : sale, transfer, offer,listings,minted
  type: 'sale',
  removed: false,
};

export default FeedArtistProfile;
