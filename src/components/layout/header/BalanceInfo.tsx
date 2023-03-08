import { FC } from 'react';
import { IconEth, IconMadOutlined, IconWeth } from 'components/common/iconography/IconBundle';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { IconEthSVG } from 'components/common/iconography/iconsComponentSVG';
import { useSelector } from 'react-redux';

interface IBalanceInfoProps {
  userBalances: {
    ethBalance: string;
    wethBalance: string;
    umadBalance: string;
    ethUsdBalance: string;
    wethUsdBalance: string;
  };
}

const BalanceInfo: FC<IBalanceInfoProps> = (props) => {
  const { userBalances } = props;
  const { icon } = useSelector((state:any) => state.theme);
  return (
    <Stack spacing={2} my={2}>
      <Stack direction="row" alignItems="center">
        <IconEthSVG style={{color:'white'}} />
        <div className="ml-2">
          <div className="sm:hidden text--body-small text-medium-emphasis">Ether</div>
          <div className="text--subtitle text-white">
            {userBalances.ethBalance} ETH{' '}
            <span className="sm:block text--body-small text-medium-emphasis">
              ${userBalances.ethUsdBalance}
            </span>
          </div>
        </div>
      </Stack>
      <Divider className="md:hidden" />
      <Stack direction="row" alignItems="center">
        <IconEthSVG style={icon} />
        <div className="ml-2 text-white">
          <div className="sm:hidden text--body-small text-medium-emphasis">Ether</div>
          <div className="text--subtitle">
            {userBalances.wethBalance} WETH
            <span className="sm:block text--body-small text-medium-emphasis">
              ${userBalances.wethUsdBalance}
            </span>
          </div>
        </div>
      </Stack>
      <Stack direction="row" alignItems="center">
        <IconMadOutlined size={'w-[32px] w-6 h-[100%]'} />
        <div className="ml-2 text-white">
          <div className="sm:hidden text--body-small text-medium-emphasis">MADworld</div>
          <div className="sm:block text--subtitle">{userBalances.umadBalance} UMAD</div>
          <div className="md:hidden text--body-small text-medium-emphasis">
            ${userBalances.umadBalance}
          </div>
        </div>
      </Stack>
    </Stack>
  );
};

export default BalanceInfo;
