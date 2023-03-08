import React from 'react';
import SubscribeField from 'components/modules/newsletter/SubcribeField';

export default function Subscribe({ hiddenMore = false }: any) {
  return (
    <div className={`flex-1 md:px-0 sm:px-3 block`}>
      <p className="font-Chakra font-bold md:text-[45px] sm:text-[27px]">
        {!hiddenMore && 'More '}
        <span className="md:text-[#BBA2EA] sm:text-[#BBA2EA]">DROPS</span> are coming!!{' '}
      </p>
      <p className="font-Chakra font-bold md:text-[32px] sm:text-[22px] mt-4 md:mb-0">
        Subscribe to obtain the latest Drops
      </p>
      <p className="font-Chakra mb-[16px] font-bold md:text-[#D6C7F2] sm:text-[#D6C7F2] text-[28px] mt-[67px]">
        Subscribe
      </p>
      <div className="md:w-[389px] sm:w-full">
        <SubscribeField />
        <p className={`font-OnlyChakra text-sm opacity-60 !text-xs`}>
          Join us to stay updated with our newest feature releases, NFT drops, tips and tricks in
          MADworld NFT Marketplace.
        </p>
      </div>
    </div>
  );
}
