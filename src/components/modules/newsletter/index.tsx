import React from 'react';
import SubscribeField from './SubcribeField';

const NewsletterBlock = () => {
  return (
    <div className="newsletter-block w-[450px] flex flex-col justify-center py-10 px-8 !font-Chakra">
      <div className="flex flex-col gap-4">
        <div className="text--title-medium text-white text-base">Subscribe</div>
        <SubscribeField />
        <p className="text--body-small opacity-60">
          Subscribe to our newsletter to stay up to date for the upcoming featured event, airdrops,
          and more!
        </p>
      </div>
    </div>
  );
};

export default NewsletterBlock;
