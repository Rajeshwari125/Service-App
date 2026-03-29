"use client";

import { ArrowLeft, Package, Check, X, Search, Filter, Star, MapPin } from "lucide-react";
import Link from "next/link";
import { staticServices } from "@/lib/static-services";

export default function AdminListingsPage() {
    const pendingListings = staticServices.slice(0, 5); // Simulated pending

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
                        <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Verify Listings</h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Approval Workflow</p>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 scrollbar-hide">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Pending Verification</h3>
                        <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">5 Action Required</span>
                    </div>

                    {pendingListings.map((item, idx) => (
                        <div 
                            key={idx}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-slide-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex p-4 gap-4">
                                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="text-[13px] font-black text-slate-900 truncate">{item.title}</h4>
                                        <span className="shrink-0 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">New</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 leading-tight line-clamp-2">{item.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                            <span className="text-[10px] font-black text-slate-900">{item.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                                            <MapPin size={10} /> Madurai
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 flex gap-2 border-t border-slate-100">
                                <button className="flex-1 rounded-xl bg-slate-900 text-white py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all">
                                    <Check size={14} /> Approve
                                </button>
                                <button className="flex-1 rounded-xl bg-white border border-slate-200 text-slate-500 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                                    <X size={14} /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
