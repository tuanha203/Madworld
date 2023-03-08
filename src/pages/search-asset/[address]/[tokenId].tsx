import { Box } from '@mui/material';
import ImageBase from 'components/common/ImageBase';
import ModalCommon from 'components/common/modal';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import CardCommon from 'components/modules/cards/CardCommon';
import ItemOverview from 'components/modules/stats-overview/ItemOverview';
import { AvatarOwned } from 'components/modules/thumbnail';
import { ChartActivities } from 'components/templates/assets/charts';
import DetailContract from 'components/templates/assets/detail-contract/DetailContract';
import ModalReport from 'components/templates/assets/modal-report';
import NftContent from 'components/templates/assets/nft-content/NftContent';
import PropertiesAsset from 'components/templates/assets/properties/PropertiesAsset';
import { ASSET_TYPE, TYPE_LIKES, WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import _, { get } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import assetService from 'service/assetService';
import searchCollectService from 'service/searchCollectionService';
import { toastError, toastSuccess } from 'store/actions/toast';
import { shortenNameNoti, shortenNameNotiHasAddress } from 'utils/func';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 2,
  },
};

var PAGE = 1;
const LIMIT = 6;
let CURSOR: string = '';

export default function SearchAsset() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tokenId, address } = router.query;
  const [assetDataDetail, setAssetDataDetail] = useState<any>({});
  const [properties, setProperties] = useState<any>([]);
  const [openReport, setOpenReport] = useState(false);
  const [showLess, setShowLess] = useState(true);
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const [collectionList, setCollectionList] = useState<Array<any>>([]);
  const [owner, setOwner] = useState<any>({});
  const [collectionInfo, setCollectionInfo] = useState<any>({});

  const { owner_of: ownerNft, externalLink, contract_type, metadata } = assetDataDetail as any;
  const { description } = properties as any;
  const isERC1155 = contract_type === ASSET_TYPE.ERC1155;
  const isERC721 = contract_type === ASSET_TYPE.ERC721;
  const idOwner = get(ownerNft, 'id', '');
  const addressOwner = get(ownerNft, 'walletAddress', '');
  const nameOwner = get(ownerNft, 'username', '');
  const ownerAvatar = get(ownerNft, 'avatarImg', '');
  const ownerVerify = get(ownerNft, 'isVerify', false);
  const windowMode = useDetectWindowMode();

  useEffect(() => {
    if (address && tokenId) {
      getAssetDetail();
      initDataColection();
      getCollection();
    }
  }, [address, tokenId]);

  useEffect(() => {
    if (tokenId && address) {
      setCollectionList([]);
    }
  }, [tokenId, address]);

  async function initDataColection(type?: string) {
    PAGE = 1;
    let params: any = {
      address,
      limit: LIMIT,
      page: PAGE,
    };
    await fetchNft(params, false);
  }

  async function fetchNft(params: any, more?: boolean, type?: string) {
    try {
      if (more && !CURSOR) return;
      const [response, error] = await assetService.queryDataMoreCollection(params);
      if (error) {
        return [];
      }
      const data = (await _.get(response, 'result')) || [];
      CURSOR = (await _.get(response, 'cursor')) || '';
      const ix = _.findIndex(data, (x: any) => x.token_id === tokenId?.toString());
      if (ix !== -1) {
        data.splice(ix, 1);
      }
      if (more) {
        const list = [...collectionList, ...data];
        setCollectionList(list);
      } else {
        setCollectionList(data);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  //get detail nft
  const getAssetDetail = useCallback(async () => {
    const [assetData, error] = await assetService.queryDataAssetDetail({
      address: address as string,
      tokenId: tokenId as string,
    });
    if (error) {
      if (get(error, 'response.status') === 404) {
        /*  router.push('/404'); */
      }
      return [null, error];
    }
    setAssetDataDetail(assetData);
    if (assetData.metadata) {
      let data = _.isString(assetData.metadata)
        ? JSON.parse(assetData.metadata)
        : assetData.metadata;
      if (data?.attributes?.length > 0) {
        data.attributes = data?.attributes.map((x: any) => {
          return {
            name: x?.trait_type,
            rarity: x?.value,
          };
        });
      }
      setProperties(data);
    } else {
      fetch(assetData.token_uri)
        .then((res) => res.json())
        .then((data) => {
          if (data?.attributes?.length > 0) {
            data.attributes = data?.attributes.map((x: any) => {
              return {
                name: x?.trait_type,
                rarity: x?.value,
              };
            });
          }
          setProperties(data);
        });
    }
    return [assetData, null];
  }, [address, walletAddress, tokenId]);

  // get properties

  async function handleLoadMore(e: number) {
    if (e === collectionList.length - 4) {
      PAGE += 1;
      let params: any = {
        address,
        limit: LIMIT,
        page: PAGE,
        cursor: CURSOR,
      };
      await fetchNft(params, true);
    }
  }

  const handleReportNft = async (reasonValue: string, originalCollection?: number) => {
    const [responseData, error] = await assetService.reportNft({
      nftId: assetDataDetail.id,
      reason: reasonValue,
      originalCollectionId: originalCollection,
    });
    if (error) return;
    setOpenReport(false);
    dispatch(toastSuccess('This item has been reported'));
  };

  async function getCollection() {
    const [response, error] = await searchCollectService.getCollection(address);
    if (error) return dispatch(toastError('Something went wrong'));
    const data = _.get(response, 'data', {});

    const accountInfo: any = {};
    for (const key in response?.accountInfo) {
      if (response?.accountInfo[key]) accountInfo[key] = response?.accountInfo[key];
    }

    setOwner(accountInfo);
    setCollectionInfo(data);
  }

  const Overview = ({ sticky }: any) => (
    <div className={` ${sticky ? 'absolute flex right-0 top-0 m-0' : 'my-10'}`}>
      <ItemOverview
        nftId={assetDataDetail?.id}
        isLike={assetDataDetail?.liked}
        likes={assetDataDetail?.likes}
        pricePercent={assetDataDetail?.pricePercent}
        getAssetDetail={getAssetDetail}
        setOpenReport={setOpenReport}
        views={assetDataDetail?.viewNumber}
        sticky={sticky}
        disableReport
      />
    </div>
  );

  const Title = ({ isERC1155, quantity }: { isERC1155: any; quantity: any }) => {
    return (
      <ContentTooltip title={properties?.name || 'Unknown'} arrow>
        <div>
          <p className="w-[300px] truncate">{properties?.name || 'Unknown'}</p>
          {isERC1155 ? (
            <div className="text-sm color-white opacity-60">{quantity} available</div>
          ) : null}
        </div>
      </ContentTooltip>
    );
  };

  const AvtOwned = useCallback(() => {
    return (
      <div>
        <AvatarOwned
          position="Owned"
          link={isERC721 && idOwner ? `/artist/${addressOwner}` : null}
          artist={shortenNameNotiHasAddress(nameOwner || addressOwner, 9)}
          customTooltip={nameOwner || addressOwner}
          srcAvatar={isERC721 ? ownerAvatar : null}
          verified={ownerVerify}
          ownerAsset
        />
      </div>
    );
  }, [addressOwner, ownerAvatar]);

  const AvtCollection = useCallback(() => {
    return (
      <AvatarOwned
        link={`/search-collection/${address}`}
        artist={shortenNameNotiHasAddress(collectionInfo?.name, 9)}
        customTooltip={collectionInfo?.name}
        srcAvatar={collectionInfo?.image || undefined}
        position="Collection"
        artistClassName={'w-[100px]'}
      />
    );
  }, [collectionInfo, address]);

  const Description = () => (
    <>
      <div className="text--headline-xsmall mt-10 flex">
        <div className="mr-2">Description</div>
        {externalLink && (
          <Link href={externalLink} passHref>
            <a target="_blank" className="my-auto">
              <ContentTooltip arrow title={`View external link to learn more`}>
                <div className="my-auto cursor-pointer">
                  <img src="/icons/icon-hypelink.svg" alt="" />
                </div>
              </ContentTooltip>
            </a>
          </Link>
        )}
      </div>
      <div className="mt-2 " style={{ wordWrap: 'break-word' }}>
        <p className="whitespace-pre-wrap leading-[22px]">
          {showLess ? description && shortenNameNoti(description, 200) : description}
        </p>
        {description && description.length > 200 && (
          <div
            onClick={() => setShowLess(!showLess)}
            className="text-primary-90 mt-2 cursor-pointer"
          >
            {!showLess ? 'Show less' : 'Show more'}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="main-asset">
      <div className="bg-background-asset-detail">
        <div className="xl:mt-[20px] mb-[60px] mx-auto xl:flex gap-10 layout">
          <div className="xl:nft-left xl:w-1/2">
            <div className="image-nft flex justify-center">
              <NftContent
                nftUrl={metadata?.animation_url || metadata?.image || ''}
                nftImagePreview={metadata?.image || ''}
              />
              <div className="xl:hidden flex">
                <Overview sticky={true} />
              </div>
            </div>
            {[WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode) && (
              <div className="px-[16px] xl:px-[unset] mt-[24px]">
                <div className="flex text--headline-small justify-between">
                  <Title isERC1155={isERC1155} quantity={assetDataDetail?.amount} />
                </div>
                <div className="lg:hidden flex justify-between mt-5">
                  {!owner.id ? (
                    <AvatarOwned position="creator" artist={owner?.walletAddress} />
                  ) : (
                    <AvatarOwned
                      position="creator"
                      artist={owner?.username}
                      customTooltip={owner?.username}
                      srcAvatar={owner?.avatarImg}
                      verified={owner?.isVerify}
                      link={`/artist/${owner?.walletAddress}`}
                    />
                  )}
                  <div>
                    <AvtCollection />
                  </div>
                </div>
                <div className="lg:hidden flex mt-[36px] justify-between">
                  <AvtOwned />
                </div>
                <Overview />
                <Description />
              </div>
            )}
            {[WINDOW_MODE.XL, WINDOW_MODE['2XL']].includes(windowMode) && (
              <>
                <div className="flex mt-[36px] justify-between">
                  {!owner.id ? (
                    <AvatarOwned position="creator" artist={owner?.walletAddress} />
                  ) : (
                    <AvatarOwned
                      position="creator"
                      artist={owner?.username}
                      customTooltip={owner?.username}
                      srcAvatar={owner?.avatarImg}
                      verified={owner?.isVerify}
                      link={`/artist/${owner?.walletAddress}`}
                    />
                  )}
                </div>
              </>
            )}
            {[WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode) && (
              <ChartActivities
                assetDataDetail={{}}
                getAssetDetail={{}}
                refeshData={() => {}}
                nfts={[]}
                isSearchAsset
              />
            )}
            <div className="px-[16px] xl:px-[unset]">
              <DetailContract
                tokenId={assetDataDetail?.token_id}
                collection={{
                  address: assetDataDetail?.token_address,
                  type: assetDataDetail?.contract_type,
                }}
              />
              {properties?.attributes?.length > 0 && (
                <PropertiesAsset normal properties={properties?.attributes} />
              )}
            </div>
          </div>
          <div className="xl:nft-right xl:w-1/2 px-[16px] xl:px-[unset]">
            {[WINDOW_MODE.XL, WINDOW_MODE['2XL']].includes(windowMode) && (
              <>
                <div className="flex text--headline-small justify-between">
                  <Title isERC1155={isERC1155} quantity={assetDataDetail?.amount} />
                </div>
                <div className="flex justify-between mt-5">
                  <AvtOwned />
                  <div>
                    <AvtCollection />
                  </div>
                </div>
              </>
            )}

            {[WINDOW_MODE.XL, WINDOW_MODE['2XL']].includes(windowMode) && (
              <>
                <Description />
                <Overview />
                <ChartActivities
                  assetDataDetail={{}}
                  getAssetDetail={{}}
                  nfts={[]}
                  refeshData={() => {}}
                  isSearchAsset
                />
              </>
            )}
          </div>
        </div>

        <ModalCommon
          title="Report This Item"
          open={openReport}
          handleClose={() => setOpenReport(false)}
          wrapperClassName={'overflow-visible'}
          isCloseIcon={false}
        >
          <ModalReport
            handleClose={() => setOpenReport(false)}
            reportNft={(reasonValue, originalCollection) =>
              handleReportNft(reasonValue, originalCollection)
            }
          />
        </ModalCommon>
      </div>
      <Box className="collection-view xl:bg-[#252d3a] xl:py-[64px] px-[30px] pt-0 xl:pt-[30px] xl:px-[156px] w-[100%] min-h-[100%] py-[30px] bg-[red]">
        <div className="layout mx-auto">
          <label className="asset-title text-[24px] lg:text-[45px]">
            More from this collection
          </label>
          <Box className="carousel-wrape">
            {collectionList.length === 0 ? (
              <Box className="no-data">
                <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
                <label>No other item in this collection yet</label>
              </Box>
            ) : (
              <div className="carousel-wrape__carousel">
                <Carousel
                  responsive={responsive}
                  sliderClass="carousel-wrape--view"
                  itemClass="carousel-item"
                  autoPlay={false}
                  autoPlaySpeed={1000 * 1000}
                  slidesToSlide={1}
                  beforeChange={handleLoadMore}
                  className="grid grid-cols-4 gap-6 p-0 m-0"
                >
                  {collectionList.map((NFTItem: any, index: number) => {
                    let data = {
                      title: NFTItem?.metadata?.name,
                      nftImagePreview: NFTItem?.metadata?.image,
                      id: NFTItem?.token_id,
                      collection: {
                        address: NFTItem?.token_address,
                        name: NFTItem?.name,
                        type: NFTItem?.contract_type,
                      },
                    } as any;
                    if (NFTItem?.ownerNft && NFTItem?.ownerNft?.length > 0) {
                      data.owners = [
                        {
                          walletAddress: NFTItem?.ownerNft[0].owner_of,
                        },
                      ];
                    }
                    const dateNow = Math.floor(Date.now() / 1000);
                    return (
                      <div className="carousel-card-wrapper">
                        <CardCommon
                          key={NFTItem.id}
                          dateNow={dateNow}
                          dataNFT={{ ...data }}
                          type={TYPE_LIKES.NFT}
                          hidenRefresh
                          hidenLike
                          hidenBtn
                          linkRedirect={`/search-asset/${NFTItem?.token_address}/${NFTItem?.token_id}`}
                          callbackFetchList={() => initDataColection()}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              </div>
            )}
          </Box>
        </div>
      </Box>
    </div>
  );
}
