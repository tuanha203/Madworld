import React, { useState } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FilledButton } from 'components/common/buttons';


const MADGalleriesHomepage = () => {
  const categories = ['artist', 'collectibles', 'toys', 'scultures', 'physical', 'art', 'gaming', 'battles'];
  const [selectedCategory, setselectedCategory] = useState(categories[0]);
  const filterCategories = (event: any) => {
    setselectedCategory(event.target.value);
  };


  return (
    <section className="mad-galleries-section bg-background-dark-800  overflow-hidden">
      <div className="mad-galleries-section-wrapper container padded">
        <div className='w-full flex flex-row items-center justify-between'>
          <div className='flex flex-row justify-center items-center gap-2'>
            <figure className='w-12'>
              <img className='w-full object-cover mx-auto mb-3' src="./icons/finger.svg" alt="" />
            </figure>
            <h1 className='text--display-large capitalize'>MAD Galleries</h1>
          </div>
        </div>
        <div className='drop-listing-homepage flex flex-col gap-4 mb-10'>
          <div className="categories-filters mx-auto mb-10">
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={selectedCategory}
              onChange={filterCategories}
            >
              {
                categories.map((category, index) =>
                  <FormControlLabel className='mad-galleries-filtering' key={index} value={category} control={<Radio />} label={category} />
                )
              }
            </RadioGroup>
          </div>

          {/* <div className="drop-listing gap-8">
            {DropData.map((artist, index) => {
              if (index < 8) {
                return (
                  <CollectionArtistCard key={index} />
                )
              }
            }
            )}
          </div> */}
        </div>
        <div className='mad-galleries-section flex justify-center items-center capitalize'>
          <FilledButton text={`view ${selectedCategory}`} />
        </div>
      </div>
    </section>
  )
}

export default MADGalleriesHomepage
