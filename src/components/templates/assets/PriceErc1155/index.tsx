import { MadPrice } from 'components/common/price';
import React from 'react'

const PriceErc1155 = ({assetDataDetail, nftSaleStatus}: any) => {
  const nftSale = nftSaleStatus[0];

  return (
    <>
      {nftSale?.price &&
        <div className='mt-5'>
          <MadPrice umad={nftSale?.price} />
          {/* <UsdEthPrice dollar="11" eth="111" /> */}
        </div>
      }
    </>
  )
}

export default PriceErc1155