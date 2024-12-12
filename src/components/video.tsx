export const Video = ({src}: {src?: string}) => {
  return (
    <video controls>
      <source src={src} type="video/mp4" />
    </video>
  );
};
