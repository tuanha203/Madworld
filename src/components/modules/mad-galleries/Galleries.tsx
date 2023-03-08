import styled from '@emotion/styled';
import ProductDetailCard from 'components/modules/cards/ProductDetailCard';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import * as React from 'react';
import { shortenAddress, shortenNameNotiHasAddress } from 'utils/func';
import { CollectionArtistCard } from '../cards/CollectionArtistCard';
import { TYPE_LIKES, WINDOW_MODE } from 'constants/app';

const layoutMadGalleries: React.CSSProperties = {
  display: 'grid',
  gridGap: 26,
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  gridTemplateRows: '264px 264px 264px',
  gridTemplateAreas: `'h1 h2 h3 h4' 
                      'h1 h6 h3 h8' 
                      'h5 h6 h7 h8'`,
};

const LayoutItem = styled.div`
  &:first-of-type {
    grid-area: h1;
  }
  &:nth-of-type(2) {
    grid-area: h2;
  }
  &:nth-of-type(3) {
    grid-area: h3;
  }
  &:nth-of-type(4) {
    grid-area: h4;
  }
  &:nth-of-type(5) {
    grid-area: h5;
  }
  &:nth-of-type(6) {
    grid-area: h6;
  }
  &:nth-of-type(7) {
    grid-area: h7;
  }
  &:nth-of-type(8) {
    grid-area: h8;
  }
`;

interface GalleriesProps {
  data: any;
}

function Galleries({ data }: GalleriesProps) {
  const windowMode = useDetectWindowMode();

  return (
    <div className="mt-3">
      <div className="">
        {windowMode !== WINDOW_MODE.SM ? (
          <>
            <div style={layoutMadGalleries}>
              {data.map((item: any, index: number) => (
                <LayoutItem className="grid overflow-hidden cursor-pointer" key={index}>
                  <CollectionArtistCard
                    address={item?.wallet_address}
                    isVerify={item?.is_verify}
                    artist={item?.username || shortenNameNotiHasAddress(item?.wallet_address, 6, 4)}
                    avatar={item?.avatar_img}
                    coverImg={item?.cover_img}
                    heightImage={[1, 3, 4, 6].includes(index) ? 160 : 450}
                    nameToolTip={item?.username || item?.wallet_address}
                  />
                </LayoutItem>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              {data.map((item: any, index: number) => (
                <div className="overflow-hidden cursor-pointer" key={index}>
                  <CollectionArtistCard
                    address={item?.wallet_address}
                    isVerify={item?.is_verify}
                    artist={item?.username || shortenNameNotiHasAddress(item?.wallet_address, 6)}
                    avatar={item?.avatar_img}
                    coverImg={item?.cover_img}
                    heightImage={160}
                    nameToolTip={item?.username || item?.wallet_address}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="md:hidden sm:grid grid-cols-2 gap-4">
        {/* {data.map((item: any, index: number) => (
          <ProductDetailCard />
        ))} */}
      </div>
    </div>
  );
}

export default Galleries;
