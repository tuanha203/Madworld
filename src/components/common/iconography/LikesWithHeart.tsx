import { HeartIcon } from './IconBundle';

const LikesWithHeart = ({ index }: any) => {
    return (
        <div className='text--label-small flex items-center gap-2'>
            <HeartIcon />
            <span>{index}</span>
        </div>
    )
}

LikesWithHeart.defaultProps = {
    index: "90k"
}

export default LikesWithHeart