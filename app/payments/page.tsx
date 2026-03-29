"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, Landmark, History, ChevronRight, Wallet, IndianRupee, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";

export default function PaymentsPage() {
    const { user } = useAuth();
    const { bookings } = useData();

    const isEmployee = user?.role === "employee" || user?.role === "provider";

    // Real data
    const userBookings = isEmployee
        ? bookings.filter(b => b.providerId === user?.id)
        : bookings.filter(b => b.customerId === user?.id);

    const completedBookings = userBookings.filter(b => b.status === "Completed");
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const pendingAmount = userBookings
        .filter(b => b.status === "Pending" || b.status === "Accepted")
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 pt-10 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center gap-4">
                    <Link
                        href="/settings"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg active:scale-90 transition-all font-black"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">
                            {isEmployee ? "Earnings" : "Payments"}
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {isEmployee ? "Income & Transactions" : "Payment History"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide pb-32">
                <div className="flex flex-col gap-6">

                    {/* Balance Cards */}
                    <div className="grid grid-cols-2 gap-3 animate-slide-up">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-5 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-3xl rounded-full" />
                            <div className="relative z-10">
                                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                                    <IndianRupee size={14} className="text-emerald-400" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">
                                    {isEmployee ? "Total Earned" : "Total Spent"}
                                </p>
                                <p className="text-2xl font-black tracking-tight">₹{totalEarnings.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100/50 blur-2xl rounded-full" />
                            <div className="relative z-10">
                                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
                                    <Wallet size={14} className="text-amber-500" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending</p>
                                <p className="text-2xl font-black tracking-tight text-slate-900">₹{pendingAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <div className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <ArrowDownLeft size={16} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900">{completedBookings.length}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Completed</p>
                            </div>
                        </div>
                        <div className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <ArrowUpRight size={16} className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900">{userBookings.length}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total Bookings</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center justify-between px-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction History</p>
                            <History size={14} className="text-slate-300" />
                        </div>

                        {completedBookings.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {userBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${booking.status === "Completed" ? "bg-emerald-50 text-emerald-500" :
                                                booking.status === "Pending" ? "bg-amber-50 text-amber-500" :
                                                    booking.status === "Accepted" ? "bg-blue-50 text-blue-500" :
                                                        "bg-red-50 text-red-500"
                                                }`}>
                                                <CreditCard size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900">{booking.serviceTitle}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    {isEmployee ? booking.customerName : booking.providerName} • {booking.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-black ${booking.status === "Completed" ? "text-emerald-600" : "text-slate-900"
                                                }`}>₹{(booking.amount || 0).toLocaleString()}</p>
                                            <p className={`text-[8px] font-black uppercase tracking-wider ${booking.status === "Completed" ? "text-emerald-500" :
                                                booking.status === "Pending" ? "text-amber-500" :
                                                    "text-slate-400"
                                                }`}>{booking.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-white/50 p-12">
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center opacity-40">
                                        <CreditCard size={32} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Transactions Yet</p>
                                        <p className="text-[10px] text-slate-300 font-bold mt-1">
                                            {isEmployee ? "Complete bookings to see earnings here" : "Your payment history will appear here"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
