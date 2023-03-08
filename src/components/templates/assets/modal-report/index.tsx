import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Input, ListItem, Menu, MenuItem } from '@mui/material';
import { OutlinedButton } from 'components/common';
import { Avatar } from 'components/modules';
import { reasonReportNft } from 'constants/selects';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import collectionService from 'service/collectionService';
import { useOnClickOutside } from 'utils/hook';

const data = [
  { text: 'Fake collection or possible scam', value: 'fake_collection_or_possible_scam' },
  { text: 'Explicit and sensitive content', value: 'explicit_and_sensitive_content' },
  { text: 'Spam', value: 'spam' },
  { text: 'Might be stolen', value: 'might_be_stolen' },
];

interface ModalReportProp {
  handleClose: () => void;
  reportNft: (reasonValue: string, originalCollection?: number) => void;
}

interface ISelectCollection {
  id: number;
  name: string;
  thumbnailUrl: string;
}

interface Collection {
  [key: string]: any;

  id: string;
  name: string;
}

const ModalReport = ({ handleClose, reportNft }: ModalReportProp) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showListCollection, setShowListCollection] = useState<boolean>(false);
  const [reasonValue, setReasonValue] = useState('');
  const [originalCollection, setOriginalCollection] = useState<ISelectCollection | null>(null);
  const [listsCollection, setListsCollection] = useState<ISelectCollection[]>([]);
  const [listsCollectionFilter, setListsCollectionFilter] = useState<ISelectCollection[]>([]);
  const { walletAddress } = useSelector((state: any) => ({
    walletAddress: state.user.data.walletAddress,
  }));
  const [searchValue, setSearchValue] = React.useState('');
  const ref: any = useRef();
  const handleReasonClose = () => {
    setAnchorEl(null);
  };
  const handleOriginalCollection = () => {
    setShowListCollection(false);
  };

  const handleChange = (e: any) => {
    setShowListCollection(true);
    setSearchValue(e.target.value);
    const result = listsCollection
      .filter((item: ISelectCollection) => item.name && item.name.toUpperCase().includes(e.target.value.toUpperCase()))
      .map((item: ISelectCollection) => {
        return {
          ...item,
          highlightTextName: item.name.replaceAll(new RegExp(e.target.value, "ig"), (str: any) => `<span class="font-bold">${str}</span>`)
        }
      });
    setListsCollectionFilter(result);
  };

  useOnClickOutside(ref, () => {
    setShowListCollection(false);
  });

  useEffect(() => {
    getListCollection();
  }, []);

  const handleClearOriginalCollectionSelected = () => {
    setOriginalCollection(null);
  };

  const report = (reasonValue: string, originalCollection: ISelectCollection | null) => {
    if (originalCollection) {
      reportNft(reasonValue, originalCollection.id);
      return;
    }

    reportNft(reasonValue);
  };

  const getListCollection = async () => {
    const [result, error] = await collectionService.getCollectionAll({
      keyword: '',
    });
    if (error) return;
    setListsCollection(result.items);
  };
  return (
    <div className="w-[95%] xl:w-[400px]">
      <span className="block mt-10 font-bold">I think this item is...</span>
      <Button
        className="mt-3 h-14 w-full bg-[#444B56] cursor-pointer rounded-t-md px-4 flex justify-between items-center normal-case hover:bg-[#444B56] text-[#CED4E1] text-base"
        onClick={(event: any) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <span className="font-Chakra font-normal text-[#FFFFFF]">
          {' '}
          {reasonValue ? data.find((item) => item.value === reasonValue)?.text : 'Select a reason'}
        </span>
        <ArrowDropDownIcon className="text-primary-60" />
      </Button>
      <Menu sx={{
        "& > .MuiPaper-root, & .MuiList-root": {
          backgroundColor: "#646B7A !important"
        },
        "& > .MuiPaper-root": {
          width: "400px"
        }
      }} className="stat-report-nft" anchorEl={anchorEl} open={open} onClose={handleReasonClose}>
        {data.map((item, index) => {
          return (
            <MenuItem
              key={index}
              sx={{
                "&:hover": {
                  backgroundColor: "#7340D3 !important"
                },
                marginX: "0px !important"
              }}
              onClick={() => {
                setReasonValue(item.value);
                handleReasonClose();
              }}
            >
              {item.text}
            </MenuItem>
          );
        })}
      </Menu>

      {reasonValue === reasonReportNft.FAKE_COLLECTION_OR_POSSIBLE_SPAM && (
        <>
          <span className="block mt-5 mb-3">Original collection</span>
          {originalCollection ? (
            <div className="mt-3 h-14 w-full bg-[#444B56] cursor-pointer rounded-t-md px-4 flex justify-between items-center normal-case hover:bg-[#444B56] text-white">
              <div className="flex w-11/12">
                <Avatar size={'28'} src={originalCollection.thumbnailUrl} rounded={true} />
                <p className="truncate max-w-[70%] ml-3 leading-[28px]">{originalCollection.name}</p>
              </div>
              <div onClick={() => handleClearOriginalCollectionSelected()}>
                <CloseIcon className="text-primary-60" />
              </div>
            </div>
          ) : (
            <Input
              sx={{
                '&:after, &:before': {
                  display: 'none',
                },
                input: {
                  fontFamily: 'Chakra Petch',
                  cursor: 'auto',
                },
              }}
              value={searchValue}
              onChange={handleChange}
              className="mt-3 h-14 w-full bg-[#444B56] cursor-pointer rounded-t-md px-4 flex justify-between items-center normal-case hover:bg-[#444B56] text-white"
              placeholder="Search a collection"
            />
          )}
          {showListCollection && (
            <div className="absolute bg-[#646B7A] z-10 overflow-auto max-h-60 top-[290px] rounded-lg" ref={ref}>
              {
                listsCollectionFilter?.length === 0 ? <ListItem
                  className="w-[400px] cursor-pointer py-[10px] hover:bg-primary-dark"
                >
                  <p
                    className="truncate max-w-[70%] ml-3"
                  >No Results</p>
                </ListItem> :
                  listsCollectionFilter.map((item: any, index) => (
                    <ListItem
                      key={index}
                      className="w-[400px] cursor-pointer py-[10px] hover:bg-primary-dark"
                      onClick={() => {
                        setOriginalCollection(item);
                        handleOriginalCollection();
                      }}
                    >
                      <Avatar size={'28'} src={item.thumbnailUrl} rounded={true} />
                      <p
                        className="truncate max-w-[70%] ml-3"
                        dangerouslySetInnerHTML={{ __html: `${item.highlightTextName}` }}
                      ></p>
                    </ListItem>
                  ))}
            </div>
          )}
        </>
      )}
      <div className="flex justify-between mt-14 ">
        <OutlinedButton
          text="Cancel"
          dark={true}
          customClass="!text--label-large w-[150px]"
          onClick={() => handleClose()}
        />
        <Button
          sx={{
            '&.Mui-disabled': {
              color: '#EBE0E1',
              backgroundColor: 'rgba(227, 227, 227, 0.12)',
            },
          }}
          className="w-[150px] bg-[#7340D3] hover:bg-[#7340D3] normal-case text-white font-Chakra font-bold rounded-[999px]"
          onClick={() => report(reasonValue, originalCollection)}
          disabled={
            (!originalCollection &&
              reasonValue === reasonReportNft.FAKE_COLLECTION_OR_POSSIBLE_SPAM) ||
            !reasonValue || !walletAddress
          }
        >
          Report
        </Button>
      </div>
    </div>
  );
};
export default ModalReport;
