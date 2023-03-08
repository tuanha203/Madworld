const NumberCard = ({ index, mood, size, customClass, customClassContainer }: any) => {


    return (
        <div className={` number-card ${(size == "large") ? "w-12 h-12" : " w-8 h-8"}   flex justify-center items-center rounded-full 
        ${(mood == "error") ? "bg-secondary-60"
                : (mood == "primary") ? " bg-primary-dark"
                    : (mood == "disabled") ? " bg-background-dark-600" : "bg-background-dark-600"}
                    ${customClassContainer}`}
        >
            <h1 className={`text-sm text-black font-bold ${customClass}`}>{index}</h1>
        </div >
    )
}
NumberCard.defaultProps = {
    index: "1",
    mood: "error",
    size: "small",
    customClass: "",
    customClassContainer: ""
}
export default NumberCard