import React from 'react';

const VideoPlayer = ({ url }) => {
  return (
    <div className="video-container">
    <iframe
      width="100%"
      height="500"
      src={url}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="YouTube video player"
    ></iframe>
  </div>
  );
};

export default VideoPlayer;
