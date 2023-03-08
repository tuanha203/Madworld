import { Box, Button, Checkbox, Collapse, Divider, FormControlLabel } from '@mui/material';
import _ from 'lodash';
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IconLocal from '../iconography/IconLocal';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SelectCheckAllProp {
  data: { text: string; value: string }[];
  text: string;
  value: string[];
  showChildItem?: boolean;
  isLast?: boolean;
  setValue: (value: string[]) => void;
  mobile?: boolean;
}

const SelectCheckAll = ({ data, text, value, setValue, showChildItem, isLast = false, mobile }: SelectCheckAllProp) => {
  const [open, setOpen] = useState(false);
  const { icon } = useSelector((state) => (state as any).theme);
  useEffect(() => {
    if (!_.isUndefined(showChildItem)) setOpen(showChildItem);
  }, [showChildItem]);

  const isCheckAll = () => {
    for (const item of data) {
      if (!value?.includes(item.value)) {
        return false;
      }
    }
    if (data.length === 0) return false;
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
      const arr = data.map((item) => item.value);
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

  return (
    <div className={`font-normal ${mobile ? "" : "overflow-hidden"}  ${!isLast && !mobile ? "border-solid border-b border-neutral-600" : ""}`}>
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
              className={`flex ${open ? 'justify-start' : 'justify-end'} absolute  right-[-3px] ${open && 'rotate-180'
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
        paddingTop: "8px"
      } : {}} in={open} timeout="auto" unmountOnExit>
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: mobile ? 6 : 3, pb: 3 }}>
          {data.map((item, index) => {
            return (
              <FormControlLabel
                key={index}
                label=""
                control={
                  <>
                    <Checkbox
                      checked={value.includes(item.value)}
                      onChange={() => handleItemChange(item.value)}
                      className={`Madcheckbox ${!icon ? "!text-[#BBA2EA]" : ""}`}
                      sx={{
                        color: icon ? `${icon?.color} !important` : '',
                      }}
                    />
                    <span className="self-center text-sm">{item.text}</span>
                  </>
                }
              />
            );
          })}
        </Box>
      </Collapse>
    </div>
  );
};
export default memo(SelectCheckAll);
