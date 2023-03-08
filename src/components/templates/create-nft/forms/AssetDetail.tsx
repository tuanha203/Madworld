import { FormHelperText } from '@mui/material';
import { CategoryChip } from 'components/common/chips/CategoryChip';
import { IconInfoOutline } from 'components/common/iconography/IconBundle';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { TextareaCustom, TextFieldFilledCustom } from 'components/modules/textField';
import {
  REGEX_POSITIVE_NUMBER,
  REGEX_PRICE_ONLY_NUMBER,
  TYPE_COLLECTION,
  useStylesTooltipFontSize12,
  WINDOW_MODE
} from 'constants/app';
import _ from 'lodash';
import { ICategory } from 'pages/create/erc-721';
import { FC, useRef, useState } from 'react';
import SelectCollection from '../SelectCollection';
import useDetectWindowMode from "hooks/useDetectWindowMode";
import { useOnClickOutside } from "utils/hook";

const AssetDetail: FC<any> = ({
  formik,
  categories,
  handleUpdateCategories,
  collectionOfOwner,
  nftType,
  getCollectionOfOwner,
}) => {
  const { values, errors, getFieldProps, touched, setFieldValue, setFieldTouched } = formik;
  const useStylesTooltip = useStylesTooltipFontSize12();
  const windowMode = useDetectWindowMode();
  const [showTooltipText, setShowTooltipText] = useState<boolean>(false)
  const ref: any = useRef();

  useOnClickOutside(ref, () => {
    setShowTooltipText(false);
  });

  const handleSelectCategory = (item: ICategory) => {
    const categoriesClone = _.cloneDeep(categories);
    const newCategories = categoriesClone.map((category: ICategory) => {
      const { id: idItem } = item;
      const { id: idCategory } = category;
      if (idItem === idCategory) {
        return { ...category, isActive: !category.isActive };
      } else {
        return category;
      }
    });
    handleUpdateCategories(newCategories);
  };

  const handleChangeSupply = (event: any) => {
    event.preventDefault();
    const { value } = event.target;
    if (REGEX_POSITIVE_NUMBER.test(value)) {
      const supply = value.replace(/^0+/g, "");
      setFieldValue('supply', supply);
    }
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    const pressedKey = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!REGEX_POSITIVE_NUMBER.test(pressedKey)) {
      event.preventDefault();
      return false;
    }
  };

  return (
    <div>
      <div className="lg:mt-0 lg:mb-12 mb-6 mt-6">
        <TextFieldFilledCustom
          customClassName="custom-field"
          id="title"
          scheme="dark"
          classCustomError="text--body-small !text-xs !font-normal !text-error-60 pl-4"
          label={
            <p className="text-sm mb-[8px] font-bold">
              Title<span className="text-error-60">*</span>
            </p>
          }
          placeholder="Asset Title"
          error={touched.title && Boolean(errors.title)}
          helperText={touched.title && errors?.title}
          className="font-Chakra"
          {...getFieldProps('title')}
          value={values.title}
        />
      </div>
      <div className="lg:mb-12 mb-6">
        <TextareaCustom
          customClassName="custom-field"
          classNameTextarea="custom-field"
          scheme="dark"
          label={
            <>
              <p className="text-sm flex gap-x-[6px] font-bold">Description</p>
              <p className="text-archive-Neutral-Variant70 text-xs mb-[8px] mt-[6px] font-normal">
                Provide a detailed description of your item. The description will be included on the
                item's detail page underneath its image.
              </p>
            </>
          }
          placeholder="Description"
          error={Boolean(errors?.description)}
          helperText={errors?.description}
          {...getFieldProps('description')}
          value={values.description}
        />
      </div>
      {nftType === TYPE_COLLECTION.ERC1155 && (
        <div className="lg:mb-12 mb-6">
          <TextFieldFilledCustom
            customClassName="custom-field"
            scheme="dark"
            id="supply"
            onWheel={(e: any) => e.target.blur()}
            inputProps={{ pattern: "[0-9]" }}
            label={
              <p className="text-sm flex font-bold">
                Supply<span className="text-error-60">*</span>
              </p>
            }
            disableUnderline
            classCustomError="text--body-small !text-xs !font-normal !text-error-60 pl-4"
            placeholder="Supply"
            error={touched.supply && Boolean(errors?.supply)}
            helperText={touched.supply && errors?.supply}
            className="font-Chakra"
            type="number"
            value={values.supply}
            onChange={handleChangeSupply}
            onKeyPress={onKeyPress}
            onBlur={() => {
              setFieldTouched('supply')
            }}
            // {...getFieldProps('supply')}
          />
        </div>
      )}
      <div className="lg:mb-12 mb-6">
        <p className="text-sm mb-4 flex font-bold relative">
          Categories of NFT<span className="text-error-60 mr-[6px]">*</span>
          {
            [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode) ? (
              <>
                <div onClick={() => setShowTooltipText(true)} ref={ref}>
                  <IconInfoOutline/>
                </div>
                {
                  showTooltipText && (
                    <p className="absolute top-[30px] left-0 bg-[#1f262c] z-10 text-[10px] py-2 px-5 tooltip-text">
                      Adding a category will help make your item discoverable on MADworld.
                    </p>
                  )
                }
              </>
            ) : (
              <ContentTooltip
                classes={useStylesTooltip}
                title="Adding a category will help make your item discoverable on MADworld."
                arrow
                placement="bottom"
              >
                <div>
                  <IconInfoOutline />
                </div>
              </ContentTooltip>
            )
          }
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-4">
          {categories.length > 0 &&
            categories.map((category: ICategory) => {
              const { name, isActive } = category;
              return (
                <CategoryChip
                  customClass={`${
                    isActive
                      ? '!bg-primary-dark !border-primary-dark !text-light-on-primary'
                      : '!bg-background-700 !border-archive-Neutral-Variant60'
                  }`}
                  label={name}
                  scheme="dark"
                  onClick={() => handleSelectCategory(category)}
                />
              );
            })}
        </div>
        {errors.categoryIds && touched.categoryIds && (
          <FormHelperText
            className={`text--body-small text-xs font-normal !text-error-60 pl-4`}
            error={touched.categoryIds && Boolean(errors?.categoryIds)}
          >
            {touched.categoryIds && errors.categoryIds}
          </FormHelperText>
        )}
      </div>
      <div className="lg:mb-12 mb-6">
        <p className="text-sm flex font-bold">
          Collection<span className="text-error-60 mr-[6px]">*</span>
        </p>
        <p className="text-archive-Neutral-Variant70 text-xs mb-[8px] mt-[6px] font-normal">
          This is the collection where your item will appear.{' '}
        </p>
        <SelectCollection
          values={values}
          errors={errors}
          touched={touched}
          collectionOfOwner={collectionOfOwner}
          getFieldProps={getFieldProps}
          getCollectionOfOwner={getCollectionOfOwner}
          nftType={nftType}
          setFieldValue={setFieldValue}
        />
      </div>
      <div className="lg:mb-12 mb-6">
        <TextFieldFilledCustom
          customClassName="custom-field"
          scheme="dark"
          label={
            <>
              <p className="text-sm font-bold">External link</p>
              <p className="text-archive-Neutral-Variant70 text-xs mb-[8px] mt-[6px] font-normal">
                MADworld will include a link to this URL on this item's detail page, so that users
                can click to learn more about your asset and the project details
              </p>
            </>
          }
          disableUnderline
          error={Boolean(errors?.externalLink)}
          helperText={errors?.externalLink}
          className="font-Chakra"
          {...getFieldProps('externalLink')}
          value={values.externalLink}
        />
      </div>
    </div>
  );
};

export default AssetDetail;
