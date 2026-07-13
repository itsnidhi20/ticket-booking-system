import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";

interface Props {
  event: Event;
}

function EventCard({ event }: Props) {
  const navigate = useNavigate();

  return (
    <div className="group cursor-pointer">
      <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-[#d9d5ce]">
        <img
          src={`https://picsum.photos/600/800?random=${event.id}`}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-5 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[4px] text-stone-500">
            {event.venue}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-[#1A1A1A]">
            {event.title}
          </h3>
        </div>

        <p className="text-xl font-semibold text-[#C36241]">
          ₹{event.price}
        </p>
      </div>

      <button
        onClick={() => navigate(`/event/${event.id}`)}
        className="mt-6 w-full rounded-full border border-[#1A1A1A] py-3 hover:bg-[#1A1A1A] hover:text-white transition"
      >
        View Details
      </button>
    </div>
  );
}

export default EventCard;