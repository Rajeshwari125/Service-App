"use client";

import { useAuth } from "@/lib/auth-context";
import {
  Users,
  Briefcase,
  TrendingUp,
  Shield,
  UserCheck,
  UserX,
  BarChart3,
  Activity,
} from "lucide-react";

export function AdminHomeContent() {
  const { users } = useAuth();

  const customers = users.filter((u) => u.role === "customer");
  const employees = users.filter((u) => u.role === "employee");

  return (
    <div className="flex flex-col gap-6 px-4 py-5 pb-12 animate-fade-in">
      {/* Admin Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/40">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <Shield size={28} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Command Center</h2>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">System Administrator</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter flex items-center gap-1">
              <Activity size={10} /> Live System
            </p>
          </div>
        </div>

        {/* Background Decorative Circles */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Analytics Recap */}
      <div className="grid grid-cols-2 gap-4">
        <div className="group rounded-[2rem] bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all animate-slide-up">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Active Users</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-slate-900">{users.filter(u => u.role !== 'admin').length}</p>
            <p className="text-[10px] font-bold text-emerald-500 pb-1.5">+12%</p>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[70%] rounded-full" />
          </div>
        </div>

        <div className="group rounded-[2rem] bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Revenue Hub</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-slate-900">₹0</p>
            <p className="text-[10px] font-bold text-slate-300 pb-1.5">0%</p>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-300 w-[10%] rounded-full" />
          </div>
        </div>
      </div>

      {/* Role Segregation */}
      <div className="flex gap-4">
        <div className="flex-1 flex items-center gap-3 bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Customers</p>
            <p className="font-black text-indigo-900 text-lg">{customers.length}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100/50 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Employees</p>
            <p className="font-black text-emerald-900 text-lg">{employees.length}</p>
          </div>
        </div>
      </div>

      {/* Strategic Actions */}
      <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h3 className="mb-4 px-1 text-sm font-black text-slate-900 uppercase tracking-widest">Operational Gear</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: "Users", color: "text-blue-600", bg: "bg-blue-100" },
            { icon: BarChart3, label: "Stats", color: "text-purple-600", bg: "bg-purple-100" },
            { icon: Activity, label: "Logs", color: "text-rose-600", bg: "bg-rose-100" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                className="flex flex-col items-center gap-3 rounded-[2rem] bg-white p-5 border border-slate-100 shadow-sm active:scale-95 transition-all"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.bg}`}>
                  <Icon size={24} className={action.color} />
                </div>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Registered Personnel */}
      <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Platform Users</h3>
          <span className="text-[10px] font-black text-primary px-2 py-1 bg-primary/5 rounded-lg">{users.length} Total</span>
        </div>

        <div className="flex flex-col gap-3">
          {users.map((u, idx) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-4 shadow-sm hover:border-primary/20 transition-all animate-slide-up"
              style={{ animationDelay: `${idx * 50 + 600}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${u.role === "admin" ? "bg-slate-950 text-white" :
                    u.role === "employee" ? "bg-emerald-100 text-emerald-600" :
                      "bg-indigo-100 text-indigo-600"
                  }`}>
                  {u.role === "admin" ? <Shield size={20} /> : u.role === "employee" ? <Briefcase size={20} /> : <Users size={20} />}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{u.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 tracking-tight leading-none mt-1">
                    {u.role === "employee" ? u.employeeId : u.mobile}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${u.role === "admin" ? "bg-slate-100 text-slate-900" :
                    u.role === "employee" ? "bg-emerald-50 text-emerald-600" :
                      "bg-indigo-50 text-indigo-600"
                  }`}>
                  {u.role}
                </span>
                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">ActiveNow</p>
              </div>
            </div>
          ))}

          {users.filter(u => u.role !== 'admin').length === 0 && (
            <div className="flex items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 p-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 bg-white rounded-3xl shadow-sm flex items-center justify-center opacity-40">
                  <UserX size={32} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Awaiting Registration</p>
                  <p className="text-[10px] text-slate-300 font-bold mt-1">New platform users will appear here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
