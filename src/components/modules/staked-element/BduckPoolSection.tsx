import React, { useState, useEffect } from 'react'
import { FilledButton } from 'components/common/buttons'
import { InputChipIcon } from 'components/common/chips/InputChip'
import { Bduck_pool_horizontal } from './Bduck_pool_horizontal'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchPoolField from 'components/modules/textField/SearchPoolField';
import { DropData } from "./data"
import _ from "lodash";


const BduckPoolSection = () => {
    const [searchValue, setSearchValue] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(DropData);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClickAPR = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleAprAsc = () => {
        const ascArr = _.orderBy(filteredUsers, ["index"], ["asc"])
        setFilteredUsers(ascArr)
        setAnchorEl(null);
    };

    const handleAprDesc = () => {
        const ascArr = _.orderBy(filteredUsers, ["index"], ["desc"])
        setFilteredUsers(ascArr)
        setAnchorEl(null);
    };


    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            const filter = _.filter(DropData, (pool) => {
                return _.includes(
                    _.lowerCase(JSON.stringify(_.values(pool))),
                    _.lowerCase(searchValue)
                );
            });
            setFilteredUsers(filter);
        }, 100);
        return () => clearTimeout(timeout);
    }, [searchValue]);

    const displayNumber = 8


    return (
        <section className='bduck-pool-section container mx-auto padded flex flex-col gap-9'>
            <div className='filtering flex justify-between'>
                <div>
                    <SearchPoolField
                        onChange={(e: any) => setSearchValue(e.target.value)}
                        label="Search by pool name ..."
                    />
                </div>
                <div className='flex items-center gap-4'>
                    <div className='apr-filter'>
                        <InputChipIcon onClick={handleClickAPR} icon={<ArrowDropDownIcon />} label="All pools" scheme="dark" color="default" />
                        <Menu
                            id="basic-menu"
                            className="stat-report-option"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleAprAsc}>Ascending</MenuItem>
                            <MenuItem onClick={handleClose}>Descending</MenuItem>
                        </Menu>
                    </div>

                    <div className='apr-filter'>
                        <InputChipIcon onClick={handleClick} icon={<ArrowDropDownIcon />} label="APR" scheme="dark" color="default" />
                        <Menu
                            id="basic-menu"
                            className="stat-report-option"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleAprAsc}>Ascending</MenuItem>
                            <MenuItem onClick={handleAprDesc}>Descending</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
            <div className='pool-listing w-full flex flex-col items-center gap-8'>
                {
                    _.map(filteredUsers.slice(0, displayNumber), (pool) =>
                        <Bduck_pool_horizontal poolName={pool.drop_name} order={pool.index} key={pool.index} connected={false} />
                    )
                }
            </div>
            <div>
                <FilledButton customClass="text--label-large text-dark-on-primary">View More</FilledButton>
            </div>
        </section>
    )
}

export default BduckPoolSection

{/* */ }