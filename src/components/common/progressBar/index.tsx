// @ts-nocheck
import { Box } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { formatNumber } from 'utils/formatNumber';
import Diamond from '../Diamond';
import { DiamondSmallSvg } from '../iconography/iconsComponentSVG';

interface LinearProgressWithLabelProp {
  value: number;
  rarityindex: number;
}

function LinearProgressWithLabel(props: LinearProgressWithLabelProp) {
  const { text, icon, background } = useSelector((state: any) => state.theme);
  return (
    <div className="rarity-index max-content-width w-full flex justify-between gap-8">
      <div className="text--headline-small w-full flex flex-col xl:gap-[30px] gap-[10px]">
        <div className="flex item justify-between">
          <h2 className="text--headline-small capitalize text-[18px] lg:text-[28px]">
            rarity index
          </h2>
          <div className="xl:hidden flex-row items-center justify-between gap-2 flex">
            {props.rarityindex > 0 && (
              <div className="icon-diamond w-9 h-9">
                <DiamondSmallSvg color={icon?.color} />
              </div>
            )}
            <h2
              className="text--headline-large text-secondary-60 text-[24px] lg:text-[32px]"
              style={text}
            >
              {props.rarityindex > 0 ? formatNumber(props.rarityindex, 2) : '-'}
            </h2>
          </div>
        </div>
        {props.rarityindex > 0 && (
          <Box
            className="rounded-[18px] p-2.5"
            sx={
              background
                ? {
                    '& .MuiLinearProgress-bar': {
                      background: background?.backgroundGradientColor,
                    },
                    boxShadow:
                      '-2px -2px 4px rgba(68, 108, 108, 0.28), 2px 2px 4px rgba(0, 0, 0, 0.56)',
                  }
                : {
                    boxShadow:
                      '-2px -2px 4px rgba(68, 108, 108, 0.28), 2px 2px 4px rgba(0, 0, 0, 0.56)',
                  }
            }
          >
            <LinearProgress className="w-full" variant="determinate" {...props} />
          </Box>
        )}
      </div>
      <div className="xl:flex flex-col items-center justify-between gap-2 hidden">
        <h2
          className="text--headline-large text-secondary-60 text-[24px] lg:text-[32px]"
          style={text}
        >
          {props.rarityindex > 0 ? formatNumber(props.rarityindex, 2) : '-'}
        </h2>
        {props.rarityindex > 0 && (
          <div className="icon-diamond">
            <Diamond color={icon?.color} />
          </div>
        )}
      </div>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginTop: '36px',
  },
});

export default function RarityIndex(props: any) {
  const { rarityAssetDetail } = props;

  const { rarityIndex, maxRarity, minRarity } = rarityAssetDetail || {};
  const classes = useStyles();

  let value = 0;
  if (minRarity === maxRarity && maxRarity !== 0) {
    value = 100;
  } else {
    value = Math.round(((rarityIndex - minRarity) / (maxRarity - minRarity)) * 100);
  }
  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={value} rarityindex={rarityIndex} />
    </div>
  );
}
