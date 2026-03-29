import { Link,useNavigate } from "react-router-dom";
import {useState} from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if(res.ok){
      //store JWT token
      localStorage.setItem("token", data.token);

      //redirect to home page
      navigate("/home");
    }else{
      alert(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">
          Sign In to Skib
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-gray-800 rounded outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 bg-gray-800 rounded outline-none"
        />

        <button
        onClick={handleLogin}
        className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded font-semibold">
          Sign In
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-cyan-400">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}