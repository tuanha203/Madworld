import React, { useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import { Slider } from '@mui/material';
import { get } from 'lodash';
import { TYPE_MEDIA, TYPE_MEDIA_NFT } from 'constants/app';
import { getBaseURLFromIPFS } from 'utils/image';

const VIDEO_STATUS = {
  play: 'play',
  paused: 'paused',
};

const formatDuration = (duration: any) => {
  if (duration) {
    let minutes: any = Math.floor((duration % (60 * 60)) / 60);

    let seconds: any = Math.floor(duration % 60);

    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return `${minutes}:${seconds}`;
  }
  return '00:00';
};

type VideoProps = {
  type?: string;
  file: any;
  key: any;
  customClassName?: string;
};

const MediaPlayCreateNft = (props: VideoProps) => {
  const videoRef = useRef<any>(null);
  const previousVolume = useRef(0);
  const {  type, file, customClassName, key } = props;
  
  const [videoStatus, setVideoStatus] = useState(VIDEO_STATUS.paused);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVolume, setCurrentVolumne] = useState(0);
  const [isSoundOpen, setIsSoundOpen] = useState(false);

  const onSliderChange = (e: any) => {
    const value = get(e, 'target.value');
    setCurrentTime(value);
    if (videoRef?.current?.currentTime) {
      videoRef.current.currentTime = value;
    }
  };

  const onVolumeChange = (e: any) => {
    const value = get(e, 'target.value');
    setCurrentVolumne(value);
    previousVolume.current = value;
    if (!isNaN(videoRef?.current?.volume)) {
      videoRef.current.volume = value / 100;
    }
  };

  const mute = useCallback(() => {
    if (!isNaN(videoRef?.current?.volume)) {
      setCurrentVolumne(0);
      videoRef.current.volume = 0;
    }
  }, []);

  const unMute = useCallback(() => {
    if (!isNaN(videoRef?.current?.volume)) {
      const previousVolumeValue = previousVolume.current || 30;
      setCurrentVolumne(previousVolumeValue);
      videoRef.current.volume = previousVolumeValue / 100;
    }
  }, []);

  const tooglePlay = useCallback(() => {
    if (videoStatus === VIDEO_STATUS.paused) {
      videoRef?.current?.play();
      setVideoStatus(VIDEO_STATUS.play);
    }

    if (videoStatus === VIDEO_STATUS.play) {
      videoRef?.current?.pause();
      setVideoStatus(VIDEO_STATUS.paused);
    }
  }, [videoStatus]);

  const onPlay = useCallback(() => {
    videoRef?.current?.play();
    setVideoStatus(VIDEO_STATUS.play);
  }, []);

  const onPaused = useCallback(() => {
    videoRef?.current?.pause();
    setVideoStatus(VIDEO_STATUS.paused);
  }, []);

  const openSound = useCallback(() => {
    setIsSoundOpen(true);
  }, []);

  const closeSound = useCallback(() => {
    setIsSoundOpen(false);
  }, []);

  const onExpand = useCallback(() => {
    if (videoRef?.current?.requestFullscreen) {
      videoRef?.current?.requestFullscreen();
    } else if (videoRef?.current?.webkitRequestFullscreen) {
      videoRef?.current?.webkitRequestFullscreen();
    } else if (videoRef?.current?.msRequestFullscreen) {
      videoRef?.current?.msRequestFullscreen();
    }
  }, []);

  useEffect(() => {
    onPlay();
    if (videoRef?.current?.volume) {
      videoRef.current.volume = 30 / 100;
    }
    const interval = setInterval(() => {
      if (videoRef?.current?.duration) {
        setDuration(videoRef?.current?.duration);
      }

      if (videoRef?.current?.currentTime) {
        setCurrentTime(videoRef?.current?.currentTime);
      }

      if (videoRef?.current?.currentTime === videoRef?.current?.duration) {
        setVideoStatus(VIDEO_STATUS.paused);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return (
    <div className={`video-player_wrap ${customClassName}`}>
    <video
      ref={videoRef}
      className={`video-player_video ${type === TYPE_MEDIA_NFT.AUDIO && '!h-[66px]'}`}
      onClick={tooglePlay}
      autoPlay
      muted={currentVolume === 0}
      key={key}
    >
      <source src={URL.createObjectURL(file)} />
    </video>
      <div
        className={cls('lg:!w-[95%] lg:!mx-2 !w-full video-player_controls  !bottom-2 ', {
          'video-player_controls_mp3': type ===TYPE_MEDIA_NFT.AUDIO,
        })}
      >
        <div className="video-player_controls_control">
          {videoStatus === VIDEO_STATUS.paused && (
            <img
              src="/icons/play-fill-icon.svg"
              className="video-player_controls_item"
              onClick={onPlay}
            />
          )}
          {videoStatus === VIDEO_STATUS.play && (
            <img
              src="/icons/pause-fill-icon.svg"
              className="video-player_controls_item"
              onClick={onPaused}
            />
          )}
        </div>
        <div className="video-player_controls_sliders !w-[120px]">
          <Slider
            classes={{
              thumb: 'slider-custom__thumb',
              rail: 'slider-custom__rail',
              track: 'slider-custom__track',
            }}
            onChange={onSliderChange}
            className="slider-custom"
            value={currentTime}
            min={0}
            max={duration}
            color="secondary"
          />
        </div>
        <div className="video-player_controls_times">
          <span>{formatDuration(currentTime)}</span>
        </div>
        {type === TYPE_MEDIA_NFT.VIDEO && (
          <div className="video-player_controls_expand">
            <img
              src="/icons/expand-fill-icon.svg"
              className="video-player_controls_item"
              onClick={onExpand}
            />
          </div>
        )}
        <div
          className="video-player_controls_sound"
          onMouseEnter={openSound}
          onMouseLeave={closeSound}
        >
          {currentVolume > 0 ? (
            <img
              src="/icons/sound-fill-icon.svg"
              className="video-player_controls_item"
              onClick={mute}
            />
          ) : (
            <img
              src="/icons/sound-mute-icon.svg"
              className="video-player_controls_item"
              onClick={unMute}
            />
          )}
          <Slider
            classes={{
              thumb: 'slider-custom__thumb',
              rail: 'slider-custom__rail',
              track: 'slider-custom__track',
            }}
            onChange={onVolumeChange}
            orientation="vertical"
            value={currentVolume}
            className={`video-player_controls_sound_picker ${isSoundOpen ? '' : 'hidden'}`}
          />
        </div>
      </div>
    </div>
  );
};

MediaPlayCreateNft.propTypes = {
  src: PropTypes.any,
  type: PropTypes.any,
};

export default MediaPlayCreateNft;
