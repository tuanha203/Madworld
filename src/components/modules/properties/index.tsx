//@ts-nocheck
import LinearProgress from '@material-ui/core/LinearProgress';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { DiamodSmallSvg, RockSmallSvg } from 'components/common/iconography/iconsComponentSVG';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { useSelector } from 'react-redux';
import { formatPrecisionAmount } from 'utils/formatNumber';
import { shortenNameNoti } from 'utils/func';
function LinearProgressWithLabel(props: any) {
  const { background } = useSelector((state: any) => state.theme);
  return (
    <Box
      className="properties-progress max-content-width"
      sx={
        background
          ? {
              '& .MuiLinearProgress-bar': {
                background: background?.backgroundGradientColor,
              },
              boxShadow: '-2px -2px 4px rgba(68, 108, 108, 0.28), 2px 2px 4px rgba(0, 0, 0, 0.56)',
            }
          : {
              boxShadow: '-2px -2px 4px rgba(68, 108, 108, 0.28), 2px 2px 4px rgba(0, 0, 0, 0.56)',
            }
      }
    >
      <LinearProgress className="rarity-small w-full" variant="determinate" {...props} />
    </Box>
  );
}
const NAME_SHORT_NUMBER = 12;
LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const Properties = ({ rarityValue, lightIcon, item = {}, normal }: any) => {
  const [bar, setBar] = useState(0);
  const { name = '', value = '' } = item;
  const { box, text, icon } = useSelector((state: any) => state.theme);
  useEffect(() => {
    const value = +rarityValue;
    setBar(value);
  }, [rarityValue]);

  return (
    <div
      className="properties text-white flex flex-col items-center justify-center gap-2 xl:p-4 max-content-width border-primary-dark border rounded-2xl xl:w-[168px] w-[160px] h-[113px]"
      style={box?.outline}
    >
      <div className="flex gap-4 justify-between">
        {lightIcon == 'true' ? (
          <div className="mt-2 light-icon -ml-4">
            <LightModeOutlinedIcon />
          </div>
        ) : (
          ''
        )}
        <div className="flex flex-col gap-1">
          <ContentTooltip
            disableHoverListener={name.length <= NAME_SHORT_NUMBER}
            title={<span className="capitalize">{name}</span>}
          >
            <div className="text-xs	font-normal	leading-4 text-center capitalize">
              {shortenNameNoti(name, NAME_SHORT_NUMBER)}
            </div>
          </ContentTooltip>
          <ContentTooltip
            disableHoverListener={value.length <= NAME_SHORT_NUMBER}
            title={<span className="capitalize">{value}</span>}
          >
            <div className="text-base	font-normal	leading-4 text-center capitalize">
              {shortenNameNoti(value, NAME_SHORT_NUMBER)}
            </div>
          </ContentTooltip>

          <div className="text-xs	font-normal	leading-4 text-center text-secondary-60" style={text}>
            {normal ? rarityValue : `${formatPrecisionAmount(bar, 2)}% rarity`}
          </div>
        </div>
      </div>
      {!normal && (
        <div className="flex items-center justify-between gap-x-1">
          <RockSmallSvg width={10} color={icon?.color} />
          <LinearProgressWithLabel value={Math.round(100 - bar)} />
          <DiamodSmallSvg width={10} color={icon?.color} />
        </div>
      )}
    </div>
  );
};

Properties.defaultProps = {
  rarityValue: '10',
  lightIcon: 'false',
  item: {
    name: '',
    value: '',
  },
};

export default Properties;
