import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (
      !otp ||
      !newPassword ||
      !confirmPassword
    ) {
      return setError("Please fill all fields.");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/users/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      alert(res.data.message);

      navigate("/login");

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
          "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0] px-6">

      <form
        onSubmit={handleResetPassword}
        className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl"
      >

        <h1 className="mb-4 text-4xl font-bold">
          Reset Password
        </h1>

        <p className="mb-8 text-stone-500">
          Enter the OTP sent to your email and choose a new password.
        </p>

        {error && (
          <div className="mb-5 rounded-xl bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        <input
          type="email"
          value={email}
          readOnly
          className="mb-5 w-full rounded-xl border bg-gray-100 p-4"
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
          className="mb-5 w-full rounded-xl border p-4 outline-none"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          className="mb-5 w-full rounded-xl border p-4 outline-none"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="mb-8 w-full rounded-xl border p-4 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black py-4 text-white hover:bg-[#C36241]"
        >
          {loading
            ? "Updating..."
            : "Reset Password"}
        </button>

      </form>

    </div>
  );
}

export default ResetPassword;