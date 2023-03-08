import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Divider from '@mui/material/Divider';
import BigNumber from 'bignumber.js';
import { SWAP_UMAD_UNISWAP } from 'constants/text';
import _ from 'lodash';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { commaForMatSpec } from 'utils/utils';
import { TextButtonSquare } from '../../common/buttons';

const TopBarHeader = () => {
  const { text, icon } = useSelector((state:any) => state.theme);
  const trendingMadworld = useSelector((state: any) => ({
    usd: state?.system?.priceUmadUsd || 0,
    usd_24h_change: state?.system?.priceUmadUsd24hChange,
  }));

  const usd_24h_change =
    trendingMadworld?.usd_24h_change &&
    trendingMadworld?.usd_24h_change?.toString()?.replaceAll('-', '');

  const bugUsd = new BigNumber(trendingMadworld.usd).toFormat();

  const usd =
    Number(bugUsd) === 0
      ? '0'
      : Number(bugUsd) < Math.pow(10, -3)
      ? '~0.001'
      : _.toString(bugUsd).slice(0, 5);

  return (
    <div className="top-bar-header w-full bg-background-700 md:bg-background-dark-800 rounded-[14px] text-white md:rounded-none">
      <div className="md:container mx-auto px-5 py-3.5 md:p-0">
        <div className="ticker-wrapper flex items-center flex-wrap md:flex-nowrap md:justify-end">
          <div className="flex items-center gap-2">
            <span>
              <img className="w-5 h-5" src="/icons/mad_icon_outlined.svg" alt="" />
            </span>
            <span className="text--body-medium">UMAD</span>
          </div>
          <Divider className="!mx-4" orientation="vertical" variant="middle" flexItem />
          <div className="flex items-center gap-2">
            <span className=" w-5 h-5 rounded-full flex flex-col justify-center items-center bg-[#16C784]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.3752 6.8125C5.95645 6.44375 5.5002 6.0625 5.5002 5.46875C5.5002 4.7875 6.13145 4.3125 7.1877 4.3125C8.3002 4.3125 8.7127 4.84375 8.7502 5.625H10.1314C10.0877 4.55 9.43145 3.5625 8.1252 3.24375V1.875H6.2502V3.225C5.0377 3.4875 4.0627 4.275 4.0627 5.48125C4.0627 6.925 5.25645 7.64375 7.0002 8.0625C8.5627 8.4375 8.8752 8.9875 8.8752 9.56875C8.8752 10 8.56895 10.6875 7.1877 10.6875C5.9002 10.6875 5.39395 10.1125 5.3252 9.375H3.9502C4.0252 10.7437 5.0502 11.5125 6.2502 11.7688V13.125H8.1252V11.7812C9.34395 11.55 10.3127 10.8438 10.3127 9.5625C10.3127 7.7875 8.79395 7.18125 7.3752 6.8125Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="text--body-medium font-bold">{usd ? usd : '--'}</span>
          </div>
          <Divider className="!mx-4" orientation="vertical" variant="middle" flexItem />
          <div className="flex items-center gap-2">
            {Number(trendingMadworld?.usd_24h_change) > 0 ? (
              <ArrowDropUpIcon className="text-white" style={{ color: '#4eaf0a' }} />
            ) : (
              <ArrowDropDownIcon
                className="text-white"
                style={icon ? icon : { color: '#f4b1a3' }}
              />
            )}
            <span className="text--body-medium font-bold">
              {usd_24h_change && commaForMatSpec(usd_24h_change)} %
            </span>
          </div>
          <Divider
            className="!mx-4 hidden xl:block"
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <TextButtonSquare customClass="!text--label-large !text-primary-dark hidden xl:block">
            <Link href={SWAP_UMAD_UNISWAP}>
              <a target="_blank">
                <span className="text-secondary-60" style={text}>
                  Buy UMAD
                </span>
              </a>
            </Link>
          </TextButtonSquare>
        </div>
        <div className="md:hidden">
          <TextButtonSquare customClass="!text--label-large !text-primary-dark">
            <Link href={SWAP_UMAD_UNISWAP}>
              <a target="_blank">
                <span className="text-secondary-60" style={text}>
                  Buy UMAD
                </span>
              </a>
            </Link>
          </TextButtonSquare>
        </div>
      </div>
    </div>
  );
};

export default TopBarHeader;
