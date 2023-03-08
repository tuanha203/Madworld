import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconLocal from 'components/common/iconography/IconLocal';
import _ from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import ChildItem from './ChildItem';
import Item from './Item';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F4B1A3',
    },
    secondary: {
      main: '#B794F6',
    },
    background: {
      paper: '#363642',
    },
  },
});

const _listSelected = {} as any;

interface PropCheckBox {
  onSelected?: (value: Array<any>, value2: Array<any>) => void;
  mobile?: boolean;
  listPropertiesCurrent?: any;
  list: any;
  setList: any;
}

interface PropFilterIncludesSearch {
  onSelected: (value: Array<any>, value2: Array<any>) => void;
  title?: string;
  className?: string;
  reset?: boolean;
  options: Array<{
    key: string | number;
    name: string | number;
    value: any;
    open: boolean;
    checked: boolean;
    indeterminate: boolean;
    child?: Array<{
      key: string | number;
      name: string | number;
      value: any;
      checked: boolean;
    }>;
  }>;
}

interface PropFilterIncludesSearchMobile extends PropFilterIncludesSearch {
  listPropertiesAfterApply: any;
  listPropertiesCurrent: any;
  setReset: any;
}

const NestListCheckBox = React.memo((props: PropCheckBox) => {
  const { onSelected, mobile, listPropertiesCurrent, list, setList } = props;
  const { button, icon } = useSelector((state: any) => state.theme);
  /*   React.useEffect(() => {
      if (!_.isEmpty(lastListCheckedProperties?.current))
        
    }, []) */

  const handleClick = (index: number) => {
    let _list = [...list];
    _list[index].open = !list[index].open;
    setList(_list);
  };
  const onChecked = React.useCallback(
    (index: number, ix?: number) => {
      try {
        let _list = [...list];
        if (ix !== undefined) {
          _list[index].child[ix].checked = !_list[index].child[ix].checked;

          // --------- PUSH VALUE VAO LIST CHECKED ---------
          const { value = '' } = _list[index].child[ix];
          if (_list[index].child[ix].checked) {
            if (_listSelected[_list[index].key]) {
              _listSelected[_list[index]?.key].push(value);
            } else _listSelected[_list[index]?.key] = [value];
          } else {
            const ix = _listSelected[_list[index].key].indexOf(value);
            if (ix !== -1) _listSelected[_list[index].key].splice(ix, 1);
            if (_listSelected[_list[index].key].length === 0) {
              delete _listSelected[_list[index].key];
            }
          }
          // --------- PUSH VALUE VAO LIST CHECKED ---------
        } else {
          // --------- TRUONG HOP CHO CHON CHECKED CHA ---------
          _listSelected[_list[index].key] = [];
          _list[index].checked = !list[index].checked;
          _list[index].child.forEach((element: any, i: number) => {
            const { value = '' } = _list[index].child[i];
            _list[index].child[i].checked = list[index].checked;
            if (list[index].checked) {
              if (_listSelected[_list[index].key]) {
                _listSelected[_list[index]?.key].push(value);
              } else _listSelected[_list[index]?.key] = [value];
            }
          });
          if (!list[index].checked) {
            delete _listSelected[_list[index].key];
          }
          // --------- TRUONG HOP CHO CHON CHECKED CHA ---------
        }
        const checkedAll = _list[index].child.filter((x: any) => x.checked);
        const indeterminate = _list[index].child.find((x: any) => x.checked);
        if (indeterminate) {
          _list[index].indeterminate = true;
        } else {
          _list[index].indeterminate = false;
        }
        if (checkedAll.length === _list[index].child?.length) {
          _list[index].checked = true;
          _list[index].indeterminate = false;
        } else {
          _list[index].checked = false;
          if (indeterminate) {
            _list[index].indeterminate = true;
          } else {
            _list[index].indeterminate = false;
          }
        }
        setList(_list);
        if (onSelected) onSelected(_listSelected, _list);
      } catch (error) {
        console.error('error', error);
      }
    },
    [list],
  );

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: mobile ? 'initial' : 360,
        bgcolor: mobile ? 'initial' : 'background.paper',
        fontFamily: 'Chakra Petch',
      }}
    >
      {list.map((element: any, index: number) => {
        const labelId = `checkbox-list-label-${element.key}`;
        return (
          <>
            <ListItem
              key={element.key}
              disablePadding
              className="!pr-[15px]"
              sx={{
                pr: 4,
                '&:hover': {
                  backgroundColor: `${button?.default?.background} !important` || '#7666cb',
                },
                span: {
                  fontFamily: 'Chakra Petch',
                },
              }}
            >
              <Item
                checked={element.checked}
                labelId={labelId}
                index={index}
                onChecked={onChecked}
                name={element?.name}
                value={element?.value}
                indeterminate={element.indeterminate}
                className="border-solid border-b border-neutral-600"
                iconColor={icon}
                sx={{
                  pr: 2,
                  borderBottom: '1px solid #646B7A99',
                }}
              />
              {element.open && element.child && (
                <ExpandLess
                  className="cursor-pointer"
                  sx={{ width: 30, color: icon ? icon.color : 'primary.main' }}
                  onClick={() => handleClick(index)}
                />
              )}
              {!element.open && element.child && (
                <ExpandMore
                  className="cursor-pointer"
                  sx={{ width: 30, color: icon ? icon.color : 'primary.main' }}
                  onClick={() => handleClick(index)}
                />
              )}
              {!element.open && <div className="divide-hr" />}
            </ListItem>
            {element.child && element.open && (
              <Collapse in={element.open} timeout="auto">
                <List
                  component="div"
                  disablePadding
                  className="overflow-auto font-Chakra capitalize "
                >
                  {element.child.map((item: any, ix: number) => (
                    <ChildItem
                      checked={item.checked}
                      name={item?.name?.value}
                      labelId={labelId}
                      onChecked={onChecked}
                      index={index}
                      ix={ix}
                      mobile={mobile}
                      iconColor={icon}
                      buttonColor={button}
                    />
                  ))}
                </List>
              </Collapse>
            )}
          </>
        );
      })}
    </List>
  );
});

