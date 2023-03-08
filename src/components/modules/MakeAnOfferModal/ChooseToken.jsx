import React from 'react';
import { FilledButtonDark, OutlinedButton } from 'components/common/buttons';

const MakeAnOffer = () => {
  return (
    <div className="modal-content py-8">
      <div className="w-full flex justify-end items-center space-x-4 mt-4">
        <OutlinedButton text="BUY UMAD" customClass="!text--label-large" />
        <FilledButtonDark customClass="!text--label-large" disabled={true} text="MAKE AN OFFER" />
      </div>
    </div>
  );
};

export default MakeAnOffer;
