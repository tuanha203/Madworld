import { FC } from 'react';
import WalletItem, { IWalletItemProps } from './WalletItem';

interface IWalletListProps {
  list: IWalletItemProps[];
}

const WalletList: FC<IWalletListProps> = (props) => {
  const { list } = props;

  return (
    <div className="flex flex-col gap-8 items-center mb-6">
      {list.map((item, index) => (
        <WalletItem
          key={`${item.title}-${index}`}
          img={item.img}
          title={item.title}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};

export default WalletList;
