import React, { FC } from 'react';
import Link from 'next/link';
import { ClockIcon } from 'components/common/iconography/IconBundle';
import { FilledButton } from '../../common/buttons';
import { Avatar } from '../thumbnail';
import moment from 'moment';
import { TYPE_DURATION } from 'constants/app';
import SaleEndTime from 'components/common/saleEndTime';
import ImageBase from 'components/common/ImageBase';
import dropCollectionService from 'service/dropCollectionService';
import Tooltip from '@mui/material/Tooltip';
import { shortenName } from "utils/func";
import OverflowTooltip from "components/common/tooltip/OverflowTooltip";

interface IDropCardSingleProps {
  dropId: string;
  collectionTitle: string;
  artist: string;
  timePoster: string;
  expiredTime: number;
  imgCover?: string;
  imgAvatar?: string;
  externalLink: string;
  className?:string;
}

const DropCardSingle: FC<IDropCardSingleProps> = (props) => {
  const { collectionTitle, artist, imgCover, imgAvatar, timePoster, expiredTime, externalLink, dropId, className } = props;
  const dateNow = Math.floor(Date.now() / 1000);
  const millisecondsRemain = expiredTime ? expiredTime + 15 - dateNow : -1;

  const updateDisplay = async () => {
    try {
      const [response, error] = await dropCollectionService.turnOffDisplay(dropId);
      if (response) {
        return;
      }
      if (error) {
      }
    } catch (error) {
    }
  }

  return (
    <div className={`drop-card-single p-4 bg-background-700 shadow-elevation-dark-1 hover:shadow-elevation-dark-5 md:max-w-[395px] mx-auto ${className}`}>
      <figure className="relative overflow-hidden h-[265px] mx-auto min-w-full xl:min-w-[320px] flex justify-center items-center">
        <ImageBase className="h-full object-cover w-[100%]" url={imgCover} type="HtmlImage" alt="" />
        <div className="card-corner bg-background-700"></div>
        <img className="absolute w-7 z-30 top-5 right-5" src="./icons/Fire.svg" alt="" />
        <div className="absolute z-30 top-5 left-5">
          <SaleEndTime millisecondsRemain={millisecondsRemain} isReload={false} callBackAfterEnd={() => updateDisplay()} typeDuration={TYPE_DURATION.LIMITED} />
        </div>
      </figure>
      <div className="w-full flex justify-center translate-y-[-50%]">
        <Avatar border="true" size="large" src={imgAvatar} customClass='border-primary-dark-2' />
      </div>
      <div className="flex flex-col justify-center items-center gap-2 -mt-4 mb-7">
        <h2 className="text--title-large capitalize cursor-default truncate w-full text-center !font-OnlyChakra !text-[22px] max-w-[210px]">{collectionTitle}</h2>
        <div className="flex justify-items-center">
          <div className="text--label-small max-w-full text-center items-center flex w-full">
            <div className="mr-1">Created by</div>
            <OverflowTooltip title={artist} className="max-w-[100px] text-primary-60">
              <span className="text-primary-60 capitalize truncate cursor-default text-red"> {artist}</span>
            </OverflowTooltip>
          </div>
        </div>
        <div className="drop-single mt-4">
          <FilledButton text="">
            <Link href={externalLink ? externalLink : ''}>
              <a>
                Sign to Whitelist
              </a>
            </Link>
          </FilledButton>
        </div>
      </div>
      <div className="drop-footer flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* <HeartIcon />
          <span className="text--label-medium">90k</span> */}
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon />
          <span className="text--label-medium">Posted {moment(timePoster).fromNow()}</span>
        </div>
      </div>
    </div>
  );
};

DropCardSingle.defaultProps = {
  collectionTitle: 'default collection',
  artist: 'default lee',
  imgCover: './images/drop1.jpg',
  imgAvatar: './images/drop1.jpg',
};

export default DropCardSingle;

// to do
// add fetch json data
