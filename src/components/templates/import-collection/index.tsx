import { Button, Menu, MenuItem } from '@mui/material';
import { TonalButton } from 'components/common';
import ImageBase from 'components/common/ImageBase';
import { TextFieldFilledCustom } from 'components/modules/textField';
import socket from 'configsocket';
import { EventSocket } from 'constants/text';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch } from 'react-redux';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import collectionService from 'service/collectionService';
import { toastError, toastSuccess } from 'store/actions/toast';
import { toastMsgActons } from 'store/constants/toastMsg';
import Web3 from 'web3';
import { IconShare } from '../../common/iconography/IconBundle';
enum StatusImportCollection {
  COLLECTION_EXITING = 'COLLECTION_EXITING',
  ADD_QUEUE_SUCCESS = 'ADD_QUEUE_SUCCESS',
}
const ImportCollection = (props: any) => {
  const { isImport } = props;
  const router = useRouter();

  const dispatch = useDispatch();
  const [dataCollection, setDataCollection] = useState<any>({});
  const [valueAddress, setValueAddress] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shareEl, setShareEl] = useState(null);
  const isShareOpen = Boolean(shareEl);
  const onChangeValueAddress = (e: any) => {
    setValueAddress(e.target.value.trim());
    if (!e.target.value) {
      setErrorText('');
    }
  };

  const getCollectionDetail = async (address: string) => {
    const [response, error] = await collectionService.getCollectionDetail({
      address: address,
    });
    if (error) {
      dispatch(toastError('Something went wrong when get data of collection' + address));
      return;
    }
    const data = _.get(response, 'data', {});
    setDataCollection(data);
  };

  const importCollection = async () => {
    setIsLoading(true);
    isImport(true);
    const [response, error] = await collectionService.importCollection(valueAddress);
    if (response) {
      if (response.data.status === StatusImportCollection.COLLECTION_EXITING) {
        const address = Web3.utils.toChecksumAddress(valueAddress);
        await getCollectionDetail(address);
        setErrorText('');
        setIsLoading(false);
        isImport(false);
        return;
      }
      await new Promise((resolve) => {
        socket.on(EventSocket.IMPORT_COLLECTION_SUCCESS, (res) => {
          resolve(true);
        });
      });
      await getCollectionDetail(valueAddress);
      setErrorText('');
      setIsLoading(false);
      isImport(false);
    }
    if (error) {
      if (error.message === 'Address invalid!' || error.code === 404) {
        setErrorText('Invalid address!');
      } else if (error.message === 'Collection have no nft') {
        setErrorText(
          "We couldn't find this contract. Please ensure that this is a valid ERC721 or ERC1155 contract deployed on Ethereum and that you have already minted items on the contract.",
        );
      }
      setIsLoading(false);
      isImport(false);
    }
  };

  let shareLink = '';
  if (typeof window !== 'undefined') {
    shareLink =
      window?.location?.href.replace(router.pathname, `/collection/${valueAddress}`) || '';
  }
  const shareOpen = (event: any) => {
    setShareEl(event.currentTarget);
  };
  const shareClose = () => {
    setShareEl(null);
  };

  const clickCopy = () => {
    setShareEl(null);
    dispatch(toastSuccess('Link copied!'));
    setTimeout(() => {
      dispatch({ type: toastMsgActons.CLOSE });
    }, 3000);
  };

  return (
    <div className="flex flex-col max-w-[670px] text-center m-auto text-white justify-center items-center h-full w-full p-4">
      <div className="text--headline-small text-[28px] xl:text--display-medium mb-3">
        Import Collection
      </div>
      {_.isEmpty(dataCollection) ? (
        <>
          <div className="text--body-large">
            Import an existing collection address on Ethereum of your ERC 721 and ERC 1155 to start
            trading on MADmarketplace
          </div>
          <div className="w-full max-w-[500px]">
            <TextFieldFilledCustom
              scheme="dark mt-8"
              disabled={isLoading}
              onChange={onChangeValueAddress}
              value={valueAddress}
              disableUnderline
              className="font-Chakra w-full"
              placeholder="e.g 0x6581...."
              error={!!errorText}
              helperText={errorText}
            />
            <TonalButton
              onClick={() => importCollection()}
              loading={isLoading}
              disabled={!valueAddress || isLoading}
              text="Start Import"
              customClass={`text--label-large mt-4 xl:w-fit w-full`}
              isActive={true}
            />
          </div>
        </>
      ) : (
        <>
          <div className="text--body-large">
            Your collection <span className="text-primary-60">{dataCollection.name}</span> has been
            imported successfully.
          </div>
          <div className="w-full max-w-[500px]">
            <div className="flex flex-col items-center justify-end lg:ml-auto">
              <div className="">
                <ImageBase
                  className="w-[200px] h-[200px] object-cover rounded-xl overflow-hidden mt-8"
                  type="HtmlImage"
                  url={dataCollection.thumbnailUrl}
                  errorImg="Default"
                />
              </div>
              <div className="flex items-center mt-2">
                <Button
                  id="basic-button"
                  aria-controls={isShareOpen ? 'basic-option-share' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isShareOpen ? 'true' : undefined}
                  onClick={shareOpen}
                  className="min-w-0 p-0 lg:ml-auto"
                >
                  <IconShare />
                </Button>
                <span onClick={shareOpen} className="cursor-pointer text--body-large">
                  Share
                </span>
              </div>
              <Menu
                className="stat-share"
                id="basic-option-share"
                anchorEl={shareEl}
                open={isShareOpen}
                onClose={shareClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <CopyToClipboard text={shareLink as string} onCopy={clickCopy}>
                  <MenuItem className="flex items-center item-share">
                    <img className="w-[30px] mr-[13px]" src="/social/copy-link-icon.svg" alt="" />
                    Copy Link
                  </MenuItem>
                </CopyToClipboard>
                <div>
                  <FacebookShareButton url={shareLink} className="w-[100%]">
                    <MenuItem className="flex items-center item-share" onClick={shareClose}>
                      <img className="w-[30px] mr-[13px]" src="/social/facebook-icon.svg" alt="" />
                      Share on Facebook
                    </MenuItem>
                  </FacebookShareButton>
                </div>
                <div>
                  <TwitterShareButton url={shareLink} className="w-[100%]">
                    <MenuItem
                      className="flex items-center item-share stat-share--bottom"
                      onClick={shareClose}
                    >
                      <img className="w-[30px] mr-[13px]" src="/social/twitter-icon.svg" alt="" />
                      Share to Twitter
                    </MenuItem>
                  </TwitterShareButton>
                </div>
              </Menu>
            </div>
            <Link passHref href={`/collection/${dataCollection.address}`}>
              <TonalButton text="View Collection" customClass={`text--label-large mt-4 mx-auto`} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ImportCollection;
