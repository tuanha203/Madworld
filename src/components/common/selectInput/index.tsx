import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface SelectInputProp {
  handleChange: (e: SelectChangeEvent<string>) => void;
  title: string;
  data: Array<any>;
  value: any;
}

const SelectInput = ({ handleChange, title, data, value }: SelectInputProp) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 130 }}>
      <Select
        value={value}
        onChange={handleChange}
        sx={{ height: 32, padding: 0 }}
        className="border border-archive-teal-400 text-archive-Neutral-Variant80"
      >
        <MenuItem value={0}>
          <em>None</em>
        </MenuItem>
        {data.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;