import React, { useEffect, useRef, useState } from 'react';
import { OutlinedButton } from 'components/common';
import { useWeb3React } from '@web3-react/core';
import { CURRENCY_SELECT, PAYMENT_TOKEN } from 'constants/app';
import ModalFollowStep from 'components/common/modal-follow-step';
import CircularProgressIndicator from 'components/common/progress-indicator';
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/router';
import NftSellCard from 'components/modules/cards/NftSellCard';
import { LINK_SCAN } from 'constants/envs';
import { get } from 'lodash';
import { ITxHashFlow } from '.';
import { roundNumber } from 'utils/func';
import { formatNumber } from 'utils/formatNumber';

const NEXT_PUBLIC_UMAD_ADDRESS = process.env.NEXT_PUBLIC_UMAD_ADDRESS!;

interface IModalFollowStepSell {
  open?: any;
  handleClose?: any;
  data?: any;
  id?: any;
  isUserRegisteredProxy?: boolean;
  isApproveUMAD?: boolean;
  isWaitingForSign?: boolean;
  textHeader?: any;
  isApproveCollection?: boolean;
  isNFT1155?: boolean;
  txHashFlow?: ITxHashFlow;
  assetDataDetail: any;
}

interface ICollapsed {
  [key: string]: boolean;
  initWallet: boolean;
  approve: boolean;
  confirm: boolean;
  listing: boolean;
}

const defaultCollapsed = {
  initWallet: true,
  approve: false,
  confirm: false,
  listing: false,
};

