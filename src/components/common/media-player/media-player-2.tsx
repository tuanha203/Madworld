import { useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import Slider from '@mui/material/Slider';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Box, formLabelClasses } from '@mui/material';
import { TYPE_MEDIA } from 'constants/app';

interface IMediaPlayerProps {
  width?: number;
  height?: number;
  imageUrl: string;
  src: string;
  type: TYPE_MEDIA;
  style?: any;
}

function MediaPlayer2({ width, height, imageUrl, src, type, style = {} }: IMediaPlayerProps) {
  const videoRef = useRef<any>(null);
  const [playing, setPlaying] = useState<any>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [valueVolume, setValueVolume] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChangeVolume = (event: Event, newValue: number | number[]) => {
    setValueVolume(newValue as number);
    if (videoRef.current) videoRef.current.volume = newValue;
  };

  const handleExpand = () => {
    if (!videoRef.current.duration) return;
    setIsExpanded(!isExpanded);
  };

  const videoHandler = (control: any) => {
    if (control === 'play') {
      if (!videoRef.current.duration) return;
      videoRef.current.play();
      setPlaying(true);
      // console.log(videoRef.current);
      setVideoTime(videoRef.current.duration);
    } else if (control === 'pause') {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const fastForward = () => {
    videoRef.current.currentTime += 5;
  };

  const revert = () => {
    videoRef.current.currentTime -= 5;
  };

  useEffect(() => {
    const timeInterval = setInterval(function () {
      setCurrentTime(videoRef.current?.currentTime);
      setProgress((videoRef.current?.currentTime / videoTime) * 100);
    }, 1000);
    return clearInterval(timeInterval);
  }, []);

  return (
    <div
      style={
        !isExpanded
          ? { width: width || '500px', height: height || '300px', ...style }
          : {
              position: 'fixed',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              zIndex: 100,
              background: 'black',
            }
      }
      className={`flex flex-col items-center overflow-hidden relative group transition-none`}
    >
      <video ref={videoRef} className="w-full h-full" src={src} poster={imageUrl}></video>
      {imageUrl && type === TYPE_MEDIA.MP3 ? (
        <img className="w-full h-full absolute" src={imageUrl} alt="" />
      ) : null}

      <div className="hidden absolute w-full z-10 left-[50%] top-[50%] -translate-y-1/2 -translate-x-1/2 group-hover:block">
        <div className="flex items-center m-auto justify-evenly">
          <img
            onClick={revert}
            className="w-10 h-10 cursor-pointer"
            alt=""
            src="/icons/backward-5.svg"
          />
          {playing ? (
            <img
              onClick={() => videoHandler('pause')}
              className="w-[52px] h-[52px] cursor-pointer"
              alt=""
              src="/icons/pauseVideo.svg"
            />
          ) : (
            <img
              onClick={() => videoHandler('play')}
              className="w-[52px] h-[52px] cursor-pointer"
              alt=""
              src="/icons/playVideo.svg"
            />
          )}
          <img
            className="w-10 h-10 cursor-pointer"
            onClick={fastForward}
            alt=""
            src="/icons/forward-5.svg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center absolute z-10 w-full justify-evenly bottom-[10%] w-11/12">
        <div className="w-full justify-between flex">
          <p className="text-white">
            {Math.floor(currentTime / 60) + ':' + ('0' + Math.floor(currentTime % 60)).slice(-2)}
            &nbsp;/&nbsp;
            {Math.floor(videoTime / 60) + ':' + ('0' + Math.floor(videoTime % 60)).slice(-2)}
          </p>
          <div className="flex gap-6 cursor-pointer items-center h-[24px]">
            <Box
              sx={{ '&:hover .MuiSlider-root': { display: 'block !important' } }}
              className="flex gap-4 hover:bg-[#0000003b] px-2 rounded-[8px] items-center"
            >
              <div className="w-[100px]">
                <Slider
                  sx={{ '.MuiSlider-track': { backgroundColor: '#11BCB4 !important' } }}
                  className="hidden"
                  size="small"
                  aria-label="Volume"
                  step={0.1}
                  max={1}
                  min={0}
                  value={valueVolume}
                  onChange={handleChangeVolume}
                />
              </div>
              {valueVolume === 0 ? (
                <VolumeOffIcon onClick={(e: any) => handleChangeVolume(e, 1)} />
              ) : (
                <VolumeUpIcon onClick={(e: any) => handleChangeVolume(e, 0)} />
              )}
            </Box>

            <AspectRatioIcon
              onClick={() => {
                handleExpand();
              }}
            />
          </div>
        </div>

        <div
          onClick={(event: any) => {
            let ratioUserClickProgress = event.nativeEvent.offsetX / event.target.offsetWidth;
            let currentTimeAfterClick = ratioUserClickProgress * videoTime;
            videoRef.current.currentTime = currentTimeAfterClick;
          }}
          className={`bg-gray-600 w-full h-[10px] z-30 relative cursor-pointer ${
            isExpanded ? 'hidden group-hover:block' : ''
          }`}
        >
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-[#11BCB4] pointer-events-none transition-none"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default MediaPlayer2;
