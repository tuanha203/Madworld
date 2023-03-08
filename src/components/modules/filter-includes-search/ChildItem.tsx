import { Checkbox, ListItemButton, ListItemText } from '@mui/material';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import { memo } from 'react';

const ChildItem = (props: any) => {
  const { checked, name, labelId, onChecked, index, ix, mobile, iconColor, buttonColor } = props;
  return (
    <ListItemButton
      sx={{
        pl: mobile ? 2 : 4,
        '&:hover': {
          backgroundColor: buttonColor?.default?.background || '#7666cb',
        },
        span: {
          fontFamily: 'Chakra Petch',
        },
      }}
      onClick={() => onChecked(index, ix)}
    >
      <Checkbox
        edge="start"
        checked={checked}
        tabIndex={-1}
        disableRipple
        inputProps={{ 'aria-labelledby': `${labelId}_${ix}` }}
        sx={{
          color: iconColor ? `${iconColor?.color} !important` : '#B794F6 !important',

        }}
      />
      <OverflowTooltip title={name} className="w-[calc(100%-40px)] leading-8">
        {name}
      </OverflowTooltip>
    </ListItemButton>
  );
};

export default memo(ChildItem);
