import { FC } from 'react';
// import TypeItem, { ITypeItemProps } from './TypeItem';
import { useRouter } from 'next/router';
import TypeItem, { ITypeItemProps } from './TypeItem';

interface ITypeListProps {
  list: ITypeItemProps[];
}

const TypeList: FC<ITypeListProps> = (props) => {
  const { list = [] } = props;
  const router = useRouter();

  const handleChooseType = (pathname: string) => {
    router.push(pathname);
  }
  return (
    <div className="lg:flex-row lg:gap-x-6 gap-y-6 flex items-center flex-col">
      {list.map((item, index) => {
        const {title, img, description, pathname} = item;
        return (
          <TypeItem
            key={`${title}-${index}`}
            img={img}
            title={title}
            description={description}
            onClick={() => handleChooseType(pathname)}
          />
        )
      })}
    </div>
  );
};

export default TypeList;
