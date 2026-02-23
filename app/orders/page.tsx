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
    AlertCircle,
    ShoppingBag,
    Briefcase
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";

export default function OrdersPage() {
    const { user } = useAuth();
    const { bookings, services } = useData();
    const [activeTab, setActiveTab] = useState<"services" | "rentals">("services");

    // Filter bookings for the logged-in customer
    const userBookings = bookings.filter(b => b.customerId === user?.id);
    const serviceBookings = userBookings.filter(b => b.type === "service");
    const rentalBookings = userBookings.filter(b => b.type === "rental");

    const orders = activeTab === "services" ? serviceBookings : rentalBookings;

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "delivered":
            case "accepted":
                return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50";
            case "pending":
            case "on the way":
                return "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50";
            case "cancelled":
            case "rejected":
                return "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50";
            default:
                return "bg-slate-50 text-slate-600 border-slate-100 shadow-slate-100/50";
        }
    };

    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Premium Header */}
            <div className="bg-white px-6 pt-10 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg active:scale-90 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Active Bookings</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Live Status</p>
                        </div>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <Briefcase size={22} />
                    </div>
                </div>

                {/* Tab Navigator */}
                <div className="flex mt-8 p-1 bg-slate-100/80 rounded-2xl border border-slate-100">
                    <button
                        onClick={() => setActiveTab("services")}
                        className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${activeTab === "services"
                            ? "bg-white text-slate-900 shadow-md scale-[1.02]"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        Services
                    </button>
                    <button
                        onClick={() => setActiveTab("rentals")}
                        className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${activeTab === "rentals"
                            ? "bg-white text-slate-900 shadow-md scale-[1.02]"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        Rentals
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide pb-32">
                <div className="flex flex-col gap-5">
                    {orders.map((order, idx) => (
                        <div
                            key={order.id}
                            className="group relative overflow-hidden rounded-[2rem] border border-white bg-white p-5 shadow-xl shadow-slate-200/50 animate-slide-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                                            {activeTab === "services" ? <Briefcase size={20} /> : <Package size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Order ID: {order.id.slice(-6)}</p>
                                            <p className="text-sm font-black text-slate-900">{order.serviceTitle}</p>
                                        </div>
                                    </div>
                                    <div className={`rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyles(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-1 px-1">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                            <Calendar size={12} className="text-slate-300" /> {order.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                            <Clock size={12} className="text-slate-300" /> {order.time}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Paid</p>
                                        <p className="text-lg font-black text-slate-900">₹{order.amount}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                    <button className="flex-1 py-3.5 rounded-[1.2rem] bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">
                                        Track Progress
                                    </button>
                                    <button className="h-12 w-12 flex items-center justify-center rounded-[1.2rem] border border-slate-100 text-slate-400 hover:bg-slate-50 active:scale-90 transition-all">
                                        <AlertCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {orders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 px-10 text-center animate-fade-in">
                            <div className="relative mb-6">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center border border-slate-50">
                                    <ShoppingBag size={40} className="text-slate-200" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center border-4 border-white">
                                    <Clock size={16} className="text-slate-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Empty Station</h3>
                            <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[200px]">
                                You haven't placed any {activeTab} bookings yet.
                            </p>
                            <Link
                                href="/"
                                className="mt-8 rounded-2xl bg-white border border-slate-900 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-sm active:scale-95 transition-all"
                            >
                                Start Browsing
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
