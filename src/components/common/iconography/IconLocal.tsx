interface IconLocalProp {
  src: string;
  custom?: string;
  customSize?: string
}

const IconLocal = ({ src, custom, customSize }: IconLocalProp) => {
  return (
    <figure className={` flex flex-col justify-center ${customSize ? customSize: "w-4 h-4"} ${custom}`}>
      <img className=" w-full object-cover" src={src} alt="" />
    </figure>
  );
};

export default IconLocal;
