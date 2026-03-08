import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {

  const navigate = useNavigate();

  const[fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async() => {

    const res = await fetch("http://localhost:5000/api/signup",{
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        password
      })
    });

    const data = await res.json();

    if(res.ok){
      alert("Signup Successful!");
      navigate("/login");
    }else{
      alert(data.message);
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">
          Create Your Skib Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-gray-800 rounded outline-none"
        />

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
        onClick={handleSignup}
        className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded font-semibold">
          Sign Up
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}