
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import { FilledButton, TextButton } from 'components/common';
import { useSelector } from 'react-redux';

interface IModalFilterMobile {
    open: boolean;
    children: any;
    handleClose: any;
    handleApply: any;
    activeReset?: () => boolean;
    handleReset?: any;
}


const ModalFilterMobile = ({ open, children, handleClose, handleApply, activeReset, handleReset }: IModalFilterMobile) => {
    const { icon, button } = useSelector((state) => (state as any).theme);
    return (
        <>
            {
                open ? (<div className="fixed inset-0 bg-red w-full h-full z-[1000] bg-background-asset-detail p-[24px] overflow-y-scroll overflow-x-hidden">
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <FilterListIcon style={icon} className="text-primary-60" />
                                    <p className="text-sm font-bold ">FILTER</p>
                                </div>
                                <CloseIcon style={icon} className="text-primary-60" onClick={handleClose} />
                            </div>

                            <div className="mt-[24px] flex flex-col gap-3">
                                {children}
                            </div>
                        </div>

                        <div className="mb-[30px] mt-5">
                            <FilledButton
                                onClick={handleApply}
                                text={'Apply'}
                                customClass="!text--label-large w-full"
                                style={button?.filled}
                            />
                            {
                                activeReset && activeReset() ? <TextButton text="Reset" onClick={handleReset} customClass="!text--label-large w-full mt-3" /> : null
                            }

                        </div>

                    </div>


                </div>) : null
            }

        </>
    );
};

export default ModalFilterMobile;
