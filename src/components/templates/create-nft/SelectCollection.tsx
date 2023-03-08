import { FormControl, FormHelperText, MenuItem, MenuList, Select } from '@mui/material';
import ImageBase from 'components/common/ImageBase';
import { get } from 'lodash';
import { FC, useState } from 'react';
import DialogCreateCollection from '../collection/asset/create-collection';

const SelectCollection: FC<any> = ({
  values,
  errors,
  collectionOfOwner,
  getFieldProps,
  nftType,
  touched,
  getCollectionOfOwner,
  setFieldValue,
}) => {
  const [toggleCreateCollection, setToggleCreateCollection] = useState<boolean>(false);
  const [isOpenDropdownSelectCollection, setOpenDropdownSelectCollection] =
    useState<boolean>(false);

  const handleSelectCollection = (address: string) => {
    setOpenDropdownSelectCollection(false);
    setFieldValue('collectionAddress', address);
  };

  const Placeholder = ({ children }: any) => {
    return <div className="font-normal text-base text-[#ffffff99]	">{children}</div>;
  };

  const renderNameCollectionSelected = (collection: any) => {
    return get(collection, '[0].title', '') || get(collection, '[0].name', '');
  };
  return (
    <div>
      <FormControl
        className={`text-field text-field-filled select-field dark`}
        fullWidth
        variant="filled"
      >
        <Select
          onOpen={() => setOpenDropdownSelectCollection(true)}
          onClose={() => setOpenDropdownSelectCollection(false)}
          open={isOpenDropdownSelectCollection}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          type="text"
          autoComplete="off"
          className="flex text-light-on-primary font-Chakra"
          sx={{
            '&::after, &::before': {
              display: 'none',
            },
            svg: {
              color: '#F4B1A3 !important',
              WebkitTextFillColor: '#F4B1A3 !important',
            },
            '.MuiFilledInput-input': {
              padding: '16px',
              backgroundColor: '#3E3F4D',
              borderRadius: '4px 4px 0px 0px',
            },
          }}
          displayEmpty
          value={values.collectionAddress}
          error={touched.collectionAddress && Boolean(errors?.collectionAddress)}
          renderValue={(value) => {
            const collection = collectionOfOwner.filter(
              (collection: any) => collection.address === value,
            );
            return value !== '' ? (
              renderNameCollectionSelected(collection)
            ) : (
              <Placeholder>Add to collection</Placeholder>
            );
          }}
          {...getFieldProps('collectionAddress')}
        >
          <div className="lg:px-6 lg:pt-7 px-4 pt-6 ">
            <h6 className="text-base text-secondary-60 font-bold">Create New Collection</h6>
            <div
              className="flex items-center px-2 cursor-pointer"
              onClick={() => setToggleCreateCollection(true)}
            >
              <img className="w-4 h-4" src="/icons/create-new.svg" alt="create-new" />
              <p className="text-base ml-6 border-[#CED4E1] font-bold border-b-[1px] border-solid w-full py-3">
                Create New
              </p>
            </div>
            <h6 className="text-base text-secondary-60 mt-7 font-bold lg:leading-none leading-6">
              Your Collection
            </h6>
          </div>
          <MenuList
            autoFocusItem={isOpenDropdownSelectCollection}
            id="composition-menu"
            aria-labelledby="composition-button"
            className="lg:max-h-[180px] max-h-[170px] overflow-x-auto lg:!p-[16px] lg:px-4 py-0"
            autoFocus={true}
            autoFocusItem={false}
          >
            {collectionOfOwner.length > 0 ? (
              collectionOfOwner
                .sort((a: any, b: any) => {
                  if (a.title?.toLowerCase() === 'madworld') return -1;
                  if (b.title?.toLowerCase() === 'madworld') return 1;
                  return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                })
                .map((collection: any) => {
                  const { thumbnailUrl, name, address, title } = collection;
                  return (
                    <MenuItem
                      onClick={() => handleSelectCollection(address)}
                      className="!px-4 !py-0 flex"
                      key={name}
                      value={address}
                    >
                      <ImageBase
                        className="rounded-full w-[40px] h-[40px] mr-4 my-2 inline object-cover"
                        type="HtmlImage"
                        url={thumbnailUrl}
                        errorImg="Avatar"
                      />
                      <p className="whitespace-pre-wrap	h-full font-Chakra flex items-center font-normal text-base text-light-on-primary flex-1 border-[#CED4E1] border-b-[1px] border-solid py-2 min-h-[56px]">
                        {title || name}
                      </p>
                    </MenuItem>
                  );
                })
            ) : (
              <div className="text-center">No result</div>
            )}
          </MenuList>
          <div className="h-[28px]"></div>
        </Select>
        {touched.collectionAddress && errors.collectionAddress && (
          <FormHelperText
            className="text--body-small !text-xs !font-normal !text-error-60 pl-4"
            error={Boolean(errors?.collectionAddress)}
          >
            {touched.collectionAddress && errors.collectionAddress}
          </FormHelperText>
        )}
      </FormControl>
      <DialogCreateCollection
        open={toggleCreateCollection}
        nftType={nftType}
        onToggle={() => {
          setToggleCreateCollection(false);
          getCollectionOfOwner();
        }}
      />
    </div>
  );
};

export default SelectCollection;
