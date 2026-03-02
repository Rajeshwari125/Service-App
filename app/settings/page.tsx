"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Bell,
    MapPin,
    LogOut,
    Trash2,
    ChevronRight,
    Edit2,
    Check,
    X,
    CreditCard,
    Globe,
    Moon,
    Sun,
    Star,
    Briefcase,
    Clock,
    Calendar,
    Phone,
    Shield,
    Award,
    TrendingUp,
    Package,
    CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { useReviews } from "@/lib/review-context";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    const { user, logout, updateUser } = useAuth();
    const { services, rentals, bookings } = useData();
    const { getProviderReviews } = useReviews();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [mobile, setMobile] = useState(user?.mobile || "");
    const [bookingNotify, setBookingNotify] = useState(true);
    const [location, setLocation] = useState("Madurai, India");

    const cities = ["Madurai, India", "Chennai, India", "Coimbatore, India", "Bangalore, India", "Mumbai, India", "Delhi, India"];

    const handleSaveProfile = () => {
        updateUser({ name, mobile });
        setIsEditing(false);
        toast.success("Profile updated successfully");
    };

    const handleLogout = () => {
        logout();
        router.push("/");
        toast.success("Logged out successfully");
    };

    if (!user) {
        router.push("/");
        return null;
    }

    const isEmployee = user.role === "employee";

    // Employee stats
    const providerServices = services.filter(s => s.providerId === user.id);
    const providerRentals = rentals.filter(r => r.providerId === user.id);
    const providerBookings = bookings.filter(b => b.providerId === user.id);
    const completedBookings = providerBookings.filter(b => b.status === "Completed").length;
    const pendingBookings = providerBookings.filter(b => b.status === "Pending").length;
    const totalEarnings = providerBookings
        .filter(b => b.status === "Completed")
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    // Employee profile
    if (isEmployee) {
        return (
            <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
                {/* Profile Hero */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary/80 px-6 pt-10 pb-8 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                href="/"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                            >
                                <ArrowLeft size={18} />
                            </Link>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest"
                                >
                                    <Edit2 size={12} /> Edit
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-300"
                                    >
                                        <X size={14} />
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"
                                    >
                                        <Check size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Profile Card */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="h-20 w-20 rounded-[1.5rem] bg-gradient-to-br from-primary/40 to-emerald-400/40 flex items-center justify-center border-2 border-white/20 shadow-2xl backdrop-blur-sm">
                                    <User size={36} className="text-white/80" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-slate-900">
                                    <CheckCircle2 size={12} className="text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-9 rounded-xl bg-white/10 border-white/10 font-bold text-white placeholder:text-white/30 text-sm"
                                            placeholder="Your Name"
                                        />
                                        <Input
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            className="h-9 rounded-xl bg-white/10 border-white/10 font-bold text-white placeholder:text-white/30 text-sm"
                                            placeholder="Mobile Number"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-black text-white tracking-tight">{user.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone size={12} className="text-white/40" />
                                            <p className="text-xs font-bold text-white/50">+{user.mobile}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 rounded-md bg-primary/30 text-[9px] font-black uppercase text-primary-foreground tracking-widest border border-primary/20">
                                                Service Partner
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[9px] font-black uppercase text-emerald-300 tracking-widest border border-emerald-500/20">
                                                ID: {user.employeeId}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide pb-32 -mt-2">
                    <div className="flex flex-col gap-6">

                        {/* Performance Stats */}
                        <div className="grid grid-cols-4 gap-2 animate-slide-up">
                            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col items-center gap-1">
                                <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Briefcase size={14} className="text-blue-500" />
                                </div>
                                <p className="text-lg font-black text-slate-900">{providerServices.length}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Services</p>
                            </div>
                            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col items-center gap-1">
                                <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <Package size={14} className="text-emerald-500" />
                                </div>
                                <p className="text-lg font-black text-slate-900">{providerRentals.length}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Rentals</p>
                            </div>
                            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col items-center gap-1">
                                <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <CheckCircle2 size={14} className="text-amber-500" />
                                </div>
                                <p className="text-lg font-black text-slate-900">{completedBookings}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Done</p>
                            </div>
                            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col items-center gap-1">
                                <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <TrendingUp size={14} className="text-purple-500" />
                                </div>
                                <p className="text-lg font-black text-slate-900">₹{totalEarnings}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Earned</p>
                            </div>
                        </div>

                        {/* Work Info */}
                        <section className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Work Details</p>
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                                {/* Service Area */}
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">Service Area</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Your work location</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md">{location.split(',')[0]}</p>
                                    </div>
                                    <Select value={location} onValueChange={setLocation}>
                                        <SelectTrigger className="w-full h-11 rounded-xl bg-slate-50 border-none font-bold text-xs text-slate-700">
                                            <SelectValue placeholder="Change location" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                            {cities.map(city => (
                                                <SelectItem key={city} value={city} className="font-bold text-xs py-3">{city}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Availability */}
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Availability</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Accept new bookings</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black text-emerald-600 uppercase">Online</span>
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                </div>

                                {/* Rating - Clickable to reviews page */}
                                {(() => {
                                    const providerReviews = getProviderReviews(user.id);
                                    const avgRating = providerReviews.length > 0
                                        ? (providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length).toFixed(1)
                                        : "0.0";
                                    const ratingNum = Math.round(Number(avgRating));
                                    return (
                                        <button
                                            onClick={() => router.push('/provider/reviews')}
                                            className="w-full p-5 flex items-center justify-between group active:bg-slate-50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                                    <Star size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">Rating</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                        {providerReviews.length} customer feedback{providerReviews.length !== 1 ? "s" : ""}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star key={i} size={12} className={i <= ratingNum ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                                                    ))}
                                                    <span className="text-xs font-black text-slate-900 ml-1">{avgRating}</span>
                                                </div>
                                                <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    );
                                })()}

                                {/* Experience Badge */}
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                                            <Award size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Badge</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Trust level</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 text-[10px] font-black text-primary uppercase tracking-widest border border-primary/10">
                                        {completedBookings >= 10 ? "⭐ Gold Partner" : completedBookings >= 5 ? "🥈 Silver" : "🆕 New Partner"}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Preferences */}
                        <section className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Preferences</p>
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                                {/* Booking Notifications */}
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                            <Bell size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Booking Alerts</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">New booking notifications</p>
                                        </div>
                                    </div>
                                    <Switch checked={bookingNotify} onCheckedChange={setBookingNotify} />
                                </div>

                                {/* Dark Mode */}
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">Dark Mode</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Theme appearance</p>
                                        </div>
                                    </div>
                                    <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                                </div>

                                {/* Payments */}
                                <button
                                    onClick={() => router.push('/payments')}
                                    className="w-full p-5 flex items-center justify-between group active:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                            <CreditCard size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-foreground">Earnings & Payments</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">View payment history</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                                </button>
                            </div>
                        </section>

                        {/* Account */}
                        <section className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Account</p>
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                                <button onClick={handleLogout} className="w-full p-5 flex items-center justify-between group active:bg-rose-50 transition-colors text-rose-500">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
                                            <LogOut size={18} />
                                        </div>
                                        <p className="text-sm font-black">Logout</p>
                                    </div>
                                    <ChevronRight size={16} className="text-rose-200" />
                                </button>

                                <button className="w-full p-5 flex items-center justify-between group opacity-30 cursor-not-allowed">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                            <Trash2 size={18} />
                                        </div>
                                        <p className="text-sm font-black">Delete Account</p>
                                    </div>
                                </button>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="flex flex-col items-center gap-2 pt-2">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                                <Shield size={10} className="text-slate-400" />
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Privacy Policy</span>
                                <span className="text-slate-200 text-[8px]">|</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Terms</span>
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">ServiceHub v1.0</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Customer stats
    const customerBookings = bookings.filter(b => b.customerId === user.id);
    const customerCompleted = customerBookings.filter(b => b.status === "Completed").length;
    const customerPending = customerBookings.filter(b => b.status === "Pending" || b.status === "Accepted").length;
    const customerSpent = customerBookings
        .filter(b => b.status === "Completed")
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    // Customer profile (premium)
    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Profile Hero */}
            <div className="relative bg-gradient-to-br from-primary/90 via-blue-600 to-indigo-700 px-6 pt-10 pb-8 overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />

                {/* Back + Edit */}
                <div className="relative flex items-center justify-between mb-6">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white active:scale-90 transition-all"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white active:scale-95 transition-all"
                        >
                            <Edit2 size={10} /> Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white"
                            >
                                <X size={10} /> Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-primary"
                            >
                                <Check size={10} /> Save
                            </button>
                        </div>
                    )}
                </div>

                {/* Avatar + Info */}
                <div className="relative flex items-center gap-4">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-[1.5rem] bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                            <User size={36} className="text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-400 flex items-center justify-center border-2 border-white shadow-lg">
                            <CheckCircle2 size={14} className="text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 rounded-lg bg-white/20 border-white/20 text-white font-bold text-sm placeholder:text-white/50" placeholder="Your Name" />
                                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-9 rounded-lg bg-white/20 border-white/20 text-white font-bold text-sm placeholder:text-white/50" placeholder="Mobile Number" />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-black text-white tracking-tight leading-none">{user.name}</h2>
                                <p className="text-xs font-bold text-white/60 mt-1">+{user.mobile}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-[9px] font-black uppercase text-white tracking-widest">
                                        Customer
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-400/20 text-[9px] font-black uppercase text-emerald-200 tracking-widest">
                                        ✓ Verified
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide pb-32 -mt-2">
                <div className="flex flex-col gap-6">

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 animate-slide-up">
                        {[
                            { label: "Bookings", value: customerBookings.length, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
                            { label: "Completed", value: customerCompleted, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                            { label: "Spent", value: `₹${customerSpent.toLocaleString()}`, icon: CreditCard, color: "text-purple-500", bg: "bg-purple-50" },
                            { label: "Active", value: customerPending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-center">
                                    <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-1.5 ${stat.color}`}>
                                        <Icon size={14} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900 leading-none">{stat.value}</p>
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <section className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Quick Access</p>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            <Link href="/orders" className="p-5 flex items-center justify-between group active:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">My Bookings</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {customerBookings.length} total • {customerPending} active
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                            </Link>

                            <Link href="/payments" className="p-5 flex items-center justify-between group active:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Payments</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            ₹{customerSpent.toLocaleString()} total spent
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                            </Link>

                            <Link href="/history" className="p-5 flex items-center justify-between group active:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Booking History</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {customerCompleted} completed services
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>
                    </section>

                    {/* Recent Orders Inline */}
                    <section className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '150ms' }}>
                        <div className="flex items-center justify-between px-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recent Orders</p>
                            <Link href="/orders" className="text-[10px] font-black text-primary uppercase tracking-wider">View All</Link>
                        </div>
                        {customerBookings.length === 0 ? (
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col items-center gap-2">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <Package size={22} className="text-slate-300" />
                                </div>
                                <p className="text-xs font-bold text-slate-400">No bookings yet</p>
                                <Link href="/browse/service/all" className="text-[10px] font-black text-primary uppercase tracking-wider mt-1">
                                    Book a Service →
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {customerBookings.slice(0, 5).map((booking, i) => {
                                    const statusColors: Record<string, string> = {
                                        Completed: "bg-emerald-50 text-emerald-600",
                                        Pending: "bg-amber-50 text-amber-600",
                                        Accepted: "bg-blue-50 text-blue-600",
                                        Cancelled: "bg-red-50 text-red-500",
                                    };
                                    const color = statusColors[booking.status] || "bg-slate-50 text-slate-500";
                                    return (
                                        <div key={(booking as any).id || i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Package size={16} className="text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black text-slate-900 truncate">{(booking as any).serviceName || (booking as any).itemName || "Booking"}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    {(booking as any).date ? new Date((booking as any).date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "–"}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${color}`}>{booking.status}</span>
                                                {(booking as any).amount ? <span className="text-xs font-black text-slate-900">₹{(booking as any).amount}</span> : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Preferences */}
                    <section className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Preferences</p>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                        <Bell size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Notifications</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Booking updates</p>
                                    </div>
                                </div>
                                <Switch checked={bookingNotify} onCheckedChange={setBookingNotify} />
                            </div>

                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Dark Mode</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Theme appearance</p>
                                    </div>
                                </div>
                                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                            </div>

                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Location</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Your area</p>
                                    </div>
                                </div>
                                <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-[130px] h-9 rounded-lg bg-slate-50 border-none font-bold text-[10px] text-slate-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                        {cities.map(city => (
                                            <SelectItem key={city} value={city} className="font-bold text-xs py-2.5">{city}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </section>

                    {/* Account */}
                    <section className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Account</p>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            <button onClick={handleLogout} className="w-full p-5 flex items-center justify-between group active:bg-rose-50 transition-colors text-rose-500">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
                                        <LogOut size={18} />
                                    </div>
                                    <p className="text-sm font-black">Logout</p>
                                </div>
                                <ChevronRight size={16} className="text-rose-200" />
                            </button>

                            <button className="w-full p-5 flex items-center justify-between group opacity-30 cursor-not-allowed">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                        <Trash2 size={18} />
                                    </div>
                                    <p className="text-sm font-black">Delete Account</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="flex flex-col items-center gap-2 pt-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                            <Shield size={10} className="text-slate-400" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Privacy Policy</span>
                            <span className="text-slate-200 text-[8px]">|</span>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Terms</span>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">ServiceHub v1.0</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
