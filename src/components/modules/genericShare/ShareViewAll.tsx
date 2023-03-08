import { RightArrow } from 'components/common/iconography/IconBundle'

export const SharedViewAll = ({ text = "View All" }: any) => {
    return (
        <div className='flex items-center gap-2 mx-6 cursor-pointer'>
            <div className="text--label-large text-primary-dark">{text}</div>
            <figure className='cursor-pointer'>
                <RightArrow />
            </figure>
        </div>
    )
}
