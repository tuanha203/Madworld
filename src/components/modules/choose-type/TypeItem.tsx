import { FC, memo } from 'react';

export interface ITypeItemProps {
  img: string;
  title: string;
  description?: string;
  pathname?: any;
  onClick?: () => void;
}

const TypeItem: FC<ITypeItemProps> = (props) => {
  const { img, title, description, onClick } = props;

  const typeItemClassName =
    'flex flex-col items-center justify-center w-[360px] h-[302px] text-white border border-[#836462] cursor-pointer opacity-50 hover:border-primary-60 hover:opacity-100';

  return (
    <div className={typeItemClassName} onClick={onClick}>
      <div className="mb-7">
        <img className="w-full" src={img} alt={title} />
      </div>
      <div className="text-center">
        <h2 className="text--headline-small mb-5">{title}</h2>
        <div className="text--body-medium whitespace-pre-line">{description}</div>
      </div>
    </div>
  );
};

export default memo(TypeItem);
