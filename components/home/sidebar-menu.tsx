"use client";

import { useAuth } from "@/lib/auth-context";
import {
  X,
  Home,
  Briefcase,
  Heart,
  History,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Shield,
  CreditCard,
  Bell,
  Navigation,
  ClipboardList,
  PlusCircle,
  Wallet,
  LayoutDashboard,
  Package,
  Star,
  Users,
  BarChart3,
  Database,
  Key,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Employee/Provider navigation items
  const employeeMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: ClipboardList, label: "Manage Bookings", href: "/provider/manage-bookings" },
    { icon: PlusCircle, label: "Add Listing", href: "/provider/add-listing" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: History, label: "Booking History", href: "/history" },
    { icon: Wallet, label: "Earnings", href: "/payments" },
    { icon: Star, label: "Customer Reviews", href: "/provider/reviews" },
    { icon: HelpCircle, label: "Help Center", href: "/support" },
  ];

  // Customer navigation items
  const customerMenuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Briefcase, label: "My Bookings", href: "/orders" },
    { icon: Heart, label: "Favourites", href: "/favourites" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: History, label: "Booking History", href: "/history" },
    { icon: CreditCard, label: "Payments", href: "/payments" },
    { icon: HelpCircle, label: "Help Center", href: "/support" },
  ];

  // Admin navigation items
  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Admin Console", href: "/" },
    { icon: Users, label: "Manage Users", href: "/admin/users" },
    { icon: Package, label: "Approve Listings", href: "/admin/listings" },
    { icon: ClipboardList, label: "System Bookings", href: "/admin/all-bookings" },
    { icon: BarChart3, label: "Growth Analytics", href: "/admin/analytics" },
    { icon: Database, label: "Database Health", href: "/admin/database" },
    { icon: Bell, label: "Alerts", href: "/notifications" },
    { icon: Settings, label: "Site Settings", href: "/settings" },
  ];

  const isEmployee = user?.role === "employee" || user?.role === "provider";
  const isAdmin = user?.role === "admin";
  
  const menuItems = isAdmin 
    ? adminMenuItems 
    : isEmployee 
      ? employeeMenuItems 
      : customerMenuItems;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="absolute inset-0 z-50 bg-slate-950/40 backdrop-blur-md animate-fade-in"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`absolute left-0 top-0 z-[60] flex h-full w-[85%] max-w-[320px] flex-col bg-background shadow-2xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Premium Header */}
        <div className="relative overflow-hidden bg-slate-950 px-6 py-10 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[2.2rem] bg-gradient-to-br from-primary to-accent p-[2px] overflow-hidden">
                <div className="flex h-full w-full items-center justify-center rounded-[2.1rem] bg-slate-900 border border-white/10 overflow-hidden">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : user?.role === "admin" ? (
                    <Shield size={28} className="text-primary" />
                  ) : (
                    <User size={28} className="text-primary" />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-black tracking-tight leading-none mb-1">{user?.name || "Guest"}</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  {(user?.role === "employee" || user?.role === "provider") ? (
                    `Partner ID: ${user.employeeId || 'P-' + user.id.slice(-4)}`
                  ) : user?.role === "admin" ? (
                    "System Admin"
                  ) : (
                    `+91 ${user?.mobile}`
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="group flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
            >
              <X size={20} className="text-white/60 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          {/* Role Badge */}
          <div className="relative z-10 mt-6 flex">
            <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border shadow-sm ${user?.role === "admin"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : (user?.role === "employee" || user?.role === "provider")
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-primary/20 text-primary-foreground border-white/10"
              }`}>
              <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${user?.role === "admin" ? "bg-rose-400" : (user?.role === "employee" || user?.role === "provider") ? "bg-emerald-400" : "bg-primary"
                }`} />
              {isEmployee ? "Partner" : user?.role === "admin" ? "Admin" : "Customer"} Member
            </div>
          </div>

          {/* Decorative Background */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
        </div>

        {/* Navigation Section */}
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-8 scrollbar-hide">
          <p className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Main Navigator</p>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`group relative flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300 animate-slide-up ${isActive
                    ? "bg-primary/5 text-primary shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                    }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {isActive && (
                    <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
                  )}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${isActive ? "bg-primary/10 text-primary scale-110" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-900"
                    }`}>
                    <Icon size={20} className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
                  </div>
                  <span className={`text-sm font-black tracking-tight ${isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}>
                    {item.label}
                  </span>

                  {!isActive && (
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all">
                      <Navigation size={14} className="rotate-90 text-slate-300" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Luxury Footer Card */}
        <div className="p-4 border-t border-slate-50">
          <div className="bg-slate-50 rounded-[2rem] p-4 flex flex-col gap-4 border border-slate-100/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                <HelpCircle size={18} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-none">Need assistance?</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">24/7 Digital Support</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white border border-rose-100 px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-500 shadow-sm transition-all hover:bg-rose-500 hover:text-white active:scale-95"
            >
              <LogOut size={16} />
              Terminate Session
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
