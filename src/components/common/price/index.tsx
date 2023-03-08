import { Divider } from '@mui/material';
import { TOKEN } from 'constants/app';
import { FC, ReactNode } from 'react';
import { roundingNumber } from 'utils/formatNumber';
import { IconEth, IconMadOutlined, IconWeth } from '../iconography/IconBundle';
import Tooltip from '@mui/material/Tooltip';
import ContentTooltip from '../tooltip/ContentTooltip';
import OverflowTooltip from '../tooltip/OverflowTooltip';
import { useSelector } from 'react-redux';
import { IconEthSVG } from '../iconography/iconsComponentSVG';

export type NFTCurrency = 'ETH' | 'UMAD';

interface INFTPriceProps {
  currency?: NFTCurrency;
  dollarfull?: string;
  dollar?: string;
  amount: string;
  amountFull: string;
  className?: string;
  icon?: boolean;
  iconSize?: string;
  classToolTip?: string;
}

export const NFTPrice: FC<INFTPriceProps> = (props) => {
  const {
    amount,
    amountFull,
    dollar,
    className,
    currency = 'UMAD',
    icon = true,
    iconSize,
    dollarfull,
    classToolTip,
  } = props;

  const iconByCurrency: { [x: string]: ReactNode } = {
    UMAD: <IconMadOutlined size={iconSize} />,
    ETH: <IconEth size={iconSize} />,
  };

  return (
    <>
      <div className={`mad-price inline-flex items-center text--total--price gap-2 ${className}`}>
        {icon && iconByCurrency[currency]}
        <div className={`inline-flex items-center gap-1`}>
          <ContentTooltip style={{ cursor: 'pointer' }} title={`${amount} ${currency}`} arrow>
            <div className={`text-right ${classToolTip}`}>{amount}</div>
          </ContentTooltip>
          {currency}
        </div>
      </div>
      {dollar && (
        <ContentTooltip style={{ cursor: 'pointer' }} title={`$${dollarfull}`} arrow>
          <div className={`text--body-medium text-medium-emphasis text-right ${classToolTip}`}>
            (${dollar})
          </div>
        </ContentTooltip>
      )}
    </>
  );
};

interface MadPriceProps {
  umad: string;
  customClass?: string;
  icon?: boolean;
  customClassIcon?: string;
  fullDisplay?: boolean;
  shortView?: boolean;
}
export const MadPrice: FC<MadPriceProps> = ({
  umad,
  customClass,
  icon = true,
  customClassIcon,
  fullDisplay = false,
  shortView = false,
}) => {
  return (
    <div
      className={`mad-price flex items-center text--price gap-2 ${fullDisplay ? 'w-[82vw] ' : 'w-[45vw]'
        } xl:w-[100%] ${customClass}`}
    >
      {icon && (
        <img className={`w-8 ${customClassIcon}`} src="/icons/mad_icon_outlined.svg" alt="" />
      )}
      <div className={shortView ? `max-w-[230px]` : 'max-w-[375px]'}>
        <OverflowTooltip title={`${umad} UMAD`}>
          <span className="font-Chakra">{umad}</span>
        </OverflowTooltip>
      </div>
      <h2 className="font-Chakra">UMAD</h2>
    </div>
  );
};

interface CustomEthPriceProps {
  eth: string;
  customClass?: string;
  icon?: boolean;
  currency?: string;
  customClassImage?: string;
  shortView?: boolean;
  fontSize?: string;
}
export const CustomEthPrice: FC<CustomEthPriceProps> = ({
  eth,
  customClass,
  icon = true,
  currency = 'ETH',
  customClassImage,
  shortView,
  fontSize,
}) => {
  return (
    <div className={`mad-price flex items-center text--price gap-2 font-Chakra ${customClass}`}>
      {icon && (
        <img
          className={`${customClassImage}`}
          src={currency === 'WETH' ? '/icons/weth.svg' : '/icons/Eth.svg'}
          alt="icon"
        />
      )}
      <div className={`${shortView ? `max-w-[340px]` : 'max-w-[475px]'} flex ${fontSize}`}>
        <OverflowTooltip title={`${eth} ${currency}`}>
          <span className={`font-Chakra font-bold `}>{eth}</span>
        </OverflowTooltip>
        {'\u00A0'}
        {currency}
      </div>
    </div>
  );
};

interface PriceProps {
  amount: string | number;
  customClass?: string;
  icon?: boolean;
  currency: string;
}
export const CustomPrice: FC<PriceProps> = ({
  amount,
  customClass,
  icon = true,
  currency = '',
}) => {
  return (
    <div className={`mad-price flex items-center text--price gap-2 ${customClass}`}>
      {icon && <img className="w-8" src="/icons/mad_icon_outlined.svg" alt="" />}
      <h2>
        {amount} {currency}
      </h2>
    </div>
  );
};

interface MadVolumeProps {
  index: string | number;
  customClass?: string;
  iconSize?: string;
}
export const MadVolume: FC<MadVolumeProps> = ({ index, customClass, iconSize }) => {
  return (
    <div className="mad-price-small text--label-medium flex self-end items-center">
      <IconMadOutlined size={iconSize} />
      <span className={`ml-2 mr-1 ${customClass}`}>{index}</span>
    </div>
  );
};

interface MadPriceMediumProps {
  umad: string;
}

