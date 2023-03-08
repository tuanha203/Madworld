import { FC } from "react"
interface TimeLimitProps {
    children: string
}

const TimeLimit: FC<TimeLimitProps> = ({ children }) => {
    return (
        <div className='max-content-width text--headline-xsmall text-[#410002] px-5 py-1 rounded-full bg-primary-dark'>
            {children}
        </div>
    )
}

TimeLimit.defaultProps = {
    children: "8h 49m 10s"
}

export default TimeLimit