import { FC } from 'react';
import TypeItem, { ITypeItemProps } from './TypeItem';
import { useRouter } from 'next/router';

interface ITypeListProps {
  list: ITypeItemProps[];
  handleClose: () => void;
}

const TypeList: FC<ITypeListProps> = (props) => {
  const { list, handleClose } = props;
  const router = useRouter();

  const handleChooseType = (pathname: string) => {
    handleClose();
    router.push(pathname);
  }
  return (
    <div className="flex items-center gap-x-6">
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
