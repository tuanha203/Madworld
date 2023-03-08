import { Box, StyledEngineProvider } from '@mui/material';
import { Web3ReactProvider } from '@web3-react/core';
import DefaultLayout from 'components/layout';
import AppContainer from 'components/layout/AppContainer';
import Web3ReactManager from 'components/web3/Web3ReactManager';
import { providers } from 'ethers';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { wrapper } from 'store/configureStore';
import { themeActions } from 'store/constants/theme';
import { initialStateTheme } from 'store/reducers/theme';
import 'swiper/css/bundle';
import '../styles/index.scss';
import '../styles/normalize.css';

function getLibrary(provider: any) {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 15000;
  return library;
}

function MyApp({ Component, pageProps }: AppProps) {
  const store: any = useStore();
  const dispatch = useDispatch();
  const Gate: any = typeof window !== 'undefined' ? PersistGate : Box;
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.onbeforeunload = ()=> {
      dispatch({
        type: themeActions.TOGGLE_THEME,
        payload: {
          ...initialStateTheme,
        },
      });
    };
  }, []);

  return (
    <>
      <Head>
        <title>MADworld NFT Marketplace</title>
        <meta property="og:title" content="MADworld NFT Marketplace" key="title" />
        <meta name="description" content="MADworld NFT Marketplace" key="description" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no,maximum-scale=1"
        />
        <meta name="og:type" content="website" />
        <meta
          property="og:image"
          content="https://madworld-market.sotatek.works/images/thumbnail.png"
          key="image"
        />
        <meta property="og:image:secure_url" content="/favicon.png" key="secure_image" />
        <meta property="og:image:alt" content="Crypto" key="imgAlt" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactManager>
          <StyledEngineProvider injectFirst>
            <Gate persistor={store.__persistor} loading={null}>
              <AppContainer>
                <DefaultLayout>
                  <div suppressHydrationWarning>
                    <Component {...pageProps} />
                  </div>
                </DefaultLayout>
              </AppContainer>
            </Gate>
          </StyledEngineProvider>
        </Web3ReactManager>
      </Web3ReactProvider>
    </>
  );
}
export default appWithTranslation(wrapper.withRedux(MyApp));
