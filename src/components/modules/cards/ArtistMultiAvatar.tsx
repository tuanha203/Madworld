import React from 'react'
import { Avatar } from 'components/modules/thumbnail'

const ArtistMultiAvatar = ({ artistName, size }: any) => {
    return (
        <div className='multi-avatar flex items-center gap-2'>
            <div className='flex flex-row'>
                <Avatar size={size} />
                <Avatar size={size} border="true" customClass="-ml-3" src="/images/1.jpg" />
            </div>
            <div className='text--label-large text-white capitalize'>{artistName}</div>
        </div>
    )
}
ArtistMultiAvatar.defaultProps = {
    artistName: "artist Name",
    size: "small"
}

export default ArtistMultiAvatar