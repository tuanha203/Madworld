import OverviewSectionFeaturedCard from 'components/modules/cards/OverviewSectionFeatureCard';
import OverviewSectionCard from 'components/modules/cards/OverviewSectionCard';

const OverviewSectionHomepage = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  return (
    <section className="overview-section-homepage bg-background-dark-900 ">
      <div className="overview-section-homepage-wrapper pt-4 pb-12  flex gap-6 overflow-x-auto scroll-smooth">
        <div className="ml-[9rem]">{/* <OverviewSectionFeaturedCard /> */}</div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {data.map((card, index) =>
              !(index % 2) ? (
                <div key={index} className="card-scroll">
                  <OverviewSectionCard />
                </div>
              ) : null,
            )}
          </div>
          <div className="flex items-center gap-4">
            {data.map((card, index) =>
              index % 2 ? (
                <div key={index} className="card-scroll">
                  <OverviewSectionCard />
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSectionHomepage;
