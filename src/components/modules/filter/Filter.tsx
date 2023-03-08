import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { TRENDING_TYPE } from 'constants/app';
import React, { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface IFilterProps {
  period?: boolean;
  headline: string;
  group?: boolean;
  icon?: any;
  categoryCallback?: any;
  dateCallback?: any;
  firstValueDate?: string;
  firstValueCate?: string;
}

const FilterDate = [
  { value: 'TODAY', label: 'Today' },
  { value: 'LAST7DAYS', label: 'Last 7 Days' },
  { value: 'LAST30DAYS', label: 'Last 30 Days' },
];

const FilterCate = [
  { value: TRENDING_TYPE.COLLECTION, label: 'Collection' },
  { value: TRENDING_TYPE.ARTIST, label: 'Artist' },
  { value: TRENDING_TYPE.OFFERS, label: 'Offers' },
];

export default function Filter({
  period,
  headline,
  group,
  icon,
  categoryCallback,
  dateCallback,
  firstValueDate,
  firstValueCate,
}: IFilterProps) {
  const [date, setDate] = useState(firstValueDate || 'TODAY');
  const [category, setCategory] = useState(firstValueCate || 'COLLECTION');

  const handleDate = (event: any) => {
    setDate(event.target.value);
    dateCallback(event.target.value);
  };
  const handleCategory = (event: any) => {
    setCategory(event.target.value);
    categoryCallback(event.target.value);
  };

  return (
    <>
      <div className="custom-filter flex flex-wrap items-center md:gap-2 capitalize px-3">
        {icon}
        {period ? (
          <div className="custom-filter-time">
            <FormControl className="time-filter-form">
              {/* <InputLabel id="time-select-label">Today</InputLabel> */}
              <Select
                labelId="time-select-label"
                id="time-select"
                value={date}
                onChange={handleDate}
                className="filter-time-menu"
                IconComponent={KeyboardArrowDownIcon}
                // inputProps={{ MenuProps: { disableScrollLock: true } }}
              >
                {FilterDate.map((item, index) => (
                  <MenuItem
                    sx={{
                      fontFamily: 'Chakra Petch !important',
                      ':hover': {
                        backgroundColor: '#7340d3 !important',
                      },
                    }}
                    value={item.value}
                    key={index}
                  >
                    <div className="font-bold">
                      {item.label}
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ) : null}
        <div className="xl:text-[45px] lg:text-[36px] sm:text-[20px] sm:mb-2 lg:ml-0 lg:mr-0 sm:mx-2 lg:font-Hanson sm:font-Chakra lg:font-normal sm:font-bold">
          {headline}
        </div>
        {group ? (
          <div className="custom-filter-category">
            <FormControl className="category-filter-form">
              <Select
                labelId="category-select-label"
                id="category-select"
                value={category}
                onChange={handleCategory}
                className="filter-category-menu "
                IconComponent={KeyboardArrowDownIcon}
              >
                {FilterCate.map((item, index) => (
                  <MenuItem
                    sx={{
                      fontFamily: 'Chakra Petch !important',
                      ':hover': {
                        backgroundColor: '#7340d3 !important',
                      },
                    }}
                    value={item.value}
                    key={index}
                  >
                    <div className="font-bold">
                      {item.label}
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ) : null}
      </div>
    </>
  );
}

Filter.defaultProps = {
  period: true,
  headline: 'Hot',
  group: true,
};
