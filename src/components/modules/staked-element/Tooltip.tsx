import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { InfoIcon } from 'components/common/iconography/IconBundle';

const BootstrapTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'white',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#4B526A',
  },
}));

export default function CustomizedTooltips({ children, text, placement }: any) {
  return (
    <div className="customize-tooltip">
      <BootstrapTooltip placement={placement} title={text}>
        <Button>
          <InfoIcon />
        </Button>
      </BootstrapTooltip>
    </div>
  );
}

CustomizedTooltips.defaultProps = {
  text: 'The APR % highly depends on the amount of UMAD you’re staking.The more UMAD tokens you stake -the more yearly rewards you earn.',
  placement: 'top', //  https://mui.com/material-ui/react-tooltip/
};
