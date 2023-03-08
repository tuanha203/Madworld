import { CREATE_ASSET_TYPE } from 'constants/app';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';
import AssetDetail from '../forms/AssetDetail';
import PriceDetail from './PriceDetail';
import AdvancedDetail from '../forms/AdvancedDetail';

const FormCreate: FC<any> = ({
  formik,
  stepCreate,
  categories = [],
  collectionOfOwner = [],
  handleUpdateCategories,
  getCollectionOfOwner,
  nftType,
}) => {
  const { values, setFieldValue } = formik;
  const [collectionSelected, setCollectionSelected] = useState<any>({});

  useEffect(() => {
    const collectionSelected = collectionOfOwner.filter(
      (collection: any) => collection.address === values?.collectionAddress,
    );
    setFieldValue('collectionSelected', collectionSelected[0]);
  }, [values?.collectionAddress]);
  
  return (
    <>
      {stepCreate === CREATE_ASSET_TYPE.ASSET_DETAIL && (
        <AssetDetail
          collectionOfOwner={collectionOfOwner}
          formik={formik}
          categories={categories}
          handleUpdateCategories={handleUpdateCategories}
          getCollectionOfOwner={getCollectionOfOwner}
          nftType={nftType}
        />
      )}
      {stepCreate === CREATE_ASSET_TYPE.ADVANCED_DETAIL && <AdvancedDetail formik={formik} />}
      {stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL && (
        <PriceDetail formik={formik} collectionSelected={collectionSelected} />
      )}
    </>
  );
};

export default FormCreate;
