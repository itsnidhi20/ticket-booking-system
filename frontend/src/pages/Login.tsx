import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const res = await api.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/profile");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0] px-6">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10"
      >

        <h1 className="text-5xl font-bold mb-10">
          Login
        </h1>

        {error && (
          <div className="mb-6 rounded-xl bg-red-100 text-red-700 p-3">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full mb-5 rounded-xl border p-4 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full mb-8 rounded-xl border p-4 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black text-white py-4 hover:bg-[#C36241] transition"
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <p className="mt-6 text-center text-stone-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#C36241]"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;