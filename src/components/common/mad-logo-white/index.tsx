import React from 'react'

const MadLogoWhite = ({url, style}:any) => {
  return (
    <figure className='w-[150px]'>
      <img className='w-full object-cover' src={url || "/images/topLogoWhite.svg"} alt="logo" style={style} />
    </figure>
  )
}

export default MadLogoWhite