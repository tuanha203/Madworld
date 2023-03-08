import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles(() => ({
  tooltip: {
    backgroundColor: "#1F262C",
    fontSize: '16px',
    padding: '10px',
    color: '#fff',
    fontFamily: 'Chakra Petch',
    maxWidth: '500px'
  },
  arrow: {
    color: "#1F262C"
  }
}));

const ContentTooltip = (props: any) => {
  const classesTooltip = useStyles();
  return (
    <Tooltip {...props} style={props.style} className={props?.className} classes={props?.classes ? props?.classes : classesTooltip} />
  )
}

export default ContentTooltip;