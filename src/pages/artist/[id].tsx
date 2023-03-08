import TabAsset from 'components/templates/artist/asset/TabAsset';
import TabFeed from 'components/templates/artist/feed/TabFeed';
import HeaderArtist from 'components/templates/artist/header/HeaderArtist';
import TabInsights from 'components/templates/artist/insights/TabInsights';
import { ARTIST_TAB } from 'constants/app';
import _ from 'lodash';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { theme } from 'pages/asset/[address]/[tokenId]';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'react-multi-carousel/lib/styles.css';
import { useDispatch } from 'react-redux';
import userService from 'service/userService';
import { themeActions } from 'store/constants/theme';
import { initialStateTheme } from 'store/reducers/theme';
import { convertUrlImage } from 'utils/image';
interface IArtistProfilePageProps {
  userData: any;
  theme: any;
}
export interface IArtristfilter {
  sortField?: string;
  priceType?: string;
  saleType?: string;
  startPrice?: number;
  endPrice?: number;
}


const ArtistProfilePage: NextPage<IArtistProfilePageProps> = (props) => {
  const [tabSelected, setTabSelected] = useState<ARTIST_TAB | null>(null);
  const router = useRouter();
  const { id, edit } = router.query;
  const { userData = {}, theme } = props;
  const rootParams = useRef<any>({});
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: themeActions.TOGGLE_THEME,
      payload: {
        ...theme,
      },
    });
    return () => {
      dispatch({
        type: themeActions.TOGGLE_THEME,
        payload: {
          ...initialStateTheme,
        },
      });
    };
  }, []);

  const onPushRouter = (params: any) => {
    const paramsRouter = { ...rootParams.current };
    delete paramsRouter.id;
    const url = { pathname: `/artist/${id}`, query: params || paramsRouter };
    const options = { scroll: false };
    router.push(url, undefined, options);
  };

  useEffect(() => {
    if (!router.query.tabActive) {
      rootParams.current = {};
    }
    delete rootParams.current.edit;
    rootParams.current = { ...rootParams.current, ...router.query };
    debounceLoadData({ ...rootParams.current });
  }, [router]);

  const debounceLoadData = useCallback(
    _.debounce(async (params) => {
      if (params.tabActive) {
        setTabSelected(params.tabActive);
      } else {
        setTabSelected(ARTIST_TAB.ASSET);
      }
    }, 150),
    [],
  );

  function handleClickTab(tabClick: ARTIST_TAB) {
    rootParams.current.tabActive = tabClick;
    onPushRouter(null);
    if (tabClick !== tabSelected) setTabSelected(tabClick);
  }

  return (
    <div>
      <Head>
        <title>{userData.username}</title>
        <meta property="og:title" content={userData.username || ''} key="title" />
        <meta name="description" content={userData.description || ''} key="description" />
        <meta
          property="og:image"
          content={convertUrlImage(userData.avatarImg, 'Avatar')}
          key="image"
        />
      </Head>
      <HeaderArtist
        isAvatarClickEdit={edit ? edit === 'true' : false}
        id={id}
        tabSelected={tabSelected}
        handleClickTab={handleClickTab}
      />
      <div className="layout mx-auto">
        {tabSelected === ARTIST_TAB.ASSET && <TabAsset />}
        {tabSelected === ARTIST_TAB.INSIGHTS && <TabInsights />}
        {tabSelected === ARTIST_TAB.FEED && <TabFeed walletAddress={id as string} />}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  try {
    // await basicAuthCheck(req, res);
    const { id } = params as any;
    const result: any = await userService.fetchSEOUserInfo(id);
    const response = await result.json();
    if (response) {
      // const theme = response?.creator?.flagshipStore?.theme || {};      
      return {
        props: {
          userData: response,
          theme: { ...theme },
        },
      };
    }
    return { props: {} };
  } catch {
    return { props: {} };
  }
};

export default ArtistProfilePage;
