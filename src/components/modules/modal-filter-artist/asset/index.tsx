import ModalFilterMobile from 'components/common/modal-filter-mobile';
import { DropdownSelectInputMobile } from 'components/common/select-type/DropdownSelectInput';
import SelectCheckOne from 'components/common/select-type/SelectCheckOne';
import _ from 'lodash';
import * as React from 'react';
import collectionService from 'service/collectionService';
import FilterIncludesSearch, { FilterIncludesSearchMobile } from '../../filter-includes-search';
import { IPriceRangeType } from 'components/templates/collection/asset';
import { NftSortOptions } from 'constants/dropdown';
import SelectCheckAll from 'components/common/select-type/SelectCheckAll';
import DropdownSelectInput, { DEFAULT_CURRENCY_PRICE_RANGE } from 'components/common/select-type/DropdownSelectInput';
import { useSelector } from 'react-redux';

interface ModalFilterArtistAsset {
  open: boolean;
  setOpen: any;
  filter: any;
}

const sortData = {
  text: 'Sort By',
  data: NftSortOptions,
};

const SaleData = {
  text: 'Sale Type',
  data: [
    { text: 'Not for sale', value: 'not_for_sale' },
    { text: 'Sales fixed price', value: 'fix_price' },
    { text: 'Auction', value: 'auction' },
  ],
};

const ModalFilterArtistAsset = ({ open, setOpen, filter }: ModalFilterArtistAsset) => {
  const [listsCollectionFilter, setListsCollectionFilter] = React.useState([]);
  const [keywordFilterCollection, setKeywordFilterCollection] = React.useState('');
  const {
    setSort,
    sort,
    setPriceRange,
    priceRange,
    setSaleType,
    saleType,
    setProperties,
    properties,
    options,
    onPushRouter,
    rootParams,
    handleResetMobileOptionProperty
  } = filter;
  const [salesSelf, setSalesSelf] = React.useState(saleType);
  const [propertiesSelf, setPropertiesSelf] = React.useState(properties);
  const [priceRangeSelf, setPriceRangesSelf] = React.useState(priceRange);
  const [sortSelf, setSortSelf] = React.useState(sort);

  const listPropertiesAfterApply = React.useRef<any>([]);
  const listPropertiesCurrent = React.useRef<any>([]);
  const [reset, setReset] = React.useState(false);


  React.useEffect(() => {
    if (document) {
      if (open) {
        document.querySelector('body')!.style.overflow = 'hidden';
        return () => {
          document.querySelector('body')!.style.overflow = '';
        };
      } else {
        document.querySelector('body')!.style.overflow = '';
      }
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const activeReset = React.useCallback(() => {
    if (
      salesSelf?.length > 0 ||
      propertiesSelf?.length > 0 ||
      priceRangeSelf.min || priceRangeSelf.max ||
      sortSelf?.value
    )
      return true;
    return false;
  }, [salesSelf.length > 0, propertiesSelf, priceRangeSelf, sortSelf]);

  /*   React.useEffect(() => {
  
      }, [salesSelf, propertiesSelf.length > 0, priceRangeSelf, sortSelf]) */

  const getListCollection = React.useCallback(async () => {
    const [result, error] = await collectionService.getCollectionAll({
      keyword: keywordFilterCollection,
    });
    if (error) return;
    setListsCollectionFilter(result.items);
  }, [keywordFilterCollection]);
  React.useEffect(() => {
    getListCollection();
  }, [keywordFilterCollection]);

  React.useEffect(() => {
    setSalesSelf(saleType);
    setSortSelf(sort);
    setPropertiesSelf(properties);
    setPriceRangesSelf(priceRange);
  }, [open]);

  const onChangeProperties = (data: any, dataOriginal: any) => {
    const properties: any = [];
    for (const property in dataOriginal) {
      dataOriginal[property].child.forEach((child: any) => {
        if (child.checked) {
          properties.push(child.value.id);
        }
      });
    }
    setPropertiesSelf(properties);
  };

  const handleApply = () => {
    /* setSaleType(salesSelf);
    setSort(sortSelf);
    setProperties(propertiesSelf);
    setPriceRange(priceRangeSelf); */
    listPropertiesAfterApply.current = JSON.parse(JSON.stringify(listPropertiesCurrent.current));
    rootParams.current.sortField = sortSelf?.value || '';
    rootParams.current.saleType = salesSelf || '';
    rootParams.current.startPrice = priceRangeSelf.min && Number(priceRangeSelf.min).toFixed(2);
    rootParams.current.endPrice = priceRangeSelf.max && Number(priceRangeSelf.max).toFixed(2);
    rootParams.current.priceType = priceRangeSelf.currency;
    rootParams.current.properties = propertiesSelf;

    onPushRouter(null);

    handleClose();
  };

  const handleReset = () => {
    setReset(true)
    handleResetMobileOptionProperty()
    setSalesSelf([]);
    setSortSelf(null);
    setPropertiesSelf(null);
    setPriceRangesSelf({
      min: '',
      max: '',
      currency: DEFAULT_CURRENCY_PRICE_RANGE,
    });
  };

  return (
    <>
      <ModalFilterMobile
        activeReset={activeReset}
        handleReset={handleReset}
        handleApply={handleApply}
        handleClose={handleClose}
        open={open}
      >
        <FilterIncludesSearchMobile
          title={'Properties'}
          options={options}
          reset={reset}
          setReset={setReset}
          onSelected={(value: any, value2) => onChangeProperties({ ...value }, { ...value2 })}
          listPropertiesAfterApply={listPropertiesAfterApply}
          listPropertiesCurrent={listPropertiesCurrent}
        />

        <SelectCheckOne
          data={sortData.data}
          setValueCheck={setSortSelf}
          text={sortData.text}
          valueCheck={sortSelf}
          mobile
        />
        <DropdownSelectInputMobile
          title="Price Range"
          priceRange={priceRangeSelf}
          setPriceRange={(price: IPriceRangeType) => setPriceRangesSelf(price)}
        />
        <SelectCheckAll
          data={SaleData.data}
          setValue={setSalesSelf}
          text={SaleData.text}
          value={salesSelf}
          isLast
          mobile
        />
      </ModalFilterMobile>
    </>
  );
};

export default ModalFilterArtistAsset;
