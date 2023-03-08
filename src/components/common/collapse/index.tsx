import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FC } from 'react';
import Divider from '../divider';
import { IconDynamic } from '../iconography/IconBundle';

interface CollapseCustomProps {
  isShow?: boolean;
  handleShow?: () => void;
  children?: React.ReactNode;
  itemText: string;
  imageHeader: string;
  customItemText?: any;
  customClassName?: string;
  customClassIcon?: string;
}

const CollapseCustom: FC<CollapseCustomProps> = ({
  isShow,
  handleShow,
  children,
  itemText,
  imageHeader,
  customItemText,
  customClassName,
  customClassIcon,
}) => {
  return (
    <List className="p-0">
      <ListItemButton className={`px-2 py-8 ${customClassName}`} onClick={handleShow}>
        <ListItemIcon className={`min-w-max mr-2`}>
          <IconDynamic className={customClassIcon} image={imageHeader} />
        </ListItemIcon>
        <ListItemText
          sx={customItemText}
          primary={itemText}
        />
        {isShow ? (
          <ExpandLess className="text-primary-60" />
        ) : (
          <ExpandMore className="text-primary-60" />
        )}
      </ListItemButton>
      <Collapse in={isShow} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
      <Divider />
    </List>
  );
};

export default CollapseCustom;