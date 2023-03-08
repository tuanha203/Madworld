import React from 'react'
import Link from 'next/link'
import { AddNumberPoint } from '../whitelist-elements/points'
const WhitelistFollow = () => {
    return (
        <div className="whitelist-follow w-[550px] py-6 px-4 flex justify-between items-center bg-background-dark-600">
            <a href=" /" className='flex items-center gap-4 cursor-pointer'>
                <img className='w-7' src="./social/Icon_twitter_original.svg" alt="" />
                <h2 className='text--title-medium text-primary-dark hover:underline'>Follow @Madworldnft on Twitter</h2>
            </a>
            <div className='mr-2'>
                <AddNumberPoint index="1" />
            </div>
        </div>
    )
}

export default WhitelistFollow