"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquare, Phone, Mail, HelpCircle, ChevronRight, MessageCircle } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Premium Header */}
            <div className="bg-white px-6 pt-10 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-slate-900 shadow-sm active:scale-90 transition-all font-black"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Support Desk</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Resolution Hub</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide pb-32">
                <div className="flex flex-col gap-8">

                    {/* Hero Support Card */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20">
                        <div className="relative z-10 flex flex-col gap-2">
                            <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 mb-2">
                                <HelpCircle size={32} className="text-primary" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter">How can we help?</h2>
                            <p className="text-sm text-white/50 font-medium leading-relaxed max-w-[200px]">Our expert team is on standby to resolve your queries instantly.</p>
                        </div>

                        {/* Decorative Background */}
                        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                    </div>

                    {/* Contact Channels */}
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Instant Channels</p>
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden divide-y divide-slate-50">

                            {/* Live Chat */}
                            <button className="w-full p-6 flex items-center gap-5 group active:bg-slate-50 transition-colors text-left">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
                                    <MessageCircle size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-900">Live Agent Chat</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Response time: ~2 mins</p>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                            </button>

                            {/* Voice Support */}
                            <button className="w-full p-6 flex items-center gap-5 group active:bg-slate-50 transition-colors text-left">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm">
                                    <Phone size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-900">Direct Support Line</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Available 9AM - 8PM</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-200" />
                            </button>

                            {/* Email */}
                            <button className="w-full p-6 flex items-center gap-5 group active:bg-slate-50 transition-colors text-left">
                                <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm">
                                    <Mail size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-900">Official Dispatch</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">support@servicehub.com</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-200" />
                            </button>
                        </div>
                    </div>

                    {/* FAQ Quick Link */}
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 flex items-center justify-between shadow-2xl shadow-slate-900/20">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <MessageSquare size={18} />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest leading-none">Browse Knowledge Base</p>
                        </div>
                        <ChevronRight size={16} className="text-white/30" />
                    </div>
                </div>
            </main>
        </div>
    );
}
