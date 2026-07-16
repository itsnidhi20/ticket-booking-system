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
  <main className="bg-[#F9F6F0] min-h-screen">

    <section className="max-w-7xl mx-auto px-8 pt-24">

      <p className="uppercase tracking-[6px] text-stone-500">
        LIVE EXPERIENCES
      </p>

      <h1 className="mt-5 text-[92px] leading-[0.9] font-bold text-[#1A1A1A]">
        BOOK
        <br />
        UNFORGETTABLE
        <br />
        MOMENTS.
      </h1>

      <p className="mt-8 max-w-xl text-lg text-stone-600">
        Discover concerts, comedy shows and premium live experiences.
      </p>

    </section>

    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="mb-12 flex items-center justify-between">

        <h2 className="text-5xl text-[#1A1A1A]">
          Trending Events
        </h2>

        <button className="rounded-full border border-black px-7 py-3 hover:bg-black hover:text-white transition">
          View All
        </button>

      </div>

      <div className="grid gap-12 md:grid-cols-2">

        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}

      </div>

    </section>

  </main>
);
}

export default Home;