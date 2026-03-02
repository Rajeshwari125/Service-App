"use client";

import { useData } from "@/lib/data-context";
import { Star, ArrowRight, Search } from "lucide-react";
import { useSearch } from "@/lib/search-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { staticServices } from "@/lib/static-services";
import { staticRentals } from "@/lib/static-rentals";

// Compact horizontal card
function HorizontalCard({ item, onClick }: { item: any; onClick: () => void }) {
    const isService = item.type === "service";
    return (
        <button
            onClick={onClick}
            className="group flex-shrink-0 w-56 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md active:scale-[0.98] transition-all text-left snap-start"
        >
            <div className="relative h-36 w-full overflow-hidden bg-muted">
                <img
                    src={item.image}
                    alt={item.title || item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-bold">{item.rating}</span>
                </div>
                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isService ? "bg-blue-500/80 text-white" : "bg-emerald-500/80 text-white"
                    }`}>
                    {isService ? "Service" : "Rental"}
                </div>
            </div>
            <div className="p-3 flex flex-col gap-1 flex-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider truncate">{item.providerName}</p>
                <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2">{item.title || item.name}</h3>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                    <div>
                        <span className="text-sm font-black text-foreground">₹{item.price}</span>
                        <span className="text-[9px] text-muted-foreground font-bold uppercase ml-1">/{item.priceUnit || item.durationUnit}</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isService ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                        }`}>
                        {isService ? "Book" : "Rent"}
                    </span>
                </div>
            </div>
        </button>
    );
}

export function FeaturedServices() {
    const { services, rentals } = useData();
    const { searchQuery } = useSearch();
    const router = useRouter();

    const allServices = services.length > 0 ? services : staticServices as any[];
    const allRentals = rentals.length > 0 ? rentals : staticRentals as any[];

    const serviceItems = allServices.map((s: any) => ({ ...s, title: s.title || s.name, type: "service" as const }));
    const rentalItems = allRentals.map((r: any) => ({ ...r, title: r.name || r.title, type: "rental" as const }));

    const filterItems = (items: any[]) => {
        if (!searchQuery) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(i =>
            (i.title || "").toLowerCase().includes(q) ||
            (i.providerName || "").toLowerCase().includes(q) ||
            (i.category || "").toLowerCase().includes(q)
        );
    };

    const displayServices = filterItems(serviceItems).slice(0, 15);
    const displayRentals = filterItems(rentalItems).slice(0, 15);

    const handleServiceClick = (item: any) => {
        const params = new URLSearchParams({
            name: item.title || item.name || "",
            price: String(item.price || 0),
            provider: item.providerName || "",
            category: item.category || "",
            type: "service",
            rating: String(item.rating || 4.5),
            image: item.image || "",
            id: item.id || "",
            providerId: item.providerId || "",
            priceUnit: item.priceUnit || "visit",
        });
        router.push(`/checkout?${params.toString()}`);
    };

    const handleRentalClick = (item: any) => {
        const params = new URLSearchParams({
            name: item.name || item.title || "",
            price: String(item.price || 0),
            provider: item.providerName || "",
            category: item.category || "",
            type: "rental",
            rating: String(item.rating || 4.5),
            image: item.image || "",
            id: item.id || "",
            providerId: item.providerId || "",
            priceUnit: item.durationUnit || item.priceUnit || "day",
        });
        router.push(`/checkout?${params.toString()}`);
    };

    if (searchQuery && displayServices.length === 0 && displayRentals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
                <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Search size={32} className="text-muted-foreground/30" />
                </div>
                <h3 className="text-base font-bold text-foreground tracking-tight">No Matches Found</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                    No results for &quot;{searchQuery}&quot;.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-0 py-2">
                {/* Section Header */}
                <div className="flex items-center justify-between px-4 pb-4">
                    <h2 className="text-lg font-black text-foreground tracking-tight leading-tight max-w-[70%]">
                        {searchQuery ? `Results for "${searchQuery}"` : "Most Recommended & Popular"}
                    </h2>
                    {!searchQuery && (
                        <Link href="/browse/service/all" className="text-xs font-bold text-primary flex items-center gap-1">
                            Explore All <ArrowRight size={14} />
                        </Link>
                    )}
                </div>

                {/* ── SERVICES ── */}
                {displayServices.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between px-4 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-1 rounded-full bg-blue-500" />
                                <span className="text-xs font-black text-foreground uppercase tracking-widest">Services</span>
                            </div>
                            <Link href="/browse/service/all" className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                                View All
                            </Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x">
                            {displayServices.map((item: any, index: number) => (
                                <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${index * 40}ms` }}>
                                    <HorizontalCard item={item} onClick={() => handleServiceClick(item)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── RENTALS ── */}
                {displayRentals.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between px-4 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-1 rounded-full bg-emerald-500" />
                                <span className="text-xs font-black text-foreground uppercase tracking-widest">Rentals</span>
                            </div>
                            <Link href="/browse/rental/all" className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                                View All
                            </Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x">
                            {displayRentals.map((item: any, index: number) => (
                                <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${index * 40}ms` }}>
                                    <HorizontalCard item={item} onClick={() => handleRentalClick(item)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </>
    );
}
