import { HeartIcon, TrendingUp } from "components/common/iconography/IconBundle"
import { EthPrice } from "components/common/price"
import { Avatar } from "components/modules/thumbnail"
import { SharedViewAll } from "components/modules/genericShare/ShareViewAll"
import JustifyBetween from "components/modules/share/JustifyBetween"

const FeaturedBrandedCollection = () => {
    return (
        <div className="featured-branded-collections">
            <figure className="w-[550px] h-[450px]">
                <img className="w-full h-full object-contain object-center mx-auto" src="./images/featuredBrand.png" alt="" />
            </figure>
            <div className="flex flex-col gap-8">
                <JustifyBetween>
                    <div className="flex items-center gap-2">
                        <Avatar />
                        <h2 className="text--headline-xsmall">Krispy Kreme Xmas</h2>
                    </div>
                    <SharedViewAll text="View Brand" />
                </JustifyBetween>
                <div className="flex flex-row gap-4 items-center">
                    <div className='flex items-center gap-2'>
                        <HeartIcon />
                        <span className='text--label-medium'>90k</span>
                    </div>
                    <EthPrice customClass="!text-white !text--title-small" eth="60.90k" />
                    <div className='flex items-center gap-2'>
                        <TrendingUp />
                        <span className='text--label-medium'>+60.90%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeaturedBrandedCollection