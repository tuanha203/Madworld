import { MadPrice, UsdEthPrice } from 'components/common/price';
import { usePriceToken } from 'hooks/usePriceToken';
import React from 'react';
import { roundNumber } from 'utils/func';

const PriceErc721 = ({ assetDataDetail, nftSaleStatus }: any) => {
  const nftSale = nftSaleStatus[0];
  const priceETH = usePriceToken('ethereum');

  if (!nftSale) return <></>;

  return (
    <div className="mt-5">
      {nftSale?.currencyToken === 'umad' ? (
        <MadPrice umad={nftSale?.price} />
      ) : (
        <UsdEthPrice dollar={String(roundNumber(nftSale?.price * priceETH))} eth={nftSale?.price} />
      )}
    </div>
  );
};

export default PriceErc721;