const ModalFollowStepSell = ({
  open,
  handleClose,
  data,
  id,
  isUserRegisteredProxy,
  isApproveUMAD,
  isWaitingForSign,
  isApproveCollection,
  isNFT1155,
  assetDataDetail,
  txHashFlow,
}: IModalFollowStepSell) => {
  const { account } = useWeb3React();
  const router = useRouter();
  const { tokenId, address } = router.query;
  const signRef = useRef<any>(null);
  const approveRef = useRef<any>(null);

  const isUMAD = data?.currency === PAYMENT_TOKEN.UMAD;

  const [collapsed, setCollapsed] = useState<ICollapsed>(defaultCollapsed);

  useEffect(() => {
    if (isWaitingForSign) {
      // no handle
    } else if (isApproveCollection) {
      setCollapsed({
        ...collapsed,
        listing: true,
      });
      setTimeout(() => {
        signRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else if (isApproveUMAD) {
      setCollapsed({
        ...collapsed,
        confirm: true,
      });
      setTimeout(() => {
        approveRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else if (isUserRegisteredProxy) {
      setCollapsed({
        ...collapsed,
        approve: true,
      });
    } else {
      setCollapsed({
        ...collapsed,
        initWallet: true,
      });
    }
    return () => setCollapsed(defaultCollapsed);
  }, [id, isUserRegisteredProxy, isApproveUMAD, isWaitingForSign, isApproveCollection]);

  const updateCollapsed = (key: string) => {
    setCollapsed({
      ...collapsed,
      [key]: !collapsed[key],
    });
  };
  return (
    <div>
      <ModalFollowStep
        open={open}
        handleClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        textHeader="Complete your listing"
        classCustom="max-h-[90vh]"
      >
        <div className="font-Chakra">
          <div className="pb-8">
            <NftSellCard
              collectionName={
                get(assetDataDetail, 'collection.title', '') ||
                get(assetDataDetail, 'collection.name', 'Unknown')
              }
              nftName={get(assetDataDetail, 'title', 'Unknown')}
              nftImage={assetDataDetail?.nftImagePreview || assetDataDetail?.nftUrl}
              nftUrl={assetDataDetail?.nftUrl || ''}
              quantity={data?.quantity || 1}
              isErc1155={!!isNFT1155}
              currency={data?.currency}
              price={data?.amount}
              collectionAddress={get(assetDataDetail, 'collection.address', '')}
            />
          </div>
          <div className="overflow-y-auto h-[45vh] mb-[10px]">
            <div className="flex p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected">
              <div className="pr-3 pl-1 w-10">
                {isUserRegisteredProxy ? (
                  <CheckIcon style={{ color: '#F4B1A3' }} />
                ) : (
                  <CircularProgressIndicator size={20} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-bold text-dark-on-surface">1. Initialize your wallet</div>
                  <div className="p-2">
                    <img
                      src="/icons/arrow-bottom.svg"
                      className={`relative bottom-1 text-primary-dark ml-3`}
                      onClick={() => updateCollapsed('initWallet')}
                      style={{
                        transform: !collapsed.initWallet ? 'none' : 'rotate(180deg)',
                      }}
                    />
                  </div>
                </div>
                {collapsed.initWallet && (
                  <div className="pr-2">
                    <div className="text-primary-gray text-sm mt-2">
                      To start selling for the first time on MADworld, you need to set up your wallet.
                      This requires gas fee once only.
                    </div>
                    {!isUserRegisteredProxy && (
                      <div className="text-xs text-secondary-gray mt-3 mb-3">
                        Waiting for setting up...
                      </div>
                    )}
                    {txHashFlow?.initWallet && (
                      <div className="mt-2">
                        <a href={`${LINK_SCAN}tx/${txHashFlow?.initWallet}`} target="_blank">
                          <OutlinedButton
                            customClass="!text-secondary-60 h-[40px] font-bold"
                            target="_blank"
                            fullWidth
                            text="View on Etherscan"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {isUMAD && (
              <div className="flex p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected">
                <div className="pr-3 pl-1 w-10">
                  {isUserRegisteredProxy ? (
                    isApproveUMAD ? (
                      <CheckIcon style={{ color: '#F4B1A3' }} />
                    ) : (
                      <CircularProgressIndicator size={20} />
                    )
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-bold text-dark-on-surface">
                      2. Approve {CURRENCY_SELECT.UMAD} token
                    </div>
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
                      <div className="text-primary-gray text-sm mt-2">
                        To start selling for the first time on MADworld, you need to allow a website
                        to use your UMAD.
                      </div>
                      {!isApproveUMAD && (
                        <div className="text-xs text-secondary-gray mt-3 mb-3">
                          Waiting for confirmation...
                        </div>
                      )}
                      {txHashFlow?.approveUMAD && (
                        <div className="mt-2">
                          <a href={`${LINK_SCAN}tx/${txHashFlow?.approveUMAD}`} target="_blank">
                            <OutlinedButton
                              customClass="!text-secondary-60 h-[40px] font-bold"
                              target="_blank"
                              fullWidth
                              text="View on Etherscan"
                            />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={approveRef} className="flex p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected">
              <div className='"pr-3 pl-1 w-10'>
                {data?.currency === CURRENCY_SELECT.UMAD ? (
                  <>
                    {isApproveUMAD ? (
                      isApproveCollection ? (
                        <CheckIcon style={{ color: '#F4B1A3' }} />
                      ) : (
                        <CircularProgressIndicator size={20} />
                      )
                    ) : null}
                  </>
                ) : (
                  <>
                    {isUserRegisteredProxy ? (
                      isApproveCollection ? (
                        <CheckIcon style={{ color: '#F4B1A3' }} />
                      ) : (
                        <CircularProgressIndicator size={20} />
                      )
                    ) : null}
                  </>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-bold text-dark-on-surface">
                    {isUMAD ? 3 : 2}. Approve this item for sale
                  </div>
                  <div className="p-2">
                    <img
                      src="/icons/arrow-bottom.svg"
                      className={`relative bottom-1 text-primary-dark ml-3`}
                      onClick={() => updateCollapsed('confirm')}
                      style={{
                        transform: !collapsed.confirm ? 'none' : 'rotate(180deg)',
                      }}
                    />
                  </div>
                </div>
                {collapsed.confirm && (
                  <div className="pr-2">
                    <div className="text-primary-gray text-sm mt-2">
                      To start listing for the first time on MADworld, you need to approve this item
                      for sale. This requires gas fee once only.
                    </div>
                    {
                      !isApproveCollection && (
                        <div className="text-xs text-secondary-gray mt-3 mb-3">
                          Waiting for confirmation...
                        </div>
                      )
                    }
                    {txHashFlow?.approveCollection && (
                      <div className="mt-2">
                        <a href={`${LINK_SCAN}tx/${txHashFlow?.approveCollection}`} target="_blank">
                          <OutlinedButton
                            customClass="!text-secondary-60 h-[40px] font-bold"
                            target="_blank"
                            fullWidth
                            text="View on Etherscan"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div ref={signRef} className="flex p-4 rounded-lg cursor-pointer bg-background-sell-step-popup-selected">
              <div className='"pr-3 pl-1 w-10'>
                {isApproveCollection ? (
                  isWaitingForSign ? (
                    <CheckIcon style={{ color: '#F4B1A3' }} />
                  ) : (
                    <CircularProgressIndicator size={20} />
                  )
                ) : null}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-bold text-dark-on-surface">
                    {isUMAD ? 4 : 3}. Confirm {formatNumber(data?.amount)} {data?.currency} listing
                  </div>
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
                      You'll be asked to review and confirm this listing from your wallet
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ModalFollowStep>
    </div>
  );
};

export default ModalFollowStepSell;
