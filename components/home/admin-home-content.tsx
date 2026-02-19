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
    <div className="flex flex-col gap-5 px-4 py-4 pb-8">
      {/* Admin Header */}
      <div className="rounded-2xl bg-primary p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/15">
            <Shield size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-foreground">Admin Dashboard</h2>
            <p className="text-xs text-primary-foreground/60">Full access control panel</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ebf4ff]">
              <Users size={18} className="text-[#3182ce]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="text-lg font-bold text-foreground">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0fff4]">
              <UserCheck size={18} className="text-[#38a169]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Customers</p>
              <p className="text-lg font-bold text-foreground">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
              <Briefcase size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Employees</p>
              <p className="text-lg font-bold text-foreground">{employees.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fefcbf]">
              <TrendingUp size={18} className="text-[#d69e2e]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-lg font-bold text-foreground">1.2L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 text-base font-bold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: "Manage Users", color: "text-[#3182ce]", bg: "bg-[#ebf4ff]" },
            { icon: BarChart3, label: "Analytics", color: "text-[#38a169]", bg: "bg-[#f0fff4]" },
            { icon: Activity, label: "Reports", color: "text-[#d69e2e]", bg: "bg-[#fefcbf]" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${action.bg}`}>
                  <Icon size={20} className={action.color} />
                </div>
                <span className="text-xs font-medium text-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h3 className="mb-3 text-base font-bold text-foreground">Registered Users</h3>
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  u.role === "admin" ? "bg-destructive/10" : u.role === "employee" ? "bg-accent/10" : "bg-primary/10"
                }`}>
                  {u.role === "admin" ? (
                    <Shield size={18} className="text-destructive" />
                  ) : u.role === "employee" ? (
                    <Briefcase size={18} className="text-accent" />
                  ) : (
                    <Users size={18} className="text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.role === "employee" ? `ID: ${u.employeeId}` : u.mobile}
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                u.role === "admin"
                  ? "bg-destructive/10 text-destructive"
                  : u.role === "employee"
                    ? "bg-accent/10 text-accent"
                    : "bg-primary/10 text-primary"
              }`}>
                {u.role}
              </span>
            </div>
          ))}

          {users.length === 1 && (
            <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <UserX size={24} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No other users registered yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
