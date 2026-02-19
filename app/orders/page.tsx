"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Package,
    Calendar,
    Clock,
    MapPin,
    MoreVertical,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";

export default function OrdersPage() {
    const { user } = useAuth();
    const { bookings, services, products } = useData();
    const [activeTab, setActiveTab] = useState<"services" | "products">("services");

    // Filter bookings for the logged-in customer
    const userBookings = bookings.filter(b => b.customerId === user?.id);
    const serviceBookings = userBookings.filter(b => b.type === "service");
    // Product bookings are still mock-supported or handled via DataContext if they exist
    const productBookings = userBookings.filter(b => b.type === "product");

    const orders = activeTab === "services" ? serviceBookings : productBookings;

    // Determine status color
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "delivered":
            case "accepted":
                return "bg-green-100 text-green-700";
            case "pending":
            case "on the way":
                return "bg-yellow-100 text-yellow-700";
            case "cancelled":
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Helper to get image for service/product
    const getImage = (order: any) => {
        if (order.type === "service") {
            const svc = services.find(s => s.id === order.serviceId);
            return svc?.image || "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=100&h=100&auto=format&fit=crop";
        }
        return "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=100&h=100&auto=format&fit=crop";
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
                        <h1 className="text-lg font-bold text-foreground">My Orders</h1>
                        <p className="text-xs text-muted-foreground">Track your bookings & orders</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 p-4 pb-0">
                    <button
                        onClick={() => setActiveTab("services")}
                        className={`flex items-center justify-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${activeTab === "services"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Calendar size={16} />
                        Services
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`flex items-center justify-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${activeTab === "products"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Package size={16} />
                        Products
                    </button>
                </div>
            </div>

            {/* Orders List */}
            <div className="flex flex-col gap-4 p-4">
                {orders.map((order) => (
                    <div key={order.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                        <div className="flex p-4 gap-4">
                            {/* Image */}
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                                <img
                                    src={getImage(order)}
                                    alt="Order item"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-xs font-mono text-muted-foreground">{order.id}</span>
                                    </div>

                                    <h3 className="mt-1 font-bold text-foreground">
                                        {activeTab === "services" ? order.providerName : (order as any).items?.[0] || "General Product"}
                                    </h3>
                                    {activeTab === "products" && (order as any).items && (order as any).items.length > 1 && (
                                        <p className="text-xs text-muted-foreground">+ {(order as any).items.length - 1} more items</p>
                                    )}
                                    {activeTab === "services" && (
                                        <p className="text-xs text-muted-foreground">{order.serviceTitle}</p>
                                    )}
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex flex-col text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} /> {order.date}
                                        </span>
                                    </div>
                                    <span className="font-bold text-foreground">₹{order.amount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-4 py-3">
                            <button className="text-xs font-semibold text-primary hover:underline">
                                View Details
                            </button>
                            {order.status === "Completed" || order.status === "Delivered" ? (
                                <button className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                                    <CheckCircle2 size={14} /> Rate
                                </button>
                            ) : (
                                <button className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700">
                                    <AlertCircle size={14} /> Help
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-20 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                            <Package size={40} className="text-muted-foreground/50" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-foreground">No orders yet</h3>
                        <p className="text-sm text-muted-foreground">Start booking services or shopping for products!</p>
                        <Link
                            href="/"
                            className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90"
                        >
                            Browse Categories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
