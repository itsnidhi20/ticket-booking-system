import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSendOTP = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await api.post("/users/forgot-password", {
        email,
      });

      alert("OTP sent successfully!");

      navigate("/reset-password", {
        state: {
          email,
        },
      });

    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0] px-6">

      <form
        onSubmit={handleSendOTP}
        className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl"
      >

        <h1 className="mb-4 text-4xl font-bold">
          Forgot Password
        </h1>

        <p className="mb-8 text-stone-500">
          Enter your registered email and we'll send you an OTP to reset your password.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-8 w-full rounded-xl border p-4 outline-none"
          required
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-black py-4 text-white hover:bg-[#C36241]"
        >
          Send OTP
        </button>

      </form>

    </div>
  );
}

export default ForgotPassword;