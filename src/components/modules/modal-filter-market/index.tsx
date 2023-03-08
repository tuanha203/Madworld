import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import { FilledButton } from 'components/common';
import SelectCheckAll from 'components/common/select-type/SelectCheckAll';
import SelectCollectionFilter from '../select-collection-filter';
import collectionService from 'service/collectionService';
import { Divider } from '@mui/material';
import SelectCheckOne from 'components/common/select-type/SelectCheckOne';
import ModalFilterMobile from 'components/common/modal-filter-mobile';
import { NftSortOptions } from 'constants/dropdown';
import orderBy from 'lodash/orderBy';

interface ModalFilterMarket {
  open: boolean;
  setOpen: any;
  filter: any;
  onPushRouter: any;
  rootParams: any;
}

const sortData = {
  text: 'Sort By',
  data: NftSortOptions,
};

const statusData = {
  text: 'Sale Type',
  data: [
    { text: 'Not for sale', value: 'not_for_sale' },
    { text: 'Sales fixed price ', value: 'fix_price' },
    { text: 'Auction', value: 'auction' },
  ],
};

const collectionData = {
  text: 'Collections',
  data: [
    { text: 'Status 1', value: '1' },
    { text: 'Status 2', value: '2' },
    { text: 'Status 3', value: '3' },
  ],
};
const SaleData = {
  text: 'Currency',
  data: [
    { text: 'ETH', value: 'ETH' },
    { text: 'WETH', value: 'WETH' },
    { text: 'UMAD', value: 'UMAD' },
  ],
};

const ModalFilterMarket = ({
  open,
  setOpen,
  filter,
  onPushRouter,
  rootParams,
}: ModalFilterMarket) => {
  const [listsCollectionFilter, setListsCollectionFilter] = React.useState([]);
  const [keywordFilterCollection, setKeywordFilterCollection] = React.useState('');
  const { sales, status, collections, sort } = filter;
  const [salesSelf, setSalesSelf] = React.useState(sales);
  const [statusSelf, setStatusSelf] = React.useState(status);
  const [collectionsSelf, setCollectionsSelf] = React.useState(collections);
  const [sortSelf, setSortSelf] = React.useState(sort);
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
    setSalesSelf(sales);
    setStatusSelf(status);
    setCollectionsSelf(collections);
    setSortSelf(sort);
  }, [open]);

  const handleApply = () => {
    rootParams.current.sortField = sortSelf?.value;
    rootParams.current.priceType = salesSelf || '';
    rootParams.current.collectionIds = collectionsSelf;
    rootParams.current.saleType = statusSelf || '';
    onPushRouter();
    handleClose();
  };

  const activeReset = React.useCallback(() => {
    if (
      salesSelf?.length > 0  ||
      collectionsSelf?.length > 0 ||
      statusSelf?.length > 0  ||
      sortSelf?.value
    )
      return true;
    return false;
  }, [salesSelf, collectionsSelf, statusSelf, sortSelf]);

  const handleReset = () => {
    setSalesSelf([]);
    setSortSelf(null);
    setCollectionsSelf([]);
    setStatusSelf([])
  };

  return (
    <>
      <ModalFilterMobile activeReset={activeReset} handleReset={handleReset} handleApply={handleApply} handleClose={handleClose} open={open}>
        <SelectCheckOne
          data={sortData.data}
          setValueCheck={setSortSelf}
          text={sortData.text}
          valueCheck={sortSelf}
          mobile
        />
        <SelectCheckAll
          data={statusData.data}
          setValue={setStatusSelf}
          text={statusData.text}
          value={statusSelf}
          mobile
        />
        <SelectCollectionFilter
          data={orderBy(listsCollectionFilter, (item: any) => item?.name?.toLowerCase(), ['asc'])}
          setValue={setCollectionsSelf}
          text={collectionData.text}
          value={collectionsSelf}
          setKeywordFilterCollection={setKeywordFilterCollection}
          keywordFilterCollection={keywordFilterCollection}
          mobile
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

export default ModalFilterMarket;