export default function FilterIncludesSearch(props: PropFilterIncludesSearch) {
  const { title, className, onSelected, options = [], reset } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchKey, setSearchKey] = React.useState<string>('');
  const [dataFilter, setDataFilter] = React.useState<any>(null);
  const [list, setList] = React.useState<any>([]);
  const { button, icon } = useSelector((state: any) => state.theme);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSearchProperty = React.useCallback(
    _.debounce((keyword: any) => {
      const list = [...options];
      const _list = list?.filter((e: any) => {
        let name = _.toString(e.name);
        name = name.toLowerCase();
        let kw = _.toString(keyword);
        kw = kw.toLowerCase();
        return name.includes(kw);
      });
      setDataFilter(_list);
    }, 250),
    [options],
  );

  React.useEffect(() => {
    let ops = (_.isArray(dataFilter) ? dataFilter : options)?.sort(function (a: any, b: any) {
      const nameA = a?.name?.toUpperCase();
      const nameB = b?.name?.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    ops?.forEach((e: any, index: number) => {
      if (e?.child.length > 0) {
        const arr = e?.child || [];
        ops[index].child = arr.sort(function (a: any, b: any) {
          const nameA = a.name?.value?.toUpperCase();
          const nameB = b.name?.value?.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      }
    });

    setList(ops);
  }, [options, dataFilter]);

  React.useEffect(() => {
    if (reset && dataFilter) {
      setDataFilter([]);
      setSearchKey('');
      onSearchProperty('');
      const list = [...options];
      setDataFilter(list);
    }
  }, [reset, options]);

  return (
    <ThemeProvider theme={theme}>
      <div className={`${className} font-Chakra`}>
        <Button
          style={button?.outline}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="outlined"
          color="secondary"
          className="font-Chakra text-dark-on-surface-variant h-[32px] border-primary-90 normal-case font-bold text-sm pr-2 normal-case hover:bg-background-dark-600 bg-background-dark-600 hover:border-secondary-60"
        >
          {title}
          {open ? (
            <ArrowDropUpIcon style={icon} sx={{ ml: 1, color: 'primary.main' }} />
          ) : (
            <ArrowDropDownIcon style={icon} sx={{ ml: 1, color: 'primary.main' }} />
          )}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          className="!mt-[5px]"
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            '> div': { color: 'white', bgcolor: 'transparent' },
            ul: { p: '0px !important' },
          }}
        >
          <MenuItem className="flex flex-col p-0 min-w-[327px]">
            <Paper className={`search-text-field-paper w-[100%] !h-[48px] !bg-[#555C69]`}>
              <IconButton aria-label="search">
                <SearchIcon
                  style={{ fontSize: '30px' }}
                  sx={{
                    color: icon ? `${icon.color} !important` : '#B794F6 !important',
                  }}
                />
              </IconButton>
              <TextField
                className="search-text-field"
                value={searchKey}
                onChange={(e) => {
                  setSearchKey(e.target.value);
                  onSearchProperty(e.target.value);
                }}
                placeholder="Search for a specific Properties"
                inputProps={{ 'aria-label': 'search icons' }}
                sx={{
                  fieldset: { border: 'unset' },
                  'input:placeholder-shown': { color: 'white !important', fontWeight: '100' },
                  background: '#555C69',
                  width: '85%',
                  '.MuiInputBase-formControl': { maxHeight: '50px !important' },
                  '.MuiInputBase-formControl input': { height: '10px' },
                }}
              />
            </Paper>
            <Box sx={{ maxHeight: '50vh', overflow: 'auto', minHeight: '3px', width: '100%' }}>
              <NestListCheckBox onSelected={onSelected} list={list} setList={setList} />
            </Box>
          </MenuItem>
        </Menu>
      </div>
    </ThemeProvider>
  );
}

export function FilterIncludesSearchMobile(props: PropFilterIncludesSearchMobile) {
  const [open, setOpen] = React.useState(false);
  const {
    title,
    className,
    onSelected,
    options = [],
    reset,
    listPropertiesCurrent,
    listPropertiesAfterApply,
    setReset,
  } = props;
  const [searchKey, setSearchKey] = React.useState<string>('');
  const [dataFilter, setDataFilter] = React.useState<any>(null);
  const [checked, setChecked] = React.useState(false);
  const [list, setList] = React.useState<any>([]);

  const { button, icon, input } = useSelector((state: any) => state.theme);

  /*   React.useEffect(() => {
      if (!_.isUndefined(showChildItem)) setOpen(showChildItem);
    }, [showChildItem]); */

  const onSearchProperty = React.useCallback(
    _.debounce((keyword: any) => {
      const _list = listPropertiesCurrent.current.filter((e: any) => {
        let name = _.toString(e.name);
        name = name.toLowerCase();
        let kw = _.toString(keyword);
        kw = kw.toLowerCase();
        return name.includes(kw);
      });
      setDataFilter(_list);
    }, 250),
    [listPropertiesCurrent],
  );

  /*   React.useEffect(() => {
    if (reset && dataFilter) setDataFilter([]);
  }, [reset]) */ const handleChangeFilter = (e: any) => {
    setSearchKey(e.target.value);
    onSearchProperty(e.target.value);
  };

  const handleChange = () => {
    if (checked) {
      const _list = JSON.parse(JSON.stringify(list));
      _list.map((item: any) => {
        item.checked = false;
        item.child.forEach((child: any) => (child.checked = false));
      });
      setList(_list);
      setChecked(false);
      onSelected([], _list);
    } else {
      const _list = JSON.parse(JSON.stringify(list));
      _list.map((item: any) => {
        item.checked = true;
        item.child.forEach((child: any) => (child.checked = true));
      });
      setList(_list);
      setChecked(true);
      onSelected([], _list);
    }
  };

  const isCheckAll = () => {
    return !list.find((item: any) => {
      return item.child.find((child: any) => !child.checked);
    });
  };

  const isNotCheckAll = () => {
    return !list.find((item: any) => {
      return item.child.find((child: any) => child.checked);
    });
  };

  const isIndeter = () => {
    if (!isNotCheckAll() && !isCheckAll()) {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    if (_.isEmpty(listPropertiesAfterApply.current)) {
      let ops = JSON.parse(JSON.stringify(_.isArray(dataFilter) ? dataFilter : options)).sort(
        function (a: any, b: any) {
          const nameA = a?.name?.toUpperCase();
          const nameB = b?.name?.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        },
      );
      ops.forEach((e: any, index: number) => {
        if (e?.child.length > 0) {
          const arr = e?.child || [];
          ops[index].child = arr.sort(function (a: any, b: any) {
            const nameA = a?.name?.value?.toUpperCase();
            const nameB = b?.name?.value?.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });
        }
      });
      setList(ops);
    } else {
      setList(JSON.parse(JSON.stringify(listPropertiesAfterApply.current)));
    }
  }, [options, dataFilter, listPropertiesAfterApply.current]);

  React.useEffect(() => {
    if (!searchKey) listPropertiesCurrent.current = list;
  }, [list]);

  React.useEffect(() => {
    if (isCheckAll() && list.length > 0) {
      return setChecked(true);
    }
    setChecked(false);
  }, [list]);

  React.useEffect(() => {
    if (reset) {
      if (_.isArray(dataFilter)) {
        setDataFilter(
          dataFilter?.map((item: any) => {
            return {
              ...item,
              checked: false,
              child: item?.child?.map((itemChild: any) => ({ ...itemChild, checked: false })),
            };
          }),
        );
      } else {
        setList(
          list?.map((item: any) => {
            return {
              ...item,
              checked: false,
              child: item?.child?.map((itemChild: any) => ({ ...itemChild, checked: false })),
            };
          }),
        );
      }
      setReset(false);
    }
  }, [reset]);

  return (
    <ThemeProvider theme={theme}>
      <div className={`font-normal `}>
        <FormControlLabel
          label=""
          sx={{
            border: 'none !important',
          }}
          control={
            <div className="flex w-full relative">
              <Checkbox
                checked={checked}
                indeterminate={isIndeter()}
                onChange={handleChange}
                className={`Madcheckbox ${icon || "!text-[#BBA2EA]"}`}
                sx={{
                  color: icon ? `${icon?.color} !important` : '',
                }}
              />
              <span className="self-center">{title}</span>
              <Button
                className={`flex ${open ? 'justify-start' : 'justify-end'} absolute right-[-3px] ${open && 'rotate-180'
                  }`}
                onClick={() => setOpen(!open)}
              >
                <KeyboardArrowDownIcon style={{ ...icon, fontSize: "32px" }} />
              </Button>
            </div>
          }
          className={`flex mr-[0] ${open ? 'border-solid border-b border-neutral-600' : ''}`}
        />

        {<Divider className="w-screen relative right-[24px] h-[1px] mt-3" />}

        <Collapse
          sx={{
            backgroundColor: '#050119',
            width: '100vw',
            position: 'relative',
            left: '-24px',
            paddingTop: '8px',
            '.MuiCollapse-wrapperInner': {
              paddingX: '48px',
            },
          }}
          in={open}
          timeout="auto"
          unmountOnExit
        >
          <div style={{ ...input?.background }} className={`flex pr-5 mt-[14px] bg-[#555C69]  rounded`}>
            <IconButton sx={{ padding: '10px', color: icon ? icon?.color : '', ...input?.backgroundColor }} aria-label="search" className="text-slate-600">
              <SearchIcon style={icon} className="text-secondary-60" />
            </IconButton>
            <input
              value={searchKey}
              type="text"
              placeholder="Search for a specific properties..."
              className="w-full border-0 bg-transparent px-2 focus-visible:outline-0 text-xs"
              onChange={handleChangeFilter}
              style={{
                ...input?.text,
                ...input?.background
              }}
            />
          </div>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              ml: 6,
              gap: '8px',
              marginY: '10px',
              marginLeft: '0px !important',
              maxHeight: '240px !important',
              overflowY: 'auto',
            }}
            className="scroll-filter-collections scroll-hidden"
          >
            <NestListCheckBox
              onSelected={onSelected}
              listPropertiesCurrent={listPropertiesCurrent}
              list={list}
              setList={setList}
              mobile
            />
          </Box>
        </Collapse>
      </div >
    </ThemeProvider >
  );
}
