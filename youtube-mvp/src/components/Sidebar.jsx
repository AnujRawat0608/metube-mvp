const Sidebar = ({ isCollapsed }) => {
  return (
    <div
      className={`bg-gray-900 text-white h-screen pt-16 fixed transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      <ul className="space-y-4 p-4">
        <li className="hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
          🏠 {!isCollapsed && "Home"}
        </li>
        <li className="hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
          🔥 {!isCollapsed && "Trending"}
        </li>
        <li className="hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
          📺 {!isCollapsed && "Subscriptions"}
        </li>
        <li className="hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
          📚 {!isCollapsed && "Library"}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;