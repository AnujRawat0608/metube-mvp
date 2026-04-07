import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/videos`)
      .then(res => res.json())
      .then(data => {
        const selected = data.find(v => v.id === id);
        setVideo(selected);
      });
  }, [id]);

  if (!video) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="ml-0 md:ml-20 lg:ml-56 pt-20 p-6 bg-[#0f0f0f] min-h-screen text-white">
      
      {/* VIDEO PLAYER */}
      <div className="w-full max-w-4xl">
        <video
          src={video.video_url}
          controls
          className="w-full rounded-lg"
        />
      </div>

      {/* VIDEO INFO */}
      <div className="mt-4 max-w-4xl">
        <h1 className="text-xl font-semibold text-gray-200">
          {video.title}
        </h1>

        <p className="text-sm text-gray-400 mt-2">
          {video.description}
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Uploaded recently
        </p>
      </div>

    </div>
  );
}

export default VideoPage;