const VideoCard = ({ video }) => {
  return (
    <div className="bg-[#161616] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition cursor-pointer group">
      
      {/* Thumbnail */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <video
          src={video.video_url}
          className="w-full h-full object-cover"
        />

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="bg-black/50 p-3 rounded-full text-white text-sm">
            ▶
          </div>
        </div>

        {/* Duration */}
        <span className="absolute bottom-2 right-2 text-xs bg-black/80 px-2 py-0.5 rounded">
          10:00
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-200 truncate">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          1k views • 2 days ago
        </p>
      </div>
    </div>
  );
};

export default VideoCard;