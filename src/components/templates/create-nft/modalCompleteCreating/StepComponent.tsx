import CircularProgressIndicator from "components/common/progress-indicator";
import CheckIcon from '@mui/icons-material/Check';
import { STATE_STEP } from "constants/app";
import { OutlinedButton } from "components/common";

const StepComponent = ({
  step: { title, des, state, indexNum, link, isShowDes, subDes },
  toggleDescription,
  key,
}: any) => {
  
  return (
    <div className="flex bg-background-asset-detail p-4 rounded-lg cursor-pointer w-full" key={key}>
      <div className="pr-3 pl-1 w-10">
        {state === STATE_STEP.LOADING ? (
          <CircularProgressIndicator size={20} />
        ) : state === STATE_STEP.UNCHECKED ? (
          <CheckIcon style={{ color: '#6F7978' }} />
        ) : (
          <CheckIcon style={{ color: '#F4B1A3' }} />
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-bold text-dark-on-surface text-lg">{`${indexNum}. ${title}`}</p>
          <div className="p-2">
            <img
              src="/icons/arrow-bottom.svg"
              className={`relative bottom-1 text-primary-dark ml-3 ${
                isShowDes ? 'rotate-180' : ''
              }`}
              onClick={() => toggleDescription(indexNum - 1)}
            />
          </div>
        </div>

        {isShowDes && (
          <div className="pr-2">
            <p className="text-primary-gray text-sm mt-2">{des}</p>
            <p className="text-xs text-secondary-gray mt-3 mb-3">{subDes}</p>
            {link && (
              <a href={link} target="_blank">
                <OutlinedButton
                  customClass="!text-secondary-60"
                  target="_blank"
                  fullWidth
                  text="View on Etherscan"
                />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepComponent;