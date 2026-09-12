import { useEffect, useState } from "react";
import api from "../services/api";
import type { Event } from "../types/Event";
import EventCard from "../components/EventCard";

function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data.events);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4EFE5] text-[#1A1714]">

      {/* ================= HERO ================= */}

      <section className="relative border-b border-[#1A1714]/25">

        <div className="mx-auto max-w-7xl px-8 pb-28 pt-24">

          {/* HERO CONTENT */}

          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

            {/* LEFT */}

            <div className="relative z-10">

              <p className="mb-6 text-xs font-semibold uppercase tracking-[5px] text-[#8C3030]">
                Events • Experiences • Tickets
              </p>

              <h1 className="max-w-4xl font-serif text-[50px] font-bold leading-[0.9] tracking-[-3px] sm:text-[68px] lg:text-[86px]">
                FIND
                <br />
                SOMETHING
                <br />
                <span className="text-[#8C3030]">
                  WORTH SEEING.
                </span>
              </h1>

              <p className="mt-8 max-w-lg text-lg leading-8 text-[#5F5852]">
                Discover concerts, comedy, movies and live experiences.
                Choose an event, pick your seat and make it yours.
              </p>

            </div>

            {/* RIGHT — POLAROID */}

            <div className="relative mx-auto w-full max-w-sm">

              {/* Behind paper */}

              <div className="absolute -left-5 -top-5 h-full w-full rotate-[-6deg] bg-[#D7CEC0]" />

              <div className="relative rotate-[3deg] bg-[#FFFDF8] p-4 pb-20 shadow-[0_18px_35px_rgba(26,23,20,0.18)]">

                <div className="aspect-[4/5] overflow-hidden bg-[#332C27]">

                  <img
                    src="https://picsum.photos/500/650?random=80"
                    alt="Live event"
                    className="h-full w-full object-cover grayscale-[15%] sepia-[12%]"
                  />

                </div>

                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">

                  <div>
                    <p className="font-serif text-2xl font-bold">
                      MOMENTS
                    </p>

                    <p className="text-[9px] uppercase tracking-[3px] text-stone-500">
                      Captured live
                    </p>
                  </div>

                  <span className="font-mono text-[9px] text-stone-400">
                    01 / 08
                  </span>

                </div>

              </div>

              {/* Small physical label */}

              <div className="absolute -bottom-7 -left-8 rotate-[-7deg] border border-[#1A1714]/50 bg-[#F4EFE5] px-4 py-2 font-mono text-[9px] uppercase tracking-[2px]">
                FRAME 001
              </div>

              {/* Date stamp */}

              <div className="absolute -right-5 -top-5 rotate-[5deg] bg-[#8C3030] px-3 py-2 font-mono text-[9px] uppercase tracking-[2px] text-[#F4EFE5]">
                09 / 2026
              </div>

            </div>

          </div>

        </div>


        {/* ================= FILM CROSSING HERO ================= */}

        <div className="pointer-events-none relative -mb-5 h-32 w-[115%] -translate-x-[7%] rotate-[2deg] sm:h-36">

          {/* Film body */}

          <div className="absolute inset-x-0 top-8 h-20 bg-[#211B18] shadow-[0_10px_25px_rgba(26,23,20,0.15)]">

            {/* Sprocket holes */}

            <div className="absolute left-0 right-0 top-2 flex justify-between gap-3 overflow-hidden px-3">

              {Array.from({ length: 34 }).map((_, index) => (
                <span
                  key={index}
                  className="h-4 w-7 shrink-0 rounded-[2px] bg-[#F4EFE5]/90"
                />
              ))}

            </div>

            {/* Frames */}

            <div className="absolute inset-x-0 bottom-2 top-8 flex gap-3 overflow-hidden px-3">

              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="relative h-full w-28 shrink-0 border border-[#F4EFE5]/35 bg-[#39312B]"
                >

                  <div className="absolute inset-2 border border-[#F4EFE5]/15" />

                  <span className="absolute bottom-1 left-2 font-mono text-[7px] text-[#F4EFE5]/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                </div>
              ))}

            </div>

            {/* Bottom sprocket holes */}

            <div className="absolute bottom-2 left-0 right-0 flex justify-between gap-3 overflow-hidden px-3">

              {Array.from({ length: 34 }).map((_, index) => (
                <span
                  key={index}
                  className="h-3 w-7 shrink-0 rounded-[2px] bg-[#F4EFE5]/90"
                />
              ))}

            </div>

          </div>

        </div>

      </section>


      {/* ================= EVENTS ================= */}

      <section className="px-8 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-12 flex flex-col gap-5 border-b-2 border-[#1A1714] pb-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[4px] text-[#8C3030]">
                Currently showing
              </p>

              <h2 className="mt-2 font-serif text-5xl font-bold tracking-[-1px] sm:text-6xl">
                WHAT'S ON
              </h2>

            </div>

            <p className="text-xs font-semibold uppercase tracking-[3px] text-stone-500">
              {events.length} Events
            </p>

          </div>


          {events.length === 0 ? (

            <div className="border border-[#1A1714]/30 bg-[#E9E1D4] px-8 py-20 text-center">

              <p className="font-serif text-3xl font-bold">
                Nothing showing yet.
              </p>

              <p className="mt-3 text-sm text-stone-500">
                Check back soon for upcoming events.
              </p>

            </div>

          ) : (

            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">

              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}

            </div>

          )}

        </div>

      </section>


      {/* ================= BOTTOM PRINT / POSTER ================= */}

      <section className="relative overflow-hidden border-t border-[#1A1714]/30 bg-[#8C3030] px-8 py-24 text-[#F4EFE5]">

        {/* Top perforation detail */}

        <div className="absolute left-0 right-0 top-0 flex justify-between overflow-hidden px-3">

          {Array.from({ length: 28 }).map((_, index) => (
            <span
              key={index}
              className="mt-2 h-3 w-5 shrink-0 rounded-sm bg-[#F4EFE5]/80"
            />
          ))}

        </div>


        <div className="mx-auto max-w-7xl pt-5">

          <p className="text-xs font-semibold uppercase tracking-[5px] opacity-70">
            Your next experience
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.9] sm:text-7xl">
            GO SEE
            <br />
            SOMETHING.
          </h2>

          <p className="mt-7 max-w-lg text-base leading-7 opacity-80">
            Browse the latest events, choose your seat and be there when
            it happens.
          </p>

        </div>

      </section>

    </main>
  );
}

export default Home;