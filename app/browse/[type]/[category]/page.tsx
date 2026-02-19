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
    Plus
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useData, type Service, type Product } from "@/lib/data-context";
import { BookingModal } from "@/components/booking/booking-modal";

export default function BrowsePage() {
    const params = useParams();
    const router = useRouter();
    const type = params?.type as string; // 'service' or 'product'
    const category = params?.category as string;

    const { services, products } = useData();
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [bookingOpen, setBookingOpen] = useState(false);

    // Determine title from category slug
    const title = category
        ? category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        : "Browse";

    const isService = type === "service";

    // Filter items based on category
    // Note: mock data categories are lowercase
    const items = isService
        ? services.filter(s => s.category.toLowerCase().includes(category.toLowerCase()) || category === "all")
        : products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()) || category === "all");

    const handleBook = (service: Service) => {
        setSelectedService(service);
        setBookingOpen(true);
    };

    const handleAddToCart = (name: string) => {
        toast.success(`${name} added to cart`, {
            description: "Continue shopping or proceed to checkout."
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-foreground">{title}</h1>
                        <p className="text-xs text-muted-foreground capitalize">{type} • {items.length} results</p>
                    </div>
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"
                    >
                        <Filter size={18} />
                    </button>
                </div>

                {/* Quick Filters (Horizontal Scroll) */}
                <div className="flex gap-2 overflow-x-auto px-4 py-3 pb-2 scrollbar-hide">
                    <button className="flex-shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm">
                        All
                    </button>
                    <button className="flex-shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground">
                        Top Rated
                    </button>
                    <button className="flex-shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground">
                        Price Low to High
                    </button>
                    <button className="flex-shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground">
                        Nearest
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    {items.map((item) => (
                        isService ? (
                            // SERVICE CARD
                            <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                                <div className="flex p-4 gap-4">
                                    {/* Image */}
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                                        <img
                                            src={(item as Service).image}
                                            alt={(item as Service).title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-1 right-1 rounded-full bg-blue-500 p-0.5 text-white">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-foreground line-clamp-1">{(item as Service).title}</h3>
                                                <div className="flex items-center gap-1 rounded-md bg-[#fefcbf] px-1.5 py-0.5 text-[10px] font-bold text-[#d69e2e]">
                                                    {(item as Service).rating} <Star size={8} fill="currentColor" />
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{(item as Service).providerName} • {(item as Service).reviews} reviews</p>

                                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {(item as Service).location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {(item as Service).availability}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Action */}
                                <div className="border-t border-border bg-secondary/30 px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-bold text-foreground">₹{(item as Service).price}</span>
                                        <span className="text-xs text-muted-foreground">/{(item as Service).priceUnit}</span>
                                    </div>
                                    <button
                                        onClick={() => handleBook(item as Service)}
                                        className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform active:scale-95 hover:bg-primary/90"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // PRODUCT CARD
                            <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                                <div className="absolute top-3 right-3 z-10">
                                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur text-gray-500 hover:text-red-500">
                                        <Heart size={16} />
                                    </button>
                                </div>

                                {/* Image */}
                                <div className="relative aspect-square w-full overflow-hidden bg-secondary/50">
                                    <img
                                        src={(item as Product).image}
                                        alt={(item as Product).name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {(item as Product).isBestSeller && (
                                        <div className="absolute left-3 top-3 rounded-lg bg-yellow-400 px-2 py-1 text-[10px] font-bold text-black shadow-sm">
                                            Best Seller
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-xs font-medium text-muted-foreground capitalize">{category.replace(/-/g, ' ')}</p>
                                        <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                                            <Star size={12} className="text-yellow-400" fill="currentColor" /> {(item as Product).rating}
                                        </div>
                                    </div>
                                    <h3 className="mb-1 text-base font-bold text-foreground line-clamp-1">{(item as Product).name}</h3>
                                    <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{(item as Product).description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-bold text-foreground">₹{(item as Product).price}</span>
                                            <span className="text-xs text-muted-foreground">/{(item as Product).priceUnit}</span>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart((item as Product).name)}
                                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95 hover:bg-primary/90"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}

                    {items.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <p>No items found in this category.</p>
                            <Link href="/" className="mt-4 text-primary hover:underline">Go back home</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
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
