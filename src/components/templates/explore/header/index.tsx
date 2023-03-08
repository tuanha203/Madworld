import { Button } from '@mui/material';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import 'react-multi-carousel/lib/styles.css';
import categoryService from 'service/categoryService';

interface ITabValue {
  id?: string;
  name: any;
}

interface IExploreHeader {
  onChangeTab: (value: ITabValue) => void;
  activeValue: any;
}

export const DefaultSelectedTab = { name: 'Explore', id: 'undefined' };

const ExploreHeader = ({ onChangeTab, activeValue }: IExploreHeader) => {
  const [exploreTab, setExploreTab] = useState<any>({});
  const [exploreTabList, setExploreTabList] = useState<Array<ITabValue>>([]);
  useEffect(() => {
    async function onGetCategoryList() {
      const [result] = await categoryService.get({ isDisplay: 1 });
      if (result)
        setExploreTabList(
          [
            { name: 'Explore', id: 'null' },
            ...result?.categories.sort((a: any, b: any) => {
              return a?.name.toLowerCase().localeCompare(b?.name.toLowerCase());
            }),
          ] || [],
        );
    }
    onGetCategoryList();
  }, []);
  const handleSetTab = (value: any) => {
    setExploreTab(value);
    onChangeTab(value);
  };

  useEffect(() => {
    if (activeValue !== undefined) checkTab;
  }, [activeValue, exploreTabList]);

  const checkTab = useMemo(() => {
    if (exploreTabList.length > 0) {
      const check = exploreTabList.find((x: any) => x.id === _.toNumber(activeValue));
      if (check) {
        setExploreTab(check);
      } else {
        setExploreTab({ ...DefaultSelectedTab, id: 'null' });
      }
    }
  }, [activeValue, exploreTabList]);

  return (
    <div className="h-full w-full flex col-start-2 col-end-3">
      {exploreTabList.map((item: any, index: number) => {
        const active =
          _.toString(item.id) === _.toString(exploreTab.id)
            ? 'bg-primary-dark hover:bg-primary-dark font-bold text-white font-Chakra normal-case'
            : 'bg-background-dark-600 hover:bg-background-dark-500 font-bold text-archive-Neutral-Variant90 font-Chakra normal-case';
        return (
          <Button
            key={index}
            variant="contained"
            className={`${active} mx-[10px] w-[125px] min-w-[96px]`}
            onClick={() => handleSetTab(item)}
          >
            <OverflowTooltip title={item?.name} placement="bottom">
              <a className="truncate">{item?.name}</a>
            </OverflowTooltip>
          </Button>
        );
      })}
    </div>
  );
};
export default ExploreHeader;
