
import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";

interface Props {
  event: Event;
}

function EventCard({ event }: Props) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate("/event/" + event.id);
  };

  return (
    <div className="group cursor-pointer" onClick={handleViewDetails}>
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#d9d5ce]">
        <img
          src={"https://picsum.photos/500/625?random=" + event.id}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[3px] text-stone-500">
              {event.venue}
            </p>

            <h3 className="mt-1 text-2xl font-bold leading-tight text-[#1A1A1A]">
              {event.title}
            </h3>
          </div>

          <p className="shrink-0 text-lg font-semibold text-[#C36241]">
            ₹{event.price}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          className="mt-4 w-full rounded-full border border-[#1A1A1A] py-2.5 text-sm transition hover:bg-[#1A1A1A] hover:text-white"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default EventCard;

