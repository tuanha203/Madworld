import React from 'react'
import Chip from '@mui/material/Chip';


// export const CategoryChip = () => {
//     return (
//         <div className='category-chip min-w-[100px] flex justify-center items-center py-[6px] rounded text--label-large capitalize text-archive-Neutral-Variant80  bg-background-dark-600 shadow-elevation-dark-1'>
//             collection
//         </div>
//     )
// }

interface ICategoryChip {
    label: string
    scheme?: string
    state?: string
    customClass?: string
    onClick: () => void;
  }
  
  export const CategoryChip = ({ label, scheme, state, customClass, onClick }: ICategoryChip) => {
    return (
      <Chip
        label={label}
        clickable
        disabled={state === 'disabled'}
        onClick={onClick}
        className={`!border !px-[6px] py-[16px] !border-solid text-archive-Neutral-Variant80 basic-chip assistive-chip ${scheme} ${customClass}`}
      />
    );
  };