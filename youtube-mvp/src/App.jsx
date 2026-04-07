import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import VideoPage from "./pages/VideoPage"; // ✅ FIXED case

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // ✅ Hide layout on auth pages
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white">

      {/* SIDEBAR */}
      {!hideLayout && <Sidebar isCollapsed={isCollapsed} />}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        {!hideLayout && (
          <Navbar toggleSidebar={() => setIsCollapsed(prev => !prev)} />
        )}

        {/* PAGE CONTENT */}
        <div className={hideLayout ? "" : "mt-14 p-6 overflow-y-auto"}>
          <Routes>
            <Route path="/" element={<Home isCollapsed={isCollapsed} />} />
            <Route path="/home" element={<Home isCollapsed={isCollapsed} />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ✅ FIXED lowercase route */}
            <Route path="/upload" element={<Upload />} />

            {/* ✅ NEW VIDEO PAGE ROUTE */}
            <Route path="/video/:id" element={<VideoPage />} />
          </Routes>
        </div>

      </div>
    </div>
  );
}

export default App;