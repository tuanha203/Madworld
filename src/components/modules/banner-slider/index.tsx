import { EmojiFire } from 'components/common/Emojies/emojies';
import ImageBase from 'components/common/ImageBase';
import SliderButton from 'components/modules/slider-button';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import Link from 'next/link';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SlidePagination from './SlidePagination';

interface IBannerSliderProps<T> {
  title: string | Element | ReactNode;
  records: {
    items: T[];
    total: number;
  };
  limit?: number;
  typeThumbnail?: 'small' | 'large';
  imgThumbnail?: string;
  renderer: (item: T, index: number) => Element | ReactNode;
  renderFooterImg?: Element | ReactNode;
  className?: string;
  renderHeader?: Element | ReactNode;
  linkRedirect?: string;
  nextBtn?: boolean;
  prevBtn?: boolean;
}

const BannerSlider = <T extends unknown>(props: IBannerSliderProps<T>) => {
  const {
    title,
    records,
    limit = 6,
    renderer,
    typeThumbnail = 'small',
    imgThumbnail,
    renderFooterImg,
    renderHeader,
    className,
    linkRedirect,
    nextBtn = true,
    prevBtn = true,
  } = props;

  const containerRef = useRef<any>();
  const currentPage = useRef<any>(1);
  const [slideState, setSlideState] = useState({
    left: false,
    right: true,
  });

  const MAX_SCROLL_LEFT = containerRef.current?.scrollWidth - containerRef.current?.clientWidth;

  let STEP_SCROLL = 0;
  if (typeof window !== 'undefined') {
    /**
     * * Each card item width is 246 multiple * 4 plus additional gap
     */
    STEP_SCROLL = 1155; // HOT FIX CAN XEM LAI DE FIX CHUAN HON
    // STEP_SCROLL = 246 * 4 + 72;
  }

  const handleScroll = useCallback(
    (e: any) => {
      if (
        (!slideState.right || !slideState.left) &&
        Math.ceil(e.target.scrollLeft) < MAX_SCROLL_LEFT &&
        Math.floor(e.target.scrollLeft) > 0
      ){
        setSlideState({ right: true, left: true });
      }
      if (Math.ceil(e.target.scrollLeft) >= MAX_SCROLL_LEFT) {
        return setSlideState({ left: true, right: false });
      }
      if (Math.floor(e.target.scrollLeft) <= 0) return setSlideState({ right: true, left: false });
    },
    [MAX_SCROLL_LEFT],
  );

  const { cardTop, cardBottom } = useMemo(() => {
    let cardTop: T[] = [];
    let cardBottom: T[] = [];
    [...records.items].forEach((e: any, index: number) => {
      if (index % 2 === 0) {
        cardTop.push(e);
      } else cardBottom.push(e);
    });
    if (typeThumbnail === 'small') {
      const item = cardTop.splice(cardTop.length - 1, 1) || [];
      cardBottom = cardBottom.concat(item);
      return {
        cardTop,
        cardBottom,
      };
    }
    return {
      cardTop,
      cardBottom,
    };
  }, [records]);

  useEffect(() => {
    containerRef.current.addEventListener('scroll', handleScroll);
  }, [MAX_SCROLL_LEFT]);
  const LinkCheck = () => {
    if (linkRedirect) {
      return (
        <Link href={linkRedirect}>
          <a>
            <ImageBase
              className="h-[425px] object-cover"
              width={'100%'}
              type="HtmlImage"
              url={imgThumbnail}
            />
          </a>
        </Link>
      );
    }
    return <ImageBase className="h-[425px]" width={'100%'} type="HtmlImage" url={imgThumbnail} />;
  };
  return (
    <section
      className={`banner-leader-board-section relative bg-background-black-pearl pb-[20px] ${className}`}
    >
      <div className="layout mx-auto pb-[36px]  lg:p-0">
        {renderHeader}
        <div
          ref={containerRef as any}
          className="px-[16px] lg:px-0 pt-4 pb-12 flex gap-6 max-w-[100%] no-scrollbar overflow-x-auto lg:overflow-x-hidden scroll-smooth"
        >
          <div className="flex flex-col gap-[24px]">
            <>
              {typeThumbnail === 'small' && (
                <>
                  <div className="flex items-center gap-[16px] lg:gap-[24px]">
                    <div className="flex min-w-[552px]">
                      <EmojiFire />
                      <div className="text--display-large ml-4">{title}</div>
                    </div>
                    {cardTop.map((card, index: number) => renderer(card, index))}
                  </div>
                  <div className="flex items-center gap-[16px] lg:gap-[24px]">
                    {cardBottom.map((card, index: number) => renderer(card, index))}
                  </div>
                </>
              )}
              {typeThumbnail === 'large' && (
                <div className="flex gap-[16px] lg:gap-[24px]">
                  <div className="w-[92vw] lg:w-[unset] lg:min-w-[552px]">
                    <LinkCheck />
                    <div className="mt-[21px] mr-[50px]">{renderFooterImg}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-[16px] lg:gap-[24px]">
                      {cardTop.map((card, index: number) => renderer(card, index))}
                    </div>
                    <div className="flex items-center gap-[16px] lg:gap-[24px] mt-[24px]">
                      {cardBottom.map((card, index: number) => renderer(card, index))}
                    </div>
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
        {nextBtn && (
          <div
            onClick={() => {
              containerRef.current.scrollLeft += STEP_SCROLL;
              currentPage.current++;
            }}
            className={`slider-button-wrapper absolute right-[5%] top-[40%] z-[99]`}
          >
            {slideState.right && records.total > 8 ? (
              <SliderButton state={slideState.right ? 'active' : 'disabled'} />
            ) : null}
          </div>
        )}
        {prevBtn && (
          <div
            onClick={() => {
              containerRef.current.scrollLeft -= STEP_SCROLL;
              currentPage.current--;
            }}
            className={`slider-button-wrapper absolute left-[5%] top-[40%] z-[99] ${
              slideState ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slideState.left ? (
              <SliderButton state={slideState.left ? 'active' : 'disabled'} direction="left" />
            ) : null}
          </div>
        )}
        <div className="px-[16px] lg:px-0">
          <SlidePagination
            currentPage={currentPage.current}
            total={records.total}
            limit={limit}
            onPaginationChange={(selectedPage) => {
              if (selectedPage > currentPage.current) {
                containerRef.current.scrollLeft +=
                  (selectedPage - currentPage.current) * STEP_SCROLL;
              } else {
                containerRef.current.scrollLeft -=
                  (currentPage.current - selectedPage) * STEP_SCROLL;
              }
              currentPage.current = selectedPage;
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;
