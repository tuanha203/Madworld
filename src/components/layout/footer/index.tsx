import Divider from 'components/common/divider';
import {
  DiscordSvg,
  LinkedinIconSVG,
  SocialIconSVG,
  SocialIconSVG1,
  TelegramSvg,
  TwitterIconCustomSVG,
} from 'components/common/iconography/iconsComponentSVG';
import MadLogoWhite from 'components/common/mad-logo-white';
import NewsletterBlock from 'components/modules/newsletter';
import SubscribeField from 'components/modules/newsletter/SubcribeField';
import _ from 'lodash';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const Footer = (props: any) => {
  const { isMobile } = props;
  const { text, media, icon } = useSelector((state: any) => state.theme);
  const logo = _.find(media?.logos, (e: any) => e.index === 2);
  if (isMobile) {
    return (
      <>
        <section className="footer relative">
          <div className="newsletter-wrapper bg-[#424A57] rounded-xl">
            <div className="newsletter-block flex flex-col justify-center p-4 !font-Chakra">
              <div className="flex flex-col gap-4">
                <div className="text--headline-xsmall font-Chakra text-primary-60" style={text}>
                  Subscribe
                </div>
                <SubscribeField />
                <p className="text--body-small opacity-60 max-w-[300px]">
                  Join us to stay updated with our newest feature releases, NFT drops, tips and
                  tricks in MADworld NFT Marketplace.
                </p>
              </div>
            </div>
          </div>
          <div className="footer-content z-40">
            <div className="footer-main flex flex-col items-center text-center">
              <div className="connect-wrapper">
                <p className="text--body-medium text-gray-c4 mb-2 max-w-[200px]">
                  It is a NFT platform for both real world and digital collectibles.
                </p>
                <div>
                  <div className="text-secondary-60 text--subtitle" style={text}>
                    Connect with us
                  </div>
                  <div className="flex flex-row items-center gap-4 pt-5">
                    <TwitterIconCustomSVG color={icon?.color} />
                    <TelegramSvg color={icon?.color} />
                    <DiscordSvg color={icon?.color} />
                    <SocialIconSVG color={icon?.color} />
                    <SocialIconSVG1 color={icon?.color} />
                    <LinkedinIconSVG color={icon?.color} />
                  </div>
                </div>
              </div>
              <div className="other-links-wrapper">
                <div className="other-links">
                  <div className="other-links-header text--subtitle mt-[40px]" style={text}>
                    other links
                  </div>
                  <Link href="https://www.madworld.io/about">
                    <a target="_blank">About Madworld</a>
                  </Link>
                  <Link href="https://www.madworld.io/umad">
                    <a target="_blank">UMAD</a>
                  </Link>
                  <Link href="https://www.madworld.io/umad#tokenomics">
                    <a target="_blank">Tokenomics</a>
                  </Link>
                  <Link href="https://www.madworld.io/partners">
                    <a target="_blank">Partners</a>
                  </Link>
                  <Link href="https://madworld.io/about#teams">
                    <a target="_blank">Teams</a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="sub-content py-[44px] text-center">
              <div className="copyright max-w-[340px]">
                Copyright © 2022 MADworld.io, Insanity Limited.
              </div>
              <div className="z-10 sub-content-links max-w-full whitespace-nowrap flex-wrap justify-center">
                <Link href="https://madworld.io/terms">
                  <a target="_blank">Terms & Conditions</a>
                </Link>
                <Link href="https://madworld.io/aml">
                  <a target="_blank">AML/KYC Policy</a>
                </Link>
                <Link href="https://madworld.io/privacy">
                  <a target="_blank">Privacy</a>
                </Link>
              </div>
              <div className="z-10 sub-content-links max-w-full whitespace-nowrap">
                <Link href="https://madworld.io/disclaimers">
                  <a target="_blank">Disclaimer</a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  return (
    <section className="footer relative">
      <div className="footer-content padded z-40">
        <div className="footer-main">
          <div className="connect-wrapper">
            <div>
              <MadLogoWhite url={logo?.url} style={logo?.style} />
            </div>
            <p className="text--body-medium text-gray-c4 mt-6 mb-2">
              It is a NFT platform for both real world and digital collectibles.
            </p>
            <div>
              <div className="text-secondary-60 text--title-medium my-6" style={text}>
                Connect with us
              </div>
              <div className="flex flex-row items-center gap-4">
                <TwitterIconCustomSVG color={icon?.color} />
                <TelegramSvg color={icon?.color} />
                <DiscordSvg color={icon?.color} />
                <SocialIconSVG color={icon?.color} />
                <SocialIconSVG1 color={icon?.color} />
                <LinkedinIconSVG color={icon?.color} />
              </div>
            </div>
          </div>
          <div className="main-links-wrapper">
            <div className="z-10 main-links">
              {text ? (
                <Link href="/marketplace">Marketplace</Link>
              ) : (
                <>
                  <Link href="/">MADworld</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <Link href="/branded-projects">Branded Projects</Link>
                  <div>
                    <Link href="https://www.madworld.io/news">
                      <a target="_blank">News & Events</a>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="other-links-wrapper">
            <div className="other-links">
              <div className={`other-links-header`} style={text}>
                other links
              </div>
              {media && media.links ? (
                media.links.map((item: any) => (
                  <Link key={item.index} href={item.url}>
                    <a target="_blank">{item.name}</a>
                  </Link>
                ))
              ) : (
                <>
                  <Link href="https://www.madworld.io/about">
                    <a target="_blank">About Madworld</a>
                  </Link>
                  <Link href="https://www.madworld.io/umad">
                    <a target="_blank">UMAD</a>
                  </Link>
                  <Link href="https://www.madworld.io/umad#tokenomics">
                    <a target="_blank">Tokenomics</a>
                  </Link>
                  <Link href="https://www.madworld.io/partners">
                    <a target="_blank">Partners</a>
                  </Link>
                  <Link href="https://madworld.io/about#teams">
                    <a target="_blank">Teams</a>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="newsletter-wrapper">
            <NewsletterBlock />
          </div>
        </div>
        <Divider customClass="my-12" />
        <div className="sub-content">
          <div className="copyright">Copyright © 2022 MADworld.io, Insanity Limited.</div>
          <div className="z-10 sub-content-links">
            <Link href="https://madworld.io/terms">
              <a target="_blank">Terms & Conditions</a>
            </Link>
            <Link href="https://madworld.io/aml">
              <a target="_blank">AML/KYC Policy</a>
            </Link>
            <Link href="https://madworld.io/privacy">
              <a target="_blank">Privacy</a>
            </Link>
            <Link href="https://madworld.io/disclaimers">
              <a target="_blank">Disclaimer</a>
            </Link>
          </div>
        </div>
      </div>
      <img
        className="absolute z-0 w-[31%] top-[11%] left-[5%] -rotate-[16.78deg] opacity-[0.06]"
        src="../logo/MAD_logo_white_single.svg"
        alt=""
      />
    </section>
  );
};

export default Footer;
