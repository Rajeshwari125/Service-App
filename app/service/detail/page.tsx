"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Star,
    MapPin,
    Clock,
    Shield,
    User,
    Calendar,
    Heart,
    Share2,
    CheckCircle2,
    MessageCircle,
} from "lucide-react";
import { useData } from "@/lib/data-context";
import { useReviews } from "@/lib/review-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/booking-modal";
import { toast } from "sonner";

export default function ServiceDetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceId = searchParams.get("id");
    const { services } = useData();
    const { user } = useAuth();
    const { getServiceReviews, getAverageRating } = useReviews();
    const [liked, setLiked] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    const service = services.find(s => s.id === serviceId);
    const reviews = serviceId ? getServiceReviews(serviceId) : [];
    const avgRating = serviceId ? getAverageRating(serviceId) : 0;

    if (!service) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8">
                <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
                    <MapPin size={40} className="text-muted-foreground/30" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Service Not Found</h2>
                <p className="text-sm text-muted-foreground text-center">This service may have been removed or the link is invalid.</p>
                <Link href="/" className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                    Go Home
                </Link>
            </div>
        );
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: service.title,
                text: `Check out ${service.title} on ServiceHub!`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Hero Image */}
            <div className="relative h-72 w-full overflow-hidden bg-secondary">
                <img
                    src={service.image}
                    alt={service.title}
                    className={`h-full w-full object-cover transition-all duration-700 ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                    onLoad={() => setImgLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                {/* Top Actions */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
                    <button
                        onClick={() => router.back()}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleShare}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all active:scale-90"
                        >
                            <Share2 size={18} />
                        </button>
                        <button
                            onClick={() => { setLiked(!liked); toast(liked ? "Removed from favourites" : "Added to favourites ❤️"); }}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all active:scale-90"
                        >
                            <Heart size={18} className={liked ? "fill-red-500 text-red-500" : ""} />
                        </button>
                    </div>
                </div>

                {/* Bottom Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                        <span className="inline-block rounded-full bg-primary/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground mb-2">
                            {service.category}
                        </span>
                        <h1 className="text-2xl font-black text-white tracking-tight leading-tight">{service.title}</h1>
                    </div>
                    {avgRating > 0 && (
                        <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 shadow-lg">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-black text-slate-900">{avgRating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 -mt-4 rounded-t-[2rem] bg-background relative z-10 pb-28">
                <div className="px-5 pt-6 space-y-6">

                    {/* Price + Provider */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-primary">₹{service.price}</span>
                                <span className="text-sm text-muted-foreground font-bold">/{service.priceUnit}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                                <User size={14} className="text-primary" />
                            </div>
                            <span className="text-xs font-bold text-foreground">{service.providerName}</span>
                        </div>
                    </div>

                    {/* Info Pills */}
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                        <div className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-card border border-border px-4 py-3 shadow-sm">
                            <MapPin size={16} className="text-muted-foreground" />
                            <span className="text-xs font-bold">{service.location}</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-card border border-border px-4 py-3 shadow-sm">
                            <Clock size={16} className="text-muted-foreground" />
                            <span className="text-xs font-bold">{service.availability || "Available"}</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-card border border-border px-4 py-3 shadow-sm">
                            <Shield size={16} className="text-emerald-500" />
                            <span className="text-xs font-bold">Verified</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">About this Service</h2>
                        <p className="text-sm text-foreground leading-relaxed">
                            {service.description || "Professional service with guaranteed quality. Our experienced team ensures top-notch results with every visit. Fully insured and background-verified professionals."}
                        </p>
                    </div>

                    {/* What's Included */}
                    <div className="rounded-2xl bg-card border border-border p-4 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">What&apos;s Included</h3>
                        <div className="space-y-2.5">
                            {["Professional assessment & diagnosis", "Quality materials & equipment", "30-day service warranty", "Clean-up after completion"].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                Reviews ({reviews.length})
                            </h2>
                            {avgRating > 0 && (
                                <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    {avgRating.toFixed(1)} avg
                                </div>
                            )}
                        </div>

                        {reviews.length > 0 ? (
                            <div className="space-y-3">
                                {reviews.slice(0, 5).map(review => (
                                    <div key={review.id} className="rounded-2xl bg-card border border-border p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User size={14} className="text-primary" />
                                                </div>
                                                <span className="text-sm font-bold">{review.customerName}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
                                        )}
                                        <p className="text-[10px] text-muted-foreground/50 mt-2">
                                            {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-8 text-center">
                                <MessageCircle size={28} className="mx-auto text-muted-foreground/30 mb-2" />
                                <p className="text-sm text-muted-foreground font-medium">No reviews yet</p>
                                <p className="text-xs text-muted-foreground/50">Be the first to review this service</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Book Button */}
            {user?.role === "customer" && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border p-4 max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Starting at</p>
                            <p className="text-xl font-black text-primary">₹{service.price}<span className="text-xs font-bold text-muted-foreground">/{service.priceUnit}</span></p>
                        </div>
                        <Button
                            onClick={() => {
                                const params = new URLSearchParams({
                                    name: service.title || "",
                                    price: String(service.price || 0),
                                    provider: service.providerName || "",
                                    category: service.category || "",
                                    type: "service",
                                    rating: String(avgRating || 4.5),
                                    image: service.image || "",
                                    id: service.id || "",
                                    providerId: service.providerId || "",
                                    priceUnit: service.priceUnit || "visit",
                                });
                                router.push(`/checkout?${params.toString()}`);
                            }}
                            className="h-14 px-8 rounded-2xl text-base font-black shadow-lg shadow-primary/20"
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
