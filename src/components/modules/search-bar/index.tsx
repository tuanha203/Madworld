import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { Avatar } from '../thumbnail';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function SearchBar(props: any) {
  const { dataSearch } = props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<any>([]);
  const [isMyInputFocused, setIsMyInputFocused] = useState(false);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        if (dataSearch?.length > 0) {
          setOptions(dataSearch);
        } else {
          setOptions([...topFilms]);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (dataSearch?.length > 0) setOptions(dataSearch);
  }, [dataSearch]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    props.func(isMyInputFocused);
  }, [isMyInputFocused]);

  const handleChange = (data: any) => {
    setOpen(true);
  };

  return (
    <Autocomplete
      className={`search-bar ${isMyInputFocused ? ' !w-full' : ' w-[350px]'}`}
      id="SearchBar"
      sx={{ width: 300 }}
      open={open}
      // onOpen={() => {
      //     setOpen(true);
      // }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => (option as any)?.title === (value as any)?.title}
      getOptionLabel={(option) => (option as any)?.title}
      options={options}
      loading={loading}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > figure': { mr: 2, flexShrink: 0 } }} {...props}>
          <Avatar />
          {(option as any).title} - {(option as any).year}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          sx={{
            '&::after, &::before': {
              display: 'none',
            },
          }}
          onChange={() => {
            handleChange((event as any)?.target.value);
          }}
          onBlur={() => setIsMyInputFocused(false)}
          onFocus={() => setIsMyInputFocused(true)}
          {...params}
          label="Search Collection or items..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
];

// reference
// https://flaviocopes.com/react-how-to-get-value-input/
