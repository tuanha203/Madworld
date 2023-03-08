import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';

const MadLogoWhite = () => {
  const { media } = useSelector((state:any) => state.theme);
  const logo = _.find(media?.logos, (e: any) => e.index === 1);
  return (
    <figure className="w-[150px]">
      <img
        className="w-full object-cover"
        style={logo?.style}
        src={logo?.url || '/images/topLogoWhite.svg'}
        alt="logo"
      />
    </figure>
  );
};

export default MadLogoWhite;
