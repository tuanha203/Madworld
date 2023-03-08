import React, { useState } from 'react'
import { FilledButton } from 'components/common/buttons';
import { DropData } from './data';
import { LeaderboardArtistList, LeaderboardCollectionList } from 'components/modules/leaderboardList/LeaderboardList';
import Filter from 'components/modules/customTitleFilter';
import Link from 'next/link'

const HotCollectionSection = () => {
  const [category, setCategory] = useState();

  const collectionListing = (
    DropData.map((chip, index) =>
      <Link key={index} passHref href={`/collection/${chip.index}`}>
        <a>
          <LeaderboardCollectionList index={chip.index} collectionName={chip.artist} />
        </a>
      </Link>
    )
  )

  const artistListing = (
    DropData.map((chip, index) =>
      <Link passHref key={index} href={`/artist/${chip.index}`}>
        <a>
          <LeaderboardArtistList index={chip.index} artistName={chip.artist} />
        </a>
      </Link>
    )
  )

  return (
    <section className="hot-collection-section bg-background-dark-900 overflow-hidden">
      <div className="hot-collection-section-wrapper container padded">
        <div className='w-full flex flex-row items-center justify-between'>
          <Filter categoryCallback={setCategory} />
        </div>
        <div className='collection-listing-homepage grid gap-6 mb-8'>

          {/* collection is by  default  */}
          {
            (category == "artist") ? artistListing
              : (category == "brands") ? "brand"
                : (category == "drops") ? "drops"
                  : (category == "offers") ? "offers"
                    : collectionListing
          }
        </div>
        <div className='hot-collection-section flex items-center capitalize'>
          <FilledButton text="View Collection Leaderboard 1" />
        </div>
      </div>
    </section>
  )
}

export default HotCollectionSection