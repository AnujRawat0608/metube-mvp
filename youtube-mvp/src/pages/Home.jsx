import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate(); // ✅ IMPORTANT

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ml-0 md:ml-20 lg:ml-56 p-6 pt-20 bg-[#0f0f0f] min-h-screen text-white">
      
      <h2 className="text-xl font-semibold mb-5 text-gray-200">
        Latest Videos
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => navigate(`/video/${video.id}`)} // ✅ NAVIGATION
            className="bg-[#161616] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 hover:scale-[1.02] transition cursor-pointer group"
          >
            
            {/* VIDEO PREVIEW */}
            <div className="relative">
              <video
                src={video.thumbnail_url}
                className="w-full h-48 object-cover pointer-events-none" // ✅ FIX CLICK ISSUE
                muted
                onMouseOver={(e) => e.target.play()}
                onMouseOut={(e) => {
                  e.target.pause();
                  e.target.currentTime = 0;
                }}
              />

              {/* PLAY ICON */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="bg-black/60 p-3 rounded-full text-white text-sm">
                  ▶
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-200 line-clamp-2">
                {video.title}
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Uploaded recently
              </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Home;