import React from 'react'

interface ICardStatusProps{
    status?: string;
    aprsText?: string;
    aprs?: boolean | string;
} 

export const CardStatus = ({ status, aprsText, aprs }: ICardStatusProps) => {
    return (
        <div className={`status-sticker  py-[6px] px-4 uppercase
            ${(status == "shared") ? "bg-primary-dark text-background-dark-900" : "bg-[#B02C29] text-white"}
            text--label-small shadow-elevation-dark-1
        `}>
            {(aprs) ?
                <>
                    <span className='text-white/80 normal-case'>APRs </span>
                    {aprsText}%
                </>
                :
                <>
                    {(status == "shared") ? "shared" : (status == "unlisted") ? "unlisted"
                        : (status == "onsale") ? "on sale" : (status == "notforsale") ? "not for sale"
                            : (status == "staked") ? "staked" : ""

                    }
                </>
            }
        </div>
    )
}
CardStatus.defaultProps = {
    aprs: false,
}