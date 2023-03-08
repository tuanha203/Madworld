import { FC } from 'react';

interface IPreferredWalletItemProps {
  title: string;
  img?: string;
  description?: string;
}

const PreferredWalletItem: FC<IPreferredWalletItemProps> = (props) => {
  const { title, description, img } = props;

  return (
    <div className="flex items-center border py-3 px-6 border-[#006A64] h-16">
      <div className="pr-4">
        <div>icon</div>
      </div>
      <div className="flex flex-col">
        <div className="text--headline-xsmall text-white">{title}</div>
        <div className="text--body-medium text-archive-Neutral-Variant70">{description}</div>
      </div>
    </div>
  );
};

export default PreferredWalletItem;
