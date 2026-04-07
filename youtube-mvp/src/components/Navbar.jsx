import logo from "../assets/skib_logo.svg";
import { useNavigate, Link } from "react-router-dom";
const icons = {
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};


const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-6 h-14 bg-[#111] text-white fixed w-full top-0 z-50 border-b border-gray-800">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-xl p-2 rounded-lg hover:bg-gray-800 transition"
        >
          ☰
        </button>

        <div className="flex items-center gap-2">
          <img src={logo} alt="Skib" className="h-20 w-auto" />
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative w-1/3 hidden md:block">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          {icons.search}
        </span>
        <input
          type="text"
          placeholder="Search videos, creators..."
          className="w-full bg-[#1a1a1a] border border-gray-700 text-sm text-white pl-9 pr-4 py-2 rounded-full outline-none focus:border-cyan-500 transition"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        
        {/* Upload */}
        <Link to="/upload">
          <button className="bg-cyan-500 px-4 py-1.5 text-sm rounded-full font-medium hover:bg-cyan-600 transition">
            + Upload
          </button>
        </Link>

        {/* Avatar */}
        <div
          onClick={() => navigate("/signup")}
          className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full cursor-pointer border border-gray-700 hover:border-cyan-400 transition"
        >
          <span className="text-xs text-gray-400">U</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;