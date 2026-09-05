import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

interface TokenData {
  id: number;
  role: string;
}

interface DashboardData {
  totalEvents: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
}
interface Event {
  id: number;
  title: string;
  venue: string;
  event_date: string;
  start_time: string;
  end_time: string;
  price: number;
}

function Admin() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = jwtDecode<TokenData>(token);

  if (decoded.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const [data, setData] = useState<DashboardData>({
    totalEvents: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] =
  useState<Event | null>(null);
  useEffect(() => {
  fetchDashboard();
  fetchEvents();
}, []);
const [newEvent, setNewEvent] = useState({
  title: "",
  event_date: "",
  start_time: "",
  end_time: "",
  venue_id: 1,

  premium_price: 800,
  premium_rows: 2,
  premium_seats: 6,

  executive_price: 500,
  executive_rows: 3,
  executive_seats: 8,

  normal_price: 300,
  normal_rows: 4,
  normal_seats: 10,
});

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };
  const fetchEvents = async () => {
  try {
    const res = await api.get("/admin/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setEvents(res.data);
  } catch (err) {
    console.log(err);
    alert("Failed to load events");
  }
};
const deleteEvent = async (id: number) => {
  const confirmDelete = window.confirm(
    "Delete this event?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/admin/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Event deleted successfully");

    fetchEvents();
    fetchDashboard();
  } catch (err) {
    console.log(err);
    alert("Failed to delete event");
  }
};
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading...
      </div>
      
    );
  }
const saveChanges = async () => {
  if (!editingEvent) return;

  try {
    await api.put(
      `/admin/events/${editingEvent.id}`,
      {
        title: editingEvent.title,
        event_date: editingEvent.event_date,
        start_time: editingEvent.start_time,
        end_time: editingEvent.end_time,
        price: editingEvent.price,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Event updated successfully");

    setEditingEvent(null);

    fetchEvents();
    fetchDashboard();
  } catch (err) {
    console.log(err);
    alert("Failed to update event");
  }
};
const addEvent = async () => {
  try {
    await api.post(
      "/admin/events",
      newEvent,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Event added successfully");

    setNewEvent({
  title: "",
  event_date: "",
  start_time: "",
  end_time: "",
  venue_id: 1,

  premium_price: 800,
  premium_rows: 2,
  premium_seats: 6,

  executive_price: 500,
  executive_rows: 3,
  executive_seats: 8,

  normal_price: 300,
  normal_rows: 4,
  normal_seats: 10,
});

    fetchEvents();
    fetchDashboard();
  } catch (err) {
    console.log(err);
    alert("Failed to add event");
  }
};
  return (
  <div className="min-h-screen bg-[#F9F6F0] p-10">
    <h1 className="text-5xl font-bold mb-10 text-[#1A1A1A]">
      Admin Dashboard
    </h1>
    <div className="bg-white rounded-3xl shadow p-8 mb-10">
  <h2 className="text-3xl font-bold mb-6">
    Add Event
  </h2>

  <div className="grid grid-cols-2 gap-4">

    <input
      type="text"
      placeholder="Title"
      value={newEvent.title}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          title: e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="date"
      value={newEvent.event_date}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          event_date: e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="time"
      value={newEvent.start_time}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          start_time: e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="time"
      value={newEvent.end_time}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          end_time: e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    {/* Premium */}

<div className="col-span-2 rounded-2xl border p-5">
  <h3 className="mb-4 text-xl font-bold text-[#C36241]">
    Premium
  </h3>

  <div className="grid grid-cols-3 gap-4">
    <input
      type="number"
      placeholder="Price"
      value={newEvent.premium_price}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          premium_price: Number(e.target.value),
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="number"
      placeholder="Rows"
      value={newEvent.premium_rows}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          premium_rows: Number(e.target.value),
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="number"
      placeholder="Seats / Row"
      value={newEvent.premium_seats}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          premium_seats: Number(e.target.value),
        })
      }
      className="border rounded-xl p-3"
    />
  </div>
</div>

{/* Executive */}

<div className="col-span-2 rounded-2xl border p-5">
  <h3 className="mb-4 text-xl font-bold text-[#C36241]">
    Executive
  </h3>

  <div className="grid grid-cols-3 gap-4">
    <input
      type="number"
      placeholder="Price"
      value={newEvent.executive_price}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          executive_price: Number(e.target.value),
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="number"
      placeholder="Rows"
      value={newEvent.executive_rows}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          executive_rows: Number(e.target.value),
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="number"
      placeholder="Seats / Row"
      value={newEvent.executive_seats}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          executive_seats: Number(e.target.value),
        })
      }
      className="border rounded-xl p-3"
    />
  </div>
