const ModalHeader = ({ children, className }: any) => {
  return (
    <div className={`modal-header w-full text-center text-white text--headline-small ${className}`}>
      {children}
    </div>
  );
};

ModalHeader.defaultProps = {
  children: 'text here',
};

export default ModalHeader;
