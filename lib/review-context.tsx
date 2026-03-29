"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from "react";
import { useAuth } from "./auth-context";

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

    const { user } = useAuth();

    useEffect(() => {
        const stored = localStorage.getItem("servicehub_reviews");
        let initialReviews: Review[] = [];
        
        if (stored) {
            try {
                initialReviews = JSON.parse(stored);
            } catch (e) {
                initialReviews = [];
            }
        }

        if (initialReviews.length === 0 && user && (user.role === "employee" || user.role === "provider")) {
            // Seed demo reviews for the current provider
            initialReviews = [
                {
                    id: "rev-1",
                    bookingId: "book-1",
                    serviceId: "ser-1",
                    customerId: "cust-1",
                    customerName: "Anjali Sharma",
                    providerId: user.id,
                    rating: 5,
                    comment: "Excellent service! The cleaning was very thorough and professional.",
                    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                },
                {
                    id: "rev-2",
                    bookingId: "book-2",
                    serviceId: "ser-2",
                    customerId: "cust-2",
                    customerName: "Karthik Raja",
                    providerId: user.id,
                    rating: 4,
                    comment: "Very punctual and did a great job with the electrical wiring fix.",
                    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                },
                {
                    id: "rev-3",
                    bookingId: "book-3",
                    serviceId: "ser-1",
                    customerId: "cust-3",
                    customerName: "Meena Kumari",
                    providerId: user.id,
                    rating: 5,
                    comment: "Budget friendly and reliable. Highly recommended for home services.",
                    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
                }
            ];
        }
        
        setReviews(initialReviews);
        setIsLoaded(true);
    }, [user]);

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
