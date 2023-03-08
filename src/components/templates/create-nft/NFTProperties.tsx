import CollapseCustom from 'components/common/collapse';
import { IconDynamic } from 'components/common/iconography/IconBundle';
import { TextFieldProperty } from 'components/modules/textField';
import { FieldArray } from 'formik';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';

interface PropertiesState {
  value: string;
  name: string;
}

const initialProperties = { value: '', name: '' };

const NFTProperties: FC<any> = ({ title, iconLink, filedName, formik }) => {
  const {values, setFieldValue} = formik;
  const [isAddMore, setAddMore] = useState<boolean>(false);
  const [isRemove, setRemove] = useState<boolean>(true);
  
  useEffect(() => {
    if (values.properties.length === 1 && (!values.properties[0].value || !values.properties[0].name)) {
      setRemove(false);
    } else {
      setRemove(true);
    }
  }, [values.properties]);

  useEffect(() => {
    for (const property of values.properties) {
      if (!property.value || !property.name) return setAddMore(false);
    }
    setAddMore(true);
  }, [values.properties]);

  const handleShowProperties = () => {
    if (_.isEmpty(values.properties)) {
      setFieldValue('properties', [initialProperties]);
    } else if (values.properties.length === 1) {
      for (const property of values.properties) {
        if (!property.value && !property.name) {
          setFieldValue('properties', []);
        }
      }
    }
    setFieldValue('isShowProperties', !values.isShowProperties);
  };

  const handleRemove = (index: number, remove: any) => {
    if (!isRemove) return;
    if (values.properties.length === 1) {
      setFieldValue('properties', [initialProperties]);
    } else {
      remove(index);
    }
  };

  const handleAddProperty = (push: any) => {
    if (!isAddMore) return;
    push(initialProperties);
  };

  return (
    <FieldArray
      name={filedName}
      render={({ insert, remove, push }) => (
        <CollapseCustom
          handleShow={handleShowProperties}
          isShow={values.isShowProperties}
          itemText={title}
          imageHeader={iconLink}
          customItemText={{
            span: {
              fontSize: '14px !important',
              fontWeight: 'bold'
            },
          }}
          customClassName="px-0 lg:py-8 py-6"
          customClassIcon="!w-[18px] !h-[18px]"
        >
          {values.properties.map((propertiesItem: PropertiesState, index: number) => {
            return (
              <div className="flex items-center lg:pr-7" key={index}>
                <div className={`flex w-full ${index !== 0 && 'mt-4'}`}>
                  <div className="flex-auto w-[50%]">
                    <TextFieldProperty
                      label={index === 0 && <p className="text-base font-bold mb-1">Type</p>}
                      placeholder="e.g. Background"
                      classCustom={`!border-r !border-background-dark-200 border-solid !bg-[#3E3F4D] rounded-tl`}
                      errorName={`${filedName}[${index}].value`}
                      name={`${filedName}.${index}.value`}
                      type="text"
                    />
                  </div>
                  <div className="flex-auto w-[50%]">
                    <TextFieldProperty
                      label={index === 0 && <p className="text-base font-bold mb-1">Name</p>}
                      placeholder="e.g. Building"
                      classCustom="rounded-tr !bg-[#3E3F4D]"
                      errorName={`${filedName}[${index}].name`}
                      name={`${filedName}.${index}.name`}
                      type="text"
                    />
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

export default NFTProperties;
