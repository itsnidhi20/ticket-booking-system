import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import SeatSelection from "./pages/SeatSelection";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/seats/:eventId" element={<SeatSelection />} />
        <Route path="/profile" element={<Profile />} />
        {/* Event Details */}
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </div>
  );
}

export default App;