import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Seat {
  id: number;
  seat_number: string;
  booked: boolean;
}

function SeatSelection() {
  const { eventId } = useParams();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSeats();
  }, [eventId]);

  const fetchSeats = async () => {
    try {
      const res = await api.get(`/events/${eventId}/seats`);

      setSeats(res.data.seats);

    } catch (err) {
      console.log(err);
    }
  };

  const toggleSeat = (seat: Seat) => {
    if (seat.booked) return;

    const exists = selectedSeats.find(
      (s) => s.id === seat.id
    );

    if (exists) {
      setSelectedSeats(
        selectedSeats.filter(
          (s) => s.id !== seat.id
        )
      );
    } else {
      setSelectedSeats([
        ...selectedSeats,
        seat,
      ]);
    }
  };

  const bookSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("Select at least one seat");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/bookings",
        {
          eventId: Number(eventId),
          seatNumbers: selectedSeats.map(
            (seat) => seat.seat_number
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      alert("Booking Successful 🎉");

      setSelectedSeats([]);

      fetchSeats();

    } catch (err: any) {

      alert(
        err.response?.data?.message ||
          "Booking Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  const totalPrice =
    selectedSeats.length * 4999;

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <div className="mx-auto max-w-6xl px-8 py-16">

        <p className="uppercase tracking-[5px] text-stone-500">
          Event #{eventId}
        </p>

        <h1 className="mt-4 text-5xl font-bold">
          Select Your Seats
        </h1>

        <div className="mx-auto mb-14 mt-10 max-w-3xl rounded-full bg-black py-4 text-center tracking-[8px] text-white">
          STAGE
        </div>

        <div className="flex justify-center">

          <div className="grid grid-cols-8 gap-4">

            {seats.map((seat) => {

              const selected =
                selectedSeats.some(
                  (s) => s.id === seat.id
                );

              return (
                <button
                  key={seat.id}
                  disabled={seat.booked}
                  onClick={() =>
                    toggleSeat(seat)
                  }
                  className={`h-14 w-14 rounded-xl font-semibold transition
                  ${
                    seat.booked
                      ? "cursor-not-allowed bg-red-500 text-white"
                      : selected
                      ? "scale-110 bg-[#C36241] text-white"
                      : "border border-stone-300 bg-white hover:bg-stone-200"
                  }`}
                >
                  {seat.seat_number}
                </button>
              );
            })}

          </div>

        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 shadow-lg">

          <div className="flex justify-between">

            <div>

              <p className="text-sm uppercase text-stone-500">
                Selected Seats
              </p>

              <h2 className="mt-2 text-3xl">

                {selectedSeats.length === 0
                  ? "-"
                  : selectedSeats
                      .map(
                        (seat) =>
                          seat.seat_number
                      )
                      .join(", ")}

              </h2>

            </div>

            <div className="text-right">

              <p className="text-sm uppercase text-stone-500">
                Total
              </p>

              <h2 className="mt-2 text-4xl font-bold text-[#C36241]">
                ₹{totalPrice}
              </h2>

            </div>

          </div>

          <button
            onClick={bookSeats}
            disabled={loading}
            className="mt-8 w-full rounded-full bg-black py-4 text-white transition hover:bg-stone-800 disabled:opacity-50"
          >
            {loading
              ? "Booking..."
              : "Book Now"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default SeatSelection;