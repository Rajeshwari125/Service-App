"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, History, Clock, CheckCircle2, XCircle, Calendar, IndianRupee, Filter, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";

type HistoryFilter = "all" | "Completed" | "Rejected";

export default function HistoryPage() {
    const { user } = useAuth();
    const { bookings } = useData();
    const [filter, setFilter] = useState<HistoryFilter>("all");

    const isEmployee = user?.role === "employee";

    // Get past bookings (completed or rejected)
    const userBookings = isEmployee
        ? bookings.filter(b => b.providerId === user?.id)
        : bookings.filter(b => b.customerId === user?.id);

    const historyBookings = userBookings.filter(
        b => b.status === "Completed" || b.status === "Rejected"
    );

    const filteredBookings = filter === "all"
        ? historyBookings
        : historyBookings.filter(b => b.status === filter);

    const completedCount = historyBookings.filter(b => b.status === "Completed").length;
    const rejectedCount = historyBookings.filter(b => b.status === "Rejected").length;
    const totalEarnings = historyBookings
        .filter(b => b.status === "Completed")
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    const filters: HistoryFilter[] = ["all", "Completed", "Rejected"];

    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg active:scale-90 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Booking History</h1>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {historyBookings.length} past {isEmployee ? "jobs" : "bookings"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide pb-32">
                <div className="flex flex-col gap-5">

                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-2 animate-slide-up">
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                            </div>
                            <p className="text-lg font-black text-slate-900">{completedCount}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Completed</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center mx-auto mb-2">
                                <XCircle size={14} className="text-red-500" />
                            </div>
                            <p className="text-lg font-black text-slate-900">{rejectedCount}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Declined</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-2">
                                <IndianRupee size={14} className="text-blue-500" />
                            </div>
                            <p className="text-lg font-black text-slate-900">₹{totalEarnings.toLocaleString()}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">{isEmployee ? "Earned" : "Spent"}</p>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "bg-white text-slate-400 border border-slate-100 hover:text-slate-600"
                                    }`}
                            >
                                {f === "all" && <Filter size={10} />}
                                {f === "all" ? `All (${historyBookings.length})` : `${f} (${f === "Completed" ? completedCount : rejectedCount})`}
                            </button>
                        ))}
                    </div>

                    {/* Booking List */}
                    {filteredBookings.length > 0 ? (
                        <div className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            {filteredBookings.map((booking, idx) => (
                                <div
                                    key={booking.id}
                                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-slide-up"
                                    style={{ animationDelay: `${idx * 60}ms` }}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Status Icon */}
                                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${booking.status === "Completed" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
                                            }`}>
                                            {booking.status === "Completed" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="text-sm font-black text-slate-900 truncate">{booking.serviceTitle}</h3>
                                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${booking.status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 mt-1">
                                                <User size={10} className="text-slate-400" />
                                                <p className="text-[11px] font-bold text-slate-500">
                                                    {isEmployee ? booking.customerName : booking.providerName}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={10} /> {booking.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} /> {booking.time}
                                                    </span>
                                                </div>
                                                <p className={`text-sm font-black ${booking.status === "Completed" ? "text-emerald-600" : "text-slate-400 line-through"
                                                    }`}>₹{(booking.amount || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                            <div className="relative mb-6">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-lg flex items-center justify-center border border-slate-100">
                                    <History size={40} className="text-slate-200" />
                                </div>
                                <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white border-2 border-white">
                                    <Clock size={14} />
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">No History Yet</h3>
                            <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[220px]">
                                {isEmployee
                                    ? "Completed and declined jobs will appear here"
                                    : "Your past bookings will be archived here"
                                }
                            </p>
                            <Link
                                href="/"
                                className="mt-8 rounded-2xl bg-slate-900 px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg active:scale-95 transition-all"
                            >
                                {isEmployee ? "Go to Dashboard" : "Browse Services"}
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
