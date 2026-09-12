
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  event_date: string;
  start_time: string;
  end_time: string;
  price: number;
}

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await api.get("/events");

      const found = res.data.events.find(
        (e: Event) => e.id === Number(id)
      );

      setEvent(found || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4EFE5] text-[#1A1714]">

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <p className="font-mono text-xs uppercase tracking-[4px] text-[#8C3030]">
              Loading event
            </p>

            <div className="mx-auto mt-5 h-px w-24 bg-[#1A1714]/30" />

          </div>

        </div>

      </main>
    );
  }

  /* ================= NOT FOUND ================= */

  if (!event) {
    return (
      <main className="min-h-screen bg-[#F4EFE5] px-8 text-[#1A1714]">

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <p className="font-mono text-xs uppercase tracking-[4px] text-[#8C3030]">
              Error 404
            </p>

            <h1 className="mt-4 font-serif text-5xl font-bold">
              Event Not Found.
            </h1>

            <button
              onClick={() => navigate("/")}
              className="mt-8 border border-[#1A1714] px-7 py-3 text-sm font-semibold uppercase tracking-[2px] transition hover:bg-[#1A1714] hover:text-[#F4EFE5]"
            >
              Back to Events
            </button>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4EFE5] text-[#1A1714]">

      {/* ================= TOP BAR ================= */}

      <div className="border-b border-[#1A1714]/20">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

          <button
            onClick={() => navigate(-1)}
            className="font-mono text-[11px] font-semibold uppercase tracking-[2px] text-[#5F5852] transition hover:text-[#8C3030]"
          >
            ← Back
          </button>

          <p className="font-mono text-[10px] uppercase tracking-[3px] text-[#7A7169]">
            Event Details
          </p>

          <span className="font-mono text-[10px] text-[#7A7169]">
            #{String(event.id).padStart(3, "0")}
          </span>

        </div>

      </div>


      {/* ================= MAIN ================= */}

      <section className="mx-auto max-w-7xl px-8 py-10 sm:py-14">

        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">


          {/* ================= IMAGE ================= */}

          <div className="relative">

            {/* Image frame */}

            <div className="border border-[#1A1714]/30 bg-[#E9E1D4] p-3">

              <div className="relative overflow-hidden">

                <img
                  src={`https://picsum.photos/700/900?random=${event.id}`}
                  alt={event.title}
                  className="h-[520px] w-full object-cover grayscale-[15%] sm:h-[620px]"
                />

                {/* subtle image overlay */}

                <div className="pointer-events-none absolute inset-0 bg-[#8C3030]/5" />

              </div>

            </div>


            {/* Photo caption */}

            <div className="mt-3 flex items-center justify-between px-1">

              <p className="font-mono text-[9px] uppercase tracking-[2px] text-[#7A7169]">
                EVENT / FRAME {String(event.id).padStart(3, "0")}
              </p>

              <p className="font-mono text-[9px] text-[#7A7169]">
                09 / 2026
              </p>

            </div>

          </div>


          {/* ================= EVENT INFO ================= */}

          <div className="lg:pt-4">

            {/* Venue */}

            <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8C3030]">
              {event.venue}
            </p>


            {/* Title */}

            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.95] tracking-[-2px] text-[#1A1714] sm:text-7xl">
              {event.title}
            </h1>


            {/* Description */}

            <p className="mt-8 max-w-2xl text-base leading-7 text-[#5F5852] sm:text-lg">
              {event.description}
            </p>


            {/* Divider */}

            <div className="my-9 border-t border-dashed border-[#1A1714]/30" />


            {/* ================= EVENT DETAILS ================= */}

            <div className="grid max-w-2xl grid-cols-1 gap-7 sm:grid-cols-2">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#7A7169]">
                  Date
                </p>

                <p className="mt-2 font-serif text-2xl font-bold text-[#1A1714]">
                  {new Date(event.event_date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>

              </div>


              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#7A7169]">
                  Time
                </p>

                <p className="mt-2 font-mono text-lg font-bold text-[#1A1714]">
                  {event.start_time} — {event.end_time}
                </p>

              </div>


              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#7A7169]">
                  Venue
                </p>

                <p className="mt-2 text-lg font-semibold text-[#1A1714]">
                  {event.venue}
                </p>

              </div>


              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#7A7169]">
                  Starting From
                </p>

                <p className="mt-1 font-mono text-3xl font-bold text-[#8C3030]">
                  ₹{Number(event.price).toFixed(2)}
                </p>

              </div>

            </div>


            {/* ================= BOOKING ================= */}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">

              <button
                onClick={() => navigate(`/seats/${event.id}`)}
                className="border border-[#1A1714] bg-[#1A1714] px-10 py-4 text-sm font-semibold uppercase tracking-[2px] text-[#F4EFE5] transition hover:bg-[#8C3030]"
              >
                Book Tickets →
              </button>

              <p className="font-mono text-[10px] uppercase tracking-[2px] text-[#7A7169]">
                Select your seats next
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FILM STRIP ================= */}

      <div className="flex h-10 items-center gap-6 overflow-hidden bg-[#211B18] px-5">

        {Array.from({ length: 22 }).map((_, index) => (
          <div
            key={index}
            className="flex shrink-0 items-center gap-2"
          >

            <span className="h-3 w-5 rounded-sm bg-[#F4EFE5]/80" />

            <span className="font-mono text-[8px] text-[#F4EFE5]/50">
              {String(index + 1).padStart(2, "0")}
            </span>

          </div>
        ))}

      </div>


      {/* ================= BOTTOM CTA ================= */}

      <section className="bg-[#8C3030] px-8 py-12 text-[#F4EFE5]">

        <div className="mx-auto max-w-7xl">

          <p className="text-[10px] font-semibold uppercase tracking-[4px] opacity-70">
            Your next memory
          </p>

          <div className="mt-2 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <h2 className="max-w-2xl font-serif text-4xl font-bold leading-none sm:text-5xl">
              SEE IT.
              <br />
              EXPERIENCE IT.
            </h2>

            <button
              onClick={() => navigate(`/seats/${event.id}`)}
              className="w-fit border border-[#F4EFE5]/60 px-7 py-3 text-xs font-semibold uppercase tracking-[2px] transition hover:bg-[#F4EFE5] hover:text-[#8C3030]"
            >
              Choose Seats
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}

export default EventDetails;
