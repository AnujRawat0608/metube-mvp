import { Link, useLocation } from "react-router-dom";

const icons = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 10v12h7v-6h6v6h7V10z"/>
    </svg>
  ),
  trending: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
    </svg>
    ),
      subscriptions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v12H4z"/>
      <path d="M22 20H2"/>
      <path d="M12 16v4"/>
    </svg>
  ),
  library: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5V4a2 2 0 0 1 2-2h12"/>
      <path d="M16 2v20"/>
      <path d="M8 6h8"/>
      <path d="M8 10h8"/>
      <path d="M8 14h8"/>
    </svg>
  ),
    upload: (<svg width="20" height="20" viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 16V4" />
    <path d="M8 8l4-4 4 4" />
    <path d="M20 16v4H4v-4" />
  </svg>
),

};

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
        {navItem("/", icons.home, "Home")}
        {navItem("/trending", icons.trending, "Trending")}
        {navItem("/subscriptions", icons.subscriptions, "Subscriptions")}

        {/* SPACING */}
        <div className="h-3" />

        {/* SECTION LABEL */}
        {!isCollapsed && (
          <div className="text-[10px] text-gray-500 uppercase tracking-wider px-3 mt-2 mb-1">
            Library
          </div>
        )}

        {/* LIBRARY */}
        {navItem("/library", icons.library, "Library")}
        {navItem("/upload", icons.upload, "Uploads")}
      </div>
    </div>
  );
};

export default Sidebar;