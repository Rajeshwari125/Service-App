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

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    priceUnit: string;
    category: string;
    rating: number;
    reviews: number;
    image: string;
    deliveryTime: string;
    isBestSeller: boolean;
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
    type: "service" | "product"; // Simplify to include product orders
    items?: string[]; // For products
}

interface DataContextType {
    services: Service[];
    products: Product[];
    bookings: Booking[];
    addService: (service: Omit<Service, "id" | "rating" | "reviews">) => void;
    addBooking: (booking: Omit<Booking, "id" | "status">) => void;
    updateBookingStatus: (id: string, status: Booking["status"]) => void;
    getProviderBookings: (providerId: string) => Booking[];
    getCustomerBookings: (customerId: string) => Booking[];
}

const DataContext = createContext<DataContextType | null>(null);

// Initial Mock Data
const INITIAL_SERVICES: Service[] = [
    {
        id: "svc-1",
        providerId: "emp-1001",
        providerName: "Rahul Sharma",
        title: "Expert Plumbing Service",
        category: "plumbing",
        price: 499,
        priceUnit: "visit",
        description: "Fixing leaks, installing taps, and general plumbing repairs.",
        location: "Sector 15, Noida",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=400&h=300&auto=format&fit=crop",
        rating: 4.8,
        reviews: 124,
        availability: "Available Today",
    },
    {
        id: "svc-2",
        providerId: "emp-1002",
        providerName: "A2Z Home Services",
        title: "Full Home Electrician",
        category: "electrician",
        price: 350,
        priceUnit: "hour",
        description: "Wiring, switch installation, and electrical fault repair.",
        location: "MG Road, Pune",
        image: "https://images.unsplash.com/photo-1581578731117-104f2a417954?q=80&w=400&h=300&auto=format&fit=crop",
        rating: 4.5,
        reviews: 89,
        availability: "Next Slot: 2 PM",
    },
    {
        id: "svc-3",
        providerId: "emp-1003",
        providerName: "CleanPro Services",
        title: "Deep Home Cleaning",
        category: "cleaning",
        price: 1500,
        priceUnit: "unit",
        description: "Complete deep cleaning of your home including kitchen and bathrooms.",
        location: "Indiranagar, Bangalore",
        image: "https://images.unsplash.com/photo-1581578731117-104f2a417954?q=80&w=400&h=300&auto=format&fit=crop", // Placeholder
        rating: 4.9,
        reviews: 210,
        availability: "Tomorrow",
    }
];

const INITIAL_PRODUCTS: Product[] = [
    {
        id: "pr-1",
        name: "Organic Fresh Tomatoes",
        description: "Farm fresh, pesticide free tomatoes",
        price: 45,
        priceUnit: "kg",
        category: "vegetables",
        rating: 4.7,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&h=200&auto=format&fit=crop",
        deliveryTime: "30 mins",
        isBestSeller: true
    },
    {
        id: "pr-2",
        name: "Fresh Spinach (Palak)",
        description: "Cleaned and packed fresh spinach",
        price: 30,
        priceUnit: "bundle",
        category: "vegetables",
        rating: 4.5,
        reviews: 32,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=200&h=200&auto=format&fit=crop",
        deliveryTime: "45 mins",
        isBestSeller: false
    },
];

export function DataProvider({ children }: { children: ReactNode }) {
    const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [bookings, setBookings] = useState<Booking[]>([]);

    // Load from LocalStorage on mount
    useEffect(() => {
        const storedServices = localStorage.getItem("services");
        if (storedServices) setServices(JSON.parse(storedServices));

        const storedBookings = localStorage.getItem("bookings");
        if (storedBookings) setBookings(JSON.parse(storedBookings));
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem("services", JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        localStorage.setItem("bookings", JSON.stringify(bookings));
    }, [bookings]);

    const addService = useCallback((serviceData: Omit<Service, "id" | "rating" | "reviews">) => {
        const newService: Service = {
            ...serviceData,
            id: `svc-${Date.now()}`,
            rating: 0,
            reviews: 0,
        };
        setServices((prev) => [...prev, newService]);
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
                products,
                bookings,
                addService,
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
