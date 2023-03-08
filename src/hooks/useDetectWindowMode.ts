import { WINDOW_MODE } from 'constants/app';
import { useState } from 'react';
import useEventListener from './useEventListener';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

function useDetectWindowMode() {
  const [windowSize, setWindowSize] = useState<any>('');

  const handleSize = () => {
    let _size: string = '';
    if (window.innerWidth > 260) _size = WINDOW_MODE.SM;
    if (window.innerWidth > 600) _size = WINDOW_MODE.MD;
    if (window.innerWidth > 960) _size = WINDOW_MODE.LG;
    if (window.innerWidth > 1280) _size = WINDOW_MODE.XL;
    if (window.innerWidth > 1440) _size = WINDOW_MODE['2XL'];
    setWindowSize(_size);
  };

  useEventListener('resize', handleSize);

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
}

export default useDetectWindowMode;
