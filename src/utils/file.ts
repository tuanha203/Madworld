import { getBaseURLFromIPFS } from './image';
export const TYPE_FILE = {
  IMAGE: 'IMAGE',
  GIF: 'GIF',
  VIDEO: 'VIDEO',
  MUSIC: 'MUSIC',
  MODEL: 'MODEL',
};

export const validateFile = (extension: string) => {
  const acceptableFormats = ['jpg', 'png', 'jpeg', 'gif', 'svg+xml', 'svg'];
  if (acceptableFormats.includes(extension)) {
    return true;
  }
  return false;
};

const getFileExtensionFromIPFS = async (url: string) => {
  const baseURL = getBaseURLFromIPFS(url);
  const req = await fetch(baseURL, { method: 'HEAD' });
  const fileType = req?.headers?.get('content-type') || "";
  return fileType;
};

export const getTypeFile = async (url: string):Promise<string> => {
  try {
    if (url?.includes('ipfs')) {
      const contentType = await getFileExtensionFromIPFS(url);
      if (contentType.includes("video")) {
        return TYPE_FILE.VIDEO;
      } else if (contentType.includes("audio")) {
        return TYPE_FILE.MUSIC;
      } else if (contentType.includes("model")) {
        return TYPE_FILE.MODEL;
      } else {
        return TYPE_FILE.IMAGE;
      }
    }
    const tagFile = url?.slice(-4).toLocaleLowerCase() || '';
    if (['.jpg', '.png', '.jpeg', 'svg'].includes(tagFile)) return TYPE_FILE.IMAGE;
    if (tagFile === '.gif') return TYPE_FILE.GIF;
    if (tagFile === '.mp4' || tagFile === '.mp4' || tagFile === 'webm') return TYPE_FILE.VIDEO;
    if (tagFile === '.mp3') return TYPE_FILE.MUSIC;
    if (tagFile === '.ogg') return TYPE_FILE.MUSIC;
    if (tagFile === '.wav') return TYPE_FILE.MUSIC;
    if (tagFile === 'mpeg') return TYPE_FILE.MUSIC;
    if (tagFile === 'mpga') return TYPE_FILE.MUSIC;
    if (tagFile === '.glb' || tagFile === 'gltf') return TYPE_FILE.MODEL;
    return '';
  } catch (err: any) {
    return '';
  }
};
