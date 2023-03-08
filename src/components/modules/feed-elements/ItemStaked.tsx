import React from 'react'
import { IconViewGraph } from 'components/common/iconography/IconBundle'
import { MadPriceMedium } from 'components/common/price'
import { Avatar } from '../thumbnail'

const ItemStaked = () => {
    return (
        <div className="staked-item flex max-content-width justify-between items-center gap-14 py-4 px-6 rounded-xl bg-background-dark-600">
            <div className='flex items-center gap-6'>
                <Avatar rounded="false" src="/images/LadyLuck7.png" />
                <div>
                    <div className='text-white text--title-medium'>Lady Luck #7</div>
                    <div className='text--label-small text-archive-Neutral-Variant70'>2h ago</div>
                </div>
            </div>
            <div className='text-center '>
                <div className='text--label-small text-white/60'>Value</div>
                <MadPriceMedium umad="20" />
            </div>
            <div className='text-center  '>
                <div className='text--label-small text-white/60'>Rewards</div>
                <MadPriceMedium umad="20" />
            </div>
            <div className='text-center '>
                <div className='text--label-small text-white/60'>APRs</div>
                <div className='text--title-medium text-white'>15%</div>
            </div>
            <div className='cursor-pointer'>
                <IconViewGraph />
            </div>
        </div>
    )
}

export default ItemStaked