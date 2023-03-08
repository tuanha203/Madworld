const PhotoCardSimple = () => {
  return (
    <figure className="card-thumbnail relative w-[360px] h-[360px] bg-primary-light overflow-hidden">
      <img className="w-full object-cover" src="/images/test.jpg" alt="thumbnail" />
      <div className="card-corner bg-background-dark-900"></div>
      {/* please add color of background to corner */}
    </figure>
  );
};

export default PhotoCardSimple;
