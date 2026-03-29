import { useState } from "react";

export default function Upload() {
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleUpload = async () => {
    if (!video) return alert("Select a video");

    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      await res.json();
      alert("Uploaded 🚀");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-20 flex justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-[500px] text-white">

        <h2 className="text-xl mb-4">Upload Video</h2>

        {/* Drag & Drop Box */}
        <label className="border-2 border-dashed border-gray-600 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 transition">
          <input
            type="file"
            accept="video/*"
            hidden
            onChange={handleFileChange}
          />

          <p className="text-gray-400">Click to upload video</p>
        </label>

        {/* Preview */}
        {preview && (
          <video
            src={preview}
            controls
            className="mt-4 rounded-lg"
          />
        )}

        {/* Title */}
        <input
          type="text"
          placeholder="Enter title"
          className="mt-4 w-full px-3 py-2 bg-gray-800 rounded outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="mt-4 w-full bg-cyan-500 py-2 rounded hover:bg-cyan-600 transition"
        >
          Upload
        </button>

      </div>
    </div>
  );
}