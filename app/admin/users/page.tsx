"use client";

import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Users, Shield, Search, MoreVertical, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
    const { users } = useAuth();
    const platformUsers = users.filter(u => u.role !== 'admin');

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
                        <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Manage Users</h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{platformUsers.length} Registered Members</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-4 pt-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, phone or role..."
                        className="w-full rounded-2xl border-none bg-white px-12 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-300"
                    />
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 scrollbar-hide">
                <div className="flex flex-col gap-3">
                    {platformUsers.map((user, idx) => (
                        <div
                            key={user.id}
                            className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm animate-slide-up"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                                        user.role === 'employee' ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'
                                    }`}>
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900">{user.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                user.role === 'employee' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                                {user.role}
                                            </span>
                                            <p className="text-[10px] font-bold text-slate-400">{user.mobile}</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-2">
                                <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 transition-all">
                                    <Mail size={12} /> Message
                                </button>
                                <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 transition-all">
                                    <Shield size={12} /> Perms
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
