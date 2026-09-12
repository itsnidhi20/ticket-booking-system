
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Seat {
  id: number;
  seat_number: string;
  row_name: string;
  section: string;
  price: number;
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

      console.log("TOTAL:", res.data.seats.length);

      console.log(
        "SECTIONS:",
        res.data.seats.reduce((x: any, s: any) => {
          x[s.section] = (x[s.section] || 0) + 1;
          return x;
        }, {})
      );

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

      const res = await api.post(
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

      const {
        orderId,
        amount,
        currency,
        bookingIds,
        keyId,
      } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Ticket Booking System",
        description: "Event Ticket Booking",
        order_id: orderId,

        handler: async function (response: any) {
          try {
            const verifyRes = await api.post(
              "/payments/verify",
              {
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "token"
                  )}`,
                },
              }
            );

            console.log(
              "Payment verification:",
              verifyRes.data
            );

            alert(
              "Payment successful! Booking confirmed."
            );

            window.location.reload();
          } catch (error: any) {
            console.error(
              "Payment verification failed:",
              error
            );

            alert(
              error.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },

        prefill: {
          name: localStorage.getItem("name") || "",
          email: localStorage.getItem("email") || "",
        },

        theme: {
          color: "#8C3030",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Payment failed:",
            response.error
          );

          alert(
            "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();

      console.log("Booking IDs:", bookingIds);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Booking Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = selectedSeats.reduce(
    (total, seat) =>
      total + Number(seat.price),
    0
  );

  const groupedSeats = seats.reduce(
    (acc: any, seat) => {
      if (!acc[seat.section]) {
        acc[seat.section] = {};
      }

      if (!acc[seat.section][seat.row_name]) {
        acc[seat.section][seat.row_name] = [];
      }

      acc[seat.section][seat.row_name].push(
        seat
      );

      return acc;
    },
    {}
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4EFE5] text-[#1A1714]">

      {/* ================= HEADER ================= */}

      <section className="border-b border-[#1A1714]/20">

        <div className="mx-auto max-w-7xl px-8 pb-10 pt-10">

          <div className="flex items-end justify-between gap-6">

            <div>

              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[4px] text-[#8C3030]">
                Event #{eventId}
              </p>

              <h1 className="font-serif text-5xl font-bold leading-none tracking-[-2px] text-[#1A1714] sm:text-6xl">
                SELECT
                <br />
                YOUR SEATS.
              </h1>

            </div>

            <div className="hidden text-right sm:block">

              <p className="font-mono text-[9px] uppercase tracking-[3px] text-[#7A7169]">
                Admission
              </p>

              <p className="mt-1 font-serif text-3xl font-bold text-[#1A1714]">
                #{String(eventId).padStart(3, "0")}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= SEATING AREA ================= */}

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8">

        {/* STAGE */}

        <div className="mx-auto max-w-3xl">

          <div className="relative border border-[#1A1714]/40 bg-[#211B18] px-6 py-5 text-center">

            <p className="font-mono text-[11px] font-semibold tracking-[8px] text-[#F4EFE5]">
              STAGE
            </p>

            <div className="absolute bottom-0 left-1/2 h-1 w-32 -translate-x-1/2 bg-[#8C3030]" />

          </div>

          <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[3px] text-[#7A7169]">
            Front of venue
          </p>

        </div>


        {/* LEGEND */}

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-8 gap-y-4 border-y border-[#1A1714]/20 py-5">

          <div className="flex items-center gap-2">

            <span className="h-4 w-4 border border-[#1A1714]/50 bg-[#FFFDF8]" />

            <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-[#5F5852]">
              Available
            </span>

          </div>


          <div className="flex items-center gap-2">

            <span className="h-4 w-4 bg-[#8C3030]" />

            <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-[#5F5852]">
              Selected
            </span>

          </div>


          <div className="flex items-center gap-2">

            <span className="h-4 w-4 bg-[#211B18]" />

            <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-[#5F5852]">
              Booked
            </span>

          </div>

        </div>


        {/* ================= SECTIONS ================= */}

        <div className="mt-10 space-y-10">

          {Object.entries(groupedSeats).map(
            ([section, rows]: any) => (

              <div
                key={section}
                className="border border-[#1A1714]/25 bg-[#FFFDF8] p-6 sm:p-8"
              >

                {/* Section heading */}

                <div className="mb-8 flex items-center justify-between border-b border-dashed border-[#1A1714]/25 pb-5">

                  <h2 className="font-serif text-3xl font-bold text-[#1A1714]">
                    {section}
                  </h2>

                  <span className="font-mono text-[9px] uppercase tracking-[2px] text-[#8C3030]">
                    Seating
                  </span>

                </div>


                {/* Rows */}

                <div className="space-y-6">

                  {Object.entries(rows).map(
                    ([rowName, rowSeats]: any) => {

                      const firstHalf =
                        rowSeats.slice(
                          0,
                          Math.ceil(
                            rowSeats.length / 2
                          )
                        );

                      const secondHalf =
                        rowSeats.slice(
                          Math.ceil(
                            rowSeats.length / 2
                          )
                        );

                      return (
                        <div
                          key={rowName}
                          className="flex items-center justify-center gap-3 sm:gap-5"
                        >

                          {/* Row label */}

                          <div className="w-7 shrink-0 text-center font-mono text-xs font-bold text-[#8C3030]">
                            {rowName}
                          </div>


                          {/* Left seats */}

                          <div className="flex gap-2 sm:gap-3">

                            {firstHalf.map(
                              (seat: Seat) => {

                                const selected =
                                  selectedSeats.some(
                                    (s) =>
                                      s.id ===
                                      seat.id
                                  );

                                return (
                                  <button
                                    key={seat.id}
                                    disabled={
                                      seat.booked
                                    }
                                    onClick={() =>
                                      toggleSeat(
                                        seat
                                      )
                                    }
                                    title={`Seat ${seat.seat_number} — ₹${seat.price}`}
                                    className={`h-10 w-10 border text-[10px] font-mono font-bold transition-all sm:h-12 sm:w-12 sm:text-xs ${
                                      seat.booked
                                        ? "cursor-not-allowed border-[#211B18] bg-[#211B18] text-[#F4EFE5]"
                                        : selected
                                        ? "scale-110 border-[#8C3030] bg-[#8C3030] text-[#F4EFE5]"
                                        : "border-[#1A1714]/40 bg-[#FFFDF8] text-[#1A1714] hover:border-[#8C3030] hover:bg-[#E9E1D4]"
                                    }`}
                                  >
                                    {
                                      seat.seat_number
                                    }
                                  </button>
                                );
                              }
                            )}

                          </div>


                          {/* AISLE */}

                          <div className="mx-1 h-10 border-l border-dashed border-[#1A1714]/25 sm:mx-3 sm:h-12" />


                          {/* Right seats */}

                          <div className="flex gap-2 sm:gap-3">

                            {secondHalf.map(
                              (seat: Seat) => {

                                const selected =
                                  selectedSeats.some(
                                    (s) =>
                                      s.id ===
                                      seat.id
                                  );

                                return (
                                  <button
                                    key={seat.id}
                                    disabled={
                                      seat.booked
                                    }
                                    onClick={() =>
                                      toggleSeat(
                                        seat
                                      )
                                    }
                                    title={`Seat ${seat.seat_number} — ₹${seat.price}`}
                                    className={`h-10 w-10 border text-[10px] font-mono font-bold transition-all sm:h-12 sm:w-12 sm:text-xs ${
                                      seat.booked
                                        ? "cursor-not-allowed border-[#211B18] bg-[#211B18] text-[#F4EFE5]"
                                        : selected
                                        ? "scale-110 border-[#8C3030] bg-[#8C3030] text-[#F4EFE5]"
                                        : "border-[#1A1714]/40 bg-[#FFFDF8] text-[#1A1714] hover:border-[#8C3030] hover:bg-[#E9E1D4]"
                                    }`}
                                  >
                                    {
                                      seat.seat_number
                                    }
                                  </button>
                                );
                              }
                            )}

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

            )
          )}

        </div>


        {/* ================= SUMMARY ================= */}

        <div className="mt-12 border border-[#1A1714]/30 bg-[#FFFDF8] text-[#1A1714]">

          <div className="grid md:grid-cols-[1fr_auto]">

            {/* Selected seats */}

            <div className="p-7 sm:p-8">

              <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#8C3030]">
                Selected Seats
              </p>

              <h2 className="mt-3 min-h-[38px] font-mono text-lg font-bold text-[#1A1714] sm:text-xl">

                {selectedSeats.length === 0
                  ? "—"
                  : selectedSeats
                      .map(
                        (seat) =>
                          seat.seat_number
                      )
                      .join(", ")}

              </h2>

              <p className="mt-3 font-mono text-[9px] uppercase tracking-[2px] text-[#7A7169]">
                {selectedSeats.length}{" "}
                {selectedSeats.length === 1
                  ? "seat"
                  : "seats"}{" "}
                selected
              </p>

            </div>


            {/* Price */}

            <div className="border-t border-dashed border-[#1A1714]/25 bg-[#E9E1D4] p-7 md:border-l md:border-t-0 sm:p-8">

              <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#7A7169]">
                Total
              </p>

              <p className="mt-1 font-mono text-3xl font-bold text-[#8C3030]">
                ₹{totalPrice.toFixed(2)}
              </p>

            </div>

          </div>


          {/* BOOK BUTTON */}

          <div className="border-t border-[#1A1714]/20 p-6 sm:p-7">

            <button
              onClick={bookSeats}
              disabled={loading}
              className="w-full border border-[#1A1714] bg-[#1A1714] py-4 text-sm font-semibold uppercase tracking-[2px] text-[#F4EFE5] transition hover:bg-[#8C3030] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : "Continue to Payment →"}
            </button>

            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[2px] text-[#7A7169]">
              Seats are held temporarily during checkout
            </p>

          </div>

        </div>

      </section>


      {/* ================= FILM STRIP ================= */}

      <div className="flex h-10 items-center gap-6 overflow-hidden bg-[#211B18] px-5">

        {Array.from({ length: 24 }).map(
          (_, index) => (
            <div
              key={index}
              className="flex shrink-0 items-center gap-2"
            >

              <span className="h-3 w-5 rounded-sm bg-[#F4EFE5]/80" />

              <span className="font-mono text-[8px] text-[#F4EFE5]/50">
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

            </div>
          )
        )}

      </div>


      {/* ================= FOOTER ================= */}

      <section className="bg-[#8C3030] px-8 py-12 text-[#F4EFE5]">

        <div className="mx-auto max-w-7xl">

          <p className="text-[10px] font-semibold uppercase tracking-[4px] opacity-70">
            Final step
          </p>

          <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold leading-none sm:text-5xl">
            PICK YOUR
            <br />
            SPOT.
          </h2>

        </div>

      </section>

    </main>
  );
}

export default SeatSelection;