</div>

{/* Normal */}

<div className="col-span-2 rounded-2xl border p-5">
  <h3 className="mb-4 text-xl font-bold text-[#C36241]">
    Normal
  </h3>

  <div className="grid grid-cols-3 gap-4">
    <input
      type="number"
      placeholder="Price"
      value={newEvent.normal_price}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          normal_price: Number(e.target.value),
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="number"
      placeholder="Rows"
      value={newEvent.normal_rows}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          normal_rows: Number(e.target.value),
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="number"
      placeholder="Seats / Row"
      value={newEvent.normal_seats}
      onChange={(e) =>
        setNewEvent({
          ...newEvent,
          normal_seats: Number(e.target.value),
        })
      }
      className="border rounded-xl p-3"
    />
  </div>
</div>
  </div>

  <button
    onClick={addEvent}
    className="mt-6 bg-[#C36241] text-white px-6 py-3 rounded-xl"
  >
    Add Event
  </button>
</div>
    {editingEvent && (
  <div className="bg-white rounded-3xl shadow p-8 mb-10">
    <h2 className="text-3xl font-bold mb-6">
      Edit Event
    </h2>

    <div className="grid grid-cols-2 gap-4">

      <input
        type="text"
        value={editingEvent.title}
        onChange={(e) =>
          setEditingEvent({
            ...editingEvent,
            title: e.target.value,
          })
        }
        placeholder="Title"
        className="border rounded-xl p-3"
      />

      <input
        type="number"
        value={editingEvent.price}
        onChange={(e) =>
          setEditingEvent({
            ...editingEvent,
            price: Number(e.target.value),
          })
        }
        placeholder="Price"
        className="border rounded-xl p-3"
      />

      <input
        type="date"
        value={editingEvent.event_date.slice(0, 10)}
        onChange={(e) =>
          setEditingEvent({
            ...editingEvent,
            event_date: e.target.value,
          })
        }
        className="border rounded-xl p-3"
      />

      <input
        type="time"
        value={editingEvent.start_time}
        onChange={(e) =>
          setEditingEvent({
            ...editingEvent,
            start_time: e.target.value,
          })
        }
        className="border rounded-xl p-3"
      />

      <input
        type="time"
        value={editingEvent.end_time}
        onChange={(e) =>
          setEditingEvent({
            ...editingEvent,
            end_time: e.target.value,
          })
        }
        className="border rounded-xl p-3"
      />

    </div>

    <div className="mt-6 flex gap-4">

     <button
  onClick={saveChanges}
  className="bg-green-600 text-white px-6 py-3 rounded-xl"
>
  Save Changes
</button>

      <button
        onClick={() => setEditingEvent(null)}
        className="bg-gray-500 text-white px-6 py-3 rounded-xl"
      >
        Cancel
      </button>

    </div>
  </div>
)}

    {/* Dashboard Cards */}
    <div className="grid grid-cols-4 gap-6">

      <div className="bg-white rounded-3xl shadow p-8">
        <h2 className="text-lg text-gray-500">
          Total Events
        </h2>

        <p className="text-4xl font-bold mt-3">
          {data.totalEvents}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow p-8">
        <h2 className="text-lg text-gray-500">
          Users
        </h2>

        <p className="text-4xl font-bold mt-3">
          {data.totalUsers}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow p-8">
        <h2 className="text-lg text-gray-500">
          Bookings
        </h2>

        <p className="text-4xl font-bold mt-3">
          {data.totalBookings}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow p-8">
        <h2 className="text-lg text-gray-500">
          Revenue
        </h2>

        <p className="text-4xl font-bold mt-3">
          ₹{data.totalRevenue}
        </p>
      </div>

    </div>

    {/* Events List */}
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">
        All Events
      </h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-2xl font-semibold">
                {event.title}
              </h3>

              <p>{event.venue}</p>

              <p>
                {new Date(event.event_date).toDateString()}
              </p>

              <p className="font-semibold">
                ₹{event.price}
              </p>
            </div>

            <div className="flex gap-3">
              <button
  onClick={() => setEditingEvent(event)}
>
  Edit
</button>
<button
  onClick={() => deleteEvent(event.id)}
  className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600"
>
  Delete
</button>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
);
}

export default Admin;