import { AWS_CLOUDFRONT_API_ENDPOINT } from 'constants/envs';
export const getNFTImageName = (imgFile: any) => {
  let { type } = imgFile;
  let name = new Date().getTime();
  let extension = type.split('/')[1];
  if (extension.includes('svg')) extension = 'svg';
  return `${name}.${extension}`;
};

export const getNFTVideoName = (imgFile: any) => {
  let type = imgFile.name;
  let name = new Date().getTime();
  let result = type.split('.');
  return `${name}.${result[result.length - 1]}`;
};

export const getBaseURLFromIPFS = (url: any) => {
  if (!url) return '';
  if (url.includes('ipfs://ipfs/')) {
    const ipfsIndex = url.indexOf('//ipfs/');
    const urlHash = url.substring(ipfsIndex + 7);
    return `https://ipfs.io/ipfs/${urlHash}`;
  } else if (url.includes('ipfs://')) {
    const ipfsIndex = url.indexOf('//');
    const urlHash = url.substring(ipfsIndex + 2);
    return `https://ipfs.io/ipfs/${urlHash}`;
  } else if (!url.includes('http')) {
    return `${AWS_CLOUDFRONT_API_ENDPOINT}${url}`;
  }
  return url;
};

/**
 * check error img and add domain
 * @param src string
 * @param errorImg enum NoData | default
 */
export const convertUrlImage = (url?: string | null | undefined, errorImg?: string) => {
  if (!url) {
    switch (errorImg) {
      case 'NoData':
        return require('../assets/images/noData.png');
      case 'Avatar':
        return require('../../public/images/avatar-default.png');
      case 'Banner':
        return require('../assets/images/banner-empty.png');
      default:
        return require('../../public/images/no-image.jpg');
    }
  } else if (url?.includes('http')) {
    return url;
  } else if (url?.includes('ipfs://ipfs/')) {
    const ipfsIndex = url.indexOf('//ipfs/');
    const urlHash = url.substring(ipfsIndex + 7);
    return `https://ipfs.io/ipfs/${urlHash}`;
  } else if (url?.includes('ipfs://')) {
    const ipfsIndex = url.indexOf('//');
    const urlHash = url.substring(ipfsIndex + 2);
    return `https://ipfs.io/ipfs/${urlHash}`;
  } else {
    return `${AWS_CLOUDFRONT_API_ENDPOINT}${url}`;
    // return `${AWS_CLOUDFRONT_API_ENDPOINT}${encodeURIComponent(url)}`;
  }
};
