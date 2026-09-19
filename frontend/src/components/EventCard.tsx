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
    <div
      className="group cursor-pointer max-sm:mx-auto max-sm:w-[82%]"
      onClick={handleViewDetails}
    >
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#d9d5ce]">
        <img
          src={
            event.image_url ||
            `https://picsum.photos/500/625?random=${event.id}`
          }
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 max-sm:mt-3">
        <div className="flex items-start justify-between gap-4 max-sm:gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[3px] text-stone-500 max-sm:text-[8px] max-sm:tracking-[2px]">
              {event.venue}
            </p>

            <h3 className="mt-1 text-2xl font-bold leading-tight text-[#1A1A1A] max-sm:text-xl">
              {event.title}
            </h3>
          </div>

          <p className="shrink-0 text-lg font-semibold text-[#C36241] max-sm:text-base">
            ₹{event.price}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          className="mt-4 w-full rounded-full border border-[#1A1A1A] py-2.5 text-sm transition hover:bg-[#1A1A1A] hover:text-white max-sm:mt-3 max-sm:py-2 max-sm:text-xs"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default EventCard;