import Slider from '@mui/material/Slider';

const BasicSlider = ({labelstate}: any) => {
  return (
      <Slider
        size="small"
        defaultValue={80}
        valueLabelDisplay= {labelstate}
        className="basic-slider"
      />
  );
}

export default BasicSlider;
