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
    `flex flex-col items-center justify-center 
    text-white border border-[#836462] cursor-pointer opacity-50
    hover:border-primary-60 hover:opacity-100
    lg:w-[360px] lg:h-[302px] w-full h-[auto]
    py-6 px-[30px]`

  return (
    <div className={typeItemClassName} onClick={onClick}>
      <div className="lg:mb-7 mb-2">
        <img className="lg:w-full w-[40px] h-[40px]" src={img} alt={title} />
      </div>
      <div className="text-center">
        <h2 className="text--headline-small lg:mb-5 mb-[6px] lg:text-2xl text-lg">{title}</h2>
        <div className="text--body-medium whitespace-pre-line lg:font-bold font-normal">{description}</div>
      </div>
    </div>
  );
};

export default memo(TypeItem);
