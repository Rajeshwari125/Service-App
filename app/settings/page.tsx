"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Bell,
    MapPin,
    Shield,
    LogOut,
    Trash2,
    ChevronRight,
    Edit2,
    Check,
    X,
    Settings,
    CreditCard,
    Globe,
    Moon,
    Sun,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

export default function SettingsPage() {
    const { user, logout, updateUser } = useAuth();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [mobile, setMobile] = useState(user?.mobile || "");

    // Notifications State
    const [bookingNotify, setBookingNotify] = useState(true);
    const [promoNotify, setPromoNotify] = useState(false);

    // Location State
    const [location, setLocation] = useState("Madurai, India");

    const cities = ["Madurai, India", "Chennai, India", "Coimbatore, India", "Bangalore, India", "Mumbai, India", "Delhi, India"];

    const handleSaveProfile = () => {
        updateUser({ name, mobile });
        setIsEditing(false);
        toast.success("Identity profile updated");
    };

    const handleLogout = () => {
        logout();
        router.push("/");
        toast.success("Security session terminated");
    };

    if (!user) {
        router.push("/");
        return null;
    }

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
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">System Configuration</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Preferences</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide pb-32">
                <div className="flex flex-col gap-10">

                    {/* Identity Section */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Digital Identity</p>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-full">Edit Profile</button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(false)} className="text-[10px] font-black uppercase tracking-widest text-rose-500">Cancel</button>
                                    <button onClick={handleSaveProfile} className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Confirm</button>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-white">
                            <div className="flex items-center gap-5">
                                <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 relative group overflow-hidden">
                                    <User size={32} className="text-slate-300" />
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2">
                                            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-xl bg-slate-50 border-none font-bold placeholder:text-slate-300" placeholder="Display Name" />
                                            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-10 rounded-xl bg-slate-50 border-none font-bold placeholder:text-slate-300" placeholder="Mobile Secret" />
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">{user.name}</h3>
                                            <p className="text-xs font-bold text-slate-400 tracking-tighter mb-1">+{user.mobile}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[9px] font-black uppercase text-primary tracking-widest">{user.role}</span>
                                                {user.employeeId && <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[9px] font-black uppercase text-emerald-600 tracking-widest">ID: {user.employeeId}</span>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Operational Settings */}
                    <section className="flex flex-col gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Operational Controls</p>
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden divide-y divide-slate-50">

                            {/* Booking Notifications */}
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                        <Bell size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Job Alerts</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Real-time status updates</p>
                                    </div>
                                </div>
                                <Switch checked={bookingNotify} onCheckedChange={setBookingNotify} />
                            </div>

                            {/* Location Preferences */}
                            <div className="p-5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Base Station</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Primary service area</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md">{location.split(',')[0]}</p>
                                </div>
                                <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-full h-12 rounded-2xl bg-slate-50 border-none font-black text-xs text-slate-700">
                                        <SelectValue placeholder="Relocate Area" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                        {cities.map(city => (
                                            <SelectItem key={city} value={city} className="font-bold text-xs py-3">{city}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Dark Mode */}
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">Dark Mode</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Switch visual theme</p>
                                    </div>
                                </div>
                                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                            </div>

                            {/* Payment Systems */}
                            <button className="w-full p-5 flex items-center justify-between group active:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">Payment Hub</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Manage cards & wallet</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </section>

                    {/* Security Vector */}
                    <section className="flex flex-col gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Security Vector</p>
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden divide-y divide-slate-50">

                            <button onClick={handleLogout} className="w-full p-5 flex items-center justify-between group active:bg-rose-50 transition-colors text-rose-500">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
                                        <LogOut size={18} />
                                    </div>
                                    <p className="text-sm font-black">Terminate Session</p>
                                </div>
                                <ChevronRight size={16} className="text-rose-200" />
                            </button>

                            <button className="w-full p-5 flex items-center justify-between group opacity-30 cursor-not-allowed">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                        <Trash2 size={18} />
                                    </div>
                                    <p className="text-sm font-black">Decommission Account</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    <div className="flex flex-col items-center gap-2 pt-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                            <Globe size={10} className="text-slate-400" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 underline decoration-slate-300">Privacy Policy</span>
                            <span className="text-slate-200 text-[8px]">|</span>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 underline decoration-slate-300">Terms</span>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">ServiceHub Alpha 1.0.8</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
