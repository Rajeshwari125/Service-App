"use client";

import { ArrowLeft, Database, Activity, Cpu, HardDrive, RefreshCw, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminDatabasePage() {
    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg active:scale-90 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">System Health</h1>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Database & Infrastructure</p>
                        </div>
                    </div>
                    <button className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 scrollbar-hide">
                <div className="flex flex-col gap-6">
                    
                    {/* Status Overview */}
                    <div className="bg-emerald-500 rounded-[2.5rem] p-6 text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Systems Operational</span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight leading-tight">Everything looks great today!</h2>
                            <p className="mt-2 text-[11px] font-bold text-white/70 leading-relaxed">No incidents reported across global infrastructure. Database response time: 24ms.</p>
                        </div>
                        <CheckCircle2 size={120} className="absolute -right-8 -bottom-8 text-white/10" />
                    </div>

                    {/* Technical Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-slide-up">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                    <Cpu size={18} />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CPU Usage</p>
                            </div>
                            <p className="text-2xl font-black text-slate-900">12%</p>
                            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[12%] rounded-full" />
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Database size={18} />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Storage</p>
                            </div>
                            <p className="text-2xl font-black text-slate-900">4.2 GB</p>
                            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[30%] rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Incident Log */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Activity Logs</h3>
                            <Activity size={16} className="text-slate-300" />
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { event: "Backup Sync Complete", time: "2 mins ago", type: "success" },
                                { event: "Node-4 Rejuvenation", time: "1 hour ago", type: "info" },
                                { event: "High Traffic Alert", time: "3 hours ago", type: "warning" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${
                                            log.type === 'success' ? 'bg-emerald-400' : log.type === 'warning' ? 'bg-orange-400' : 'bg-blue-400'
                                        }`} />
                                        <p className="text-[11px] font-bold text-slate-700">{log.event}</p>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-300 uppercase">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
