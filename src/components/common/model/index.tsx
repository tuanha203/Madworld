import '@google/model-viewer';

interface IModalState {
  src: string;
  poster?: string;
}
const Model = (props: IModalState) => {
  const { src, poster } = props;
  return (
    <model-viewer
      alt="A 3D model"
      src={src}
      ar
      ar-modes="webxr scene-viewer quick-look"
      environment-image=""
      poster=""
      shadow-intensity="1"
      camera-controls
      touch-action="pan-y"
    ></model-viewer>
  );
};

export default Model;
