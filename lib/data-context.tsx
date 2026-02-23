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
    name: string;
    description: string;
    price: number;
    priceUnit: string;
    category: string;
    rating: number;
    reviews: number;
    image: string;
    durationUnit: string; // e.g., "hour", "day", "week"
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
    addService: (service: Omit<Service, "id" | "rating" | "reviews">) => void;
    addRental: (rental: Omit<Rental, "id" | "rating" | "reviews">) => void;
    addBooking: (booking: Omit<Booking, "id" | "status">) => void;
    updateBookingStatus: (id: string, status: Booking["status"]) => void;
    getProviderBookings: (providerId: string) => Booking[];
    getCustomerBookings: (customerId: string) => Booking[];
}

const DataContext = createContext<DataContextType | null>(null);

// Initial Mock Data
const INITIAL_SERVICES: Service[] = [];
const INITIAL_RENTALS: Rental[] = [];

export function DataProvider({ children }: { children: ReactNode }) {
    const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
    const [rentals, setRentals] = useState<Rental[]>(INITIAL_RENTALS);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const storedServices = localStorage.getItem("servicehub_services");
        if (storedServices) setServices(JSON.parse(storedServices));

        const storedBookings = localStorage.getItem("servicehub_bookings");
        if (storedBookings) setBookings(JSON.parse(storedBookings));

        const storedRentals = localStorage.getItem("servicehub_rentals");
        if (storedRentals) setRentals(JSON.parse(storedRentals));

        setIsLoaded(true);
    }, []);

    // Save to LocalStorage on change (ONLY after initial load)
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("servicehub_services", JSON.stringify(services));
        }
    }, [services, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("servicehub_bookings", JSON.stringify(bookings));
        }
    }, [bookings, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("servicehub_rentals", JSON.stringify(rentals));
        }
    }, [rentals, isLoaded]);

    const addService = useCallback((serviceData: Omit<Service, "id" | "rating" | "reviews">) => {
        const newService: Service = {
            ...serviceData,
            id: `svc-${Date.now()}`,
            rating: 0,
            reviews: 0,
        };
        setServices((prev) => [...prev, newService]);
    }, []);

    const addRental = useCallback((rentalData: Omit<Rental, "id" | "rating" | "reviews">) => {
        const newRental: Rental = {
            ...rentalData,
            id: `rnt-${Date.now()}`,
            rating: 0,
            reviews: 0,
        };
        setRentals((prev) => [...prev, newRental]);
    }, []);

    const addBooking = useCallback((bookingData: Omit<Booking, "id" | "status">) => {
        const newBooking: Booking = {
            ...bookingData,
            id: `ord-${Date.now()}`,
            status: "Pending",
        };
        setBookings((prev) => [newBooking, ...prev]);
    }, []);

    const updateBookingStatus = useCallback((id: string, status: Booking["status"]) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status } : b))
        );
    }, []);

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
