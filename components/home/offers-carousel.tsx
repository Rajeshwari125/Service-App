"use client";

import { useState, useEffect, useCallback } from "react";

const offers = [
  {
    id: 1,
    title: "50% Off on First Service",
    subtitle: "New user exclusive deal",
    bg: "from-[#1a365d] to-[#2b6cb0]",
    badge: "NEW",
  },
  {
    id: 2,
    title: "Free Home Cleaning",
    subtitle: "On orders above 999",
    bg: "from-[#22543d] to-[#38a169]",
    badge: "HOT",
  },
  {
    id: 3,
    title: "Flat 30% Off Plumbing",
    subtitle: "This weekend only",
    bg: "from-[#744210] to-[#d69e2e]",
    badge: "DEAL",
  },
  {
    id: 4,
    title: "Refer & Earn 200",
    subtitle: "Share with friends & family",
    bg: "from-[#553c9a] to-[#805ad5]",
    badge: "EARN",
  },
  {
    id: 5,
    title: "20% Off Equipment Rent",
    subtitle: "Cameras, Tools & more",
    bg: "from-[#c05621] to-[#dd6b20]",
    badge: "RENTAL",
  },
];

export function OffersCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % offers.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <div className="px-4 py-2">
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`min-w-full bg-gradient-to-r ${offer.bg} p-6`}
            >
              <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                {offer.badge}
              </span>
              <h3 className="text-xl font-bold text-white">{offer.title}</h3>
              <p className="mt-1 text-sm text-white/80">{offer.subtitle}</p>
              <button
                type="button"
                className="mt-3 rounded-lg bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                Avail Now
              </button>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {offers.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              aria-label={`Go to offer ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
