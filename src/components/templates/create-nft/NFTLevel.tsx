import CollapseCustom from 'components/common/collapse';
import { IconDynamic } from 'components/common/iconography/IconBundle';
import { NumberProperty, TextFieldProperty } from 'components/modules/textField';
import { BACKSPACE_KEY, MAX_LEVEL, REGEX_PRICE_ONLY_NUMBER } from 'constants/app';
import { FieldArray } from 'formik';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';

interface PropertiesState {
  level: number;
  maxLevel: number;
  name: string;
}

const initialProperties = { name: '', level: 2, maxLevel: 4 };

const NFTLevel: FC<any> = ({ title, iconLink, filedName, formik }) => {
  const { values, setFieldValue } = formik;
  const [isAddMore, setAddMore] = useState<boolean>(false);
  const [isRemove, setRemove] = useState<boolean>(true);

  useEffect(() => {
    if (values[filedName].length === 1 && !values[filedName][0].name) {
      setRemove(false);
    } else {
      setRemove(true);
    }
  }, [values[filedName]]);

  useEffect(() => {
    for (const property of values[filedName]) {
      if (!property.name) return setAddMore(false);
    }
    setAddMore(true);
  }, [values[filedName]]);

  const handleShowProperties = () => {
    if (_.isEmpty(values[filedName])) {
      setFieldValue(`${filedName}`, [initialProperties]);
    } else if (values[filedName].length === 1) {
      for (const property of values[filedName]) {
        if (!property.name) setFieldValue(`${filedName}`, []);
      }
    }

    if (filedName === 'levels') {
      setFieldValue('isShowLevels', !values.isShowLevels);
    } else {
      setFieldValue('isShowStats', !values.isShowStats);
    }
  };

  const handleRemove = (index: number, remove: any) => {
    if (!isRemove) return;
    if (values[filedName].length === 1) {
      setFieldValue(`${filedName}`, [initialProperties]);
    } else {
      remove(index);
    }
  };

  const handleAddProperty = (push: any) => {
    if (!isAddMore) return;
    push(initialProperties);
  };

  const onUpLevel = (index: any) => {
    const currentLevel = values[filedName][index].level;
    const currentMaxLevel = values[filedName][index].maxLevel;
    if (currentLevel === currentMaxLevel || currentLevel >= MAX_LEVEL) return;
    const newField = _.cloneDeep(values[filedName]);
    newField[index] = { ...values[filedName][index], level: currentLevel + 1 };
    setFieldValue(`${filedName}`, newField);
  };

  const onUpLevelMax = (index: any) => {
    const currentMaxLevel = values[filedName][index].maxLevel;
    if (currentMaxLevel === MAX_LEVEL) return;
    const newField = _.cloneDeep(values[filedName]);
    newField[index] = { ...values[filedName][index], maxLevel: currentMaxLevel + 1 };
    setFieldValue(`${filedName}`, newField);
  };

  const onDownLevel = (index: any) => {
    const currentLevel = values[filedName][index].level;
    if (currentLevel <= 0) return;
    const newField = _.cloneDeep(values[filedName]);
    newField[index] = { ...values[filedName][index], level: currentLevel - 1 };
    setFieldValue(`${filedName}`, newField);
  };

  const onDownLevelMax = (index: any) => {
    const currentLevel = values[filedName][index].level;
    const currentMaxLevel = values[filedName][index].maxLevel;
    if (currentMaxLevel <= currentLevel) return;
    const newField = _.cloneDeep(values[filedName]);
    newField[index] = { ...values[filedName][index], maxLevel: currentMaxLevel - 1 };
    setFieldValue(`${filedName}`, newField);
  };

  const onChangeName = (event: any, index: any) => {
    let { value } = event.target;
    const newField = _.cloneDeep(values[filedName]);
    newField[index] = { ...values[filedName][index], name: value.replace(/ +(?= )/g, '') };
    setFieldValue(`${filedName}`, newField);
  };

  const onChangeLevel = (event: any, index: any) => {
    let { value } = event.target;
    const currentMaxLevel = values[filedName][index].maxLevel;
    const newField = _.cloneDeep(values[filedName]);
    if (REGEX_PRICE_ONLY_NUMBER.test(value)) {
      if (Number(value) > currentMaxLevel) {
        event.preventDefault();
        return false;
      } else if (!value || Number(value) < 0) {
        newField[index] = { ...values[filedName][index], level: 0 };
      } else {
        newField[index] = { ...values[filedName][index], level: parseInt(value, 10) };
      }
      setFieldValue(`${filedName}`, newField);
    }
  };

  const onChangeMaxLevel = (event: any, index: any) => {
    let { value } = event.target;
    const currentLevel = values[filedName][index].level;
    const newField = _.cloneDeep(values[filedName]);
    if (REGEX_PRICE_ONLY_NUMBER.test(value)) {
      if (Number(value) < currentLevel) {
        event.preventDefault();
        return false;
      } else if (!value || Number(value) < 0) {
        newField[index] = { ...values[filedName][index], maxLevel: 0 };
      } else {
        newField[index] = { ...values[filedName][index], maxLevel: parseInt(value, 10) };
      }
      setFieldValue(`${filedName}`, newField);
    }
  };

  return (
    <FieldArray
      name={filedName}
      render={({ insert, remove, push }) => (
        <CollapseCustom
          handleShow={handleShowProperties}
          isShow={filedName === 'levels' ? values.isShowLevels : values.isShowStats}
          itemText={title}
          imageHeader={iconLink}
          customItemText={{
            span: {
              fontSize: '14px !important',
              fontWeight: 'bold',
            },
          }}
          customClassName="px-0 lg:py-8 py-6"
          customClassIcon="w-[18px]"
        >
          {values[filedName].map((propertiesItem: PropertiesState, index: number) => {
            return (
              <div className="flex items-center lg:pr-7" key={index}>
                <div className={`flex w-full level-wrapper ${index !== 0 && 'mt-4'}`}>
                  <div className="lg:flex-auto lg:w-[53%] w-[38%]">
                    <TextFieldProperty
                      classCustom="!bg-[#3E3F4D] rounded-tl"
                      label={index === 0 && <p className="text-base font-bold mb-1">Name</p>}
                      placeholder="e.g. Speed"
                      errorName={`${filedName}[${index}].name`}
                      name={`${filedName}.${index}.name`}
                      type="text"
                    />
                  </div>
                  <div className="lg:flex-auto lg:w-[47%] w-[62%] flex-col">
                    {index === 0 && <p className="text-base font-bold  mb-2">Value</p>}
                    <div className="flex w-full">
                      <div className="lg:!w-[36%] !w-[40%]">
                        <NumberProperty
                          classCustom="w-!full !border-x !border-background-dark-200 border-solid !bg-[#3E3F4D]"
                          placeholder="Ex: 2"
                          errorName={`${filedName}[${index}].level`}
                          name={`${filedName}.${index}.level`}
                          onUp={() => onUpLevel(index)}
                          onDown={() => onDownLevel(index)}
                          onChange={(event: any) => onChangeLevel(event, index)}
                          type="text"
                        />
                      </div>
                      <div className="flex justify-center items-center !bg-[#3E3F4D] text-sm font-bold !border-x !border-x-background-dark-200 border-solid max-h-[56px] lg:!w-[28%] !w-[20%]">
                        Of
                      </div>
                      <div className='lg:!w-[36%] !w-[40%]'>
                        <NumberProperty
                          classCustom="!w-full rounded-tr !bg-[#3E3F4D]"
                          placeholder="Ex: 4"
                          errorName={`${filedName}[${index}].maxLevel`}
                          name={`${filedName}.${index}.maxLevel`}
                          onUp={() => onUpLevelMax(index)}
                          onDown={() => onDownLevelMax(index)}
                          onChange={(event: any) => onChangeMaxLevel(event, index)}
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="lg:ml-5 ml-4 min-w-[14px] mt-[28px]"
                  onClick={() => handleRemove(index, remove)}
                >
                  <IconDynamic
                    className="cursor-pointer min-w-3.5 min-h-3.5 w-[14px] h-[14px]"
                    image={isRemove ? '/icons/close-2.svg' : '/icons/close-disable.svg'}
                  />
                </div>
              </div>
            );
          })}
          <div
            onClick={() => handleAddProperty(push)}
            className={`flex text-sm items-center mt-2.5 mb-[30px] cursor-pointer w-max ${
              isAddMore ? 'text-primary-60' : 'text-archive-Neutral-Variant60'
            }`}
          >
            <IconDynamic
              className="mr-3 w-[14px] h-[14px]"
              image={isAddMore ? '/icons/increment.svg' : '/icons/increment-disable.svg'}
            />
            Add More
          </div>
        </CollapseCustom>
      )}
    />
  );
};

export default NFTLevel;
