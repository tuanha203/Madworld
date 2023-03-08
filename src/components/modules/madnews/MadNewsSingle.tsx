import AccessTimeIcon from '@mui/icons-material/AccessTime';
import IconCardSingle from '../../common/iconography/IconCardSingle';
import { OutlinedButton } from '../../common/buttons';
import PhotoCardSimple from '../cards/PhotoCardSimple';

const MadNewsSingle = () => {
  const testFunction = () => {
    console.log('click');
  };
  return (
    <div className="madnews-single flex flex-row gap-12">
      <div>
        <PhotoCardSimple />
      </div>

      <div className="madnews-single--description flex flex-col">
        <div className="flex flex-row items-center gap-4 mb-8">
          <IconCardSingle />
          <div className="news-details flex flex-col items-start gap-2">
            <div className="text--body-large">The MADWORLD Team</div>
            <div className="madnews-single--meta flex flex-row gap-2 items-center">
              <div className="text--body-medium flex flex-row items-center capitalize">
                <AccessTimeIcon className="text-primary-dark mr-2" />
                posted <span className="mx-1">nov</span> <span>21</span>
              </div>
              <div className="text--body-medium flex flex-row items-center">
                <span className="text-xl mr-1">&#183;</span>
                <span className="mr-1">3 min</span> read
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text--headline-small mb-4">
            MADworld Sold Out 400 MADminds in Under 2 Minutes on the ApolloX NFT Launchpad
          </h2>
          <p className="text--body-large">
            MADworld launched the first round of its MADminds PFP (profile picture) NFTs on PAID
            Network’s NFT launchpad, ApolloX on Saturday November 20, 2021. MADworld allocated 400
            Virtual Genius MADminds out of the 1111 total to PAID Network’s...
          </p>
        </div>
        <div className="mt-16">
          <OutlinedButton text="Read More" func={testFunction} />
        </div>
      </div>
    </div>
  );
};

export default MadNewsSingle;
