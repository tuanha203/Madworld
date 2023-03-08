import React, { useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { IconDotHorizontal } from 'components/common/iconography/IconBundle';


const MoreButton = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [shareEl, setShareEl] = useState(null);
    const open = Boolean(anchorEl);


    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="more-button">
            <div className='stat-report'>
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-option-report' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <IconDotHorizontal />
                </Button>
                <Menu
                    className="stat-report-option"
                    id="basic-option-report"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem
                        className='flex items-center gap-2'
                        onClick={handleClose}
                    >
                        Report
                    </MenuItem>
                    <MenuItem
                        className='flex items-center gap-2'
                        onClick={handleClose}
                    >
                        Share
                    </MenuItem>
                    <MenuItem
                        className='flex items-center gap-2'
                        onClick={handleClose}
                    >
                        Open Original  in IPFS
                    </MenuItem>
                </Menu>
            </div>
        </div>
    )
}

export default MoreButton