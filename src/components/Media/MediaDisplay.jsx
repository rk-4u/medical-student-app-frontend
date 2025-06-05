import React from "react";

const MediaDisplay = ({ media }) => {
  const extension = media.split(".").pop().toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif"].includes(extension);
  const isVideo = ["mp4", "webm"].includes(extension);

  return (
    <div className="flex items-center space-x-2 mb-2">
      {isImage && <img src={media} alt="Media" className="w-16 h-16 object-cover rounded" />}
      {isVideo && <video src={media} className="w-16 h-16 rounded" />}
      <a
        href={media}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View Media
      </a>
    </div>
  );
};

export default MediaDisplay;