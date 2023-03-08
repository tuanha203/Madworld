import difference from 'lodash/difference';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import reduce from 'lodash/reduce';

export function transformJsonToFormData(formData: FormData, values: any) {
  Object.keys(values).forEach((k) => {
    formData.append(k, values[k]);
  });
}
