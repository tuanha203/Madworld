import { FC, memo } from 'react';

export interface IWalletItemProps {
  img: string;
  title: string;
  onClick?: () => void;
}

const WalletItem: FC<IWalletItemProps> = (props) => {
  const { img, title, onClick } = props;

  const walletItemClassName =
    'flex items-center py-2.5 px-8 w-full text-primary-dark border rounded-2xl border-outlined-normal cursor-pointer hover:border-primary-dark';

  return (
    <div className={walletItemClassName} onClick={onClick}>
      <div className="w-4 mr-8">
        <img className="w-full" src={img} alt={title} />
      </div>
      <span className="text--label-large text-primary-dark">{title}</span>
    </div>
  );
};

export default memo(WalletItem);
