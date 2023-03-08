import _ from 'lodash';

export const renderFieldError = (errors: any, fieldName: any) => {
  return _.get(errors, `[${fieldName}.message]`, '');
};
export const getAttributes = (properties = []) => {
  const attributes = properties.map((item: any) => {
    const res: any = { trait_type: item.name, value: item.value };
    if (item.maxValue !== undefined && item.maxValue !== null) {
      res['max_value'] = item.maxValue;
    }
    if (item.type !== undefined && item.maxValue !== null) {
      res['display_type'] = item.type;
    }
    return res;
  });
  return attributes;
};

export const DISPLAY_TYPE_PROPERTY = {
  PROPERTY: 'PROPERTY',
  LEVEL: 'LEVEL',
  STAT: 'STAT',
};

export const getProperties = (properties = [], levels = [], stats = []) => {
  const propertiesList = properties.map((item: any) => {
    return {
      name: item?.value?.trim().toLowerCase(),
      value: item?.name?.trim().toLowerCase(),
      displayType: DISPLAY_TYPE_PROPERTY.PROPERTY,
    };
  });
  const levelList = levels.map((item: any) => {
    return {
      name: item?.name?.trim().toLowerCase(),
      value: Number(item?.level),
      maxValue: Number(item?.maxLevel),
      displayType: DISPLAY_TYPE_PROPERTY.LEVEL,
    };
  });
  const statsList = stats.map((item: any) => {
    return {
      type: 'number',
      name: item?.name?.trim().toLowerCase(),
      value: Number(item?.level),
      maxValue: Number(item?.maxLevel),
      displayType: DISPLAY_TYPE_PROPERTY.STAT,
    };
  });
  const attributes = [...propertiesList, ...levelList, ...statsList];
  return attributes;
};
