import { useEffect, useState } from "react";
import api from "../services/api";

interface Booking {
  id: number;
  title: string;
  seat_number: string;
  total_amount: number;
  booking_time: string;
}

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBookings(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: number) => {
    const confirmCancel = window.confirm(
      "Cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await api.delete(`/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Booking Cancelled");

      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("Unable to cancel booking");
    }
  };

  // ⭐ NEW FUNCTION
  const downloadTicket = async (id: number) => {
    try {
      const res = await api.get(
        `/tickets/${id}/download`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = `ticket-${id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      alert("Unable to download ticket");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-[#1A1A1A] mb-10">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow">
            <h2 className="text-3xl font-semibold">
              No bookings yet 🎟️
            </h2>

            <p className="mt-3 text-stone-500">
              Book an event to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl bg-white p-8 shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {booking.title}
                    </h2>

                    <p className="mt-3 text-lg">
                      🎫 Seat : <b>{booking.seat_number}</b>
                    </p>

                    <p className="mt-2">
                      💰 ₹{booking.total_amount}
                    </p>

                    <p className="mt-2 text-sm text-stone-500">
                      {new Date(
                        booking.booking_time
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() =>
                        downloadTicket(booking.id)
                      }
                      className="rounded-full bg-[#C36241] px-6 py-3 text-white hover:bg-[#a54d30]"
                    >
                      Download Ticket
                    </button>

                    <button
                      onClick={() =>
                        cancelBooking(booking.id)
                      }
                      className="rounded-full bg-red-500 px-6 py-3 text-white hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;