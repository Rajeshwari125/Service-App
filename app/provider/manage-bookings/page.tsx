"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    Phone,
    Calendar,
    ChevronRight,
    Filter,
    User,
    DollarSign,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type StatusFilter = "all" | "Pending" | "Accepted" | "Completed" | "Rejected";

export default function ManageBookingsPage() {
    const { user } = useAuth();
    const { bookings, updateBookingStatus } = useData();
    const [filter, setFilter] = useState<StatusFilter>("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const providerBookings = bookings.filter(b => b.providerId === user?.id);
    const filteredBookings = filter === "all"
        ? providerBookings
        : providerBookings.filter(b => b.status === filter);

    const stats = {
        total: providerBookings.length,
        pending: providerBookings.filter(b => b.status === "Pending").length,
        accepted: providerBookings.filter(b => b.status === "Accepted").length,
        completed: providerBookings.filter(b => b.status === "Completed").length,
    };

    const handleAccept = (id: string) => {
        updateBookingStatus(id, "Accepted");
        toast.success("Booking accepted! ✅", {
            description: "The customer will be notified."
        });
    };

    const handleReject = (id: string) => {
        updateBookingStatus(id, "Rejected");
        toast.error("Booking rejected", {
            description: "The customer will be notified."
        });
    };

    const handleComplete = (id: string) => {
        updateBookingStatus(id, "Completed");
        toast.success("Job marked as completed! 🎉", {
            description: "Payment will be processed."
        });
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "Pending": return { color: "bg-amber-100 text-amber-700", icon: Clock, dot: "bg-amber-400" };
            case "Accepted": return { color: "bg-blue-100 text-blue-700", icon: CheckCircle, dot: "bg-blue-400" };
            case "Completed": return { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle, dot: "bg-emerald-400" };
            case "Rejected": return { color: "bg-red-100 text-red-700", icon: XCircle, dot: "bg-red-400" };
            default: return { color: "bg-gray-100 text-gray-700", icon: Clock, dot: "bg-gray-400" };
        }
    };

    const filters: StatusFilter[] = ["all", "Pending", "Accepted", "Completed", "Rejected"];

    return (
        <div className="flex min-h-screen flex-col bg-background pb-10">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-3 px-4 py-3">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-lg font-black">Manage Bookings</h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {providerBookings.length} total requests
                        </p>
                    </div>
                </div>
            </header>

            <main className="flex-1 space-y-5 p-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: "Total", value: stats.total, bg: "bg-primary/10 text-primary" },
                        { label: "Pending", value: stats.pending, bg: "bg-amber-100 text-amber-700" },
                        { label: "Active", value: stats.accepted, bg: "bg-blue-100 text-blue-700" },
                        { label: "Done", value: stats.completed, bg: "bg-emerald-100 text-emerald-700" },
                    ].map(stat => (
                        <div key={stat.label} className={`rounded-2xl p-3 text-center ${stat.bg}`}>
                            <p className="text-xl font-black">{stat.value}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filter Pills */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${filter === f
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                }`}
                        >
                            {f === "all" && <Filter size={12} />}
                            {f === "all" ? "All" : f}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-3">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking, i) => {
                            const config = getStatusConfig(booking.status);
                            const isExpanded = expandedId === booking.id;
                            const StatusIcon = config.icon;

                            return (
                                <div
                                    key={booking.id}
                                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all animate-slide-up hover:shadow-md"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    {/* Main Row */}
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                                        className="flex w-full items-center gap-3 p-4 text-left"
                                    >
                                        {/* Status Indicator */}
                                        <div className="relative">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${config.color}`}>
                                                <User size={20} />
                                            </div>
                                            <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${config.dot}`} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-foreground truncate">{booking.customerName}</h3>
                                                <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${config.color}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{booking.serviceTitle}</p>
                                            <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                                                <span className="flex items-center gap-1"><Calendar size={10} />{booking.date}</span>
                                                <span className="flex items-center gap-1"><Clock size={10} />{booking.time}</span>
                                            </div>
                                        </div>

                                        {/* Price + Arrow */}
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm font-black text-primary">₹{booking.amount}</span>
                                            <ChevronRight
                                                size={14}
                                                className={`text-muted-foreground/30 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                                            />
                                        </div>
                                    </button>

                                    {/* Expanded Actions */}
                                    {isExpanded && (
                                        <div className="animate-slide-up border-t border-border bg-secondary/20 p-4 space-y-3">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <DollarSign size={14} />
                                                <span>Booking ID: <code className="font-mono">{booking.id}</code></span>
                                            </div>

                                            {/* Action Buttons */}
                                            {booking.status === "Pending" && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleAccept(booking.id)}
                                                        className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20"
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" /> Accept
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleReject(booking.id)}
                                                        variant="outline"
                                                        className="flex-1 h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-bold"
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" /> Decline
                                                    </Button>
                                                </div>
                                            )}

                                            {booking.status === "Accepted" && (
                                                <Button
                                                    onClick={() => handleComplete(booking.id)}
                                                    className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20"
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Completed
                                                </Button>
                                            )}

                                            {(booking.status === "Completed" || booking.status === "Rejected") && (
                                                <div className={`rounded-xl p-3 text-center text-sm font-bold ${booking.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                                                    }`}>
                                                    {booking.status === "Completed"
                                                        ? "✅ This job has been completed successfully"
                                                        : "❌ This booking was declined"
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-4">
                                <Calendar size={40} className="text-muted-foreground/30" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No bookings found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {filter === "all"
                                    ? "Your booking requests will appear here"
                                    : `No ${filter.toLowerCase()} bookings at the moment`
                                }
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
