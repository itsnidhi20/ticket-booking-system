

import { useEffect, useState } from "react";
import api from "../services/api";

interface Booking {
  id: number;
  title: string;
  seat_number: string;
  total_amount: number;
  booking_time: string;
  status: string;
  payment_id: string | null;
  expires_at: string | null;
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

  const downloadTicket = async (id: number) => {
    try {
      const res = await api.get(`/tickets/${id}/download`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
      <main className="min-h-screen bg-[#F4EFE5]">
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-mono text-sm uppercase tracking-[4px] text-[#8C3030]">
            Loading your tickets...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4EFE5] text-[#1A1714]">

      {/* ================= HEADER ================= */}

      <section className="border-b border-[#1A1714]/25">

        <div className="mx-auto max-w-7xl px-8 pb-10 pt-10">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[5px] text-[#8C3030]">
                Your collection
              </p>

              <h1 className="font-serif text-[48px] font-bold leading-[0.9] tracking-[-2px] text-[#1A1714] sm:text-[64px]">
                MY
                <br />
                BOOKINGS.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-[#5F5852]">
                Every event you've booked, kept in one place.
              </p>

            </div>

            <div className="flex items-center gap-3 pb-1">

              <span className="font-mono text-xs uppercase tracking-[3px] text-[#5F5852]">
                Tickets
              </span>

              <span className="font-serif text-4xl font-bold text-[#1A1714]">
                {bookings.length}
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ================= BOOKINGS ================= */}

      <section className="px-8 py-14">

        <div className="mx-auto max-w-6xl">

          {bookings.length === 0 ? (

            <div className="relative border border-[#1A1714]/30 bg-[#E9E1D4] px-8 py-20 text-center text-[#1A1714]">

              <div className="absolute left-0 right-0 top-0 flex justify-between overflow-hidden px-3">

                {Array.from({ length: 28 }).map((_, index) => (
                  <span
                    key={index}
                    className="mt-2 h-3 w-5 shrink-0 rounded-sm bg-[#F4EFE5]"
                  />
                ))}

              </div>

              <p className="font-mono text-xs uppercase tracking-[4px] text-[#8C3030]">
                Nothing collected yet
              </p>

              <h2 className="mt-5 font-serif text-4xl font-bold text-[#1A1714]">
                No bookings yet.
              </h2>

              <p className="mx-auto mt-4 max-w-md text-base leading-6 text-[#5F5852]">
                Book an event and your ticket will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-8">

              {bookings.map((booking, index) => (

                <article
                  key={booking.id}
                  className="overflow-hidden border border-[#1A1714]/30 bg-[#FFFDF8] text-[#1A1714] shadow-[0_8px_25px_rgba(26,23,20,0.08)]"
                >

                  {/* ================= MAIN TICKET ================= */}

                  <div className="flex flex-col lg:flex-row">

                    <div className="relative flex-1 bg-[#FFFDF8] p-8 text-[#1A1714] sm:p-9">

                      {/* Ticket number */}

                      <div className="absolute right-8 top-8 font-mono text-[10px] tracking-[2px] text-[#8A8179]">
                        #{String(index + 1).padStart(2, "0")}
                      </div>


                      {/* Label */}

                      <p className="pr-16 text-[11px] font-semibold uppercase tracking-[4px] text-[#8C3030]">
                        Event Ticket
                      </p>


                      {/* TITLE */}

                      <h2 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight tracking-[-1px] text-[#1A1714] sm:text-5xl">
                        {booking.title}
                      </h2>


                      {/* DETAILS */}

                      <div className="mt-9 grid grid-cols-2 gap-x-10 gap-y-7 sm:grid-cols-3">

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#7A7169]">
                            Seat
                          </p>

                          <p className="mt-1 font-mono text-xl font-bold text-[#1A1714]">
                            {booking.seat_number}
                          </p>
                        </div>


                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#7A7169]">
                            Amount
                          </p>

                          <p className="mt-1 font-mono text-xl font-bold text-[#1A1714]">
                            ₹{Number(booking.total_amount).toFixed(2)}
                          </p>
                        </div>


                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#7A7169]">
                            Booking
                          </p>

                          <p className="mt-1 text-base font-medium text-[#1A1714]">
                            {new Date(
                              booking.booking_time
                            ).toLocaleDateString()}
                          </p>
                        </div>

                      </div>


                      {/* DIVIDER */}

                      <div className="my-8 border-t border-dashed border-[#1A1714]/25" />


                      {/* STATUS */}

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

                        <span
                          className={`text-[11px] font-bold uppercase tracking-[2px] ${
                            booking.status === "PAID"
                              ? "text-[#4E6B43]"
                              : "text-[#A06A28]"
                          }`}
                        >
                          ● {booking.status}
                        </span>

                        <span className="text-[11px] uppercase tracking-[2px] text-[#6F6760]">
                          Booking #{booking.id}
                        </span>

                      </div>

                    </div>


                    {/* ================= STUB ================= */}

                    <div className="relative flex w-full flex-col justify-between border-t border-dashed border-[#1A1714]/25 bg-[#E9E1D4] p-8 text-[#1A1714] lg:w-64 lg:border-l lg:border-t-0">

                      {/* Perforations */}

                      <div className="absolute -left-2.5 top-0 hidden h-full flex-col justify-between lg:flex">

                        {Array.from({ length: 8 }).map((_, i) => (
                          <span
                            key={i}
                            className="h-5 w-5 rounded-full bg-[#F4EFE5]"
                          />
                        ))}

                      </div>


                      <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#6F6760]">
                          Admission
                        </p>

                        <p className="mt-2 font-serif text-4xl font-bold text-[#1A1714]">
                          #{booking.id}
                        </p>

                      </div>


                      {/* BUTTONS */}

                      <div className="mt-10 flex flex-col gap-3">

                        {booking.status === "PAID" && (
                          <button
                            onClick={() =>
                              downloadTicket(booking.id)
                            }
                            className="border border-[#1A1714] bg-[#1A1714] px-5 py-3.5 text-sm font-semibold uppercase tracking-[1.5px] text-[#F4EFE5] transition hover:bg-[#8C3030]"
                          >
                            Download Ticket
                          </button>
                        )}

                        <button
                          onClick={() =>
                            cancelBooking(booking.id)
                          }
                          className="border border-[#1A1714]/40 bg-transparent px-5 py-3.5 text-sm font-semibold uppercase tracking-[1.5px] text-[#1A1714] transition hover:border-[#8C3030] hover:text-[#8C3030]"
                        >
                          Cancel Booking
                        </button>

                      </div>

                    </div>

                  </div>


                  {/* ================= FILM STRIP ================= */}

                  <div className="flex h-9 items-center gap-5 overflow-hidden bg-[#211B18] px-5">

                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex shrink-0 items-center gap-2"
                      >

                        <span className="h-3 w-5 rounded-sm bg-[#F4EFE5]/80" />

                        <span className="font-mono text-[8px] text-[#F4EFE5]/50">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                      </div>
                    ))}

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      {bookings.length > 0 && (
        <section className="border-t border-[#1A1714]/25 bg-[#8C3030] px-8 py-14 text-[#F4EFE5]">

          <div className="mx-auto max-w-7xl">

            <p className="text-xs font-semibold uppercase tracking-[4px] opacity-70">
              Keep the ticket
            </p>

            <h2 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-none sm:text-6xl">
              SOME MOMENTS
              <br />
              ARE WORTH KEEPING.
            </h2>

          </div>

        </section>
      )}

    </main>
  );
}

export default Bookings;