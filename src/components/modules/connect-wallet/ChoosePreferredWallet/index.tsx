import { FC } from 'react';
import PreferredWalletItem from './PreferredWalletItem';

interface IChoosePreferredWalletProps {}

interface IPreferredWalletItem {
  img?: string;
  title: string;
  description?: string;
}

interface IGroupPreferredWallet {
  groupTitle: string;
  items: IPreferredWalletItem[];
}

const ChoosePreferredWallet: FC<IChoosePreferredWalletProps> = (props) => {
  const exampleData: IGroupPreferredWallet[] = [
    {
      groupTitle: 'Browser extension',
      items: [
        {
          img: '',
          title: 'Spire',
          description: 'Not installed',
        },
        {
          img: '',
          title: 'Temple Wallet',
          description: 'Not installed',
        },
      ],
    },
    {
      groupTitle: 'Desktop & Web Wallet',
      items: [
        {
          img: '',
          title: 'Galleon',
        },
        {
          img: '',
          title: 'Kubai Wallet',
        },
        {
          img: '',
          title: 'Unami',
        },
      ],
    },
    {
      groupTitle: 'Desktop & Web Wallet',
      items: [
        {
          img: '',
          title: 'AirGap Wallet',
        },
      ],
    },
  ];

  const renderList = (list: IPreferredWalletItem[]) => {
    return (
      <div className="flex flex-col gap-4">
        {list.map((item) => (
          <PreferredWalletItem img={item.img} title={item.title} description={item.description} />
        ))}
      </div>
    );
  };

  const renderGroup = () => {
    return (
      <div className="flex flex-col gap-8">
        {exampleData.map((group) => (
          <div>
            <div className="text--body-large text-white mb-3">{group.groupTitle}</div>
            {renderList(group.items)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-10 w-full">
      <div className="mb-10 px-24">
        <h1 className="text--headline-small text-dark-on-surface mb-10">
          {'Choose your preferred wallet'}
        </h1>
        {renderGroup()}
      </div>
    </div>
  );
};
export default ChoosePreferredWallet;
