import { useState } from "react";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      alert("Login Successful!");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center">

      <div className="w-[420px] bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-5xl text-center text-[#1A1A1A] mb-8">
          Welcome Back
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl p-4 mb-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl p-4 mb-8"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#C36241] text-white py-4 rounded-xl hover:opacity-90"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;