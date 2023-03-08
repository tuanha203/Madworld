import MadNewsSingle from './MadNewsSingle';

const MadNewsSection = () => {
  return (
    <section className="madnews-listing-wrapper container padded ">
      <h1>
        <span className="text--display-small !font-black ">MAD</span>
        <span>news</span>
      </h1>
      <div className="madnews-listing flex flex-col gap-8 mt-10">
        <MadNewsSingle />
        <MadNewsSingle />
        <MadNewsSingle />
      </div>
    </section>
  );
};

export default MadNewsSection;
