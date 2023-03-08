import React from 'react'
import { DropData } from './data';
import DropCardSingle from 'components/modules/cards/DropCardSingle';
import { SharedViewAll } from 'components/modules/genericShare/ShareViewAll';
import CircularProgressIndicator from 'components/common/progress-indicator';

const DropListingHomepage = () => {
  return (
    <section className="drop-section bg-background-dark-800">
      <div className="drop-section-wrapper container padded">
        <div className='w-full flex flex-row items-center justify-between -mt-8'>
          <div className='flex flex-row justify-center items-center gap-2'>
            <figure className='w-12'>
              <img className='w-full object-cover mx-auto mb-3' src="./icons/AirDrop.svg" alt="" />
            </figure>
            <h1 className='text--display-large capitalize'>Drops</h1>
          </div>
          <SharedViewAll />
        </div>
        <div className='drop-listing-homepage grid gap-4'>

          {(DropData) ? (
            DropData.map((drop: any, index: any) => {
              if (index < 3) {
                return (
                  // console.log(drop),
                  <DropCardSingle
                    key={drop._id}
                    collectionTitle={drop.drop_name}
                    artist={drop.artist}
                    timePoster={drop.timePoster}
                     expiredTime={drop.expiredTime}
                    externalLink={drop.externalLink}
                  />
                )
              }
            })
          ) :
            <CircularProgressIndicator />
          }
        </div>
      </div>
    </section>
  )
}

export default DropListingHomepage