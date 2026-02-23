"use client";

import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle2, Info, AlertTriangle, Clock } from "lucide-react";

export default function NotificationsPage() {
    const notifications = [
        {
            id: 1,
            title: "Booking Confirmed",
            desc: "Your AC Service with Raji has been confirmed for tomorrow at 10:00 AM.",
            time: "2 mins ago",
            type: "success",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            id: 2,
            title: "Equipment Ready",
            desc: "The Mahindra Thar you reserved is now ready for pickup at the hub.",
            time: "1 hour ago",
            type: "info",
            icon: Info,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            id: 3,
            title: "Payment Received",
            desc: "Transaction #SH-9921 for ₹1,200 was successful.",
            time: "3 hours ago",
            type: "success",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            id: 4,
            title: "System Update",
            desc: "We've added new rental categories! Check out AV/Events now.",
            time: "Yesterday",
            type: "warning",
            icon: SparklesIcon,
            color: "text-amber-500",
            bg: "bg-amber-50"
        }
    ];

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
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Intelligence</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Feed</p>
                        </div>
                    </div>
                    <div className="h-10 w-10 flex items-center justify-center text-slate-300">
                        <Bell size={20} className="animate-swing" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide pb-32">
                <div className="flex flex-col gap-4">
                    {notifications.map((note, idx) => (
                        <div
                            key={note.id}
                            className="group relative overflow-hidden rounded-[2rem] bg-white p-5 border border-white shadow-xl shadow-slate-200/50 animate-slide-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex gap-4">
                                <div className={`h-12 w-12 shrink-0 rounded-2xl ${note.bg} flex items-center justify-center ${note.color}`}>
                                    <note.icon size={22} />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-black text-slate-900">{note.title}</p>
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{note.time}</p>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed">{note.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-8 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">End of Intelligence Feed</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SparklesIcon({ size, className }: { size: number, className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
