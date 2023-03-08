import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const PoolStatus = ({ state }: any) => {
    return (
        <div className='state'>
            {
                (state === "approve") ?
                    <div className='approve'>
                        <div className='flex gap-2 items-center'>
                            <FiberManualRecordIcon />
                            Approve now
                        </div>
                    </div>
                    : (state === "stake") ?
                        <div className='stake'>
                            <div className='flex gap-2 items-center'>
                                <FiberManualRecordIcon />
                                Stake Now
                            </div>
                        </div>
                        : (state === "soon") ?
                            <div className='soon'>
                                <div className='flex gap-2 items-center'>
                                    <FiberManualRecordIcon />
                                    Coming Soon
                                </div>
                            </div>
                            : (state == "end") ?
                                <div className='end'>
                                    <div className='flex gap-2 items-center'>
                                        <FiberManualRecordIcon />
                                        End Staking
                                    </div>
                                </div>
                                :
                                <>
                                    <p>no state defined</p>
                                </>
            }

        </div>
    )
}

export default PoolStatus

PoolStatus.defaultProps = {
    state: "approve"
}