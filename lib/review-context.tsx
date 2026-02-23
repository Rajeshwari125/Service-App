"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from "react";

export interface Review {
    id: string;
    bookingId: string;
    serviceId: string;
    customerId: string;
    customerName: string;
    providerId: string;
    rating: number; // 1-5
    comment: string;
    createdAt: string;
}

interface ReviewContextType {
    reviews: Review[];
    addReview: (review: Omit<Review, "id" | "createdAt">) => void;
    getServiceReviews: (serviceId: string) => Review[];
    getProviderReviews: (providerId: string) => Review[];
    getAverageRating: (serviceId: string) => number;
    hasReviewed: (bookingId: string) => boolean;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

export function ReviewProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("servicehub_reviews");
        if (stored) setReviews(JSON.parse(stored));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("servicehub_reviews", JSON.stringify(reviews));
        }
    }, [reviews, isLoaded]);

    const addReview = useCallback((reviewData: Omit<Review, "id" | "createdAt">) => {
        const newReview: Review = {
            ...reviewData,
            id: `rev-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setReviews((prev) => [newReview, ...prev]);
    }, []);

    const getServiceReviews = useCallback((serviceId: string) => {
        return reviews.filter((r) => r.serviceId === serviceId);
    }, [reviews]);

    const getProviderReviews = useCallback((providerId: string) => {
        return reviews.filter((r) => r.providerId === providerId);
    }, [reviews]);

    const getAverageRating = useCallback((serviceId: string) => {
        const serviceReviews = reviews.filter((r) => r.serviceId === serviceId);
        if (serviceReviews.length === 0) return 0;
        return serviceReviews.reduce((acc, r) => acc + r.rating, 0) / serviceReviews.length;
    }, [reviews]);

    const hasReviewed = useCallback((bookingId: string) => {
        return reviews.some((r) => r.bookingId === bookingId);
    }, [reviews]);

    return (
        <ReviewContext.Provider
            value={{
                reviews,
                addReview,
                getServiceReviews,
                getProviderReviews,
                getAverageRating,
                hasReviewed,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
}

export function useReviews() {
    const ctx = useContext(ReviewContext);
    if (!ctx) throw new Error("useReviews must be used inside ReviewProvider");
    return ctx;
}
