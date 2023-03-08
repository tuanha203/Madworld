import DropCardSingle from 'components/modules/cards/DropCardSingle';
import * as React from 'react';
import moment from 'moment';
import styles from './styles/carousel.module.scss';
import SliderButton from 'components/modules/slider-button';
import Subscribe from './subscribe';
import _ from 'lodash';

interface IPropsNewsLetter {
  cards?: any;
}

const NewsLetter = ({ cards = [] }: IPropsNewsLetter) => {
  const [isRightActive, setIsRightActive] = React.useState(false);
  return (
    <div className="lg:flex">
      <div className={`flex-1 mb-[50px] ${!_.isEmpty(cards) ? 'px-[16px]' : ''}  lg:px-0`}>
        {!cards || _.isEmpty(cards) ? (
          <div className="min-h-[530px] bg-[url('/images/NFT-banner.png')] bg-[center] bg-cover lg:bg-none">
            <img
              src="/images/NFT-banner.png"
              className="object-cover w-[965px] left-[-200px] top-[100px] lg:absolute hidden lg:flex"
            />
          </div>
        ) : cards.length === 1 ? (
          <div className="p-[30px] lg:p-0">
            <DropCardSingle
              dropId={cards[0]?.id}
              collectionTitle={cards[0]?.name}
              artist={cards[0]?.creatorName}
              imgCover={cards[0]?.bannerUrl}
              imgAvatar={cards[0]?.thumbnailUrl}
              timePoster={cards[0]?.postedAt}
              expiredTime={cards[0]?.expiredTime ? moment(cards[0]?.expiredTime).unix() : 0}
              externalLink={cards[0]?.externalLink}
              className="lg:mx-0"
            />
          </div>
        ) : (
          <>
            <div className={`${styles.gallery} h-[502px]`}>
              <div className={styles['gallery-container']}>
                <div
                  className={`${styles['gallery-item']} ${
                    styles[isRightActive ? 'nonactive-left' : 'active-left']
                  }`}
                >
                  <DropCardSingle
                    dropId={cards[0]?.id}
                    collectionTitle={cards[0]?.name}
                    artist={cards[0]?.creatorName}
                    imgCover={cards[0]?.bannerUrl}
                    imgAvatar={cards[0]?.thumbnailUrl}
                    timePoster={cards[0]?.postedAt}
                    expiredTime={cards[0]?.expiredTime ? moment(cards[0]?.expiredTime).unix() : 0}
                    externalLink={cards[0]?.externalLink}
                  />
                </div>
                <div
                  className={`${styles['gallery-item']} ${
                    styles[isRightActive ? 'active-right' : 'nonactive-right']
                  }`}
                >
                  <DropCardSingle
                    dropId={cards[1]?.id}
                    collectionTitle={cards[1]?.name}
                    artist={cards[1]?.creatorName}
                    imgCover={cards[1]?.bannerUrl}
                    imgAvatar={cards[1]?.thumbnailUrl}
                    timePoster={cards[1]?.postedAt}
                    expiredTime={moment(cards[1]?.expiredTime).unix()}
                    externalLink={cards[1]?.externalLink}
                  />
                </div>

                {isRightActive ? (
                  <div
                    onClick={() => {
                      setIsRightActive(false);
                    }}
                    className={`slider-button-wrapper absolute xl:left-[-30px] lg:left-0 left-[15px] top-[210px] z-[99]`}
                  >
                    <SliderButton state={'active'} direction="left" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setIsRightActive(true);
                    }}
                    className={`slider-button-wrapper absolute xl:right-[65px] lg:right-[30px] right-[15px] top-[210px] z-[99]`}
                  >
                    <SliderButton state={'active'} direction="right" />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Subscribe hiddenMore={!cards || _.isEmpty(cards)} />
    </div>
  );
};

export default NewsLetter;
