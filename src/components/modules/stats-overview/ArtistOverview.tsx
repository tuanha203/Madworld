import React, { useState } from 'react'
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { HeartIcon, IconCopy, IconEmbed, IconLikes, IconShare } from 'components/common/iconography/IconBundle';
import { DiscordOriginal, FacebookOriginal, GoogleOriginal, InstagramOriginal } from 'components/common/iconography/SocialMediaIcon';
import { OutlinedButton } from 'components/common';
import { Avatar } from '../thumbnail';


const ArtistOverview = () => {
    const [shareEl, setShareEl] = useState(null);
    const isShareOpen = Boolean(shareEl);

    const shareOpen = (event: any) => {
        setShareEl(event.currentTarget);
    };

    const shareClose = () => {
        setShareEl(null);
    };

    return (
        <div className="item-overview max-content-width py-7 px-6 flex items-center justify-between bg-background-dark-600 rounded-lg  shadow-elevation-light-3 ">
            <div className='text--label-small flex items-center gap-3'>
                <Avatar size="medium"/>
                <div className='flex flex-col'>
                    <span className='capitalize text--title-small'>artist</span>
                    <span className=' capitalize text--title-medium text-secondary-60'>pat lee</span>
                </div>
            </div>
            <Divider orientation="vertical" variant="middle" flexItem />
            <IconLikes index="90k" />
            <Divider orientation="vertical" variant="middle" flexItem />
            <div className='text--label-medium flex items-center gap-2'>
                2k Followers
            </div>
            <Divider orientation="vertical" variant="middle" flexItem />
            <div className='text--label-medium'>
                <Button
                    id="basic-button"
                    aria-controls={isShareOpen ? 'basic-option-share' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isShareOpen ? 'true' : undefined}
                    onClick={shareOpen}
                >
                    <IconShare />
                    <span className='ml-2 text-white text--label-medium'>Share</span>
                </Button>

                <Menu
                    className="stat-share"
                    id="basic-option-share"
                    anchorEl={shareEl}
                    open={isShareOpen}
                    onClose={shareClose}
                    // TransitionComponent={Fade}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >

                    <MenuItem className='flex items-center gap-2' onClick={shareClose}>
                        <FacebookOriginal /> Facebook
                    </MenuItem>
                    <MenuItem className='flex items-center gap-2' onClick={shareClose}>
                        <GoogleOriginal /> Google +
                    </MenuItem>
                    <MenuItem className='flex items-center gap-2' onClick={shareClose}>
                        <DiscordOriginal />  Discord
                    </MenuItem>
                    <MenuItem className='flex items-center gap-2' onClick={shareClose}>
                        <InstagramOriginal/>Instagram
                    </MenuItem>
                    <MenuItem className='flex items-center gap-2' onClick={shareClose}>
                        <IconCopy/>Copy Link
                    </MenuItem>
                    <MenuItem className='flex items-center gap-2' onClick={shareClose}>
                        <IconEmbed />  Embed <br /> Asset
                    </MenuItem>
                </Menu>
            </div>
            <Divider orientation="vertical" variant="middle" flexItem />
            <div className='stat-report'>
                <OutlinedButton icon="plus" text="Follow"/>
            </div>
        </div>
    )
}

export default ArtistOverview

//@todo add social icon / work on outlined button