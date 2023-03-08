import React from 'react'
import { FilledButton } from 'components/common/buttons'

const TokenImport = () => {
    return (
        <div className="modal-token-import flex items-center justify-between">
            <div className='flex items-center gap-6'>
                <img className='w-6 h-6' src="./icons/cDai.svg" alt="" />
                <div className='text--body-small text-white/60'>
                    <h2> <span className='text--title-medium text-white'>cDAI </span>
                        | Compound Dai </h2>
                    <h2 >via Compounf</h2>
                </div>
            </div>
            <div>
                <FilledButton customClass="!text--label-large">Import</FilledButton>
            </div>
        </div>
    )
}

export default TokenImport