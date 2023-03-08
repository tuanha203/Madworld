import React, { useState, useEffect } from 'react';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import MuiPaper from '@mui/material/Paper';

const Input = styled(InputBase)({
    marginLeft: 8,
    flex: 1,
});

const Paper = styled(MuiPaper)(() => ({
    position: 'sticky',
    top: 80,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    zIndex: 1
}));



export default function SearchPoolField({ label, onChange, timeout = 100, className }: any) {
    const [query, setQuery] = useState("")
    const [typingTimeout, setTypingTimeout] = useState(0);


    function searchHandler(e: any) {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        const val = e.target.value;
        setQuery(val);
        if (onChange) {
            setTypingTimeout(setTimeout(function () {
                onChange({
                    target: { value: val }
                });
            } as any, timeout) as any);
        }
    }

    return (
        <Paper className={`search-text-field-paper w-[400px] ${className}`}>
            <IconButton sx={{ padding: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
            <Input
                // autoFocus
                className='search-text-field'
                value={query}
                onChange={searchHandler}
                placeholder={label}
                inputProps={{ 'aria-label': 'search icons' }}
            />
        </Paper>
    );
}


SearchPoolField.defaultProps = {
    label: "custom label here"
}
