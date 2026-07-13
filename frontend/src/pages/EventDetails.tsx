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

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const res = await api.get("/events");

    const found = res.data.find(
      (e: Event) => e.id === Number(id)
    );

    setEvent(found);
  };

  if (!event) {
    return (
      <div className="p-20 text-center text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0]">

      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="grid md:grid-cols-2 gap-16">

          <img
            src={`https://picsum.photos/700/900?random=${event.id}`}
            className="rounded-3xl shadow-xl"
          />

          <div>

            <p className="uppercase tracking-[4px] text-stone-500">
              {event.venue}
            </p>

            <h1 className="text-6xl mt-4 font-bold">
              {event.title}
            </h1>

            <p className="mt-8 text-lg leading-8 text-stone-600">
              {event.description}
            </p>

            <div className="mt-10 space-y-4">

              <h2 className="text-2xl">
                📅 {new Date(event.event_date).toDateString()}
              </h2>

              <h2 className="text-2xl">
                🕒 {event.start_time} - {event.end_time}
              </h2>

              <h2 className="text-3xl font-bold text-[#C36241]">
                ₹{event.price}
              </h2>

            </div>

            <button
              onClick={() =>
                navigate(`/seats/${event.id}`)
              }
              className="mt-12 rounded-full bg-black text-white px-12 py-5 text-xl hover:bg-stone-800"
            >
              Book Tickets
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EventDetails;