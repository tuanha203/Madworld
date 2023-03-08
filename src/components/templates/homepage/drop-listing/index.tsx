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
  const [listDrops, setListDrops] = useState([]);

  async function fetchListDropsCollection(params: any, more?: boolean) {
    try {
      const [response, error] = await dropCollectionService.getDropCollectionAll(params);
      if (error) dispatch(toastError('Something went wrong'));
      const collections = (await _.get(response, 'items')) || [];
      if (!_.isEmpty(collections)) {
        if (more) {
          const list: any = [...listDrops, ...collections];
          setListDrops(list);
        } else {
          setListDrops(collections);
        }
      }
    } catch (error) {
      dispatch(toastError('Something went wrong'));
    } finally {
    }
  }

  async function handleLoadMore(e: number) {
    if (e === listDrops.length - 4) {
      PAGE += 1;
      let params: any = {
        limit: 5,
        page: PAGE,
        isDisplayHomepage: true,
        type: 'ALLTIME',
      };
      await fetchListDropsCollection(params, true);
    }
  }

  useEffect(() => {
    const params = {
      limit: 5,
      page: 1,
      isDisplayHomepage: true,
      type: 'ALLTIME',
    };
    fetchListDropsCollection(params);
  }, []);

  const Header = ({ showTitle = true, showLink = false, classTitle, classLink }: any) => {
    return (
      <div
        className={`w-full flex flex-row items-center justify-between px-[16px] lg:px-0 layout mx-auto`}
      >
        {showTitle && (
          <div className={`flex flex-row justify-center items-center gap-2  ${classTitle}`}>
            <figure className="xl:w-12 w-6">
              <img
                className="w-full object-cover mx-auto xl:mb-3"
                src="./icons/AirDrop.svg"
                alt=""
              />
            </figure>
            <h1
              className={`text--display-large capitaliz m-0 lg:!font-Hanson text-[24px] lg:text-[45px]`}
            >
              Drops
            </h1>
          </div>
        )}
        {showLink && (
          <div className={`flex items-center gap-2 cursor-pointer ${classLink}`}>
            <div className="text--label-large text-primary-dark hidden lg:flex">
              <Link href="/drops-collection">View All</Link>
            </div>
            <figure className="cursor-pointer">
              <Link href="/drops-collection">
                <ArrowForwardOutlinedIcon className="text-primary-dark" />
              </Link>
            </figure>
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      className={`banner-leader-board-section relative bg-background-preview-sell lg:py-[64px] py-[15px] ${
        listDrops.length === 0 && 'bg-drop'
      }`}
    >
      <>
        <Header showLink={listDrops.length > 3} />
        <div
          className={`drop-section-wrapper ${
            listDrops.length <= 2 ? 'layout' : 'max-w-[1148px]'
          }  mx-auto !pb-0`}
        >
          <div
            className={`drop-listing-homepage-wrapper lg:mt-[48px] ${
              listDrops.length <= 2 && '!overflow-visible'
            }`}
          >
            {listDrops.length === 0 ? (
              <NewsLetter />
            ) : listDrops.length <= 2 ? (
              <NewsLetter cards={listDrops} />
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
                {listDrops.map((DropsItem: any) => {
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
      </>
    </section>
  );
};

export default DropListingHomepage;
