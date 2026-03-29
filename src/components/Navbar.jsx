import logo from "../assets/Smile.png";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-6 h-14 bg-gray-900 text-white fixed w-full top-0 z-50">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-2xl">
          ☰
        </button>

        <div className="flex items-center gap-2">
          <img src={logo} alt="Skib" className="h-8" />
          <span className="text-xl font-bold text-cyan-400">
            Skib
          </span>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search"
        className="bg-gray-800 px-4 py-1 rounded-full w-1/3 outline-none"
      />

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Upload Button */}
        <Link to="/upload">
          <button className="bg-cyan-500 px-4 py-1 rounded-full hover:bg-cyan-600 transition">
            Upload
          </button>
        </Link>

        {/* User Icon */}
        <div
          onClick={() => navigate("/signup")}
          className="w-8 h-8 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition"
        ></div>

      </div>
    </div>
  );
};

export default Navbar;