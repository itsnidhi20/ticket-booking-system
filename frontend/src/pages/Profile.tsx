import { useEffect, useState } from "react";
import api from "../services/api";

interface Profile {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] py-16">

      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow">

        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#C36241] text-5xl font-bold text-white">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <h1 className="mt-6 text-center text-4xl font-bold">
          {profile.name}
        </h1>

        <p className="mt-2 text-center text-stone-500">
          {profile.email}
        </p>

        <div className="mt-10 border-t pt-8">

          <div className="flex justify-between py-3">
            <span>Member Since</span>

            <span>
              {new Date(
                profile.created_at
              ).toLocaleDateString()}
            </span>
          </div>

        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="mt-10 w-full rounded-full bg-black py-4 text-white hover:bg-stone-800"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;