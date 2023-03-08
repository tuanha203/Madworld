import React from 'react'
import Filter from 'components/modules/customTitleFilter'
import ArtistFollowCard from 'components/modules/cards/ArtistFollowCard'

const TrendingSectionHompage = () => {
  return (
    <section className="trending-section-homepage bg-background-dark-800 ">
      <div className='trending-section-homepage container padded'>
        <Filter period={false} headline="Trending" />
        <div className="treding-listing grid gap-4">
          {
            [0, 1, 2].map((card, index) => (
              <ArtistFollowCard key={index} />
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default TrendingSectionHompage