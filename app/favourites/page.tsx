"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Sparkles, Navigation, Star, MapPin, Clock, Share2, Trash2 } from "lucide-react";
import { useFavorites } from "@/lib/favorites-context";
import { useData } from "@/lib/data-context";
import { staticServices } from "@/lib/static-services";
import { staticRentals } from "@/lib/static-rentals";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function FavouritesPage() {
    const { favorites, toggleFavorite } = useFavorites();
    const { services, rentals } = useData();
    const router = useRouter();

    // Merge API and static data
    const allServices = [...services, ...(staticServices as any[])];
    const allRentals = [...rentals, ...(staticRentals as any[])];

    // Find favorited items
    const favoritedItems = favorites.map(fav => {
        if (fav.type === "service") {
            const item = allServices.find(s => s.id === fav.id || (s as any)._id === fav.id);
            return item ? { ...item, itemType: "service" as const } : null;
        } else {
            const item = allRentals.find(r => r.id === fav.id || (r as any)._id === fav.id);
            return item ? { ...item, itemType: "rental" as const } : null;
        }
    }).filter(Boolean);

    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in">
            {/* Premium Header */}
            <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200 active:scale-90 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Shortlist</h1>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saved Collections</p>
                        </div>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <div className="relative">
                            <Heart size={22} className="fill-current" />
                            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center border-2 border-white">
                                {favoritedItems.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide pb-32">
                <div className="flex flex-col gap-6">
                    {favoritedItems.map((item: any, idx) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-white shadow-xl shadow-slate-200/50 animate-slide-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Card Media Section */}
                            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                                <img
                                    src={item.image}
                                    alt={item.name || item.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="backdrop-blur-md bg-black/30 border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
                                        {item.itemType === 'service' ? 'Verified Service' : 'Premium Asset'}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        toggleFavorite(item.id, item.itemType);
                                        toast.success("Removed from Shortlist");
                                    }}
                                    className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-2xl bg-white text-rose-500 shadow-lg active:scale-90 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Card Content Section */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.providerName}</p>
                                            <div className="h-1 w-1 rounded-full bg-slate-300" />
                                            <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase">
                                                <Star size={10} fill="currentColor" /> {item.rating}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{item.name || item.title}</h3>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-base font-black text-slate-900 leading-none">₹{item.price}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">Per {item.priceUnit || item.durationUnit || 'Slot'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams({
                                                name: item.name || item.title || "",
                                                price: String(item.price || 0),
                                                provider: item.providerName || "",
                                                category: item.category || "",
                                                type: item.itemType,
                                                rating: String(item.rating || 4.5),
                                                image: item.image || "",
                                                id: item.id || "",
                                                providerId: item.providerId || "",
                                                priceUnit: item.priceUnit || item.durationUnit || "visit",
                                            });
                                            router.push(`/checkout?${params.toString()}`);
                                        }}
                                        className="flex-1 py-3.5 rounded-[1.2rem] bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-950/20 active:scale-95 transition-all text-center"
                                    >
                                        {item.itemType === 'service' ? 'Book Now' : 'Rent Now'}
                                    </button>
                                    <button className="h-12 w-12 flex items-center justify-center rounded-[1.2rem] border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {favoritedItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 px-10 text-center animate-fade-in">
                            <div className="relative mb-10 group">
                                <div className="h-32 w-32 rounded-[3.5rem] bg-white shadow-2xl flex items-center justify-center border border-slate-50 transition-transform duration-500 group-hover:scale-110">
                                    <Heart size={56} className="text-rose-50" />
                                </div>
                                <div className="absolute -top-3 -right-3 h-14 w-14 rounded-[1.5rem] bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white border-4 border-white shadow-lg animate-bounce">
                                    <Sparkles size={20} />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Heart is Empty</h3>
                            <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[220px]">
                                Tap the heart icon on any service or rental to save it to your private collection.
                            </p>
                            <Link
                                href="/"
                                className="mt-10 group flex items-center gap-3 rounded-[2rem] bg-slate-900 px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-slate-950/20 active:scale-95 transition-all"
                            >
                                Find Something Local
                                <Navigation size={14} className="rotate-90 text-rose-400" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Tip Overlay */}
            <div className="sticky bottom-6 mx-6 p-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4 z-20">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                    <Sparkles size={18} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">Pro Tip: Saved items stay available for quick booking even during high demand.</p>
            </div>
        </div>
    );
}
