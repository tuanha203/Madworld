const JustifyBetween = ({ children, customClass = '' }: any) => {
  return (
    <div className={`w-full flex justify-between items-center ${customClass}`}>{children}</div>
  );
};

JustifyBetween.defaultProps = {
  customClass: '',
};

export default JustifyBetween;
