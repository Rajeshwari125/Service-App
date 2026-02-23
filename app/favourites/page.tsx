"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Sparkles, Navigation } from "lucide-react";

export default function FavouritesPage() {
    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Premium Header */}
            <div className="bg-white px-6 pt-10 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200 active:scale-90 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Shortlist</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saved Collections</p>
                        </div>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <Heart size={22} className="fill-current" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide pb-32">
                <div className="flex flex-col gap-3">
                    {/* Empty State with Heart Design */}
                    <div className="flex flex-col items-center justify-center py-24 px-10 text-center animate-fade-in">
                        <div className="relative mb-10 group">
                            <div className="h-32 w-32 rounded-[3.5rem] bg-white shadow-2xl flex items-center justify-center border border-slate-50 transition-transform duration-500 group-hover:scale-110">
                                <Heart size={56} className="text-rose-50" />
                            </div>
                            <div className="absolute -top-3 -right-3 h-14 w-14 rounded-[1.5rem] bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white border-4 border-white shadow-lg animate-bounce">
                                <Sparkles size={20} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Heart is Empty</h3>
                        <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[220px]">
                            Tap the heart icon on any service or rental to save it to your private collection.
                        </p>
                        <Link
                            href="/"
                            className="mt-10 group flex items-center gap-3 rounded-[2rem] bg-slate-900 px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-slate-950/20 active:scale-95 transition-all"
                        >
                            Find Something Local
                            <Navigation size={14} className="rotate-90 text-rose-400" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Tip Overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                    <Sparkles size={18} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">Pro Tip: Saved items stay available for quick booking even during high demand.</p>
            </div>
        </div>
    );
}
