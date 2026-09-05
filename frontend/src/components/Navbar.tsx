import { Ticket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

interface TokenData {
  id: number;
  role: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.profile);
    } catch (err) {
      console.log(err);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  const token = localStorage.getItem("token");

  let role = "";

if (token) {
  const decoded = jwtDecode<TokenData>(token);
  role = decoded.role;
}

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-300 bg-[#F9F6F0]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-3">
          <Ticket size={30} className="text-[#C36241]" />
          <h1 className="text-3xl font-bold text-[#1A1A1A]">
            TicketHub
          </h1>
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/">Events</Link>

          {token && (
            <Link to="/bookings">
              My Bookings
            </Link>
          )}
          {token && role === "admin" && (
            <Link to="/admin">
              Admin
            </Link>
          )}

          {!token ? (
            <>
              <Link
                to="/login"
                className="rounded-full border px-6 py-2"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-black px-6 py-2 text-white"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C36241] text-xl font-bold text-white"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white shadow-xl">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full px-5 py-4 text-left"
                  >
                    👤 Profile
                  </button>

                  <button
                    onClick={() => navigate("/bookings")}
                    className="block w-full px-5 py-4 text-left"
                  >
                    🎟 My Bookings
                  </button>

                  <button
                    onClick={logout}
                    className="block w-full px-5 py-4 text-left text-red-500"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;