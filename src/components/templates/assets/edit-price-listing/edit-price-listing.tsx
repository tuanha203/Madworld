import { InputChip } from 'components/common/chips/InputChip';
import { EditSvg } from 'components/common/iconography/iconsComponentSVG';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ModalEditPrice from '../modal-edit-price/modal-edit-price';

const EditPriceListing = ({
  bestNftSale,
  nftSaleStatus,
  nftType,
  refreshData,
  floorPrice,
  isCollectionImport,
}: any) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { icon } = useSelector((state:any) => state.theme);
  return (
    <>
      <InputChip
        label={'Edit Price'}
        onClick={() => setOpenModal(true)}
        color={'dark onSurface'}
        icon={
          <EditSvg  className="text-red" color={icon?.color} />
        }
        className="h-[32px] mt-auto"
      />
      {openModal && (
        <ModalEditPrice
          open={openModal}
          handleClose={() => setOpenModal(false)}
          bestNftSale={bestNftSale}
          nftSaleStatus={nftSaleStatus}
          nftType={nftType}
          refreshData={refreshData}
          floorPrice={floorPrice}
          isCollectionImport={isCollectionImport}
        />
      )}
    </>
  );
};

export default EditPriceListing;
