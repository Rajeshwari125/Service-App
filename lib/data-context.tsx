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
import { apiClient } from "./api-client";

export interface Service {
    id: string;
    providerId: string;
    providerName: string;
    title: string;
    category: string;
    price: number;
    priceUnit: string;
    description: string;
    location: string;
    image: string;
    rating: number;
    reviews: number;
    availability: string;
}

export interface Rental {
    id: string;
    providerId: string;
    providerName: string;
    name: string;
    description: string;
    price: number;
    priceUnit: string;
    category: string;
    rating: number;
    reviews: number;
    image: string;
    durationUnit: string;
    isAvailable: boolean;
}

export interface Booking {
    id: string;
    serviceId: string;
    serviceTitle: string;
    customerId: string;
    customerName: string;
    providerId: string;
    providerName: string;
    date: string;
    time: string;
    status: "Pending" | "Accepted" | "Completed" | "Rejected" | "Cancelled" | "Delivered" | "On the way";
    amount: number;
    type: "service" | "rental";
    items?: string[];
}

interface DataContextType {
    services: Service[];
    rentals: Rental[];
    bookings: Booking[];
    addService: (service: Omit<Service, "id" | "rating" | "reviews">) => Promise<void>;
    addRental: (rental: Omit<Rental, "id" | "rating" | "reviews">) => Promise<void>;
    addBooking: (booking: Omit<Booking, "id" | "status">) => Promise<void>;
    updateBookingStatus: (id: string, status: Booking["status"]) => Promise<void>;
    getProviderBookings: (providerId: string) => Booking[];
    getCustomerBookings: (customerId: string) => Booking[];
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const refreshData = useCallback(async () => {
        try {
            const fetchedServices = await apiClient.get("/api/services");

            // Map MongoDB services to local Service and Rental types
            // For now, service/rental distinction might be by a field
            const allItems = fetchedServices.map((s: any) => ({
                ...s,
                id: s._id,
                price: s.pricing.amount,
                priceUnit: s.pricing.unit,
                image: s.media?.[0] || "",
                reviews: s.reviewCount || 0,
                providerName: s.providerId?.name || "Unknown",
                providerId: s.providerId?._id || s.providerId
            }));

            setServices(allItems.filter((i: any) => i.type === 'service'));
            setRentals(allItems.filter((i: any) => i.type === 'rental'));

            if (user) {
                const fetchedBookings = await apiClient.get(`/api/bookings?userId=${user.id}&role=${user.role}`);
                const mappedBookings = fetchedBookings.map((b: any) => ({
                    ...b,
                    id: b._id,
                    serviceTitle: b.serviceId?.title || "Unknown Service",
                    customerName: b.customerId?.name || "Unknown Customer",
                    providerName: b.providerId?.name || "Unknown Provider",
                    date: new Date(b.bookingDate).toLocaleDateString(),
                    time: b.timeSlot || "",
                    amount: b.totalAmount,
                    status: b.status.charAt(0).toUpperCase() + b.status.slice(1) // Map to UI status
                }));

                setBookings(prev => {
                    // Keep temp bookings that are not yet in the fetched list
                    const tempBookings = prev.filter(b => b.id.startsWith('temp_'));
                    const filteredTemp = tempBookings.filter(tb =>
                        !mappedBookings.some((mb: any) => mb.serviceId === tb.serviceId && mb.date === tb.date && mb.time === tb.time)
                    );
                    return [...filteredTemp, ...mappedBookings];
                });
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }, [user]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const addService = useCallback(async (serviceData: Omit<Service, "id" | "rating" | "reviews">) => {
        try {
            await apiClient.post("/api/services", {
                ...serviceData,
                type: 'service',
                pricing: { amount: serviceData.price, unit: serviceData.priceUnit },
                media: [serviceData.image],
                providerId: serviceData.providerId
            });
            await refreshData();
        } catch (error) {
            console.error("Failed to add service:", error);
        }
    }, [refreshData]);

    const addRental = useCallback(async (rentalData: Omit<Rental, "id" | "rating" | "reviews">) => {
        try {
            await apiClient.post("/api/services", {
                ...rentalData,
                type: 'rental',
                pricing: { amount: rentalData.price, unit: rentalData.priceUnit },
                media: [rentalData.image],
                providerId: rentalData.providerId
            });
            await refreshData();
        } catch (error) {
            console.error("Failed to add rental:", error);
        }
    }, [refreshData]);

    const addBooking = useCallback(async (bookingData: Omit<Booking, "id" | "status">) => {
        const newBooking: Booking = {
            ...bookingData,
            id: `temp_${Date.now()}`,
            status: "Pending"
        };

        // Optimistic update
        setBookings(prev => [newBooking, ...prev]);

        try {
            await apiClient.post("/api/bookings", {
                ...bookingData,
                bookingDate: new Date(bookingData.date),
                timeSlot: bookingData.time,
                totalAmount: bookingData.amount,
                status: 'pending'
            });
            await refreshData();
        } catch (error) {
            console.error("Failed to add booking to backend, kept in local state:", error);
        }
    }, [refreshData]);

    const updateBookingStatus = useCallback(async (id: string, status: Booking["status"]) => {
        try {
            // Ideally we'd have a PATCH /api/bookings/:id
            // For now let's assume PATCH /api/bookings works with id in body
            await apiClient.patch("/api/bookings", { id, status: status.toLowerCase() });
            await refreshData();
        } catch (error) {
            console.error("Failed to update booking status:", error);
        }
    }, [refreshData]);

    const getProviderBookings = useCallback((providerId: string) => {
        return bookings.filter((b) => b.providerId === providerId);
    }, [bookings]);

    const getCustomerBookings = useCallback((customerId: string) => {
        return bookings.filter((b) => b.customerId === customerId);
    }, [bookings]);

    return (
        <DataContext.Provider
            value={{
                services,
                rentals,
                bookings,
                addService,
                addRental,
                addBooking,
                updateBookingStatus,
                getProviderBookings,
                getCustomerBookings,
                refreshData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used inside DataProvider");
    return ctx;
}
