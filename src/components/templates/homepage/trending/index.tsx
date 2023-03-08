import React, { useCallback, useEffect, useState } from 'react';
import Filter from 'components/modules/filter/Filter';
import ArtistFollowCard from 'components/modules/cards/ArtistFollowCard';
import { EmojiFire } from 'components/common/Emojies';
import homePageService from 'service/homePageService';
const data = [
  {
    id: 1,
    name: 'collection 1',
    price: '20',
    time: '10:20AM',
    img: '',
  },
  {
    id: 2,
    name: 'collection 2',
    price: '10',
    time: '10:20AM',
    img: '',
  },
  {
    id: 3,
    name: 'collection 3',
    price: '10',
    time: '10:20AM',
    img: '',
  },
];

const FIRSTVALUE = {
  DATE: "TODAY",
  CATE: "COLLECTION"
}


const TrendingComponent = () => {
  const [listTrending, setListTrending] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState<string>(FIRSTVALUE.CATE);

  const handleChangeCate = (event: any) => {
    setCategoryFilter(event);
  };

  const getListItemTrending = useCallback(async () => {
    const paramaterQuery = {
      limit: 12, page: 1, trendingType: categoryFilter
    }
    const [data, error] = await homePageService.getListItemTrending(paramaterQuery)
    if (error) {
      console.log(error)
      return alert("error")
    }
    setListTrending(data.items)
  }, [categoryFilter])

  useEffect(() => {
    getListItemTrending()
  }, [categoryFilter])

  return (
    <div className="bg-[#2D2D39] pt-[30px] pb-[60px]">
      <div className="flex flex-col layout mx-auto">
        <Filter
          period={false}
          headline="Trending"
          categoryCallback={handleChangeCate}
          icon={<EmojiFire />}
        />

        <div className="mt-3 no-scrollbar md:flex md:flex-row md:justify-between sm:grid sm:gap-4 sm:auto-cols-[90%] sm:grid-flow-col sm:overflow-x-auto sm:scroll-snap-mandatory sm:scroll-snap-always">
          {listTrending.map((item: any, index: number) => (
            <ArtistFollowCard key={index} artistName={item.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingComponent;
