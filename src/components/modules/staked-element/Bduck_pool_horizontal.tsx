import React, { useState, useEffect } from 'react'
import { MadVolume } from 'components/common/price'
import ArtistMultiAvatar from 'components/modules/cards/ArtistMultiAvatar'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconArrowDown, InfoIcon } from 'components/common/iconography/IconBundle';
import { FilledButton, TonalButton } from 'components/common/buttons';
import CustomizedTooltips from './Tooltip';
import Divider from '@mui/material/Divider';
import PoolStatus from './PoolStatus';

export const Bduck_pool_horizontal = ({ state, poolName, connected, order = "00", isOpen, onManageStaking }: any) => {
    const [open, setOpen] = useState(false);
    // const [isConnected, setIsConnected] = useState(false);

    const handleOpen = () => {
        setOpen(!open)
    }

    return (
        <div className='bduck-pool-wrapper w-full flex flex-col'>
            <div className='Bduck-pool-horizontal '>
                <div className='flex gap-6'>
                    <div className='avatar'>
                        <ArtistMultiAvatar size="medium" artistName="" />
                    </div>
                    <div className='col'>
                        <h2 className='caption'>Pool Name</h2>
                        <div className='title'>{poolName} #{order}
                        </div>
                    </div>
                </div>
                <div className='col'>
                    <h2 className='caption'>Total Staked UMAD</h2>
                    <div className='data'>
                        <MadVolume index="80,150,221" />
                        <h3>$ 9,999,999</h3>
                    </div>
                </div>
                <div className='col'>
                    <h2 className='caption'>Total Staked UMAD</h2>
                    <div className='data'>
                        <MadVolume index="500,000,000 / 400,000,000" />
                        <h3>$ 9,999,999,999 / $ 888,999</h3>
                    </div>
                </div>
                <div className='col'>
                    <h2 className='caption flex items-center gap-2'>APR %  <CustomizedTooltips /> </h2>
                    <div className='data'>
                        <h2>2 - 25 %</h2>
                    </div>
                </div>
                {
                    connected ?
                        // not connected 
                        <>
                            <PoolStatus state={state} />
                            <div onClick={handleOpen} className={`arrow ${open ? "rotate-180" : "rotate-0"}`}>
                                <IconArrowDown customClass="text-primary-dark" />
                            </div>
                        </>
                        :
                        //  connected 
                        <>
                            <div className='flex items-center mr-10'>
                                <FilledButton customClass="text--label-large text-dark-on-primary">Stake Now</FilledButton>
                            </div>
                        </>
                }
            </div>
            {
                connected && (open || isOpen) ?
                    <div className=' asset-wrapper '>
                        <div className='asset-ov-list '>
                            <div className='col pl-6'>
                                <h2 className='caption'>Staked NFT</h2>
                                <div className="data">
                                    <h2>4/12</h2>
                                </div>
                            </div>
                            <Divider orientation="vertical" variant="middle" flexItem />
                            <div className='col'>
                                <h2 className='caption'>Staked UMAD</h2>
                                <div className="data">
                                    <MadVolume index="12,221" />
                                    <h3>$ 2333</h3>
                                </div>
                            </div>
                            <Divider orientation="vertical" variant="middle" flexItem />
                            <div className='col'>
                                <h2 className='caption'>Reward</h2>
                                <div className="data">
                                    <MadVolume index="21,122" />
                                    <h3>$ 2333</h3>
                                </div>
                            </div>
                            <Divider orientation="vertical" variant="middle" flexItem />
                            <div className='col'>
                                <h2 className='caption'>Reward boost</h2>
                                <div className="data">
                                    <h2>166 %</h2>
                                </div>
                            </div>
                            <Divider orientation="vertical" variant="middle" flexItem />

                            <div className={`flex flex-col my-auto gap-3 ${(state === "soon") ? "invisible " : null} `}>
                                <FilledButton disabled={(state === "soon") ? true : false}>Harvest Reward</FilledButton>
                                {
                                    (onManageStaking || (state === "end")) ? null : (
                                        <TonalButton disabled={(state === "soon") ? true : false}>Manage Staking</TonalButton>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    : null
            }
        </div>

    )
}
Bduck_pool_horizontal.defaultProps = {
    connected: true,
    poolName: "MADworld X B.Duck  LP",
    isOpen: false,
    onManageStaking: false,
    state: "approve" // approve - stake - soon - end
}