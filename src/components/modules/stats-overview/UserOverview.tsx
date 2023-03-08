import React from 'react'
import { IconLikes, TrendingUp } from 'components/common/iconography/IconBundle'

const UserOverview = () => {
    return (
        <div className="user-overview relative text--title-small max-content-width py-7 px-10  
            flex justify-between items-center capitalize bg-background-dark-600
             rounded-lg shadow-elevation-light-3
        ">
            <div className='data'>136 assets</div>
            <div className='data'>4 collections</div>
            <div className='data '>2k Followers</div>
            <div className='data ml-2 flex items-center gap-2'>
                <IconLikes index="90k" />
            </div>
            <div className='pr-2 pl-2 flex flex-col items-center justify-center'>
                <div className='flex items-center gap-2 text--title-small'>
                    <span className='-ml-1'>
                        <img className=' w-6' src="./icons/Eth.svg" alt="" />
                    </span>
                    <span>2k</span>
                </div>
                <div className='text--body-small'>$92,267</div>
            </div>
            <div className='last-data flex items-center gap-2'>
                <TrendingUp />
                <div>+ 20.65%</div>
            </div>
        </div>
    )
}

export default UserOverview