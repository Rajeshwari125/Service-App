"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Star,
    MapPin,
    Clock,
    Filter,
    Heart,
    Plus,
    Tag,
    Share2,
    Calendar,
    Navigation,
    Search,
    X
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useData, type Service, type Rental } from "@/lib/data-context";
import { BookingModal } from "@/components/booking/booking-modal";
import { useSearch } from "@/lib/search-context";
import { staticServices } from "@/lib/static-services";
import { staticRentals } from "@/lib/static-rentals";

export default function BrowsePage() {
    const params = useParams();
    const router = useRouter();
    const type = params?.type as string; // 'service' or 'rental'
    const categoryQuery = params?.category as string;

    const { services, rentals } = useData();
    const { searchQuery, setSearchQuery } = useSearch();
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(!!searchQuery);

    // Determine title from category slug
    const title = categoryQuery
        ? categoryQuery.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        : "Browse";

    const isService = type === "service";

    // Merge API data with static data (API data takes precedence, static fills gaps)
    const allServices = services.length > 0 ? services : (staticServices as any[]);
    const allRentals = rentals.length > 0 ? rentals : (staticRentals as any[]);

    // Filter items based on category
    const categoryItems = isService
        ? allServices.filter((s: any) => categoryQuery === "all" || s.category.toLowerCase().includes((categoryQuery || "").toLowerCase().replace(/-/g, " ")))
        : allRentals.filter((r: any) => categoryQuery === "all" || r.category.toLowerCase().includes((categoryQuery || "").toLowerCase().replace(/-/g, " ")));

    // further filter by search query
    const items = searchQuery
        ? categoryItems.filter((item: any) => {
            const name = item.name || item.title || "";
            const provider = item.providerName || "";
            const category = item.category || "";
            const searchLower = searchQuery.toLowerCase();
            return name.toLowerCase().includes(searchLower) ||
                provider.toLowerCase().includes(searchLower) ||
                category.toLowerCase().includes(searchLower);
        })
        : categoryItems;

    const handleBook = (service: Service) => {
        setSelectedService(service);
        setBookingOpen(true);
    };

    const handleRent = (rental: Rental) => {
        toast.success(`Booking process for ${(rental as any).name} initiated!`, {
            description: "Opening rental scheduler..."
        });
    };

    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Ultra Premium Header */}
            <div className="bg-white px-6 pt-10 pb-4 border-b border-slate-100 shadow-sm relative z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        {!isSearchVisible ? (
                            <>
                                <Link
                                    href="/"
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl active:scale-90 transition-all font-black"
                                >
                                    <ArrowLeft size={20} />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-black text-slate-900 tracking-tight">{title}</h1>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type} Collections • {items.length} Units</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 flex-1 bg-slate-50 rounded-2xl border border-slate-100 px-4 py-2 animate-in slide-in-from-right-4">
                                <Search size={16} className="text-slate-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder={`Search in ${title}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
                                />
                                <button
                                    onClick={() => {
                                        setIsSearchVisible(false);
                                        setSearchQuery("");
                                    }}
                                    className="text-slate-400"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        {!isSearchVisible && (
                            <button
                                onClick={() => setIsSearchVisible(true)}
                                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 border border-slate-100 shadow-sm active:scale-90 transition-all hover:text-slate-900"
                            >
                                <Search size={18} />
                            </button>
                        )}
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 shadow-sm active:scale-90 transition-all hover:text-slate-900"
                        >
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Horizontal Category Pill Scroll */}
                <div className="flex gap-3 overflow-x-auto py-6 scrollbar-hide">
                    <button className="flex-shrink-0 px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 active:scale-95 transition-all">
                        Discover All
                    </button>
                    <button className="flex-shrink-0 px-6 py-2.5 rounded-2xl bg-white border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 active:scale-95 transition-all">
                        Premium Tier
                    </button>
                    <button className="flex-shrink-0 px-6 py-2.5 rounded-2xl bg-white border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 active:scale-95 transition-all">
                        Best Value
                    </button>
                </div>
            </div>

            {/* List/Grid Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide pb-32">
                <div className="flex flex-col gap-6">
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-white shadow-xl shadow-slate-200/50 animate-slide-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Card Media Section */}
                            <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                                <img
                                    src={(item as any).image}
                                    alt={(item as any).name || (item as any).title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="backdrop-blur-md bg-black/30 border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
                                        {isService ? 'Verified Service' : 'Premium Asset'}
                                    </div>
                                    {(item as any).isBestSeller && (
                                        <div className="bg-amber-400 text-amber-950 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg">
                                            Top Rated
                                        </div>
                                    )}
                                </div>
                                <button className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-rose-500 hover:text-white transition-all">
                                    <Heart size={18} />
                                </button>
                            </div>

                            {/* Card Content Section */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{(item as any).providerName || title}</p>
                                            <div className="h-1 w-1 rounded-full bg-slate-300" />
                                            <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase">
                                                <Star size={10} fill="currentColor" /> {(item as any).rating}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{(item as any).name || (item as any).title}</h3>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-lg font-black text-slate-900 leading-none">₹{(item as any).price}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Per {(item as any).priceUnit || (item as any).durationUnit || 'Slot'}</p>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 mb-3">{(item as any).description}</p>
                                <div className="flex items-center gap-4 py-4 border-t border-slate-50 mb-4">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                        <MapPin size={12} className="text-slate-300" /> {(item as any).location || 'Madurai'}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                        <Clock size={12} className="text-slate-300" /> {(item as any).availability || 'Available Now'}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams({
                                                name: item.name || item.title || "",
                                                price: String(item.price || 0),
                                                provider: item.providerName || "",
                                                category: item.category || "",
                                                type: isService ? "service" : "rental",
                                                rating: String(item.rating || 4.5),
                                                image: item.image || "",
                                                id: item.id || "",
                                                providerId: item.providerId || "",
                                                priceUnit: item.priceUnit || item.durationUnit || "visit",
                                            });
                                            router.push(`/checkout?${params.toString()}`);
                                        }}
                                        className="flex-1 py-4 rounded-[1.5rem] bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-950/20 active:scale-95 transition-all"
                                    >
                                        {isService ? 'Book Now' : 'Rent Now'}
                                    </button>
                                    <button className="h-14 w-14 flex items-center justify-center rounded-[1.5rem] border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 px-10 text-center animate-fade-in bg-white rounded-[3rem] border border-slate-100">
                            <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6">
                                <Filter size={40} className="text-slate-100" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Zero Matches</h3>
                            <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[200px]">
                                We couldn't find any {type} listings in the {title} category right now.
                            </p>
                            <Link
                                href="/"
                                className="mt-10 flex items-center gap-3 rounded-[2rem] bg-slate-900 px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl active:scale-95 transition-all"
                            >
                                Reset Discovery
                                <Navigation size={14} className="rotate-90 text-primary" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal (For Services) */}
            <BookingModal
                service={selectedService}
                open={bookingOpen}
                onOpenChange={(open) => {
                    setBookingOpen(open);
                    if (!open) setTimeout(() => setSelectedService(null), 300);
                }}
            />
        </div>
    );
}
