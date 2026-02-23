"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, Plus, Landmark, History, ChevronRight, ShieldCheck } from "lucide-react";

export default function PaymentsPage() {
    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Premium Header */}
            <div className="bg-white px-6 pt-10 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg active:scale-90 transition-all font-black"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Finances</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallets & Payment Hub</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide pb-32">
                <div className="flex flex-col gap-8">

                    {/* Digital Card Preview */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl shadow-slate-900/40 animate-slide-up">
                        <div className="relative z-10 flex flex-col gap-10">
                            <div className="flex justify-between items-start">
                                <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                    <ShieldCheck size={20} className="text-primary" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">ServiceHub Premium</p>
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Total Available Credit</p>
                                <h2 className="text-3xl font-black tracking-tighter">₹14,580.00</h2>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-xs font-mono opacity-60">**** **** **** 8821</p>
                                <div className="h-8 w-12 bg-white/5 rounded-lg border border-white/10" />
                            </div>
                        </div>

                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 blur-[80px]" />
                        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-500/10 blur-[60px]" />
                    </div>

                    {/* Payment Methods */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stored Methods</p>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary">+ Link Method</button>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden divide-y divide-slate-50">

                            {/* UPI */}
                            <button className="w-full p-6 flex items-center gap-5 group active:bg-slate-50 transition-colors text-left">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Landmark size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-900">Unified Payments (UPI)</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">servicehub@okaxis</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-200" />
                            </button>

                            {/* Wallet */}
                            <button className="w-full p-6 flex items-center gap-5 group active:bg-slate-50 transition-colors text-left">
                                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                    <CreditCard size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-900">ServiceHub Wallet</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fast-track secure payments</p>
                                </div>
                                <div className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-2 py-1 rounded-md">Default</div>
                            </button>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recent Transactions</p>
                            <History size={14} className="text-slate-300" />
                        </div>
                        <div className="flex flex-col gap-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-white rounded-3xl p-5 border border-white shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                                            <CreditCard size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900">#SH-TRX-2024-0{i}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{i === 1 ? 'Service Booking' : 'Rental Deposit'}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-slate-900">₹{i === 1 ? '1,200' : '5,000'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
