import { FilledButton } from 'components/common';
import { WarningSvg } from 'components/common/iconography/iconsComponentSVG';
import get from 'lodash/get';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { modalActions, MODAL_TYPE } from 'store/constants/modal';
import { IModalState } from 'store/reducers/modal';
import { IUserInitState } from 'store/reducers/user';
import SellAssetDialog from '../sell-asset-dialog';

interface IEditAndSellAssetProps {
  assetDataDetail: any;
  collection: any;
  getAssetDetail: any;
  showModalSuccess: any;
  bestNftSale?: any;
  isLoadingButtonSell: boolean;
  handleToggleDialogSell: () => void;
  isERC721?: boolean;
}

const EditAndSellAsset: FC<IEditAndSellAssetProps> = (props) => {
  const { assetDataDetail, collection, getAssetDetail, showModalSuccess, bestNftSale, isLoadingButtonSell, handleToggleDialogSell, isERC721 } = props;
  const dispatch = useDispatch();
  const storedWalletAddress = useSelector(
    (state: { user: IUserInitState }) => state.user.data.walletAddress,
  );
  const userProfile = useSelector((state: { user: IUserInitState }) => state.user.profile);
  const { button, icon } = useSelector((state:any) => state.theme);
  const toggleModalSellAsset = useSelector(
    (state: { modal: IModalState }) => state.modal.toggleModalSellAsset,
  );

  useEffect(() => {
    return () => {
      handleToggleModal(false)
    }
  }, [])

  const isUserFillFullInfo =
    get(userProfile, 'artist.email') && get(userProfile, 'artist.username');

  const handleToggleModal = (status: boolean) => {
    dispatch({
      type: modalActions.MODAL_TOGGLE_MODAL,
      payload: {
        type: MODAL_TYPE.SELL_ASSET,
        status,
      },
    });
  };

  return (
    <>
      <div className="bg-background-variant-dark py-4 xl:px-0 px-3 flex my-auto">
        <div className="layout mx-auto w-full xl:flex xl:items-center">
          <div className="flex">
            <FilledButton
              text="Sell"
              disabled={!isUserFillFullInfo}
              onClick={handleToggleDialogSell}
              loading={isLoadingButtonSell}
              style={button?.default}
            />
          </div>
          {!isUserFillFullInfo  && (
            <div className="flex my-auto xl:my-0 xl:ml-10 xl:mt-0 mt-3">
              <div className="mr-2">
                <WarningSvg color={icon?.color}/>
              </div>
              <div>
                Profile needs to be validated before being able to sell.
                <Link 
                  href={{
                    pathname: `/artist/${storedWalletAddress}`,
                    query: { edit: true },
                  }}
                  passHref
                >
                  <span className="text-primary-60 cursor-pointer"> Complete your profile</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <SellAssetDialog
        open={toggleModalSellAsset as boolean}
        onClose={() => handleToggleModal(false)}
        nftType={collection?.type}
        id={assetDataDetail?.id}
        assetDataDetail={assetDataDetail}
        getAssetDetail={getAssetDetail}
        showModalSuccess={showModalSuccess}
        bestNftSale={bestNftSale}
        isERC721={isERC721}
      />
    </>
  );
};

export default EditAndSellAsset;
