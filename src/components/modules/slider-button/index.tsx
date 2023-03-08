import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
const SliderButton = ({ direction, state }: any) => {
    return (
        <div className={`slide-button md:w-16 md:h-16 sm:w-12 sm:h-12 flex flex-col justify-center items-center rounded-full shadow-elevation-dark-1
            ${(state == "active") ? "bg-secondary-60 hover:bg-secondary-50 cursor-pointer active:bg-secondary-50/80" : (state == "disabled") ? "bg-background-dark-600 cursor-default" : ""}
        `}>
            <figure className='text-center'>
                {(direction == "right") ? <ArrowForwardIosIcon className='text-black font-bold' />
                    : (direction == "left") ? <ArrowBackIosIcon className='text-black ml-1' /> : ""
                }
            </figure>
        </div>
    )
}
SliderButton.defaultProps = {
    direction: "right", // right / left
    state: "active" // disabled / active
}
export default SliderButton