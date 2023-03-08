import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { OutlinedButton } from 'components/common';
import { ISocialValues, IUtilityValues } from '.';

export interface IFieldSocial extends ISocialValues, IUtilityValues { }
export interface ISocialOptionsItem {
  icon: React.ReactNode;
  label: string;
  field: keyof IFieldSocial;
}

interface IMenuAddSocial {
  socialOptions: ISocialOptionsItem[];
  valueField: IFieldSocial;
  onItemClick: (field: keyof IFieldSocial) => void;
  style?: any;
}

const MenuAddSocial: React.FC<IMenuAddSocial> = ({ socialOptions, valueField, onItemClick, style }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleItemClick = (itemField: keyof IFieldSocial) => {
    onItemClick(itemField);
    setAnchorEl(null);
  };


  const loadMenuItem = React.useCallback(() => {
    let menuItem: Array<React.ReactNode> = [];
    socialOptions.forEach((item) => {
      if (valueField[item.field] === undefined || valueField[item.field] === null) {
        menuItem.push(
          <MenuItem
            sx={{
              '&.MuiMenuItem-root:hover': {
                backgroundColor: 'rgba(0, 106, 100, 0.12)',
              },
            }}
            classes={{ root: 'text-white flex items-center p-3 font-Chakra' }}
            onClick={() => handleItemClick(item.field)}
          >
            <span className="mr-4">{item.icon}</span> {item.label}
          </MenuItem>,
        );
      }
    });
    return menuItem;
  }, [valueField]);

  return (
    <div>
      {loadMenuItem().length ? (
        <>
          <OutlinedButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleMenuClick}
            icon="plus"
            text="Add link"
            fullWidth
            customClass="mt-2.5 dark font-Chakra"
            style={{
              ...style?.buttom?.outline, '& svg': {
                color: style?.icon?.color
              }
            }}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            //bg-background-dark-900
            PopoverClasses={{
              paper: 'bg-background-dark-600 w-[330px] mt-1',
            }}
          >
            {loadMenuItem().map((item) => item)}
          </Menu>
        </>
      ) : ''}
    </div>
  );
};

export default MenuAddSocial;
