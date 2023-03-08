const ModalWrapper = ({ children, style, className }: any) => {
  return (
    <div
      className={`complete-checkout-wrapper buy-now-modal-wrapper lg:py-6 sm:py-14 flex flex-col lg:w-[550px] sm:w-[calc(100%-32px)] lg:px-14 sm:px-2 bg-background-700 overflow-hidden items-center relative rounded-[28px] shadow-elevation-dark-2 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ModalWrapper;
