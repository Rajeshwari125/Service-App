"use client";

import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Calendar, ArrowRight, Wallet, Users, Briefcase } from "lucide-react";
import Link from "next/link";

export default function AdminAnalyticsPage() {
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
                        <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Growth Analytics</h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform Performance</p>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 scrollbar-hide">
                <div className="flex flex-col gap-6">
                    {/* Period Selector */}
                    <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
                        {["7 Days", "30 Days", "Current Year"].map((period, i) => (
                            <button 
                                key={period}
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                                    i === 1 ? "bg-slate-900 text-white shadow-md" : "text-slate-400"
                                }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>

                    {/* Revenue Card */}
                    <div className="bg-slate-950 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <Wallet size={20} className="text-primary-foreground" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Gross Revenue</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter mb-2">₹1,24,500</h2>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-black uppercase">
                                    <TrendingUp size={12} /> +18.4%
                                </span>
                                <span className="text-white/20 text-[10px] font-bold">vs last month</span>
                            </div>
                        </div>
                        {/* Decorative Background */}
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                    </div>

                    {/* Mini Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-slide-up">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Users size={18} />
                                </div>
                                <TrendingUp size={14} className="text-emerald-500" />
                            </div>
                            <p className="text-2xl font-black text-slate-900">42</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">New Users</p>
                        </div>
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
                                    <Briefcase size={18} />
                                </div>
                                <TrendingDown size={14} className="text-rose-500" />
                            </div>
                            <p className="text-2xl font-black text-slate-900">12</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Provider Apps</p>
                        </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Booking Volume</h3>
                            <BarChart3 size={16} className="text-slate-300" />
                        </div>
                        <div className="h-32 flex items-end justify-between gap-2">
                            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                <div 
                                    key={i} 
                                    className="flex-1 bg-slate-100 rounded-t-lg relative group transition-all"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}%
                                    </div>
                                    <div className={`absolute inset-0 rounded-t-lg transition-all ${i === 3 ? "bg-primary" : "bg-slate-200"}`} />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                                <span key={d} className="text-[9px] font-black text-slate-300">{d}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
