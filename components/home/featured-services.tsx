"use client";

import { useState } from "react";
import { useData, type Service, type Rental } from "@/lib/data-context";
import { Star, MapPin, ArrowRight, Tag, Search } from "lucide-react";
import { BookingModal } from "@/components/booking/booking-modal";
import { RentalBookingModal } from "@/components/booking/rental-booking-modal";
import { useSearch } from "@/lib/search-context";

export function FeaturedServices() {
    const { services, rentals } = useData();
    const { searchQuery } = useSearch();
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [rentalModalOpen, setRentalModalOpen] = useState(false);

    const hasData = services.length > 0 || rentals.length > 0;

    const serviceItems = services.map(s => ({ ...s, title: s.title, type: 'service' as const }));
    const rentalItems = rentals.map(r => ({ ...r, title: r.name, type: 'rental' as const }));

    let allItems = [...serviceItems, ...rentalItems];

    if (searchQuery) {
        allItems = allItems.filter(item => {
            const searchLower = searchQuery.toLowerCase();
            return (item.title || "").toLowerCase().includes(searchLower) ||
                (item.providerName || "").toLowerCase().includes(searchLower) ||
                (item.category || "").toLowerCase().includes(searchLower);
        });
    }

    const displayItems = allItems.slice(0, 8);

    const handleCardClick = (item: any) => {
        if (item.type === 'service') {
            const svc = services.find(s => s.id === item.id);
            if (svc) {
                setSelectedService(svc);
                setServiceModalOpen(true);
            }
        } else {
            const rental = rentals.find(r => r.id === item.id);
            if (rental) {
                setSelectedRental(rental);
                setRentalModalOpen(true);
            }
        }
    };

    if (displayItems.length === 0) {
        if (searchQuery) {
            return (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
                    <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                        <Search size={32} className="text-muted-foreground/30" />
                    </div>
                    <h3 className="text-base font-bold text-foreground tracking-tight">No Matches Found</h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                        We couldn't find any services or tools matching &quot;{searchQuery}&quot;.
                    </p>
                </div>
            );
        }
        return null;
    }

    return (
        <>
            <div className="flex flex-col gap-4 px-4 py-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-foreground tracking-tight">
                        {searchQuery ? `Results for "${searchQuery}"` : "Featured Spotlight"}
                    </h2>
                    {!searchQuery && (
                        <button className="text-xs font-bold text-primary flex items-center gap-1">
                            Explore All <ArrowRight size={14} />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {displayItems.map((item: any, index) => (
                        <button
                            key={item.id}
                            onClick={() => handleCardClick(item)}
                            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-md active:scale-[0.98] animate-slide-up text-left"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Image Section */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Type Badge */}
                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border ${item.type === 'service'
                                    ? 'bg-blue-500/80 text-white border-blue-400/30'
                                    : 'bg-emerald-500/80 text-white border-emerald-400/30'
                                    }`}>
                                    {item.type}
                                </div>

                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-[10px] font-bold">{item.rating}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <p className="text-white text-xs font-medium opacity-90">{item.providerName || "Verified Provider"}</p>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-foreground leading-tight">{item.title}</h3>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-primary">₹{item.price}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                            Per {item.priceUnit || item.durationUnit}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
                                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                        <MapPin size={12} />
                                        {item.location || "Nearby"}
                                    </div>
                                    <div className={`flex items-center gap-1 text-[11px] font-bold ml-auto ${item.type === 'service' ? 'text-blue-600' : 'text-emerald-600'
                                        }`}>
                                        <Tag size={12} />
                                        {item.type === 'service' ? 'Book Slot' : 'Rent Now'}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Booking Modals */}
            <BookingModal
                service={selectedService}
                open={serviceModalOpen}
                onOpenChange={setServiceModalOpen}
            />
            <RentalBookingModal
                rental={selectedRental}
                open={rentalModalOpen}
                onOpenChange={setRentalModalOpen}
            />
        </>
    );
}
