import React, { useEffect, useRef, useState } from 'react';
import { FilledButton, OutlinedButton } from 'components/common';

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
import { ITxHashFlow } from 'components/templates/assets/sell-asset-dialog';
import { formatNumber } from 'utils/formatNumber';
import NftItem from './NftItem';

const NEXT_PUBLIC_UMAD_ADDRESS = process.env.NEXT_PUBLIC_UMAD_ADDRESS!;

interface IModalFollowStepAuction {
  open?: any;
  handleClose?: any;
  data?: any;
  id?: any;
  isUserRegisteredProxy?: boolean;
  isApproveUMAD?: boolean;
  isWaitingForSign?: boolean;
  textHeader?: any;
  assetDataDetail: any;
  txHashFlow: ITxHashFlow;
  isUploadIPFS: boolean;
}
const defaultCollapsed = {
  uploadIpfs: true,
  initWallet: false,
  approve: false,
  confirm: false,
  listing: false,
};
interface ICollapsed {
  [key: string]: boolean;
  initWallet: boolean;
  approve: boolean;
  confirm: boolean;
  listing: boolean;
  uploadIpfs: boolean;
}

const ModalSellEnglishAuction = ({
  open,
  handleClose,
  data,
  id,
  isUserRegisteredProxy,
  isApproveUMAD,
  isWaitingForSign,
  assetDataDetail,
  txHashFlow,
  isUploadIPFS,
}: IModalFollowStepAuction) => {
  const router = useRouter();
  const isUMAD = data?.startingEngAuctionCurrency === PAYMENT_TOKEN.UMAD;
  const [collapsed, setCollapsed] = useState<ICollapsed>(defaultCollapsed);
  const signRef = useRef<any>(null);
  const approveRef = useRef<any>(null);

  useEffect(() => {
    if (isWaitingForSign) {
      // no handle
    } else if (isApproveUMAD) {
      setCollapsed({ ...collapsed, listing: true });
      setTimeout(() => {
        signRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else if (isUserRegisteredProxy) {
      setCollapsed({ ...collapsed, approve: true });
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
  }, [id, isUserRegisteredProxy, isApproveUMAD, isWaitingForSign, isUploadIPFS]);

  const updateCollapsed = (key: string) => {
    setCollapsed({
      ...collapsed,
      [key]: !collapsed[key],
    });
  };
  
  return (
    <div className="flex flex-col	">
      <ModalFollowStep
        open={open}
        handleClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        textHeader="Complete your creating"
        classCustom="max-h-[85vh] lg:!w-[562px] lg:!px-[64px] pg:py-8 w-[90%] py-6"
      >
        <div className="font-Chakra">
          <div className="pb-8">
            <NftItem
              collectionName={get(assetDataDetail, 'collectionSelected.title', 'Unknown')}
              nftName={get(assetDataDetail, 'title', 'Unknown').trim()}
              nftImage={assetDataDetail.nftImagePreview}
              nftUrl={
                assetDataDetail?.nftAudio?.name ||
                assetDataDetail?.nftVideo?.name ||
                assetDataDetail?.nftModel?.name ||
                ''
              }
              quantity={data?.quantity || 1}
              isErc1155={false}
              currency={data?.startingEngAuctionCurrency}
              price={data?.startingPriceEngAuction}
              collectionAddress={get(assetDataDetail, 'collectionAddress', '')}
            />
          </div>
          <div className="overflow-y-auto max-h-[50vh] mb-[10px]">
            <div className="flex p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected p-5">
              <div className='"pr-3 pl-1 w-10'>
                {isUploadIPFS ? (
                  <CheckIcon style={{ color: '#F4B1A3' }} />
                ) : (
                  <CircularProgressIndicator size={20} />
                )}
              </div>
              <div className="flex-1 text-dark-on-surface">
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
            <div className="flex p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected p-5">
              <div className='"pr-3 pl-1 w-10'>
                {isUploadIPFS ? (
                  isUserRegisteredProxy ? (
                    <CheckIcon style={{ color: '#F4B1A3' }} />
                  ) : (
                    <CircularProgressIndicator size={20} />
                  )
                ) : null}
              </div>
              <div className="flex-1 text-dark-on-surface">
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
                            customClass="!text-secondary-60 w-[321px] h-[40px] font-bold"
                            target="_blank"
                            text="View on Etherscan"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              ref={approveRef}
              className="flex p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected"
            >
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
                    3. Approve {data?.startingEngAuctionCurrency} token
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
                      To start selling for the first time on MADworld, you need to allow a website to
                      use your {data?.startingEngAuctionCurrency}.
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
                            customClass="!text-secondary-60 w-[321px] h-[40px] font-bold"
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

            <div
              ref={signRef}
              className="flex p-4 rounded-lg mb-4 cursor-pointer bg-background-sell-step-popup-selected"
            >
              <div className='"pr-3 pl-1 w-10'>
                {isApproveUMAD ? (
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
                    4. Confirm {formatNumber(data?.startingPriceEngAuction)} {data?.startingEngAuctionCurrency}{' '}
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
                        You'll be asked to review and confirm this listing from your wallet.
                      </div>
                    </div>
                    <div className="text-xs text-secondary-gray mt-3 mb-3">
                      Waiting for confirmation...
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="lg:text-sm text-xs lg:px-0 px-3">
              Please wait for creating NFT. This will take a while. Please don't reload the current page.
            </div>
          </div>
        </div>
      </ModalFollowStep>
    </div>
  );
};

export default ModalSellEnglishAuction;
