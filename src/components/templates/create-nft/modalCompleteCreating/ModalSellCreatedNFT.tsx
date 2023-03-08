import React, { useEffect, useRef, useState } from 'react';
import CustomModal from 'components/common/modal';
import { FilledButton, OutlinedButton } from 'components/common';
import { useWeb3React } from '@web3-react/core';
import { checkUserHasProxy, isUserApprovedERC20, signPutDataOnSale } from 'blockchain/utils';
import saleNftService from 'service/saleNftService';
import { ASSET_TYPE, CURRENCY_SELECT, PAYMENT_TOKEN } from 'constants/app';
import { NFT_SALE_TYPES, NFT_SALE_ACTIONS } from 'constants/index';
import ModalFollowStep from 'components/common/modal-follow-step';
import CircularProgressIndicator from 'components/common/progress-indicator';
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/router';
import NftSellCard from 'components/modules/cards/NftSellCard';
import { LINK_SCAN } from 'constants/envs';
import { get } from 'lodash';
import { addCommaToNumber } from 'utils/currencyFormat';
import NftItem from './NftItem';
import { formatNumber } from 'utils/formatNumber';

const NEXT_PUBLIC_UMAD_ADDRESS = process.env.NEXT_PUBLIC_UMAD_ADDRESS!;

interface IModalFollowStepSell {
  open?: any;
  handleClose?: any;
  data: any;
  id?: any;
  isUserRegisteredProxy?: boolean;
  isApproveUMAD?: boolean;
  isWaitingForSign?: boolean;
  textHeader?: any;
  isApproveCollection?: boolean;
  isNFT1155?: boolean;
  txHashFlow?: any;
  isUploadIPFS: boolean;
  values: any;
}

interface ICollapsed {
  [key: string]: boolean;
  uploadIpfs: boolean;
  initWallet: boolean;
  approve: boolean;
  confirm: boolean;
  listing: boolean;
}

const defaultCollapsed = {
  uploadIpfs: true,
  initWallet: false,
  approve: false,
  confirm: false,
  listing: false,
};

const ModalSellCreatedNFT = ({
  open,
  handleClose,
  data,
  id,
  isUploadIPFS,
  isUserRegisteredProxy,
  isApproveUMAD,
  isWaitingForSign,
  isApproveCollection,
  isNFT1155,
  values,
  txHashFlow,
}: IModalFollowStepSell) => {
  const router = useRouter();
  const { tokenId, address } = router.query;
  const isUMAD = data?.currency === PAYMENT_TOKEN.UMAD;
  const signRef = useRef<any>(null);
  const approveRef = useRef<any>(null);

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
    } else if (isUserRegisteredProxy) {
      setCollapsed({
        ...collapsed,
        approve: true,
      });
      setTimeout(() => {
        approveRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else if (isUploadIPFS) {
      setCollapsed({
        ...collapsed,
        initWallet: true,
      });
    }
    return () => setCollapsed(defaultCollapsed);
  }, [
    id,
    isUploadIPFS,
    isUserRegisteredProxy,
    isApproveUMAD,
    isWaitingForSign,
    isApproveCollection,
  ]);

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
        textHeader="Complete your creating"
        classCustom="max-h-[85vh]"
        footerText=" Please wait for creating NFT. This will take a while. Please don't reload the current page."
      >
        <div className="font-Chakra">
          <div className="pb-8">
            <NftItem
              collectionName={get(values, 'collectionSelected.title', 'Unknown')}
              nftName={get(values, 'title', 'Unknown')}
              nftImage={values?.nftImagePreview}
              nftUrl={
                values?.nftAudio?.name || values?.nftVideo?.name || values?.nftModel?.name || ''
              }
              quantity={data?.quantity || 1}
              isErc1155={!!isNFT1155}
              currency={data?.currency}
              price={data?.amount}
              collectionAddress={get(values, 'collectionAddress', '')}
              supply={get(values, 'supply', '')}
            />
          </div>
          <div className="overflow-y-auto h-[45vh] mb-[10px]">
            <div className="flex p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected p-5">
              <div className='"pr-3 pl-1 w-10'>
                {isUploadIPFS ? (
                  <CheckIcon style={{ color: '#F4B1A3' }} />
                ) : (
                  <CircularProgressIndicator size={20} />
                )}
              </div>
              <div className="flex-1 text-dark-on-surface pt-1">
                <div className="flex justify-between">
                  <div className="font-bold">1. Uploading to IPFS</div>
                  <div className="p-2">
                    <img
                      src="/icons/arrow-bottom.svg"
                      className={`relative bottom-1 text-primary-dark ml-3`}
                      onClick={() => updateCollapsed('uploadIpfs')}
                      style={{
                        transform: !collapsed.uploadIpfs ? 'none' : 'rotate(180deg)',
                      }}
                    />
                  </div>
                </div>
                {collapsed.uploadIpfs && (
                  <div className="pr-2">
                    <div className="text-primary-gray lg:text-sm text-xs mt-2">
                      Uploading of all media assets and metadata to IPFS.
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected">
              <div className='"pr-3 pl-1 w-10'>
                {isUploadIPFS ? (
                  isUserRegisteredProxy ? (
                    <CheckIcon style={{ color: '#F4B1A3' }} />
                  ) : (
                    <CircularProgressIndicator size={20} />
                  )
                ) : null}
              </div>
              <div className="flex-1 text-dark-on-surface pt-1">
                <div className="flex justify-between">
                  <div className="font-bold">2. Initialize your wallet</div>
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
                    <div className="text-primary-gray lg:text-sm text-xs mt-2">
                      To start selling for the first time on MADworld, you need to set up your wallet.
                      This requires gas fee once only.
                    </div>
                    {
                      !isUserRegisteredProxy && (
                        <div className="text-xs text-secondary-gray mt-3 mb-3">
                          Waiting for setting up...
                        </div>
                      )
                    }
                    {txHashFlow?.initWallet && (
                      <div className="mt-2">
                        <a href={`${LINK_SCAN}tx/${txHashFlow?.initWallet}`} target="_blank">
                          <OutlinedButton
                            customClass="!text-secondary-60 w-full h-[40px] font-bold"
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
              <div ref={approveRef} className="flex  p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected">
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
                    <div className="font-bold text-dark-on-surface pt-1">
                      3. Approve {CURRENCY_SELECT.UMAD} token
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
                      <div className="text-primary-gray lg:text-sm text-xs mt-2">
                        To start selling for the first time on MADworld, you need to allow a website
                        to use your UMAD.
                      </div>
                      {
                        !isApproveUMAD && (
                          <div className="text-xs text-secondary-gray mt-3 mb-3">
                            Waiting for confirmation...
                          </div>
                        )
                      }
                      {txHashFlow?.approveUMAD && (
                        <div className="mt-2">
                          <a href={`${LINK_SCAN}tx/${txHashFlow?.approveUMAD}`} target="_blank">
                            <OutlinedButton
                              customClass="!text-secondary-60 w-full h-[40px] font-bold"
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

            <div ref={signRef} className="flex  p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected">
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
                  <div className="font-bold text-dark-on-surface pt-1">
                    {isUMAD ? 4 : 3}. Confirm {formatNumber(data?.amount)} {data?.currency}{' '}
                    listing
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
                  <>
                    <div className="pr-2">
                      <div className="text-primary-gray lg:text-sm text-xs mt-2">
                        You'll be asked to review and confirm this listing from your wallet
                      </div>
                    </div>
                    <div className="text-xs text-secondary-gray mt-3 mb-3">
                      Waiting for confirmation...
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </ModalFollowStep>
    </div>
  );
};

export default ModalSellCreatedNFT;
