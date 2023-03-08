import { FilledButton, OutlinedButton } from 'components/common/buttons';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
export const ImportToken = () => {
  return (
    <div className="py-5 flex flex-col w-full px-8">
      <div className="flex flex-col justify-center items-center w-full mx-auto mb-8">
        <div className="flex gap-7 mb-5">
          <div>
            <InfoOutlinedIcon className="text-primary-dark !w-8 !h-8" />
          </div>
          <div>
            This token doesn't appear on the active token list(s). Make sure this is the token that
            you want to trade.
          </div>
        </div>
        <div></div>

        <div className="flex w-full items-start justify-start gap-7 mb-4">
          <div className="flex flex-col justify-start items-start">
            <img className="w-8 h-9" src="./icons/cDai.svg" alt="" />
          </div>
          <div className="text--body-small text-white/60">
            <h2>
              {' '}
              <span className="text--title-medium text-white">cDAI </span>| Compound Dai{' '}
            </h2>
            <h2 className="mt-5 text--label-small text-primary-dark">
              0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643
            </h2>
          </div>
        </div>
        <div className="flex w-full items-center justify-start gap-7">
          <div>
            <InfoOutlinedIcon className="text-primary-dark !w-8 !h-8" />
          </div>
          <div className="text--body-medium text-white/60">Via Compound token list</div>
        </div>
      </div>

      <div className="capitalize text--label-large flex gap-4 justify-end items-center w-full">
        <OutlinedButton text="Go back" customClass="!text--label-large" />
        <FilledButton disabled={false} text="Import" customClass="!text--label-large" />
      </div>
    </div>
  );
};

export default ImportToken;
