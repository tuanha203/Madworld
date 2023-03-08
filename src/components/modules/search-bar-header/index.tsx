import { Box, Input, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import axios from 'axios';
import ImageBase from 'components/common/ImageBase';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import { SERVER_API_ENDPOINT } from 'constants/envs';
import { get } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import collectionService from 'service/collectionService';
import { abbreviateNumber } from 'utils/func';
import { useOnClickOutside } from 'utils/hook';
import { convertUrlImage } from 'utils/image';
import Web3 from 'web3';
import { ClosingIcon } from '../../common/iconography/IconBundle';
import { Avatar } from '../thumbnail';
import SearchIcon from '@mui/icons-material/Search';

const imgSearch = '/icons/zoom-active.svg';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
interface ISearchBarHeaderProps {
  handleCloseSearchResult?: () => void;
}
export default function SearchBarHeader({ handleCloseSearchResult }: ISearchBarHeaderProps) {
  const router = useRouter();
  const ref: any = useRef();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState('');
  const [isCollectionNotImport, setIsCollectionNotImport] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<any>();
  const { input, icon } = useSelector((state:any) => state.theme);
  let timer: any = null;

  const fetchData = async () => {
    const newSearchValue = searchValue?.trim();
    const params = {
      limit: 3,
      page: 1,
      query: newSearchValue,
    };
    try {
      setIsLoading(true);
      const response: any = await axios.get(`${SERVER_API_ENDPOINT}/search`, { params });
      const collections = get(response, 'data.collections.items', []);
      if (collections.length === 0) {
        // if collection not in our market
        const isAddress = Web3.utils.isAddress(newSearchValue);
        if (isAddress) {
          const [collectionResponse, error] = await collectionService.getCollectionInfo(
            newSearchValue,
          );
          setIsLoading(false);
          if (collectionResponse && collectionResponse.data) {
            const bannerUrl = get(collectionResponse, 'data.banner_image_url', '');
            const thumbnailUrl = get(collectionResponse, 'data.image', '');
            const newCollections = [
              {
                address: newSearchValue,
                bannerUrl,
                thumbnailUrl,
                title: collectionResponse.data?.name,
                name: collectionResponse.data?.name,
              },
            ];
            const newOptions = { ...response.data, collections: { items: newCollections } };
            setIsCollectionNotImport(true);
            setOptions(newOptions);
          } else {
            setIsCollectionNotImport(false);
            setOptions(response.data);
          }
        } else {
          setIsLoading(false);
          setIsCollectionNotImport(false);
          setOptions(response.data);
        }
      } else {
        setIsLoading(false);
        setIsCollectionNotImport(false);
        setOptions(response.data);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useOnClickOutside(ref, () => {
    setOpen(false);
  });

  useEffect(() => {
    timer = setTimeout(() => fetchData(), 500);
    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  const handleChange = (data: any) => {
    setOpen(true);
    setSearchValue(data);
  };

  const clearInput = () => {
    setSearchValue('');
  };
  const handleClickOption = () => {
    setOpen(false);
    clearInput();
    handleCloseSearchResult && handleCloseSearchResult();
    // handleCloseSearchResult();
  };
  return (
    <div ref={ref} className="min-w-[310px] font-Chakra relative">
        <Input
          style={{...input?.text, ...input?.background}}
          value={searchValue}
          onChange={() => {
            handleChange((event as any)?.target.value);
          }}
          onFocus={() => {
            searchValue && setOpen(true);
          }}
          sx={{
            'input': {
              "&::placeholder": input?.placeholder
            }
          }}
          className="!w-full font-Chakra py-[7px] xl:py-0 bg-[#555C69] border-[#555C69] border rounded text-[#CED4E1] after:hidden before:hidden"
          placeholder="Search Items, Artist or Collection"
          // sx={{
          //   backgroundColor: '#555C69',
          //   border: '1px solid #585858',
          //   borderRadius: '4px',
          //   color: '#CED4E1',
          //   '&::after, &::before': {
          //     display: 'none',
          //   },
          //   '& .MuiInputLabel-root': {},
          // }}
          endAdornment={
            <>
              {searchValue ? (
                <div onClick={() => setSearchValue('')} className="mx-3 cursor-pointer">
                  <ClosingIcon />
                </div>
              ) : null}
            </>
          }
          startAdornment={
            <SearchIcon style={icon} className=" w-4 h-4 mx-4 text-primary-60" />
          }
        />
      {options && open && (
        <div
          id="search-options"
          className="!w-full absolute text-white bg-background-variant-dark z-[1000] rounded max-h-[50vh] overflow-y-scroll"
        >
          {isLoading ? (
            <div className="p-3">Loading..</div>
          ) : (
            <List>
              <ListItem className="border-b border-solid border-slate-500">
                <ListItemText primary="Collections" />
              </ListItem>
              {options?.collections?.items.map((item: any) => (
                <ListItem className="border-b border-solid border-slate-500 hover:bg-background-dark-600">
                  <Link
                    href={`/${isCollectionNotImport ? 'search-collection' : 'collection'}/${item?.address
                      }`}
                    className="cursor-pointer"
                  >
                    <a onClick={handleClickOption} className="flex w-full">
                      <div className="flex items-center w-[70%] mr-[10px]">
                        <ListItemAvatar className="mr-[5px] min-w-fit">
                          <ImageBase
                            className="rounded-full w-[24px] h-[24px] object-cover"
                            type="HtmlImage"
                            errorImg="Avatar"
                            url={item.thumbnailUrl}
                          />
                        </ListItemAvatar>
                        <div className="w-[-webkit-fill-available] w-[100%]">
                          <OverflowTooltip
                            title={item?.title || item?.name}
                            className="leading-[20px]"
                          >
                            <a>{item?.title || item?.name}</a>
                          </OverflowTooltip>
                        </div>
                      </div>
                      {item?.amountAsset && (
                        <div className="text-xs flex items-center ml-[auto] shrink-0">
                          {abbreviateNumber(item?.amountAsset)} item
                          {Number(item?.amountAsset) > 1 ? 's' : ''}
                        </div>
                      )}
                    </a>
                  </Link>
                </ListItem>
              ))}
              <ListItem className="border-b border-solid border-slate-500">
                <ListItemText primary="Artists" />
              </ListItem>
              {options?.accounts?.items.map((item: any) => (
                <ListItem className="border-b border-solid border-slate-500 hover:bg-background-dark-600">
                  <Link href={`/artist/${item?.walletAddress}`} className="cursor-pointer">
                    <a onClick={handleClickOption} className="flex w-full items-center">
                      <ListItemAvatar className="mr-[5px] min-w-fit">
                        <ImageBase
                          className="rounded-full w-[24px] h-[24px] object-cover"
                          type="HtmlImage"
                          errorImg="Avatar"
                          url={item.avatarImg}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={item.username} />
                    </a>
                  </Link>
                </ListItem>
              ))}
              <ListItem className="border-b border-solid border-slate-500">
                <ListItemText primary="Items" />
              </ListItem>
              {options?.nfts?.items.map((item: any) => (
                <ListItem className="border-b border-solid border-slate-500 hover:bg-background-dark-600">
                  <Link
                    href={`/asset/${item?.collection?.address}/${item?.tokenId}`}
                    className="cursor-pointer"
                  >
                    <a onClick={handleClickOption} className="flex w-full items-center">
                      <ListItemAvatar className="mr-[5px] min-w-fit">
                        <ImageBase
                          className="rounded-full w-[24px] h-[24px] object-cover"
                          type="HtmlImage"
                          url={item.nftImagePreview}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={item.title} />
                    </a>
                  </Link>
                </ListItem>
              ))}
            </List>
          )}
        </div>
      )}
    </div>
  );
}
