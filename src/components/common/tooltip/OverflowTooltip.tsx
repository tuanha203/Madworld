import { useState, MouseEvent } from 'react';
import { TooltipProps } from '@mui/material/Tooltip';
import ContentTooltip from './ContentTooltip';

interface OverflowTooltipProps extends TooltipProps {
  isAddress: boolean;
  style?:any;
}

const OverflowTooltip = (props: OverflowTooltipProps) => {
  const { children, title, className, placement, isAddress, style } = props;
  const [tooltipEnabled, setTooltipEnabled] = useState(false);

  const handleShouldShow = ({ currentTarget }: MouseEvent<Element>) => {
    if (currentTarget.scrollWidth > currentTarget.clientWidth || isAddress) {
      setTooltipEnabled(true);
    }
  };

  const hideTooltip = () => setTooltipEnabled(false);

  return (
    <ContentTooltip
      onMouseEnter={handleShouldShow}
      onMouseLeave={hideTooltip}
      disableHoverListener={!tooltipEnabled}
      title={title}
      placement={placement || 'top'}
      arrow
      style={style}
    >
      <div className={`text-ellipsis ${className || ''}`}>{children}</div>
    </ContentTooltip>
  );
};

OverflowTooltip.defaultProps = {
  isAddress: false,
};

export default OverflowTooltip;