export const MadPriceMedium: FC<MadPriceMediumProps> = ({ umad }) => {
  return (
    <div className="max-w-6 mad-price-small text--subtitle flex self-end items-center 	">
      <span className="min-w-[1.5rem] w-6 h-6">
        <img className="min-w-[1.5rem] w-6 h-6" src="/icons/mad_icon_outlined.svg" alt="" />
      </span>
      <span className="ml-2 mr-1 truncate">{umad}</span>
      <span>UMAD</span>
    </div>
  );
};

export const WethPriceMedium: FC<{ weth: string }> = ({ weth }) => {
  return (
    <div className="mad-price-small text--subtitle flex self-end items-center">
      <span>
        <img className="w-6 h-6" src="/icons/weth.svg" alt="" />
      </span>
      <span className="ml-2 mr-1">{weth}</span>
      <span>WETH</span>
    </div>
  );
};

interface DollarPriceProps {
  dollar: string;
}

export const DollarPrice: FC<DollarPriceProps> = ({ dollar }) => {
  const { text } = useSelector((state:any) => state.theme);
  return (
    <div className="mad-price flex items-center text--body-large gap-2">
      <OverflowTooltip title={`$ ${dollar}`}>
        <div className="truncate">
          <span className="text-secondary-60" style={text}>$</span>
          <span>&nbsp;{dollar}</span>
        </div>
      </OverflowTooltip>
    </div>
  );
};

interface EthPriceProps {
  eth?: string;
  customClass?: string;
  iconSize?: string;
  icon?: boolean;
  isShowSymbol?: boolean;
  color: any;
}

export const EthPrice: FC<EthPriceProps> = ({
  eth,
  customClass,
  iconSize,
  icon = true,
  isShowSymbol = true,
  color
}) => {
  return (
    <div
      className={`mad-price flex items-center max-content-width text--body-large gap-2 ${customClass} `}
    >
      {icon && !color && <IconEth size={iconSize} />}
      {color && <IconEthSVG style={{ transform: "scale(0.8)", position: "relative", bottom: "2px", color: color }} />}
      <h2>
        {eth} {isShowSymbol && 'ETH'}
      </h2>
    </div>
  );
};

interface EthPriceMedium {
  eth?: string;
  customClass?: string;
  iconSize?: string;
  icon?: boolean;
  isShowSymbol?: boolean;
}

export const EthPriceMedium: FC<EthPriceProps> = ({
  eth,
  customClass,
  iconSize,
  icon = true,
  isShowSymbol = true,
}) => {
  return (
    <div className="mad-price-small text--title-medium flex self-end items-center">
      <span>
        <img className="w-6 h-6" src="/icons/Eth.svg" alt="" />
      </span>
      <span className="ml-2 mr-1">{eth}</span>
      <span>ETH</span>
    </div>
  );
};

interface TokenPriceProps {
  price: string | number;
  currencyToken: string;
  customClass?: string;
  customClassPrice?: string;
  iconSize?: string;
  isPreview?: boolean;
  isUnit?: boolean;
  currentPrice?: string | number;
}

export const TokenPrice: FC<TokenPriceProps> = ({
  price,
  customClass,
  customClassPrice,
  iconSize,
  currencyToken,
  isUnit,
  currentPrice,
}) => {
  const currency = currencyToken?.toLocaleUpperCase();
  return (
    <div
      className={`mad-price flex items-center max-content-width text--body-large gap-2 ${customClass}`}
    >
      {currency === TOKEN.ETH && <IconEth size={iconSize} />}
      {currency === TOKEN.UMAD && <IconMadOutlined size={iconSize} />}
      {currency === TOKEN.WETH && <IconWeth size={iconSize} />}
      <Tooltip title={`${currentPrice} ${currency}`}>
        <h2 className={`${customClassPrice} truncate max-w-[100px] text-base `}>
          {price} {isUnit && currency}
        </h2>
      </Tooltip>
    </div>
  );
};

interface UsdEthPriceProps {
  dollar: string;
  eth: string;
}

export const UsdEthPrice: FC<UsdEthPriceProps> = ({ dollar, eth }) => {
  return (
    <div className="usdEth flex items-center gap-4">
      <DollarPrice dollar={dollar} />
      <Divider orientation="vertical" variant="middle" flexItem />
      <EthPrice eth={eth} />
    </div>
  );
};

interface RenderTokenImageProps {
  currency: string;
  customClass?: string;
  iconSize?: string;
}

export const RenderTokenImage: FC<RenderTokenImageProps> = ({
  currency,
  iconSize,
  customClass,
}) => {
  return (
    <div className={`flex items-center max-content-width ${customClass} `}>
      {currency?.toLocaleUpperCase() === TOKEN.ETH && <IconEth size={iconSize} />}
      {currency?.toLocaleUpperCase() === TOKEN.UMAD && <IconMadOutlined size={iconSize} />}
    </div>
  );
};

RenderTokenImage.defaultProps = {
  iconSize: '',
};

MadPrice.defaultProps = {
  umad: '10',
  customClass: '',
};
MadPriceMedium.defaultProps = {
  umad: '10',
};
DollarPrice.defaultProps = {
  dollar: '1.29',
};
EthPrice.defaultProps = {
  eth: '0.0004136',
  customClass: '',
  iconSize: '',
};
