import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function handleClick(event: any) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function HeadBreadcrumbs() {
    const breadcrumbs = [
        <Link underline="hover" key="1" color="white" href="/" onClick={handleClick}>
            Home
        </Link>,
        <Link
            underline="hover"
            key="2"
            color="white"
            href="/getting-started/installation/"
            onClick={handleClick}
        >
            News & Events
        </Link>,
        <Typography key="3" color="text.primary">
            MADworld sells
        </Typography>,
    ];

    return (
        <Breadcrumbs
            className='breadcrumbs'
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
        >
            {breadcrumbs}
        </Breadcrumbs>
    );
}