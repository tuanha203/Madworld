import { Checkbox, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import React, { memo } from 'react';


const Item = (props: any) => {
  const { checked, labelId, index, onChecked, name, value, indeterminate, iconColor } = props;


  return (
    <ListItemButton
      sx={{ pr: 1, fontFamily: 'Chakra Petch', textTransform: 'capitalize' }}
      role={undefined}
      onClick={() => onChecked(index)}
      dense
    >
      <ListItemIcon sx={{ minWidth: 0 }}>
        <Checkbox
          edge="start"
          checked={checked}
          tabIndex={-1}
          indeterminate={indeterminate}
          disableRipple
          inputProps={{ 'aria-labelledby': labelId }}
          sx={{
            color: iconColor ? `${iconColor?.color} !important` :'#B794F6 !important',
          }}
        />
      </ListItemIcon>
      <div className="flex justify-between w-[calc(100%-40px)]">
        <OverflowTooltip title={name} className="w-[calc(100%-40px)] text-sm">
          {name}
        </OverflowTooltip>
        {!!value && (
          <ListItemText
            className="flex-grow-0 capitalize"
            id={value.toString()}
            primary={`${value}`}
          />
        )}
      </div>
    </ListItemButton>
  );
};

export default memo(Item);
