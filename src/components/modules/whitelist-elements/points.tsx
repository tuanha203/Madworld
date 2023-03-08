import DoneIcon from '@mui/icons-material/Done';
import { FC } from 'react';

interface AddNumberPointProps {
    index: string
}
export const AddNumberPoint: FC<AddNumberPointProps> = ({ index }) => {
  return (
    <div className="w-8 h-8 flex justify-center items-center rounded-full bg-secondary-60">
      <h1 className="text-base text-black font-bold">
        +<span>{index}</span>
      </h1>
    </div>
  );
};

AddNumberPoint.defaultProps = {
  index: '5',
};

export const TickPoint = () => {
  return (
    <div className="w-8 h-8 flex justify-center items-center rounded-full bg-secondary-60">
      <div className="text-black">
        <DoneIcon className="!w-[14px] !font-bold" />
      </div>
    </div>
  );
};
