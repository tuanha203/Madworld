import { Box, Button, Checkbox, Collapse, Divider, FormControlLabel } from '@mui/material';
import _ from 'lodash';
import { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import IconLocal from '../iconography/IconLocal';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SelectCheckAllProp {
  data: { name: string; value: string }[];
  text: string;
  valueCheck: { name: string; value: string };
  showChildItem?: boolean;
  isLast?: boolean;
  setValueCheck: any;
  mobile?: boolean;
  notNull?: boolean;
  disable?: boolean;
}

const SelectCheckOne = ({ data, text, valueCheck, setValueCheck, showChildItem, isLast = false, mobile, notNull, disable }: SelectCheckAllProp) => {
  const [open, setOpen] = useState(false);
  const lastValue = useRef<any>()
  const { icon, buttom } = useSelector((state) => (state as any).theme);
  useEffect(() => {
    if (!_.isUndefined(showChildItem)) setOpen(showChildItem);
  }, [showChildItem]);

  useEffect(() => {
    if (disable) {
      setOpen(false)
    }
  }, [disable]);


  const handleChange = () => {
    if (notNull) return;
    if (valueCheck?.value) return setValueCheck({ value: null })
    setValueCheck(lastValue.current)
  };

  const handleItemChange = (val: string) => {
    if (val === valueCheck?.value) {
      if (!notNull) return setValueCheck({ value: null })
      return
    }
    const findItem = data.find((x) => x.value === val);
    setValueCheck(findItem)
    lastValue.current = findItem
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
              checked={false}
              indeterminate={Boolean(valueCheck?.value)}
              onChange={handleChange}
              sx={{
                color: icon ? `${icon?.color} !important` : '',
              }}
              className={`Madcheckbox ${mobile && !icon ? "!text-[#BBA2EA]" : ""}`}
            />
            <span className={`self-center ${disable && "text-[#686868]"} truncate max-w-[80%]`}>{valueCheck?.name || text}</span>
            <Button
              className={`flex ${open ? 'justify-start' : 'justify-end'} absolute right-[-3px] ${open && 'rotate-180'
                }`}
              onClick={() => {
                if (disable) return
                setOpen(!open)
              }}
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
                      checked={valueCheck?.value === item.value}
                      onChange={() => handleItemChange(item.value)}
                      className={`Madcheckbox ${mobile && !icon ? "!text-[#BBA2EA]" : ""}`}
                      sx={{
                        color: icon ? `${icon?.color} !important` : '',
                      }}
                    />
                    <span className={`self-center text-sm ${disable && "text-[#686868]"} ${mobile && "max-w-[78%]"} `}>{item.name}</span>
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
export default memo(SelectCheckOne);
