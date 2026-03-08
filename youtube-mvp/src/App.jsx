import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();

  // hide layout on auth pages
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {!hideLayout && <Sidebar isCollapsed={isCollapsed} />}

      <div className="flex-1 flex flex-col">

        {!hideLayout && (
          <Navbar toggleSidebar={() => setIsCollapsed(prev => !prev)} />
        )}

        <div className={hideLayout ? "" : "mt-14 p-6 overflow-y-auto"}>
          <Routes>
            <Route path="/" element={<Home isCollapsed={isCollapsed} />} />
            <Route path="/home" element={<Home isCollapsed={isCollapsed} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>

      </div>
    </div>
  );
}

export default App;