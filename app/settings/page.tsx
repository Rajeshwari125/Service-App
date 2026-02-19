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
    X
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

export default function SettingsPage() {
    const { user, logout, updateUser } = useAuth();
    const router = useRouter();

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
        toast.success("Profile updated successfully!");
    };

    const handleLogout = () => {
        logout();
        router.push("/");
        toast.success("Logged out successfully");
    };

    const handleDeleteAccount = () => {
        toast.error("Delete account functionality is not available in demo.");
    };

    if (!user) {
        router.push("/");
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-background pb-10">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-3 px-4 py-3">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-bold">Settings</h1>
                </div>
            </header>

            <main className="flex-1 space-y-6 p-4">
                {/* Profile Section */}
                <section>
                    <div className="mb-2 flex items-center justify-between px-1">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Profile</h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1 text-xs font-bold text-primary"
                            >
                                <Edit2 size={12} /> Edit
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setName(user.name);
                                        setMobile(user.mobile);
                                        setIsEditing(false);
                                    }}
                                    className="text-xs font-bold text-muted-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex items-center gap-1 text-xs font-bold text-primary"
                                >
                                    <Check size={14} /> Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div className="p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User size={32} />
                                </div>
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="h-8 text-sm"
                                                placeholder="Full Name"
                                            />
                                            <Input
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                className="h-8 text-sm"
                                                placeholder="Mobile Number"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="font-bold text-foreground">{user.name}</h3>
                                            <p className="text-sm text-muted-foreground">{user.mobile}</p>
                                            <div className="mt-1 flex gap-2">
                                                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                                                    {user.role}
                                                </span>
                                                {user.employeeId && (
                                                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                                                        ID: {user.employeeId}
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications Section */}
                <section>
                    <h2 className="mb-2 px-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notifications</h2>
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div className="divide-y divide-border">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                        <Bell size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Booking Updates</p>
                                        <p className="text-xs text-muted-foreground">Notify about status changes</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={bookingNotify}
                                    onCheckedChange={setBookingNotify}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                        <Bell size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Promotional</p>
                                        <p className="text-xs text-muted-foreground">Offers and new services</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={promoNotify}
                                    onCheckedChange={setPromoNotify}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Location Section */}
                <section>
                    <h2 className="mb-2 px-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Location</h2>
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Service Location</p>
                                <p className="text-xs text-muted-foreground">Currently showing services in {location.split(',')[0]}</p>
                            </div>
                        </div>
                        <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger className="w-full rounded-xl">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {cities.map(city => (
                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </section>

                {/* Security Section */}
                <section>
                    <h2 className="mb-2 px-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Security & account</h2>
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div className="divide-y divide-border">
                            <button
                                onClick={() => router.push("/settings/change-password")}
                                className="flex w-full items-center justify-between p-4 transition-colors hover:bg-secondary/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                        <Shield size={18} />
                                    </div>
                                    <p className="text-sm font-medium">Change Password</p>
                                </div>
                                <ChevronRight size={16} className="text-muted-foreground" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center justify-between p-4 transition-colors hover:bg-secondary/20"
                            >
                                <div className="flex items-center gap-3 text-red-600">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">
                                        <LogOut size={18} />
                                    </div>
                                    <p className="text-sm font-medium">Logout</p>
                                </div>
                                <ChevronRight size={16} className="text-muted-foreground" />
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex w-full items-center justify-between p-4 transition-colors hover:bg-secondary/20"
                            >
                                <div className="flex items-center gap-3 text-red-600/50">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                                        <Trash2 size={18} />
                                    </div>
                                    <p className="text-sm font-medium">Delete Account</p>
                                </div>
                                <ChevronRight size={16} className="text-muted-foreground/30" />
                            </button>
                        </div>
                    </div>
                </section>

                <div className="pt-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">ServiceHub v1.0.4</p>
                </div>
            </main>
        </div>
    );
}
