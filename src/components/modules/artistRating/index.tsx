import React, { useState } from 'react';
import Rating from '@mui/material/Rating';

export default function ArtistRating({ index = "30" }) {
    const [value, setValue] = useState(4);

    return (
        <div className='artist-rating my-2 relative flex items-center px-2 py-2 gap-1 bg-background-dark-600'>
            <Rating name="read-only" value={value} readOnly />
            <div className='text--title-medium'>{index}</div>
            <div className='absolute top-0 left-0 right-0 scale-150 text-center'>
                <svg className='mx-auto translate-y-[-50%]' width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 0L14.8612 10.5H0.138784L7.5 0Z" fill="#3E3F4D" />
                </svg>
            </div>
        </div>
    );
}
ArtistRating.defaultProps = {
    index: "30",
}
