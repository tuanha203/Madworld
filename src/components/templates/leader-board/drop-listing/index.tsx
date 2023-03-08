import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import DropCardSingle from 'components/modules/cards/DropCardSingle';
import NewsLetter from 'components/templates/homepage/news-letter';
import _ from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useDispatch } from 'react-redux';
import dropCollectionService from 'service/dropCollectionService';
import { toastError } from 'store/actions/toast';

interface IParamsType {
  limit?: number;
  page?: number;
  type?: string;
  categories?: string[];
  isDisplayHomepage?: boolean;
  isDisplay?: boolean;
}

var PAGE = 1;

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 821 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 821, min: 0 },
    items: 1,
    partialVisibilityGutter: 40,
  },
};

const DropListingHomepage = () => {
  const dispatch = useDispatch();
  const [listDropsCollection, setListDropsCollection] = useState([]);

  async function fetchListDropsCollection(params: any, more?: boolean) {
    try {
      const [response, error] = await dropCollectionService.getDropCollectionAll(params);
      if (error) {
        dispatch(toastError('Something went wrong'));
      }
      const collections = (await _.get(response, 'items')) || [];
      if (more) {
        const list: any = [...listDropsCollection, ...collections];
        setListDropsCollection(list);
      } else {
        setListDropsCollection(collections);
      }
    } catch (error) {
      dispatch(toastError('Something went wrong'));
    } finally {
    }
  }

  async function handleLoadMore(e: number) {
    if (e === listDropsCollection.length - 4) {
      PAGE += 1;
      let params: any = {
        limit: 5,
        page: PAGE,
        isDisplay: true,
        type: 'ALLTIME',
      };
      await fetchListDropsCollection(params, true);
    }
  }

  useEffect(() => {
    const params = {
      limit: 5,
      page: 1,
      isDisplay: true,
      type: 'ALLTIME',
    };
    fetchListDropsCollection(params);
  }, []);
  return (
    <section className="banner-leader-board-section relative bg-background-preview-sell py-[48px]">
      <div
        className={`drop-section-wrapper ${
          listDropsCollection.length <= 2 ? 'layout' : 'max-w-[1188px]'
        }  mx-auto !pb-0`}
      >
        <div className={`w-full flex flex-row items-center justify-between px-[16px] lg:px-0 layout mx-auto`}>
          <div className={`flex flex-row justify-center items-center gap-2 `}>
            <figure className="xl:w-12 w-6">
              <img
                className="w-full object-cover mx-auto xl:mb-3"
                src="./icons/AirDrop.svg"
                alt=""
              />
            </figure>
            <h1
              className={`text--headline-small xl:text--display-large capitaliz m-0 xl:!font-Hanson`}
            >
              Drops
            </h1>
          </div>
          {
           listDropsCollection.length > 3 && (
              <div className="flex items-center gap-2 cursor-pointer">
            <div className="text--label-large text-primary-dark hidden lg:flex">
              <Link href="/drops-collection">View All</Link>
            </div>
            <figure className="cursor-pointer">
              <Link href="/drops-collection">
                <ArrowForwardOutlinedIcon className="text-primary-dark" />
              </Link>
            </figure>
          </div>
            )
          }
        </div>
        <div
          className={`drop-listing-homepage-wrapper mt-6 xl:mt-[48px] ${
            listDropsCollection.length <= 2 && '!overflow-visible'
          }`}
        >
          <div className="drop-listing-homepage !mx-0 lg:!mx-[10px]">
            {listDropsCollection.length === 0 ? (
              <NewsLetter />
            ) : listDropsCollection.length <= 2 ? (
              <NewsLetter cards={listDropsCollection} />
            ) : (
              <Carousel
                responsive={responsive}
                itemClass="card-slide"
                autoPlay={false}
                autoPlaySpeed={1000 * 1000}
                slidesToSlide={1}
                beforeChange={handleLoadMore}
                shouldResetAutoplay={false}
                draggable={false}
                partialVisible={true}
              >
                {listDropsCollection.map((DropsItem: any) => {
                  return (
                    <div className="mx-[16px]" key={DropsItem?.address + DropsItem.id}>
                      <DropCardSingle
                        dropId={DropsItem.id}
                        collectionTitle={DropsItem.name}
                        artist={DropsItem.creatorName}
                        imgCover={DropsItem.bannerUrl}
                        imgAvatar={DropsItem.thumbnailUrl}
                        timePoster={DropsItem.postedAt}
                        expiredTime={moment(DropsItem.expiredTime).unix()}
                        externalLink={DropsItem.externalLink}
                      />
                    </div>
                  );
                })}
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DropListingHomepage;
