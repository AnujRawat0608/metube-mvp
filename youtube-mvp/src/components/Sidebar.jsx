import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();

  const navItem = (path, icon, label) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition 
        ${isActive ? "bg-[#0e3a40] text-cyan-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
      >
        <span className="text-lg">{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <div
      className={`bg-[#111] text-white h-screen pt-16 fixed border-r border-gray-800 
      transition-all duration-300 overflow-hidden
      ${isCollapsed ? "w-16" : "w-56"}`}
    >
      <div className="flex flex-col gap-1 px-2">

        {/* MAIN */}
        {navItem("/", "🏠", "Home")}
        {navItem("/trending", "🔥", "Trending")}
        {navItem("/subscriptions", "📺", "Subscriptions")}

        {/* SPACING */}
        <div className="h-3" />

        {/* SECTION LABEL */}
        {!isCollapsed && (
          <div className="text-[10px] text-gray-500 uppercase tracking-wider px-3 mt-2 mb-1">
            Library
          </div>
        )}

        {/* LIBRARY */}
        {navItem("/library", "📚", "Library")}
        {navItem("/upload", "⬆️", "Uploads")}
      </div>
    </div>
  );
};

export default Sidebar;