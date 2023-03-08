import { getTypeFile, TYPE_FILE } from './file';
import {
  CONTENT_TYPES_MODEL,
  IMAGE_TYPE_UPLOAD,
  MODEL_TYPES,
  SUPPORTED_FORMATS_AUDIO,
  SUPPORTED_FORMATS_PREVIEW_IMAGE,
  SUPPORTED_FORMATS_VIDEO,
} from 'constants/app';
import _ from 'lodash';
import nftService from 'service/nftService';
import { toastError } from 'store/actions/toast';

export const handleValidateProperties = (formik: any) => {
  const { values, errors, setFieldError, setFieldTouched, touched, setFieldValue } = formik;
  const propertiesLength = values.properties.length;
  if (propertiesLength > 0) {
    setFieldValue('isShowProperties', true);
    for (let i = 0; i < values.properties.length; i += 1) {
      let newErrorsProperties =
        errors.properties && errors.properties?.length > 0 ? _.cloneDeep(errors.properties) : [];
      let newToucedProperties =
        touched.properties && touched.properties?.length > 0 ? _.cloneDeep(touched.properties) : [];
      if (!values.properties[i]?.value && values.properties[i]?.name) {
        newErrorsProperties[i] = {
          ...newErrorsProperties[i],
          value: 'Type is not allowed to be empty',
        };
        newToucedProperties[i] = { ...newToucedProperties[i], value: true };
      }

      if (!values.properties[i]?.name && values.properties[i]?.value) {
        newErrorsProperties[i] = {
          ...newErrorsProperties[i],
          name: 'Name is not allowed to be empty',
        };
        newToucedProperties[i] = { ...newToucedProperties[i], name: true };
      }
      setFieldError('properties', newErrorsProperties);
      setFieldTouched('properties', newToucedProperties);
    }
  }
};

export const handleValidateLevels = (formik: any) => {
  const { values, errors, setFieldError, setFieldTouched, touched, setFieldValue } = formik;
  const levelsLength = values.levels.length;
  if (levelsLength > 0) {
    setFieldValue('isShowLevels', true);
    for (let i = 0; i < values.levels.length; i += 1) {
      let newErrorsLevels =
        errors.levels && errors.levels?.length > 0 ? _.cloneDeep(errors.levels) : [];
      let newToucedLevels =
        touched.levels && touched.levels?.length > 0 ? _.cloneDeep(touched.levels) : [];

      if (!values.levels[i]?.name as any) {
        newErrorsLevels[i] = {
          ...newErrorsLevels[i],
          name: 'Name is not allowed to be empty',
        };
        newToucedLevels[i] = { ...newToucedLevels[i], name: true };
      }
      setFieldError('levels', newErrorsLevels);
      setFieldTouched('levels', newToucedLevels);
    }
  }
};

export const handleValidateStats = (formik: any) => {
  const { values, errors, setFieldError, setFieldTouched, touched, setFieldValue } = formik;
  const statsLength = values.stats.length;
  if (statsLength > 0) {
    setFieldValue('isShowStats', true);
    for (let i = 0; i < values.stats.length; i += 1) {
      let newErrorsStats =
        errors.stats && errors.stats?.length > 0 ? _.cloneDeep(errors.stats) : [];
      let newToucedStats =
        touched.stats && touched.stats?.length > 0 ? _.cloneDeep(touched.stats) : [];

      if (!values.stats[i]?.name as any) {
        newErrorsStats[i] = {
          ...newErrorsStats[i],
          name: 'Name is not allowed to be empty',
        };
        newToucedStats[i] = { ...newToucedStats[i], name: true };
      }
      setFieldError('stats', newErrorsStats);
      setFieldTouched('stats', newToucedStats);
    }
  }
};

export const handleChangeImage = async (event: any, formik: any, dispatch: any) => {
  const { values, setFieldValue, setFieldTouched } = formik;
  const { nftAudio, nftVideo, nftImagePreview, nftModel } = values;
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    const { type, name } = file;
    const typeFile = await getTypeFile(name || '');
    if (SUPPORTED_FORMATS_VIDEO.includes(type)) {
      await setFieldValue('nftVideo', undefined);
      setFieldTouched('nftVideo', true);
      if (!nftVideo && !nftAudio && nftImagePreview) {
        setFieldValue('nftVideo', file);
        setFieldValue('nftImagePreview', null);
        setFieldValue('nftModel', null);
      } else {
        setFieldValue('nftVideo', file);
        setFieldValue('nftAudio', undefined);
        setFieldValue('nftModel', null);
      }
    } else if (SUPPORTED_FORMATS_AUDIO.includes(type)) {
      await setFieldValue('nftAudio', undefined);
      setFieldTouched('nftAudio', true);
      if (!nftVideo && !nftAudio && nftImagePreview) {
        setFieldValue('nftAudio', file);
        setFieldValue('nftImagePreview', null);
        setFieldValue('nftModel', null);
      } else {
        setFieldValue('nftAudio', file);
        setFieldValue('nftVideo', null);
        setFieldValue('nftModel', null);
      }
    } else if (typeFile === TYPE_FILE.MODEL) {
      await setFieldValue('nftModel', null);
      setFieldTouched('nftModel', true);
      if (!nftModel && !nftVideo && !nftAudio && nftImagePreview) {
        setFieldValue('nftModel', file);
        setFieldValue('nftImagePreview', null);
      } else {
        setFieldValue('nftModel', file);
        setFieldValue('nftVideo', null);
        setFieldValue('nftAudio', null);
      }
    } else if (SUPPORTED_FORMATS_PREVIEW_IMAGE.includes(type)) {
      await setFieldValue('nftImagePreview', undefined);
      setFieldTouched('nftImagePreview', true);
      if (!nftImagePreview) {
        setFieldValue('nftImagePreview', file);
        setFieldValue('nftAudio', null);
        setFieldValue('nftVideo', null);
        setFieldValue('nftModel', null);
      } else if (nftImagePreview && !nftVideo && !nftAudio) {
        setFieldValue('nftImagePreview', file);
      }
    } else {
      dispatch(toastError('Invalid format'));
    }
  }
};

