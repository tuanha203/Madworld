import { Box } from '@mui/material';
import { FilledButton } from 'components/common';
import { EmojiFinger } from 'components/common/Emojies';
import ImageBase from 'components/common/ImageBase';
import CardCommon from 'components/modules/cards/CardCommon';
import Filter from 'components/modules/filter/Filter';
import { LoadingListBase } from 'components/modules/Loading';
import Galleries from 'components/modules/mad-galleries/Galleries';
import FullWidthTabs from 'components/modules/tab';
import { TYPE_LIKES } from 'constants/app';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import categoryService from 'service/categoryService';
import homePageService from 'service/homePageService';
import nftService from 'service/nftService';
import { STORAGE_KEYS } from 'utils/storage';

const paramaterQuery = {
  limit: 8,
  page: 1,
  hotTimeFilter: 'ALLTIME',
  trendingType: 'ARTIST',
};

const tabDefault = { id: 1111111, name: 'artist' };

const MadGalleries = () => {
  const [dataGalleries, setDataGalleries] = useState([]);
  const [tabList, setTabList] = useState<any>([]);
  const [nftList, setNftList] = useState<Array<any>>([]);
  const [lazyLoad, setLazyLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [listCategories, setListCategories] = useState<any>([]);
  const [tabIndexSelleced, setTabIndexSelleced] = useState<number>(0);
  const param = useRef<any>({ limit: 8 });

  const router = useRouter();

  const getData = async () => {
    try {
      const [data, error] = (await homePageService.getListItemHot(paramaterQuery)) as any;
      if (!error) setDataGalleries(data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const [textBtn, setTextBtn] = useState({
    label: 'View Artist Leaderboard',
    value: 'artist',
  });

  const handleChangeTab = (index: number) => {
    setTabIndexSelleced(index);
    if (index !== 0) {
      const cat: any = listCategories[index - 1];
      param.current.categoryId = cat.id;
      onGetNft({ limit: 8, categoryId: cat.id });
    }
  };

  const handleClickTab = (event: any) => {
    const label = event.target.textContent[0].toUpperCase() + event.target.textContent.substring(1);
    setTextBtn({
      label: `View ${label}`,
      value: event.target.textContent,
    });
  };

  async function onGetNft(params: any) {
    const walletAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS) as any;
    param.current.walletAddress = walletAddress;
    const newParram = { walletAddress, ...params };
    const [result, error] = (await nftService.getListNFT(newParram)) as any;
    if (!error) setNftList(result.items);
    setLazyLoad(false);
  }

  useEffect(() => {
    async function onGetCategoryList() {
      const [result] = (await categoryService.get({ isDisplay: 1 })) as any;
      const categoriesSorted = result?.categories.sort((a: any, b: any) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      const tabs: any = formatValueTabs(categoriesSorted);
      if (result) {
        setListCategories(categoriesSorted);
        setTabList(['Artist', ...tabs]);
      }
    }
    getData();
    onGetCategoryList();
  }, []);

  const formatValueTabs = (data: Array<any>) => {
    if (!data || data.length === 0) return [];
    return data.map((e: any) => {
      return e.name;
    });
  };

  return (
    <div className="bg-[#2D2D39] pt-[30px] pb-[60px] px-3 xl:px-0">
      <div className="flex flex-col layout mx-auto">
        <Filter period={false} group={false} headline="MAD Galleries" icon={<EmojiFinger />} />
        <div className="flex flex-row items-center my-4 justify-center w-full">
          <FullWidthTabs
            className="max-w-full"
            tabs={tabList}
            activeTab={0}
            onClick={handleClickTab}
            onCallBack={handleChangeTab}
            numberCharTitle={17}
          />
        </div>
        {tabIndexSelleced === 0 ? (
          <Galleries data={dataGalleries.slice(0, 8)} />
        ) : (
          <>
            {lazyLoad ? (
              <LoadingListBase loading={true} items={8} />
            ) : (
              <>
                <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 m-auto mx-0 mb-2 lg:mt-10 sm:mt-0">
                  {nftList?.length > 0 &&
                    nftList.map((NFTItem: any, index: number) => {
                      const dateNow = Math.floor(Date.now() / 1000);
                      return (
                        <div>
                          <CardCommon
                            key={NFTItem.id}
                            dateNow={dateNow}
                            dataNFT={{ ...NFTItem }}
                            type={TYPE_LIKES.NFT}
                            callbackFetchList={() => onGetNft(param.current)}
                          />
                        </div>
                      );
                    })}
                </div>
                {!loading && nftList?.length === 0 && (
                  <Box className="no-data">
                    <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
                    <label>No results</label>
                  </Box>
                )}
              </>
            )}
          </>
        )}
        {tabIndexSelleced !== 0 && nftList?.length > 0 && (
          <FilledButton
            text="View All"
            customClass="!text--label-large mt-7 lg:w-[120px] sm:w-fit xl:ml-0 ml-auto"
            onClick={() =>
              router.push({
                pathname: `/marketplace`,
                query: param.current,
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default MadGalleries;
