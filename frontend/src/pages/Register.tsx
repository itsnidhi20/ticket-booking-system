import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/users/register",
        {
          name,
          email,
          password,
        }
      );

      alert(res.data.message);

      navigate("/verify-otp", {
        state: {
          email,
        },
      });

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0] px-6">

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10"
      >

        <h1 className="text-5xl font-bold mb-10">
          Register
        </h1>

        {error && (
          <div className="mb-6 rounded-xl bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="mb-5 w-full rounded-xl border p-4"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mb-5 w-full rounded-xl border p-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="mb-5 w-full rounded-xl border p-4"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="mb-8 w-full rounded-xl border p-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black py-4 text-white transition hover:bg-[#C36241]"
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>

        <p className="mt-6 text-center text-stone-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#C36241]"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;