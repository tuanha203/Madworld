import React, { FC, useEffect, useState } from 'react';

import Card from './Card';
import { IconTokenOutlined } from 'components/common/iconography/IconBundle';
import { FilledButton } from 'components/common/buttons';

interface AcceptThisOfferProps {
  handleClose: () => void
}

const AcceptThisOffer: FC<AcceptThisOfferProps> = ({handleClose}) => {
  const [name, setName] = useState('Thuy Bui');

  const handleAccept = () => {
    handleClose()
  }
  return (
    <>
      <div className="modal-content pb-8 pt-3 w-full">
        <Card>
          <div>
            <h3 className="text--headline-xsmall justify-self-start w-full">Item</h3>
            <div className=" w-full flex items-center gap-2 ">
              <figure
                style={{
                  backgroundImage: `url(/images/test.jpg)`,
                }}
                className="w-[72px] h-[72px] bg-cover bg-center shrink-0 rounded-lg"
              />
              <div>
                <p className='text-sm'>
                  Collection <span className='text-primary-dark'>{name}</span>
                </p>
                <p className='text-lg	'>Girlfriends #90</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-center font-bold'>
            <p className='text-base mb-1'>11.5 UMAD</p>
            <p className='text-medium-emphasis text-sm'>($29.5201)</p>
          </div>
        </Card>
        <Card>
          <div className='w-full'>
            <div className='flex justify-between'>
              <p className='font-bold text-base'>Service Fee</p>
              <div>
                <p className='font-bold text-base mb-1'>0.5 UMAD</p>
                <p className='font-bold text-sm text-medium-emphasis'>($0.4428015)</p>
              </div>
            </div>
            <div className='flex justify-between mt-6'>
              <p className='font-bold text-base'>Royalty Fee</p>
              <div>
                <p className='font-bold text-base mb-1'>0.5 UMAD</p>
                <p className='font-bold text-sm text-medium-emphasis'>($0.4428015)</p>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <p className='font-bold text-base'>Total Earning</p>
          <div>
            <p className='font-bold text-base mb-1 flex align-center mb-1 '>
              <IconTokenOutlined image="/icons/mad_icon_outlined.svg" className="mr-3" />
              0.5 UMAD
            </p>
            <p className='font-bold text-sm text-medium-emphasis text-right'>($0.4428015)</p>
          </div>
        </Card>
      </div>
      <FilledButton onClick={handleAccept} text="Accept" customClass="!text--label-large ml-auto" />
    </>
  );
};

export default AcceptThisOffer;
