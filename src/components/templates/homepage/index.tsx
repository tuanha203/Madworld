import { BannerBrandedColleciton } from '../branded-projects';
import Banner from './banner';
import DropListingHomepage from './drop-listing';
import Hot from './hot';
import MadGalleries from './mad-galleries';
import Trending from './trending';
export { Banner, MadGalleries, Hot, Trending };

export default function HomePage() {
  return (
    <div className="bg-background-dark-900">
      <Banner />
      <DropListingHomepage />
      <BannerBrandedColleciton titleActive={true} typeThumbnail="large" className="py-[64px]" />
      <MadGalleries />
      <Hot />
    </div>
  );
}
