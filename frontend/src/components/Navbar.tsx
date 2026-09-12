
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
    <nav className="sticky top-0 z-50 border-b border-[#1A1714]/20 bg-[#F4EFE5]/95 backdrop-blur-sm">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

        <Link to="/" className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center border border-[#8E2F2F]">
            <Ticket
              size={21}
              strokeWidth={1.8}
              className="text-[#8E2F2F]"
            />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight">
              TicketHub
            </h1>

            <p className="hidden text-[8px] uppercase tracking-[3px] text-stone-500 sm:block">
              Live Experiences
            </p>
          </div>

        </Link>


        <div className="flex items-center gap-6 text-sm font-medium">

          <Link
            to="/"
            className="hidden transition hover:text-[#8E2F2F] sm:block"
          >
            Events
          </Link>

          {token && (
            <Link
              to="/bookings"
              className="hidden transition hover:text-[#8E2F2F] sm:block"
            >
              My Bookings
            </Link>
          )}

          {token && role === "admin" && (
            <Link
              to="/admin"
              className="hidden transition hover:text-[#8E2F2F] sm:block"
            >
              Admin
            </Link>
          )}


          {!token ? (
            <>
              <Link
                to="/login"
                className="rounded-full border border-[#1A1714] px-5 py-2.5 transition hover:bg-[#1A1714] hover:text-[#F4EFE5]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-[#8E2F2F] px-5 py-2.5 text-[#F4EFE5] transition hover:bg-[#702424]"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">

              <button
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8E2F2F] text-sm font-bold text-white transition hover:bg-[#702424]"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-52 border border-[#1A1714]/15 bg-[#F4EFE5] shadow-xl">

                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full px-5 py-4 text-left transition hover:bg-[#E8DFD0]"
                  >
                    👤 Profile
                  </button>

                  <button
                    onClick={() => navigate("/bookings")}
                    className="block w-full px-5 py-4 text-left transition hover:bg-[#E8DFD0]"
                  >
                    🎟 My Bookings
                  </button>

                  <button
                    onClick={logout}
                    className="block w-full px-5 py-4 text-left text-red-700 transition hover:bg-[#E8DFD0]"
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
