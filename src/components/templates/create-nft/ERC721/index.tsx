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
  nftType,
  getCollectionOfOwner,
}) => {
  const { values, setFieldValue } = formik;
  
  return (
    <>
      {stepCreate === CREATE_ASSET_TYPE.ASSET_DETAIL && (
        <AssetDetail
          collectionOfOwner={collectionOfOwner}
          formik={formik}
          categories={categories}
          handleUpdateCategories={handleUpdateCategories}
          nftType={nftType}
          getCollectionOfOwner={getCollectionOfOwner}
        />
      )}
      {stepCreate === CREATE_ASSET_TYPE.ADVANCED_DETAIL && <AdvancedDetail formik={formik} />}
      {stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL && (
        <PriceDetail formik={formik} collectionSelected={values.collectionSelected} />
      )}
    </>
  );
};

export default FormCreate;
