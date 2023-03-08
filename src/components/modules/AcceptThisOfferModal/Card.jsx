import { Divider } from 'components/common';
import React from 'react';

const Card = ({children}) => {
  return (
    <>
      <div className="py-6 flex justify-between">
        {children}
      </div>
      <Divider />
    </>
  );
};

export default Card;
