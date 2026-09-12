
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

  useEffect(() => {
    fetchDashboard();
    fetchEvents();
  }, []);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4EFE5] text-[#1A1714]">
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-mono text-xs uppercase tracking-[4px] text-[#8C3030]">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4EFE5] text-[#1A1714]">

      {/* ================= HEADER ================= */}

      <header className="border-b border-[#1A1714]/20">

        <div className="mx-auto max-w-7xl px-8 py-10">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[4px] text-[#8C3030]">
                Management / Control
              </p>

              <h1 className="font-serif text-5xl font-bold leading-none tracking-[-2px] sm:text-6xl">
                ADMIN
                <br />
                DASHBOARD.
              </h1>

            </div>

            <div className="font-mono text-[10px] uppercase tracking-[2px] text-[#7A7169]">
              Event Management System
            </div>

          </div>

        </div>

      </header>


      {/* ================= CONTENT ================= */}

      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">


        {/* ================= STATS ================= */}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="border border-[#1A1714]/25 bg-[#FFFDF8] p-6">
            <p className="font-mono text-[9px] uppercase tracking-[2px] text-[#7A7169]">
              Total Events
            </p>

            <p className="mt-3 font-serif text-4xl font-bold">
              {data.totalEvents}
            </p>
          </div>


          <div className="border border-[#1A1714]/25 bg-[#FFFDF8] p-6">
            <p className="font-mono text-[9px] uppercase tracking-[2px] text-[#7A7169]">
              Users
            </p>

            <p className="mt-3 font-serif text-4xl font-bold">
              {data.totalUsers}
            </p>
          </div>


          <div className="border border-[#1A1714]/25 bg-[#FFFDF8] p-6">
            <p className="font-mono text-[9px] uppercase tracking-[2px] text-[#7A7169]">
              Bookings
            </p>

            <p className="mt-3 font-serif text-4xl font-bold">
              {data.totalBookings}
            </p>
          </div>


          <div className="border border-[#1A1714]/25 bg-[#8C3030] p-6 text-[#F4EFE5]">
            <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-70">
              Revenue
            </p>

            <p className="mt-3 font-mono text-3xl font-bold">
              ₹{data.totalRevenue}
            </p>
          </div>

        </section>


        {/* ================= ADD EVENT ================= */}

        <section className="mt-10 border border-[#1A1714]/25 bg-[#FFFDF8]">

          <div className="border-b border-dashed border-[#1A1714]/25 p-7 sm:p-8">

            <p className="font-mono text-[9px] uppercase tracking-[3px] text-[#8C3030]">
              Create
            </p>

            <h2 className="mt-2 font-serif text-4xl font-bold">
              Add Event.
            </h2>

            <p className="mt-2 text-sm text-[#6F6760]">
              Create a new event and configure its seating.
            </p>

          </div>


          <div className="p-7 sm:p-8">

            {/* EVENT DETAILS */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                  Event Title
                </label>

                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      title: e.target.value,
                    })
                  }
                  className="w-full border border-[#1A1714]/25 bg-[#F4EFE5] p-3 text-sm text-[#1A1714] outline-none transition focus:border-[#8C3030]"
                />
              </div>


              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                  Event Date
                </label>

                <input
                  type="date"
                  value={newEvent.event_date}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      event_date: e.target.value,
                    })
                  }
                  className="w-full border border-[#1A1714]/25 bg-[#F4EFE5] p-3 text-sm text-[#1A1714] outline-none transition focus:border-[#8C3030]"
                />
              </div>


              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                  Start Time
                </label>

                <input
                  type="time"
                  value={newEvent.start_time}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      start_time: e.target.value,
                    })
                  }
                  className="w-full border border-[#1A1714]/25 bg-[#F4EFE5] p-3 text-sm text-[#1A1714] outline-none transition focus:border-[#8C3030]"
                />
              </div>


              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                  End Time
                </label>

                <input
                  type="time"
                  value={newEvent.end_time}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      end_time: e.target.value,
                    })
                  }
                  className="w-full border border-[#1A1714]/25 bg-[#F4EFE5] p-3 text-sm text-[#1A1714] outline-none transition focus:border-[#8C3030]"
                />
              </div>

            </div>


            {/* SEATING */}

            <div className="mt-10">

              <div className="mb-6 flex items-end justify-between">

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[3px] text-[#8C3030]">
                    Configuration
                  </p>

                  <h3 className="mt-1 font-serif text-3xl font-bold">
                    Seating.
                  </h3>
                </div>

              </div>


              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


                {/* PREMIUM */}

                <div className="border border-[#1A1714]/20 bg-[#F4EFE5] p-6">

                  <h4 className="font-serif text-2xl font-bold text-[#8C3030]">
                    Premium
                  </h4>

                  <div className="mt-6 space-y-4">

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                        Price (₹)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={newEvent.premium_price}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            premium_price:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border border-[#1A1714]/25 bg-[#FFFDF8] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                        Number of Rows
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={newEvent.premium_rows}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            premium_rows:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border border-[#1A1714]/25 bg-[#FFFDF8] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                        Seats per Row
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={newEvent.premium_seats}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            premium_seats:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border border-[#1A1714]/25 bg-[#FFFDF8] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                      />
                    </div>

                    <p className="border-t border-dashed border-[#1A1714]/20 pt-4 font-mono text-[10px] uppercase tracking-[1px] text-[#6F6760]">
                      Total seats:{" "}
                      {newEvent.premium_rows *
                        newEvent.premium_seats}
                    </p>

                  </div>

                </div>


                {/* EXECUTIVE */}

                <div className="border border-[#1A1714]/20 bg-[#F4EFE5] p-6">

                  <h4 className="font-serif text-2xl font-bold text-[#8C3030]">
                    Executive
                  </h4>

                  <div className="mt-6 space-y-4">

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                        Price (₹)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={newEvent.executive_price}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            executive_price:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border border-[#1A1714]/25 bg-[#FFFDF8] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                        Number of Rows
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={newEvent.executive_rows}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            executive_rows:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border border-[#1A1714]/25 bg-[#FFFDF8] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                        Seats per Row
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={newEvent.executive_seats}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            executive_seats:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border border-[#1A1714]/25 bg-[#FFFDF8] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                      />
                    </div>

                    <p className="border-t border-dashed border-[#1A1714]/20 pt-4 font-mono text-[10px] uppercase tracking-[1px] text-[#6F6760]">
                      Total seats:{" "}
                      {newEvent.executive_rows *
                        newEvent.executive_seats}
                    </p>

                  </div>

                </div>


                {/* NORMAL */}

                <div className="border border-[#1A1714]/20 bg-[#F4EFE5] p-6">

                  <h4 className="font-serif text-2xl font-bold text-[#8C3030]">
                    Normal
                  </h4>

                  <div className="mt-6 space-y-4">

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                        Price (₹)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={newEvent.normal_price}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            normal_price:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border border-[#1A1714]/25 bg-[#FFFDF8] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                        Number of Rows
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={newEvent.normal_rows}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            normal_rows:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border border-[#1A1714]/25 bg-[#FFFDF8] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px]">
                        Seats per Row
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={newEvent.normal_seats}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            normal_seats:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border border-[#1A1714]/25 bg-[#FFFDF8] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                      />
                    </div>

                    <p className="border-t border-dashed border-[#1A1714]/20 pt-4 font-mono text-[10px] uppercase tracking-[1px] text-[#6F6760]">
                      Total seats:{" "}
                      {newEvent.normal_rows *
                        newEvent.normal_seats}
                    </p>

                  </div>

                </div>

              </div>

            </div>


            <button
              onClick={addEvent}
              className="mt-8 border border-[#1A1714] bg-[#1A1714] px-8 py-4 text-sm font-semibold uppercase tracking-[2px] text-[#F4EFE5] transition hover:bg-[#8C3030]"
            >
              Add Event →
            </button>

          </div>

        </section>


        {/* ================= EDIT EVENT ================= */}

        {editingEvent && (

          <section className="mt-10 border border-[#8C3030]/40 bg-[#FFFDF8]">

            <div className="border-b border-dashed border-[#1A1714]/25 p-7">

              <p className="font-mono text-[9px] uppercase tracking-[3px] text-[#8C3030]">
                Modify
              </p>

              <h2 className="mt-2 font-serif text-4xl font-bold">
                Edit Event.
              </h2>

            </div>


            <div className="p-7">

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

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
                  className="border border-[#1A1714]/25 bg-[#F4EFE5] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
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
                  className="border border-[#1A1714]/25 bg-[#F4EFE5] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
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
                  className="border border-[#1A1714]/25 bg-[#F4EFE5] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
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
                  className="border border-[#1A1714]/25 bg-[#F4EFE5] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
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
                  className="border border-[#1A1714]/25 bg-[#F4EFE5] p-3 text-[#1A1714] outline-none focus:border-[#8C3030]"
                />

              </div>


              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  onClick={saveChanges}
                  className="border border-[#1A1714] bg-[#1A1714] px-6 py-3 text-sm font-semibold uppercase tracking-[1.5px] text-[#F4EFE5] transition hover:bg-[#8C3030]"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setEditingEvent(null)}
                  className="border border-[#1A1714]/30 px-6 py-3 text-sm font-semibold uppercase tracking-[1.5px] text-[#1A1714] transition hover:border-[#8C3030] hover:text-[#8C3030]"
                >
                  Cancel
                </button>

              </div>

            </div>

          </section>

        )}


        {/* ================= EVENTS ================= */}

        <section className="mt-12">

          <div className="mb-6 flex items-end justify-between">

            <div>

              <p className="font-mono text-[9px] uppercase tracking-[3px] text-[#8C3030]">
                Archive
              </p>

              <h2 className="mt-1 font-serif text-4xl font-bold">
                All Events.
              </h2>

            </div>

            <span className="font-mono text-[9px] uppercase tracking-[2px] text-[#7A7169]">
              {events.length} listed
            </span>

          </div>


          <div className="space-y-4">

            {events.map((event) => (

              <div
                key={event.id}
                className="border border-[#1A1714]/25 bg-[#FFFDF8]"
              >

                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">

                  <div>

                    <p className="font-mono text-[9px] uppercase tracking-[2px] text-[#8C3030]">
                      Event #{String(event.id).padStart(3, "0")}
                    </p>

                    <h3 className="mt-2 font-serif text-3xl font-bold">
                      {event.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#6F6760]">

                      <span>{event.venue}</span>

                      <span>
                        {new Date(
                          event.event_date
                        ).toDateString()}
                      </span>

                      <span>
                        {event.start_time} —{" "}
                        {event.end_time}
                      </span>

                    </div>

                    <p className="mt-4 font-mono text-lg font-bold text-[#8C3030]">
                      ₹{event.price}
                    </p>

                  </div>


                  <div className="flex shrink-0 gap-3">

                    <button
                      onClick={() =>
                        setEditingEvent(event)
                      }
                      className="border border-[#1A1714]/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[1.5px] text-[#1A1714] transition hover:border-[#8C3030] hover:text-[#8C3030]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteEvent(event.id)
                      }
                      className="border border-[#8C3030] bg-[#8C3030] px-5 py-2.5 text-xs font-semibold uppercase tracking-[1.5px] text-[#F4EFE5] transition hover:bg-[#211B18]"
                    >
                      Delete
                    </button>

                  </div>

                </div>


                {/* Film detail */}

                <div className="flex h-7 items-center gap-5 overflow-hidden bg-[#211B18] px-4">

                  {Array.from({ length: 14 }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className="flex shrink-0 items-center gap-2"
                      >
                        <span className="h-2.5 w-4 rounded-sm bg-[#F4EFE5]/70" />

                        <span className="font-mono text-[7px] text-[#F4EFE5]/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )
                  )}

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>


      {/* ================= FOOTER ================= */}

      <footer className="mt-12 bg-[#211B18] px-8 py-8 text-[#F4EFE5]">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row sm:items-center">

          <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-60">
            Event Management
          </p>

          <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-40">
            Admin Control
          </p>

        </div>

      </footer>

    </main>
  );
}

export default Admin;
