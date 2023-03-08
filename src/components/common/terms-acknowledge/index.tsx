import { FC } from 'react';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Link from 'next/link';
import { useSelector } from 'react-redux';

interface ITermsAcknowledgeProps {
  className?: string;
}

const TermsAcknowledge: FC<ITermsAcknowledgeProps & SwitchProps> = (props) => {
  const { className } = props;
  const { text, icon } = useSelector((state:any) => state.theme);
  return (
    <div
      className={`w-full flex flex-row justify-between items-center mt-6 gap-4 ${className || ''}`}
    >
      <div className="text--title-medium grow sm:max-w-[256px] md:max-w-auto">
        <span className="sm:whitespace-normal md:block md:whitespace-nowrap font-normal">
          By checking the switch, I agree to MADworld’s
        </span>
        <Link href="https://madworld.io/terms">
          <a target="_blank" className="sm:inline md:block">
            <span className="text-primary-90" style={text}> Terms of Service</span>
          </a>
        </Link>
      </div>
      <Switch style={icon} className="mad-switch ml-auto text-secondary-60" {...props} />
    </div>
  );
};

export default TermsAcknowledge;
