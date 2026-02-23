"use client";

import Link from "next/link";
import { ArrowLeft, Clock, History, MoreVertical, Filter } from "lucide-react";

export default function HistoryPage() {
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
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Activity Log</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Past Engagements</p>
                        </div>
                    </div>
                    <button className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide pb-32">
                <div className="flex flex-col gap-3">
                    {/* Empty State with Luxury Style */}
                    <div className="flex flex-col items-center justify-center py-24 px-10 text-center animate-fade-in">
                        <div className="relative mb-8">
                            <div className="h-32 w-32 rounded-[3.5rem] bg-white shadow-2xl flex items-center justify-center border border-slate-50">
                                <History size={56} className="text-slate-100" />
                            </div>
                            <div className="absolute top-0 right-0 h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white border-4 border-white">
                                <Clock size={16} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Timeline Clean</h3>
                        <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[220px]">
                            Once you complete your service or rental contracts, they will be archived here.
                        </p>
                        <Link
                            href="/"
                            className="mt-10 rounded-2xl bg-slate-900 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-slate-950/20 active:scale-95 transition-all"
                        >
                            Explore Platform
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/5 backdrop-blur-md rounded-[2.5rem] border border-slate-100 flex items-center justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Archived Records: 0 Items</p>
            </div>
        </div>
    );
}
