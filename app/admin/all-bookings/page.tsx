"use client";

import { useData } from "@/lib/data-context";
import { ArrowLeft, ClipboardList, Search, Filter, Calendar, Clock, User, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminAllBookingsPage() {
    const { bookings } = useData();

    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg active:scale-90 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Global Bookings</h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{bookings.length} Total Transactions</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-4 pt-6 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search IDs or Providers..."
                        className="w-full rounded-2xl border-none bg-white px-10 py-3.5 text-[11px] font-bold shadow-sm focus:ring-1 focus:ring-primary/20 placeholder:text-slate-300"
                    />
                </div>
                <button className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                    <Filter size={18} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 scrollbar-hide">
                <div className="flex flex-col gap-4">
                    {bookings.map((booking, idx) => (
                        <div 
                            key={booking.id}
                            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-slide-up"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {booking.id.slice(0, 8)}</span>
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                    booking.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>

                            <h3 className="text-sm font-black text-slate-900 mb-1">{booking.serviceTitle}</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <User size={10} className="text-slate-300" />
                                    <p className="text-[10px] font-bold text-slate-500">{booking.customerName}</p>
                                </div>
                                <ArrowRight size={10} className="text-slate-200" />
                                <div className="flex items-center gap-1">
                                    <ShieldCheck size={10} className="text-primary/40" />
                                    <p className="text-[10px] font-bold text-primary">{booking.providerName}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase">
                                        <Calendar size={10} /> {booking.date}
                                    </div>
                                    <div className="flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase">
                                        <Clock size={10} /> {booking.time}
                                    </div>
                                </div>
                                <p className="text-sm font-black text-slate-900">₹{booking.amount}</p>
                            </div>
                        </div>
                    ))}
                    
                    {bookings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-20 w-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-4 opacity-50">
                                <ClipboardList size={32} className="text-slate-200" />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No System Bookings</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
