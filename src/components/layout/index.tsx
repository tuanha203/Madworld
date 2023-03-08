import { SnackbarCustom } from 'components/modules/toast-msg';
import { WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { useDispatch, useSelector } from 'react-redux';
import { toastMsgActons } from 'store/constants/toastMsg';
import Footer from './footer';
import Header from './header';

const DefaultLayout = (props: any) => {
  const { isOpen, type, message, txHash } = useSelector((state) => (state as any).toast);
  const dispatch = useDispatch();
  const windowMode = useDetectWindowMode();
  return (
    <div style={{ minHeight: '80vh', position: 'relative' }}>
      <Header />
      <div
        className="magin-bt-rp bg-background-asset-detail"
        style={{ minHeight: '80vh', position: 'relative' }}
      >
        {props.children}
      </div>
      <Footer isMobile={[WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode)} />
      <SnackbarCustom
        open={isOpen}
        severity={type}
        message={message}
        txHash={txHash}
        handleClose={() => dispatch({ type: toastMsgActons.CLOSE })}
      />
    </div>
  );
};

export default DefaultLayout;

export const getLayout = (page: any) => <DefaultLayout>{page}</DefaultLayout>;
