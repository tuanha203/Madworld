import { MadPriceMedium } from "components/common/price"
import { Avatar } from "../thumbnail"

const ItemFeedAssetsOfferingList = () => {
    return (
        <div className="offering-list w-[450px] flex justify-between py-4 px-6 rounded-xl bg-background-dark-600 hover:bg-background-dark-400">
            <div className='flex items-center gap-3'>
                <div>
                    <Avatar />
                </div>
                <div className='flex flex-col gap-1'>
                    <h2 className='text--label-small'>Offer by</h2>
                    <h3 className='text--body-medium flex gap-2'>
                        <span className='capitalize text-secondary-60'>user name</span>
                        <span>2h</span>
                        <span>ago</span>
                    </h3>
                </div>
            </div>
            <MadPriceMedium umad="21" />
        </div>
    )
}

export default ItemFeedAssetsOfferingList