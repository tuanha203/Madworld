import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconLocal from 'components/common/iconography/IconLocal';
import SelectCheckAll from 'components/common/select-type/SelectCheckAll';
import SelectCollectionFilter from 'components/modules/select-collection-filter';
import orderBy from 'lodash/orderBy';
import * as React from 'react';
import collectionService from 'service/collectionService';

interface DrawerExploreProp {
  reset?: boolean;
  filter: any;
  openDrawer: boolean;
  setOpenDrawer: (value: boolean) => void;
}

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

const DrawerExplore = ({ reset, filter, openDrawer, setOpenDrawer }: DrawerExploreProp) => {
  const [listsCollectionFilter, setListsCollectionFilter] = React.useState([]);
  const [keywordFilterCollection, setKeywordFilterCollection] = React.useState('');

  const { sales, status, setSales, setStatus, collections, setCollections } = filter;

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
    if (reset) setKeywordFilterCollection('');
  }, [reset]);
  const getNameCollection = (item: any) => {
    const name =  item?.title || item?.name;
    return name?.toLowerCase();
  }
  return (
    <div
      className={`overflow-hidden min-h-[80vh] h-auto bg-background-700 relative ease-in-out duration-500 ${
        openDrawer ? 'w-[285px]' : 'w-[56px]'
      }`}
    >
      <div
        className={` ${
          openDrawer ? 'left-0' : '-left-[500px]'
        }  relative  ease-in-out duration-500`}
      >
        <div className="flex ml-4 pr-4 pt-5 pb-2 border-solid border-b border-neutral-600">
          <IconLocal src="/icons/filter.svg" custom="w-5 h-5 " />
          <span className="w-full pl-6 text-sm font-bold">FILTER</span>
        </div>
        <div className="pl-[1rem] max-h-[65vh] overflow-x-hidden overflow-y-auto scroll-hidden">
          <SelectCheckAll
            data={statusData.data}
            setValue={setStatus}
            text={statusData.text}
            value={status}
          />
          <SelectCollectionFilter
            data={orderBy(listsCollectionFilter, (item: any) => getNameCollection(item), ['asc'])}
            setValue={setCollections}
            text={collectionData.text}
            value={collections}
            setKeywordFilterCollection={setKeywordFilterCollection}
            keywordFilterCollection={keywordFilterCollection}
          />
          <SelectCheckAll
            data={SaleData.data}
            setValue={setSales}
            text={SaleData.text}
            value={sales}
            isLast
          />
        </div>
      </div>
      <div className={`absolute top-0 right-0 h-14 w-14  cursor-pointer z-10`}>
        <div
          className="w-14 h-14 flex flex-col justify-center items-center"
          onClick={() => setOpenDrawer(!openDrawer)}
        >
          {openDrawer ? (
            <ArrowBackIcon className="text-secondary-60" />
          ) : (
            <ArrowForwardIcon className="text-secondary-60" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerExplore;
