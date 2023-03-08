import ImageBase from 'components/common/ImageBase';
import VideoPlayer from 'components/common/media-player';
import { FullScreenDialog } from 'components/modules/dialogs';
import { TYPE_MEDIA, WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { useEffect, useMemo, useState } from 'react';
import { getTypeFile, TYPE_FILE } from 'utils/file';
import dynamic from 'next/dynamic';
import { getBaseURLFromIPFS } from 'utils/image';

const Model = dynamic(() => import('../../../common/model'), { ssr: false });

const style = {
  maxWidth: '550px',
  maxHeight: '100%',
  minWidth: '298px',
  minHeight: '226px',
};

const NftContent = ({ nftUrl, nftImagePreview }: { nftUrl: string; nftImagePreview: string }) => {
  const [isShowImageFullScreen, setShowImageFullScreen] = useState<boolean>(false);
  const [typeFile, setTypeFile] = useState<string>(TYPE_FILE.IMAGE);
  const windowMode = useDetectWindowMode();

  useEffect(() => {
    if (nftUrl) {
      getTypeFileUrl(nftUrl);
    }
  }, [nftUrl]);

  const getTypeFileUrl = async (newUrl: string) => {
    const newTypeFile = await getTypeFile(newUrl || '');
    setTypeFile(newTypeFile);
  }
  
  const renderContent = () => {
    let content;
    if (typeFile === TYPE_FILE.MUSIC) {
      content = <VideoPlayer type={TYPE_MEDIA.MP3} imageUrl={nftImagePreview} src={nftUrl} />;
    } else if (typeFile === TYPE_FILE.VIDEO) {
      content = <VideoPlayer src={nftUrl} type={TYPE_MEDIA.MP4} />;
    } else {
      content = (
        <>
          <ImageBase
            onClick={() => setShowImageFullScreen(true)}
            url={nftUrl}
            alt="Image detail"
            errorImg="Default"
            type="HtmlImage"
            style={
              [WINDOW_MODE.SM, WINDOW_MODE.MD].includes(windowMode)
                ? { cursor: 'pointer', objectFit: 'contain', height: '100%' }
                : { height: '100%', cursor: 'pointer', objectFit: 'contain' }
            }
          />
          <FullScreenDialog
            open={isShowImageFullScreen}
            onClose={() => setShowImageFullScreen(false)}
          >
            <div className="flex justify-center items-center h-full w-full">
              <ImageBase
                url={nftUrl}
                alt="Image detail"
                errorImg="Default"
                type="HtmlImage"
                className="max-w-[85vw] max-h-[85vh]"
              />
            </div>
          </FullScreenDialog>
        </>
      );
    }
    return content;
  };

  const renderModel = useMemo(() => {
    const modelUrl = getBaseURLFromIPFS(nftUrl);
    return (
      <div className="w-[100%] lg:h-[455px]">
        <div className="w-[100%] h-[455px]" onClick={() => setShowImageFullScreen(true)}>
          <Model src={modelUrl} />
        </div>
        {isShowImageFullScreen && (
          <FullScreenDialog
            open={isShowImageFullScreen}
            onClose={() => setShowImageFullScreen(false)}
          >
            <div className="flex justify-center items-center h-full w-full">
              <Model src={modelUrl} />
            </div>
          </FullScreenDialog>
        )}
      </div>
    );
  }, [typeFile, nftUrl, isShowImageFullScreen]);

  return (
    <>
      {typeFile === TYPE_FILE.MODEL ? (
        renderModel
      ) : (
        <div className="lg:h-[455px] sm:h-[375px]">{renderContent()}</div>
      )}
    </>
  );
};

export default NftContent;
