import React, { useState } from 'react';
import { OutlinedButton } from 'components/common';

import CircularProgressIndicator from 'components/common/progress-indicator';
import CheckIcon from '@mui/icons-material/Check';
import { LINK_SCAN } from 'constants/envs';

interface IModalFollowStepAuction {
  open?: any;
  handleClose?: any;
  id?: any;
  isApproveErc20?: boolean;
  isWaitingForSign?: boolean;
  textHeader?: any;
  isUMAD: boolean;
  currency?: string;
  flowTxHash: any;
}
const defaultCollapsed = {
  approve: true,
  listing: true,
};
interface ICollapsed {
  [key: string]: boolean;
  approve: boolean;
  listing: boolean;
}

const ModalFollowStepBid = ({
  isApproveErc20,
  flowTxHash,
  currency,
}: IModalFollowStepAuction) => {
  const [collapsed, setCollapsed] = useState<ICollapsed>(defaultCollapsed);

  const updateCollapsed = (key: string) => {
    setCollapsed({
      ...collapsed,
      [key]: !collapsed[key],
    });
  };

  return (
    <div className="my-[50px] md:w-[430px] sm:w-full">
      <div className="flex  p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected">
        <div className="pr-3 pl-1 w-10">
          {isApproveErc20 ? (
            <CheckIcon style={{ color: '#F4B1A3' }} />
          ) : (
            <CircularProgressIndicator size={20} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="font-bold text-dark-on-surface text-lg">1. Approve {currency} token</div>
            <div className="p-2">
              <img
                src="/icons/arrow-bottom.svg"
                className={`relative bottom-1 text-primary-dark ml-3`}
                onClick={() => updateCollapsed('approve')}
                style={{
                  transform: !collapsed.approve ? 'none' : 'rotate(180deg)',
                }}
              />
            </div>
          </div>
          {collapsed.approve && (
            <div className="pr-2">
              <div className="text-archive-Neutral-Variant70 text-sm mt-2">
                To start selling for the first time on MADworld, you need to allow a website to use
                your {currency}.
              </div>
              {
                !isApproveErc20 && (
                  <div className="text-xs text-[#7A84A5] mt-3 mb-3">
                    Waiting for confirmation...
                  </div>
                )
              }
              {
                flowTxHash?.txApprove && (
                  <div className="mt-2">
                  <a href={`${LINK_SCAN}tx/${flowTxHash?.txApprove}`} target="_blank">
                    <OutlinedButton
                      customClass="!text-secondary-60"
                      target="_blank"
                      fullWidth
                      text="View on Etherscan"
                    />
                  </a>
                </div>
                )
              }
            </div>
          )}
        </div>
      </div>

      <div className="flex  p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected">
        <div className='"pr-3 pl-1 w-10'>
          {isApproveErc20 ? <CircularProgressIndicator size={20} /> : null}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="font-bold text-dark-on-surface text-lg">2. Place a bid</div>
            <div className="p-2">
              <img
                src="/icons/arrow-bottom.svg"
                className={`relative bottom-1 text-primary-dark ml-3`}
                onClick={() => updateCollapsed('listing')}
                style={{
                  transform: !collapsed.listing ? 'none' : 'rotate(180deg)',
                }}
              />
            </div>
          </div>
          {collapsed.listing && (
            <div className="pr-2">
              <div className="text-primary-gray text-sm mt-2">
                Sign the message for placing the bid.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalFollowStepBid;
