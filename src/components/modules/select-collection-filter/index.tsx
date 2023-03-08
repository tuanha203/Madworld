import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Checkbox, Collapse, Divider, FormControlLabel, IconButton } from '@mui/material';
import IconLocal from 'components/common/iconography/IconLocal';
import _ from 'lodash';
import { memo, useEffect, useState } from 'react';
import { Avatar } from '../thumbnail';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSelector } from 'react-redux';

interface ISelectCollectionFilterProps {
  data: { [key: string]: any; id: string }[];
  text: string;
  value: string[];
  showChildItem?: boolean;
  setValue: (value: string[]) => void;
  setKeywordFilterCollection: (value: string) => void;
  keywordFilterCollection: string;
  mobile?: boolean;
}

const SelectCollectionFilter = ({
  data,
  text,
  value,
  setValue,
  showChildItem,
  keywordFilterCollection,
  setKeywordFilterCollection,
  mobile
}: ISelectCollectionFilterProps) => {
  const [open, setOpen] = useState(false);
  const { icon, button,input } = useSelector((state) => (state as any).theme);
  useEffect(() => {
    if (!_.isUndefined(showChildItem)) setOpen(showChildItem);
  }, [showChildItem]);

  const isCheckAll = () => {
    if (!data || data.length == 0) return false;
    for (const item of data) {
      const id = _.toString(item.id);
      if (!value?.includes(id)) {
        return false;
      }
    }
    return true;
  };

  const isIndeter = () => {
    if (value?.length && !isCheckAll()) {
      return true;
    }
    return false;
  };

  const handleChange = () => {
    if (isCheckAll()) {
      setValue([]);
    } else {
      const arr = data.map((item) => item.id.toString());
      setValue(arr);
    }
  };

  const handleItemChange = (val: string) => {
    if (value.includes(val)) {
      const arr = value.filter((item) => item !== val);
      setValue(arr);
    } else {
      setValue([...value, val]);
    }
  };

  const handleChangeFilter = (e: any) => {
    setKeywordFilterCollection(e.target.value);
  };

  return (
    <div className={`font-normal ${mobile ? "" : "border-solid border-b border-neutral-600 overflow-hidden"}`}>
      <FormControlLabel
        label=""
        sx={mobile ? {
          border: "none !important"
        } : {}}
        control={
          <div className="flex w-full relative">
            <Checkbox
              checked={isCheckAll()}
              indeterminate={isIndeter()}
              onChange={handleChange}
              className={`Madcheckbox ${!icon ? "!text-[#BBA2EA]" : ""}`}
              sx={{
                color: icon ? `${icon?.color} !important` : '',
              }}
            />
            <span className="self-center">{text}</span>
            <Button
              className={`flex ${open ? 'justify-start' : 'justify-end'} absolute right-[-3px] ${open && 'rotate-180'
                }`}
              onClick={() => setOpen(!open)}
            >
              <KeyboardArrowDownIcon style={{ ...icon, fontSize: "32px" }} />
            </Button>
          </div>
        }
        className={`flex ${mobile ? "" : "pr-[16px]"} mr-[0] ${open ? "border-solid border-b border-neutral-600" : ""}`}
      />

      {
        mobile ? <Divider className="w-screen relative right-[24px] h-[1px] mt-3" /> : null
      }

      <Collapse sx={mobile ? {
        backgroundColor: "#050119",
        width: "100vw",
        position: "relative",
        left: "-24px",
        paddingTop: "8px",
        ".MuiCollapse-wrapperInner": {
          paddingX: "48px"
        }
      } : {}} in={open} timeout="auto" unmountOnExit>
        <div style={{ ...input?.background }} className={`flex pr-5 mt-[14px] bg-[#555C69] ${mobile ? "" : "w-[93%]"}  rounded`}>
          <IconButton sx={{ padding: '10px', color: icon ? icon?.color : '', ...input?.backgroundColor }} aria-label="search" className="text-slate-600">
            <SearchIcon style={icon} className="text-secondary-60" />
          </IconButton>
          <input
            value={keywordFilterCollection}
            type="text"
            placeholder="Search for a specific collection..."
            className="w-full border-0 bg-transparent px-2 pl-0 focus-visible:outline-0 text-xs"
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
            ml: mobile ? 6 : 3,
            width: mobile ? 'intital' : '230px !important',
            gap: '8px',
            marginY: '10px',
            marginLeft: '0px !important',
            maxHeight: '240px !important',
            overflowY: 'auto',
          }}
          className="scroll-filter-collections scroll-hidden"
        >
          {data.map((item) => {
            const id = _.toString(item.id);
            const active = value?.includes(id);
            return (
              <div
                key={id}
                onClick={() => handleItemChange(id)}
                className={`flex gap-5 items-center py-[6px] cursor-pointer ${mobile ? '' : 'hover:bg-primary-dark'}  pl-2 rounded ${active && 'bg-primary-dark'
                  }`}
              >
                <Avatar size={'28'} src={item.thumbnailUrl} rounded={true} />
                <p className="truncate max-w-[70%] text-sm">{item.title || item.name}</p>
              </div>
            );
          })}
        </Box>
      </Collapse>
    </div>
  );
};
export default memo(SelectCollectionFilter);