export const handleUploadS3 = async (nftId: number, collectionId: number, formik: any) => {
  const { values } = formik;
  const { nftAudio, nftVideo, nftImagePreview, nftModel } = values;
  if (nftImagePreview && !nftAudio && !nftVideo && !nftModel) {
    const dataNFTUrl = {
      imgFile: values.nftImagePreview,
      nftId,
      collectionId,
      previewImgId: '',
      type: IMAGE_TYPE_UPLOAD.NFT_URL,
    };
    const nftUrlPath = await nftService.uploadNFTUrl(dataNFTUrl);
    const nftPreviewPath = await nftService.uploadNFTPreview(dataNFTUrl);
    const params = {
      nftUrl: nftUrlPath,
      nftImagePreview: nftPreviewPath,
    }
    await nftService.uploadNftImage(nftId, params);
  } else if (nftImagePreview && nftVideo) {
    const dataNFTPreview = {
      imgFile: values.nftImagePreview,
      nftId,
      collectionId,
      previewImgId: '',
      type: IMAGE_TYPE_UPLOAD.NFT_PREVIEW,
    };

    const dataNFTVideo = {
      imgFile: values.nftVideo,
      nftId,
      collectionId,
      previewImgId: '',
      type: IMAGE_TYPE_UPLOAD.NFT_URL,
    };

    const nftPreviewPath = await nftService.uploadNFTPreview(dataNFTPreview);
    const nftUrlPath = await nftService.uploadNFTVideo(dataNFTVideo);
    const params = {
      nftUrl: nftUrlPath,
      nftImagePreview: nftPreviewPath,
    }
    await nftService.uploadNftImage(nftId, params);
  } else if (nftImagePreview && nftAudio) {
    const dataNFTPreview = {
      imgFile: values.nftImagePreview,
      nftId,
      collectionId,
      previewImgId: '',
      type: IMAGE_TYPE_UPLOAD.NFT_PREVIEW,
    };

    const dataNFTUrl = {
      imgFile: values.nftAudio,
      nftId,
      collectionId,
      previewImgId: '',
      type: IMAGE_TYPE_UPLOAD.NFT_URL,
    };

    const nftPreviewPath = await nftService.uploadNFTPreview(dataNFTPreview);
    const nftUrlPath =  await nftService.uploadNFTAudio(dataNFTUrl);
    const params = {
      nftUrl: nftUrlPath,
      nftImagePreview: nftPreviewPath,
    }
    await nftService.uploadNftImage(nftId, params);
  } else if (nftImagePreview && nftModel) {
    const dataNFTPreview = {
      imgFile: values.nftImagePreview,
      nftId,
      collectionId,
      previewImgId: '',
      type: IMAGE_TYPE_UPLOAD.NFT_PREVIEW,
    };

    const dataNFTUrl = {
      imgFile: values.nftModel,
      nftId,
      collectionId,
      previewImgId: '',
      type: IMAGE_TYPE_UPLOAD.NFT_URL,
    };

    const nftPreviewPath = await nftService.uploadNFTPreview(dataNFTPreview);
    const nftUrlPath =  await nftService.uploadNFTModel(dataNFTUrl);
    const params = {
      nftUrl: nftUrlPath,
      nftImagePreview: nftPreviewPath,
    }
    await nftService.uploadNftImage(nftId, params);
  }
};

export const getPropertiesValid = (properties: any) => {
  const newProperties = _.cloneDeep(properties);
  return newProperties.filter((property: any) => {
    return property.name.trim().length > 0 && property.value.trim().length > 0;
  });
};

export const getLevelsAndStatsValid = (data: any) => {
  const result = _.cloneDeep(data);
  return result.filter((property: any) => {
    return property.name.trim().length > 0;
  });
};

export const getContentTypeModel = (extension: string) => {
  let contentType = '';
  if (extension === MODEL_TYPES.GLB) {
    contentType = CONTENT_TYPES_MODEL.GLB;
  } else if (extension === MODEL_TYPES.GLTF) {
    contentType = CONTENT_TYPES_MODEL.GLTF;
  }
  return contentType;
};

export const changeHandlerNftPreview = async (event: any, setFieldValue: any, setFieldTouched: any) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    const { type } = file;
    if (SUPPORTED_FORMATS_PREVIEW_IMAGE.includes(type)) {
      setFieldTouched('nftImagePreview', true);
      setFieldValue('nftImagePreview', file);
    }
  }
};