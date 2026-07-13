import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyOTP() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const verify = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        "http://localhost:5000/users/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Email Verified Successfully 🎉");

      navigate("/login");

    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]">

      <div className="bg-white p-10 rounded-3xl shadow w-[420px]">

        <h1 className="text-4xl font-bold mb-6">
          Verify Email
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl p-4 mb-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border rounded-xl p-4 mb-5"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {message && (
          <p className="text-red-600 mb-4">
            {message}
          </p>
        )}

        <button
          onClick={verify}
          disabled={loading}
          className="w-full bg-black text-white rounded-xl py-4"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </div>

    </div>
  );
}

export default VerifyOTP;