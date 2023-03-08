import OverviewSectionCard from 'components/modules/cards/OverviewSectionCard';
import OverviewSectionFeaturedCard from 'components/modules/cards/OverviewSectionFeatureCard';
import SliderButton from 'components/modules/slider-button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import homePageService from 'service/homePageService';

const OverviewSectionHomepage = () => {
  const router = useRouter();

  const containerRef = useRef<any>();
  const [slideState, setSlideState] = useState({
    left: false,
    right: true,
  });
  const [listItemHot, setListItemHot] = useState<any>([]);
  const [features, setFeatures] = useState<any>([]);
  const [cardTop, setCardTop] = useState<any>([]);
  const [cardBottom, setCardBottom] = useState<any>([]);

  const MAX_SCROLL_LEFT = containerRef.current?.scrollWidth - containerRef.current?.clientWidth;
  let STEP_SCROLL = 0;
  if (typeof window !== 'undefined') {
    STEP_SCROLL = window?.innerWidth * 0.7;
  }

  const handleScroll = useCallback(
    (e: any) => {
      if (
        (!slideState.right || !slideState.left) &&
        Math.ceil(e.target.scrollLeft) < MAX_SCROLL_LEFT &&
        Math.floor(e.target.scrollLeft) > 0
      )
        setSlideState({ right: true, left: true });

      if (Math.ceil(e.target.scrollLeft) >= MAX_SCROLL_LEFT)
        return setSlideState({ left: true, right: false });
      if (Math.floor(e.target.scrollLeft) <= 0) return setSlideState({ right: true, left: false });
    },
    [MAX_SCROLL_LEFT],
  );

  const getListItemHot = useCallback(async () => {
    const paramaterQuery = {
      hotTimeFilter: 'ALLTIME',
      trendingType: 'COLLECTION',
      limit: 23,
    };
    const [data, error] = await homePageService.getListItemHot(paramaterQuery);
    if (error) {
      console.log(error);
      return;
    }
    setListItemHot(data.items);
  }, []);

  useEffect(() => {
    getListItemHot();
  }, []);

  useEffect(() => {
    if (listItemHot.length > 0) {
      const list = listItemHot.slice(3, listItemHot.length);
      const features = listItemHot.slice(0, 3);
      let top: any = [];
      let bottom: any = [];
      list.forEach((e: any, ix: any) => {
        if (ix % 2 === 0) {
          top.push(e);
        } else {
          bottom.push(e);
        }
      });
      setCardTop(top);
      setFeatures(features);
      setCardBottom(bottom);
    }
  }, [listItemHot]);

  useEffect(() => {
    containerRef.current.addEventListener('scroll', handleScroll);
  }, [MAX_SCROLL_LEFT]);

  return (
    <section className="overview-section-homepage relative bg-background-dark-900 ">
      <div
        ref={containerRef as any}
        className="overview-section-homepage-wrapper pt-4 pb-12  flex gap-6 md:overflow-x-hidden sm:overflow-x-auto no-scrollbar scroll-smooth"
      >
        <div className="ml-4 md:ml-[10rem]">
          <OverviewSectionFeaturedCard data={features as any[]} />
        </div>
        <div className="flex flex-col gap-4 mr-[144px]">
          <div className="flex items-center gap-4">
            {cardTop.map((card: any, index: number) => (
              <Link href={`/collection/${card?.address}`}>
                <a>
                  <div key={index} className="card-scroll">
                    <OverviewSectionCard
                      img={card?.thumbnail_url}
                      artworkTitle={card?.title || card?.name}
                      width={268}
                    />

                  </div>
                </a>
              </Link>
            ))}
          </div>
          <div className="!mt-[10px] flex items-center gap-4">
            {cardBottom.map((card: any, index: number) => (
              <Link href={`/collection/${card?.address}`}>
                <a>
                  <div key={index} className="card-scroll">
                    <OverviewSectionCard
                      img={card?.thumbnail_url}
                      artworkTitle={card?.title || card?.name}
                      width={268}
                    />
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div
        onClick={() => (containerRef.current.scrollLeft += STEP_SCROLL)}
        className={`slider-button-wrapper absolute right-[5%] top-[40%] z-[99] md:block sm:hidden`}
      >
        {slideState.right && listItemHot.length > 9 ? (
          <SliderButton state={slideState.right ? 'active' : 'disabled'} />
        ) : null}
      </div>
      <div
        onClick={() => (containerRef.current.scrollLeft -= STEP_SCROLL)}
        className={`slider-button-wrapper absolute left-[5%] top-[40%] z-[99] md:block sm:hidden ${slideState ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {slideState.left ? (
          <SliderButton state={slideState.left ? 'active' : 'disabled'} direction="left" />
        ) : null}
      </div>
    </section>
  );
};

export default OverviewSectionHomepage;
