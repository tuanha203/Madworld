import { FC, useMemo, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { ITypeItemProps } from 'components/modules/choose-type/TypeItem';
import { NETWORK_CHAIN_ID } from 'constants/envs';
import TypeList from 'components/templates/create-nft/TypeList';

interface IChooseTypeProps {
  open: boolean;
}

const TYPE_OPTIONS: ITypeItemProps[] = [
  {
    title: 'Single',
    img: '/images/nft-single.svg',
    description: 'If you want to highlight the uniqueness and individuality of your item',
    pathname: '/create/erc-721',
  },
  {
    title: 'Multiple',
    img: '/images/nft-multiple.svg',
    description: 'If you want to share your item with a large number of community members',
    pathname: '/create/erc-1155',
  },
];

const ChooseType: FC<IChooseTypeProps> = ({}) => {
  const { account, library, chainId, active } = useWeb3React();
  const router = useRouter();

  useEffect(() => {
    if (chainId && chainId?.toString() !== NETWORK_CHAIN_ID) {
      router.push('/marketplace');
    }
  }, [chainId]);

  useEffect(() => {
    if (!library) return;
    const onChangeAccount = ([accountConnected]: any) => {
      if (!accountConnected && accountConnected === account) return;
      router.push('/marketplace');
    };

    if (library?.provider && library?.provider?.on) {
      library.provider && library.provider.on('accountsChanged', onChangeAccount);
    }
    return () => {
      library?.provider?.removeListener('accountsChanged', onChangeAccount); // need func reference to remove correctly
    };
  }, [account, library]);

  useEffect(() => {
    if (chainId && chainId?.toString() !== NETWORK_CHAIN_ID) {
      console.log('run');
    }
  }, [active, chainId]);

  return (
    <div className="flex justify-center  h-full bg-[url('/images/backgrounds/choose-type.png')]">
      <div className="lg:pt-24 lg:pb-64 py-20 px-4">
        <div className="text-center text-white lg:mb-16 mb-6">
          <h1 className="text--display-medium lg:my-8 mt-0 lg:text-[45px] text-[28px]">
            Choose Type
          </h1>
          <div className="text--body-large lg:w-[578px] mx-auto">
            Choose “Single” for one of a kind or “Multiple” if you want to sell one collectible
            multiple times
          </div>
        </div>
        <TypeList list={TYPE_OPTIONS} />
      </div>
    </div>
  );
};
export default ChooseType;
