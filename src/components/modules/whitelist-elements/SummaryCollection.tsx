import { FC, ReactNode } from "react"
import { useSelector } from "react-redux";
import MADOutline from "../../common/mad-out-line"

interface SummaryCollectionProps {
    description: string,
    index?: string | number,
    children?: any,
    icon?: ReactNode,
    className?: string,
    color?: any,
}

export const SummaryCollection: FC<SummaryCollectionProps> = ({ description, index, children, className }) => {
    const { text } = useSelector((state:any) => state.theme);
    return (
        <div className={`flex flex-col text-center gap-1 ${className}`}>
            <div className="text--title-medium text-base text-white break-all">{children}{index}</div>
            <div style={text} className="text--label-small text-secondary-70 capitalize">{description} </div>
        </div>
    )
}

interface SummaryCollectionIconProps {
    description: string,
    index: string | number,

}

export const SummaryCollectionIcon: FC<SummaryCollectionProps> = ({ description, index, icon, className }) => {
    const { text } = useSelector((state:any) => state.theme);

    return (
        <div className={`flex flex-col justify-center items-center text-center gap-1 ${className} w-[33.33%]`}>
            <div className="flex items-center justify-between gap-2 break-all">
                {/* <MADOutline /> */}
                {icon}
                <div className="text--title-medium text-white text-base">{index}</div>
            </div>
            <div style={text} className="text--label-small text-secondary-70 capitalize">{description}</div>
        </div>
    )
}

interface SummaryCollectionGraphProps {
    description: string,
    index: string,
}

export const SummaryCollectionGraph: FC<SummaryCollectionGraphProps> = ({ description, index }) => {
    return (
        <div className="flex flex-col justify-center  gap-1">
            <div className="text--title-large text-white">{index}</div>
            <div className="text--label-small text-secondary-70 capitalize">{description} </div>
        </div>
    )
}

SummaryCollection.defaultProps = {
    index: "4",
    description: "collections"
}
SummaryCollectionIcon.defaultProps = {
    index: "4",
    description: "Volume"

}
SummaryCollectionGraph.defaultProps = {
    index: "4",
    description: "collections"
}