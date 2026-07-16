import { useEffect, useState } from "react";
import api from "../services/api";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      // Backend returns:
      // {
      //   success: true,
      //   profile: {...}
      // }

      setProfile(res.data.profile);

    } catch (err: any) {
      console.log(err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        No Profile Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] py-16">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-lg">

        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#C36241] text-5xl font-bold text-white">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <h1 className="mt-6 text-center text-4xl font-bold">
          {profile.name}
        </h1>

        <p className="mt-2 text-center text-stone-500">
          {profile.email}
        </p>

        <div className="mt-10 border-t pt-6 space-y-4">

          <div className="flex justify-between">
            <span className="font-medium">User ID</span>
            <span>{profile.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Joined</span>
            <span>
              {new Date(
                profile.created_at
              ).toLocaleDateString()}
            </span>
          </div>

        </div>

        <button
          onClick={logout}
          className="mt-10 w-full rounded-full bg-black py-4 text-white hover:bg-stone-800"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Profile;