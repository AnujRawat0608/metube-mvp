import { useEffect} from "react";
import { useNavigate} from "react-router-dom";


const Home = ({ isCollapsed }) => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if(!token) {
      navigate("/login");
    }
  },[navigate]);


  return (
    <div
      className={`pt-16 p-6 bg-gray-950 min-h-screen text-white transition-all duration-300 ${
        isCollapsed ? "ml-16" : "ml-56"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-6">Recommended</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="h-40 bg-gray-700"></div>
            <div className="p-3">
              <h3 className="font-semibold">Sample Video Title</h3>
              <p className="text-sm text-gray-400">Channel Name</p>
              <p className="text-sm text-gray-500">10K views • 2 days ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;