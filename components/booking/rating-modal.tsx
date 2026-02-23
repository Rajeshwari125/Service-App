"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviews } from "@/lib/review-context";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import type { Booking } from "@/lib/data-context";

interface RatingModalProps {
    booking: Booking | null;
    open: boolean;
    onClose: () => void;
}

export function RatingModal({ booking, open, onClose }: RatingModalProps) {
    const { user } = useAuth();
    const { addReview } = useReviews();
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open || !booking) return null;

    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setLoading(true);
        await new Promise(r => setTimeout(r, 600));

        addReview({
            bookingId: booking.id,
            serviceId: booking.serviceId,
            customerId: user?.id || "",
            customerName: user?.name || "Customer",
            providerId: booking.providerId,
            rating,
            comment,
        });

        toast.success("Thank you for your review! ⭐");
        setRating(0);
        setComment("");
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal  */}
            <div className="relative z-10 w-full max-w-md bg-card rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-8 animate-slide-up shadow-2xl mx-4 mb-0 sm:mb-auto">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                >
                    <X size={18} />
                </button>

                {/* Drag Handle (mobile) */}
                <div className="flex justify-center mb-4 sm:hidden">
                    <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Star size={28} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-foreground tracking-tight">Rate Your Experience</h2>
                    <p className="text-sm text-muted-foreground mt-1">{booking.serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">{booking.providerName}</p>
                </div>

                {/* Star Rating */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                className="relative transition-all duration-200 active:scale-90"
                                style={{
                                    transform: (hoveredStar >= star || rating >= star) ? "scale(1.15)" : "scale(1)"
                                }}
                            >
                                <Star
                                    size={36}
                                    className={`transition-colors duration-200 ${(hoveredStar >= star || rating >= star)
                                            ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                                            : "text-muted-foreground/20"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    {(hoveredStar > 0 || rating > 0) && (
                        <span className="text-sm font-bold text-primary animate-fade-in">
                            {labels[hoveredStar || rating]}
                        </span>
                    )}
                </div>

                {/* Comment */}
                <Textarea
                    placeholder="Tell us more about your experience (optional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-6 min-h-[80px] rounded-xl resize-none bg-secondary/50 border-border/30 focus:border-primary/30"
                />

                {/* Submit */}
                <Button
                    onClick={handleSubmit}
                    disabled={loading || rating === 0}
                    className="w-full h-14 rounded-2xl text-lg font-black shadow-lg"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                            Submitting...
                        </div>
                    ) : (
                        `Submit Review${rating > 0 ? ` (${rating}★)` : ""}`
                    )}
                </Button>
            </div>
        </div>
    );
}
