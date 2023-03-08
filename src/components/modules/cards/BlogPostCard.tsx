import { FC } from 'react';
// import { CategoryChip } from '../../common/chips/CategoryChip';
import { ClockIcon } from '../../common/iconography/IconBundle';

interface IBlogPostCardProps {
  collectionTitle: String;
  img: string;
  paragraph: string;
}

const BlogPostCard: FC<IBlogPostCardProps> = (props) => {
  const { collectionTitle, img, paragraph } = props;
  return (
    <div className="blog-post-card w-[360px] px-4 pt-4 bg-background-dark-600 hover:bg-background-dark-400 cursor-pointer shadow-elevation-dark-1 hover:shadow-elevation-dark-5">
      <figure className="relative overflow-hidden w-full">
        <img className="w-full object-cover" src={img} alt="" />
        <div className="card-corner bg-background-dark-600"></div>
        <div className="absolute z-30 top-5 right-5">
          {/* <CategoryChip /> */}
        </div>
      </figure>
      <div className="flex flex-col justify-center gap-4 py-8">
        <h2 className="text--headline-xsmall">{collectionTitle}</h2>
        <p className=" text-gray-c4 text--body-medium">{paragraph}</p>
        <div className="flex items-center gap-2">
          <div className="scale-90">
            <ClockIcon />
          </div>
          <span className="text--label-large">Posted 8h ago</span>
        </div>
      </div>
    </div>
  );
};

BlogPostCard.defaultProps = {
  collectionTitle: 'Trending NFTs: Jimmy Choo, Pat Lee, and more',
  paragraph:
    'MADworld is building something truly special in the multiverse. Follow our channels to stay....',
  img: './images/blogPost.jpg',
};

export default BlogPostCard;
