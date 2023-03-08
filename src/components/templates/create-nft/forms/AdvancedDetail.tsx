import { Divider } from 'components/common';
import { IconDynamic, IconLock } from 'components/common/iconography/IconBundle';
import { SwitchControl } from 'components/common/selectionControls';
import { TextareaCustom, TextFieldFilledCustom } from 'components/modules/textField';
import { FC, useState } from 'react';
import NFTLevel from '../NFTLevel';
import NFTProperties from '../NFTProperties';

const AdvancedDetail: FC<any> = ({ formik }) => {
  const { values, errors, getFieldProps, setFieldValue, touched } = formik;

  const setShowUnlockableContent = (value: boolean) => {
    setFieldValue('isUnlockableContent', value);
  };

  const setShowExplicitSensitive = (value: boolean) => {
    setFieldValue('isExplicitSensitiveContent', value);
  };

  return (
    <>
      <div className="flex justify-between items-center mt-6 lg:mt-0">
        <div className="flex">
          <IconLock className="min-w-[18px] w-[18px]" />
          <div className="ml-2">
            <p className="font-bold text-sm text-white">Unlockable Content</p>
            <p className="font-normal text-xs text-archive-Neutral-Variant70 font-normal">
              Include unlockable content that can only be revealed by the item owner.
            </p>
          </div>
        </div>
        <SwitchControl
          isChecked={values.isUnlockableContent}
          parentCallback={setShowUnlockableContent}
        />
      </div>
      {values.isUnlockableContent && (
        <TextareaCustom
          scheme="dark"
          id="unlockableContent"
          label={<></>}
          disableUnderline
          classCustomError="text--body-small !text-xs !font-normal !text-error-60 pl-4"
          placeholder="Unlockable Content"
          error={touched.unlockableContent && Boolean(errors?.unlockableContent)}
          helperText={touched.unlockableContent && errors?.unlockableContent}
          onChange={formik.handleChange}
          {...getFieldProps('unlockableContent')}
          classNameTextarea="font-Chakra mt-2"
          value={values.unlockableContent}
        />
      )}
      <Divider customClass="lg:my-8 my-6" />
      <div className="flex justify-between items-center">
        <div className="flex">
          <IconDynamic className="w-[18px]" image="/icons/explicit.svg" />
          <div className="ml-2">
            <p className="font-bold text-sm text-white">Explicit & Sensitive Content</p>
            <p className="font-normal text-xs text-archive-Neutral-Variant70 font-normal">
              Set this item as explicit and sensitive content
            </p>
          </div>
        </div>
        <SwitchControl
          isChecked={values.isExplicitSensitiveContent}
          parentCallback={setShowExplicitSensitive}
        />
      </div>
      <Divider customClass="lg:mt-8 mt-6" />
      <NFTProperties
        formik={formik}
        filedName="properties"
        title="Properties"
        iconLink="/icons/properties.svg"
      />
      <NFTLevel
        formik={formik}
        filedName="levels"
        title="Levels"
        iconLink="/icons/level.svg"
      />
      <NFTLevel
        formik={formik}
        filedName="stats"
        title="Stats"
        iconLink="/icons/stats.svg"
      />
    </>
  );
};

export default AdvancedDetail;
