"use client";

import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle2, Clock, XCircle, AlertCircle, Package, Briefcase, CalendarCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";

export default function NotificationsPage() {
    const { user } = useAuth();
    const { bookings, services, rentals } = useData();

    const isEmployee = user?.role === "employee";

    // Generate real notifications from bookings
    const userBookings = isEmployee
        ? bookings.filter(b => b.providerId === user?.id)
        : bookings.filter(b => b.customerId === user?.id);

    const providerServices = isEmployee ? services.filter(s => s.providerId === user?.id) : [];
    const providerRentals = isEmployee ? rentals.filter(r => r.providerId === user?.id) : [];

    type NotificationType = {
        id: string;
        title: string;
        desc: string;
        time: string;
        icon: React.ElementType;
        color: string;
        bg: string;
    };

    const notifications: NotificationType[] = [];

    // Booking-based notifications
    userBookings.forEach(booking => {
        if (booking.status === "Pending") {
            notifications.push({
                id: `pending-${booking.id}`,
                title: isEmployee ? "New Booking Request" : "Booking Submitted",
                desc: isEmployee
                    ? `${booking.customerName} requested ${booking.serviceTitle} on ${booking.date} at ${booking.time}`
                    : `Your booking for ${booking.serviceTitle} with ${booking.providerName} is pending confirmation`,
                time: booking.date || "Recently",
                icon: Clock,
                color: "text-amber-500",
                bg: "bg-amber-50",
            });
        } else if (booking.status === "Accepted") {
            notifications.push({
                id: `accepted-${booking.id}`,
                title: isEmployee ? "Booking Accepted" : "Booking Confirmed!",
                desc: isEmployee
                    ? `You accepted ${booking.customerName}'s request for ${booking.serviceTitle}`
                    : `${booking.providerName} confirmed your booking for ${booking.serviceTitle} on ${booking.date}`,
                time: booking.date || "Recently",
                icon: CheckCircle2,
                color: "text-blue-500",
                bg: "bg-blue-50",
            });
        } else if (booking.status === "Completed") {
            notifications.push({
                id: `completed-${booking.id}`,
                title: isEmployee ? "Job Completed" : "Service Completed",
                desc: isEmployee
                    ? `${booking.serviceTitle} for ${booking.customerName} completed. ₹${booking.amount || 0} earned`
                    : `Your ${booking.serviceTitle} service with ${booking.providerName} is completed`,
                time: booking.date || "Recently",
                icon: CalendarCheck,
                color: "text-emerald-500",
                bg: "bg-emerald-50",
            });
        } else if (booking.status === "Rejected") {
            notifications.push({
                id: `rejected-${booking.id}`,
                title: isEmployee ? "Booking Declined" : "Booking Declined",
                desc: isEmployee
                    ? `You declined ${booking.customerName}'s request for ${booking.serviceTitle}`
                    : `${booking.providerName} was unable to accept your ${booking.serviceTitle} booking`,
                time: booking.date || "Recently",
                icon: XCircle,
                color: "text-red-500",
                bg: "bg-red-50",
            });
        }
    });



    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Header */}
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
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Notifications</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {notifications.length} updates
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <Bell size={20} className="text-slate-300" />
                        {notifications.length > 0 && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center">
                                {notifications.length}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide pb-32">
                {notifications.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {notifications.map((note, idx) => {
                            const Icon = note.icon;
                            return (
                                <div
                                    key={note.id}
                                    className="group relative overflow-hidden rounded-2xl bg-white p-4 border border-slate-100 shadow-sm animate-slide-up"
                                    style={{ animationDelay: `${idx * 60}ms` }}
                                >
                                    <div className="flex gap-3">
                                        <div className={`h-11 w-11 shrink-0 rounded-xl ${note.bg} flex items-center justify-center ${note.color}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-black text-slate-900 truncate">{note.title}</p>
                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest shrink-0">{note.time}</p>
                                            </div>
                                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{note.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-6 text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">All caught up</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-lg flex items-center justify-center border border-slate-100 mb-6">
                            <Bell size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">No Notifications</h3>
                        <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[200px]">
                            {isEmployee
                                ? "You'll get alerts when customers book your services"
                                : "You'll see updates about your bookings here"
                            }
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
