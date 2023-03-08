import Asset from 'components/templates/collection/asset';
import CollectionHeader from 'components/templates/collection/header';
import TabInsights from 'components/templates/collection/insight';
import { COLLECTION_TAB } from 'constants/app';
import useUpdateEffect from 'hooks/useUpdateEffect';
import _ from 'lodash';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastError } from 'store/actions/toast';
import { themeActions } from 'store/constants/theme';
import { initialStateTheme } from 'store/reducers/theme';
import { checkOwner } from 'utils/func';
import { convertUrlImage } from 'utils/image';
import { STORAGE_KEYS } from 'utils/storage';
import collectionService from '../../service/collectionService';
import { theme } from 'pages/asset/[address]/[tokenId]';
interface ICollectionDetailType {
  address: string;
  walletAddress: string | null;
}

const Collection = (props: any) => {
  const [tab, setTab] = useState<COLLECTION_TAB | null>(3);
  const [dataCollection, setDataCollection] = useState<any>({});
  const [identityUrl, setIdentityUrl] = useState<string>('');
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const [isOwner, setOwner] = useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();
  let { query } = router;
  const { collectionData = {}, theme } = props;
  const cid = _.get(query, 'cid', '');

  const rootParams = useRef<any>({});

  const onPushRouter = (params: any) => {
    const paramsRouter = { ...rootParams.current };
    delete paramsRouter.cid;
    const url = {
      pathname: `/collection/${
        dataCollection?.shortUrl ? dataCollection?.shortUrl : dataCollection?.address
      }`,
      query: params || paramsRouter,
    };
    const options = { scroll: false };
    router.push(url, undefined, options);
  };

  const onChangeTab = (data: any) => {
    rootParams.current = {
      tab: data,
    };
    onPushRouter(null);
  };

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

  useEffect(() => {
    rootParams.current = { ...rootParams.current, ...router.query };
    if (dataCollection?.address) {
      debounceLoadData({ ...rootParams.current });
    }
  }, [router, dataCollection?.address]);

  const debounceLoadData = useCallback(
    _.debounce(async (params) => {
      if (params.tab) {
        setTab(parseInt(rootParams.current.tab));
      } else {
        setTab(COLLECTION_TAB.ASSET);
      }
    }, 150),
    [],
  );

  useEffect(() => {
    if (cid && (cid !== dataCollection?.address || cid !== dataCollection?.shortUrl)) {
      setIdentityUrl(cid.toString());
    }
  }, [cid, dataCollection]);

  useEffect(() => {
    const isOwner = checkOwner(dataCollection?.creator?.walletAddress, walletAddress);
    setOwner(isOwner);
  }, [walletAddress, dataCollection]);

  const getCollectionDetail = async (params: ICollectionDetailType, isEdit?: boolean) => {
    const [response, error] = await collectionService.getCollectionDetail(params);
    if (error) {
      router.push('/404');
      dispatch(toastError('Something went wrong'));
      return;
    }
    const data = _.get(response, 'data', {});
    setDataCollection(data);
    const paramsRouter = { ...router.query };
    delete paramsRouter.cid;
    const options = { scroll: false };
    if (data?.shortUrl && data?.shortUrl !== dataCollection.shortUrl) {
      const url: any = { pathname: `/collection/${data?.shortUrl}`, query: paramsRouter };
      router.replace(url, undefined, options);
    } else if (isEdit && !data?.shortUrl) {
      const url: any = { pathname: `/collection/${data?.address}`, query: paramsRouter };
      router.replace(url, undefined, options);
    }
  };

  const handleRedirectGetCollectionDetail = () => {
    const walletAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS) as any;
    const params = {
      address: identityUrl,
      walletAddress,
    };
    getCollectionDetail(params);
  };

  const handleGetCollectionDetailAfterEdit = (shortUrl: string) => {
    const walletAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS) as any;
    if (shortUrl) {
      const params = {
        address: shortUrl,
        walletAddress,
      };

      getCollectionDetail(params, true);
    } else {
      const params = {
        address: dataCollection?.address,
        walletAddress,
      };
      getCollectionDetail(params, true);
    }
  };

  useEffect(() => {
    if (identityUrl) {
      handleRedirectGetCollectionDetail();
    }
  }, [identityUrl]);

  useUpdateEffect(() => {
    handleRedirectGetCollectionDetail();
  }, [walletAddress]);

  return (
    <div>
      <Head>
        <title>{collectionData.title}</title>
        <meta property="og:title" content={collectionData.title} key="title" />
        <meta name="description" content={collectionData.description} key="description" />
        <meta
          property="og:image"
          content={convertUrlImage(collectionData.thumbnailUrl)}
          key="image"
        />
      </Head>
      <CollectionHeader
        onLoadData={handleGetCollectionDetailAfterEdit}
        tab={tab}
        setTab={onChangeTab}
        dataCollection={dataCollection}
        isOwner={isOwner}
      />
      {tab === COLLECTION_TAB.ASSET && (
        <Asset
          isOwner={isOwner}
          typeCollection={dataCollection?.type}
          addressCollection={dataCollection?.address}
          shortUrl={dataCollection?.shortUrl}
          nameCollection={dataCollection?.title || dataCollection?.name}
          thumbnailCollection={dataCollection?.thumbnailUrl}
        />
      )}

      {tab === COLLECTION_TAB.INSIGHTS && (
        <div className="layout mx-auto">
          <TabInsights address={identityUrl} shortUrl={dataCollection?.shortUrl} />
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  try {
    // await basicAuthCheck(req, res);
    const { cid } = params as any;
    const result: any = await collectionService.fetchSEOCollectionDetails(cid);
    const response = await result.json();
    if (response) {
      // const theme = response?.creator?.flagshipStore?.theme || {};
      return { props: { collectionData: response, theme } };
    }
    return { props: {} };
  } catch {
    return { props: {} };
  }
};

export default Collection;
