import React from 'react'

const Divider = ({ customClass }: any) => {
    return (
        <hr className={`bg-[#C190FF] w-full h-[1px] opacity-10 rounded ${customClass}`} />
    )
}

Divider.defaultProps = {
    customClass: ""
}

export default Divider