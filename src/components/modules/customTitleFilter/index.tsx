import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { EmojiFire } from 'components/common/Emojies/emojies';

interface FilterProp{
    period: boolean
    headline: string
    group: boolean
    categoryCallback?: any
    dateCallback?: any
}

export default function Filter({ period, headline, group, categoryCallback, dateCallback }: FilterProp) {
    const [date, setDate] = useState(0);
    const [category, setCategory] = useState("collection");

    const handleDate = (event: any) => {
        setDate(event.target.value);
    };
    const handleCategory = (event: any) => {
        setCategory(event.target.value);
        categoryCallback(event.target.value)
    };


    return (
        <>
            <div className='custom-filter flex items-center text--display-large gap-2 capitalize'>
                <EmojiFire />
                {
                    period ?
                        <div className='custom-filter-time'>
                            <FormControl className='time-filter-form' >
                                {/* <InputLabel id="time-select-label">Today</InputLabel> */}
                                <Select
                                    labelId="time-select-label"
                                    id="time-select"
                                    value={date}
                                    onChange={handleDate}
                                    className="filter-time-menu"
                                // IconComponent={newIcon}
                                // inputProps={{ MenuProps: { disableScrollLock: true } }}
                                >
                                    <MenuItem value={0}>Today</MenuItem>
                                    <MenuItem value={20}>Last 14 Days</MenuItem>
                                    <MenuItem value={30}>Last 30 Days</MenuItem>
                                    <MenuItem value={40}>Last 60 Days</MenuItem>
                                    <MenuItem value={50}>Last Year</MenuItem>
                                    <MenuItem value={60}>All Time</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        : null
                }

                <div>{headline}</div>
                {
                    group ?
                        <div className='custom-filter-category'>
                            <FormControl className='category-filter-form' >
                                {/* <InputLabel id="category-select-label">Today</InputLabel> */}
                                <Select
                                    labelId="category-select-label"
                                    id="category-select"
                                    value={category}
                                    onChange={handleCategory}
                                    className="filter-category-menu"
                                >
                                    <MenuItem value="collection">Collection</MenuItem>
                                    <MenuItem value="artist">Artist</MenuItem>
                                    <MenuItem value="brands">Brands</MenuItem>
                                    <MenuItem value="drops">Drops</MenuItem>
                                    <MenuItem value="offers">Offers</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        : null
                }
            </div>
        </>
    );
}

Filter.defaultProps = {
    period: true,
    headline: "Hot",
    group: true
}