"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft, Check, ChevronRight, Clock, MapPin,
    Shield, Star, Tag, CreditCard, Wallet, Banknote,
    User, Phone, Calendar, AlertCircle, Zap, Package
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { toast } from "sonner";

const TIME_SLOTS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
];

const PAYMENT_METHODS = [
    { id: "upi", label: "UPI / GPay / PhonePe", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "card", label: "Credit / Debit Card", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "wallet", label: "Wallet", icon: Wallet, color: "text-purple-600", bg: "bg-purple-50" },
    { id: "cod", label: "Cash on Service", icon: Banknote, color: "text-amber-600", bg: "bg-amber-50" },
];

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { addBooking } = useData();

    // Read item info from query params (passed when "Book Now" is clicked)
    const itemName = searchParams.get("name") || "Pipe Leak Repair";
    const itemPrice = Number(searchParams.get("price") || 350);
    const itemProvider = searchParams.get("provider") || "Kumar Plumbing Works";
    const itemCategory = searchParams.get("category") || "Plumbing";
    const itemType = (searchParams.get("type") || "service") as "service" | "rental";
    const itemRating = searchParams.get("rating") || "4.8";
    const itemImage = searchParams.get("image") || "";
    const itemId = searchParams.get("id") || "static-1";
    const providerId = searchParams.get("providerId") || "prov1";
    const priceUnit = searchParams.get("priceUnit") || "visit";

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [address, setAddress] = useState(user?.name ? "" : "");
    const [addressText, setAddressText] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [notes, setNotes] = useState("");
    const [isPlacing, setIsPlacing] = useState(false);
    const [step, setStep] = useState(1); // 1=Details, 2=Payment, 3=Success

    const discount = couponApplied ? Math.floor(itemPrice * 0.1) : 0;
    const gst = Math.floor((itemPrice - discount) * 0.18);
    const total = itemPrice - discount + gst;

    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        return d;
    });

    const handleCoupon = () => {
        if (coupon.toUpperCase() === "SAVE10" || coupon.toUpperCase() === "FIRST10") {
            setCouponApplied(true);
            toast.success("Coupon applied! 10% off 🎉");
        } else {
            toast.error("Invalid coupon code");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedDate) { toast.error("Please select a date"); return; }
        if (!selectedSlot) { toast.error("Please select a time slot"); return; }
        if (!addressText.trim()) { toast.error("Please enter your address"); return; }
        setIsPlacing(true);
        await new Promise((r) => setTimeout(r, 1800));
        await addBooking({
            customerId: user?.id || "",
            customerName: user?.name || "",
            serviceId: itemId,
            serviceTitle: itemName,
            providerId,
            providerName: itemProvider,
            date: selectedDate,
            time: selectedSlot,
            status: "Pending",
            amount: total,
            type: itemType,
            address: addressText,
            notes,
        } as any);
        setIsPlacing(false);
        setStep(3);
    };

    // ─── SUCCESS SCREEN ───
    if (step === 3) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 px-6 animate-fade-in">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6 text-center">
                    <div className="h-24 w-24 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30">
                        <Check size={44} className="text-white" strokeWidth={3} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Booking Confirmed!</h2>
                        <p className="text-sm text-white/70 mt-2 leading-relaxed">
                            Your {itemType === "rental" ? "rental" : "service"} has been booked.<br />
                            The provider will confirm your slot shortly.
                        </p>
                    </div>
                    <div className="w-full bg-white/15 backdrop-blur-md rounded-3xl p-5 border border-white/20 flex flex-col gap-3 text-left">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white/60 uppercase tracking-wider">Service</span>
                            <span className="text-sm font-black text-white">{itemName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white/60 uppercase tracking-wider">Date</span>
                            <span className="text-sm font-black text-white">{selectedDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white/60 uppercase tracking-wider">Time</span>
                            <span className="text-sm font-black text-white">{selectedSlot}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/20 pt-3">
                            <span className="text-xs font-black text-white/60 uppercase tracking-wider">Total Paid</span>
                            <span className="text-lg font-black text-white">₹{total}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={() => router.push("/orders")}
                            className="w-full py-4 rounded-2xl bg-white text-emerald-600 text-sm font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                        >
                            Track Booking
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full py-4 rounded-2xl bg-white/20 text-white text-sm font-black uppercase tracking-widest border border-white/30 active:scale-95 transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-slate-50 animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="bg-white px-4 pt-10 pb-4 border-b border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => step === 2 ? setStep(1) : router.back()}
                        className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 active:scale-90 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-base font-black text-slate-900 tracking-tight">Checkout</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {step === 1 ? "Step 1 of 2 — Booking Details" : "Step 2 of 2 — Payment"}
                        </p>
                    </div>
                    {/* Step indicator */}
                    <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-8 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-slate-200"}`} />
                        <div className={`h-2 w-8 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-slate-200"}`} />
                    </div>
                </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {/* Item Summary Card */}
                <div className="mx-4 mt-4 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className={`h-24 w-full relative overflow-hidden ${itemImage ? "" : "bg-gradient-to-br from-primary/20 via-blue-100 to-indigo-100"}`}>
                        {itemImage ? (
                            <img src={itemImage} alt={itemName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Package size={36} className="text-primary/30" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                            <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1">
                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] font-black text-slate-700">{itemRating}</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${itemType === "service" ? "bg-blue-500/80 text-white" : "bg-emerald-500/80 text-white"}`}>
                                {itemType}
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{itemCategory} • {itemProvider}</p>
                        <h2 className="text-lg font-black text-slate-900 leading-tight">{itemName}</h2>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                <Shield size={11} className="text-emerald-500" />
                                <span className="text-emerald-600 font-black">Verified Provider</span>
                            </div>
                            <div>
                                <span className="text-xl font-black text-slate-900">₹{itemPrice}</span>
                                <span className="text-[10px] text-slate-400 font-bold ml-1">/{priceUnit}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {step === 1 ? (
                    <div className="px-4 py-4 flex flex-col gap-4 pb-32">
                        {/* Date Picker */}
                        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Calendar size={15} className="text-primary" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900">Select Date</h3>
                            </div>
                            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                                {dates.map((d) => {
                                    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
                                    const day = d.getDate();
                                    const month = d.toLocaleDateString("en-IN", { month: "short" });
                                    const value = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                                    const isToday = d.toDateString() === today.toDateString();
                                    const selected = selectedDate === value;
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => setSelectedDate(value)}
                                            className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border transition-all active:scale-95 ${selected
                                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                                                    : "bg-slate-50 text-slate-700 border-slate-100 hover:border-primary/30"
                                                }`}
                                        >
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${selected ? "text-white/70" : "text-slate-400"}`}>
                                                {isToday ? "Today" : label}
                                            </span>
                                            <span className="text-lg font-black leading-none">{day}</span>
                                            <span className={`text-[9px] font-black ${selected ? "text-white/70" : "text-slate-400"}`}>{month}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Time Slots */}
                        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <Clock size={15} className="text-amber-500" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900">Select Time Slot</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {TIME_SLOTS.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-2.5 px-3 rounded-2xl border text-xs font-black transition-all active:scale-95 ${selectedSlot === slot
                                                ? "bg-primary text-white border-primary shadow-md"
                                                : "bg-slate-50 text-slate-700 border-slate-100"
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Address */}
                        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center">
                                    <MapPin size={15} className="text-rose-500" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900">Service Address</h3>
                            </div>
                            <textarea
                                value={addressText}
                                onChange={(e) => setAddressText(e.target.value)}
                                placeholder="Enter your full address with landmark..."
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none focus:border-primary/40 transition-colors"
                            />
                        </section>

                        {/* Customer Details */}
                        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <User size={15} className="text-blue-500" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900">Your Details</h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                                    <User size={14} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">{user?.name || "Guest User"}</span>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                                    <Phone size={14} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">+91 {user?.mobile || "—"}</span>
                                </div>
                            </div>
                        </section>

                        {/* Special Notes */}
                        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center">
                                    <AlertCircle size={15} className="text-slate-500" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900">Special Instructions</h3>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider ml-auto">Optional</span>
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any specific notes for the service provider..."
                                rows={2}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none focus:border-primary/40 transition-colors"
                            />
                        </section>
                    </div>
                ) : (
                    <div className="px-4 py-4 flex flex-col gap-4 pb-32">
                        {/* Coupon */}
                        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <Tag size={15} className="text-orange-500" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900">Promo Code</h3>
                            </div>
                            {couponApplied ? (
                                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                                    <Check size={16} className="text-emerald-500 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-emerald-700">{coupon.toUpperCase()} Applied!</p>
                                        <p className="text-[10px] font-bold text-emerald-500">You saved ₹{discount}</p>
                                    </div>
                                    <button onClick={() => { setCouponApplied(false); setCoupon(""); }} className="text-emerald-400 text-[10px] font-black uppercase">Remove</button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        placeholder="SAVE10 or FIRST10"
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:border-primary/40 uppercase"
                                    />
                                    <button
                                        onClick={handleCoupon}
                                        className="px-5 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-wider active:scale-95 transition-all"
                                    >
                                        Apply
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* Price Breakdown */}
                        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <h3 className="text-sm font-black text-slate-900 mb-4">Price Breakdown</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold text-slate-600">{itemName}</span>
                                    <span className="font-black text-slate-900">₹{itemPrice}</span>
                                </div>
                                {couponApplied && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-bold text-emerald-600">Discount (10%)</span>
                                        <span className="font-black text-emerald-600">-₹{discount}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold text-slate-400">GST (18%)</span>
                                    <span className="font-black text-slate-600">₹{gst}</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-base font-black text-slate-900">Total</span>
                                    <span className="text-xl font-black text-primary">₹{total}</span>
                                </div>
                            </div>
                        </section>

                        {/* Payment Methods */}
                        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <CreditCard size={15} className="text-blue-500" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900">Payment Method</h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                {PAYMENT_METHODS.map((method) => {
                                    const Icon = method.icon;
                                    const selected = paymentMethod === method.id;
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all active:scale-[0.98] ${selected ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50"
                                                }`}
                                        >
                                            <div className={`h-9 w-9 rounded-xl ${method.bg} flex items-center justify-center flex-shrink-0`}>
                                                <Icon size={16} className={method.color} />
                                            </div>
                                            <span className={`flex-1 text-sm font-black text-left ${selected ? "text-slate-900" : "text-slate-600"}`}>
                                                {method.label}
                                            </span>
                                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "border-primary" : "border-slate-200"
                                                }`}>
                                                {selected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-6 py-2">
                            {["Secure Payment", "2hr Cancellation", "Verified Provider"].map((badge) => (
                                <div key={badge} className="flex flex-col items-center gap-1">
                                    <Shield size={16} className="text-emerald-500" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider text-center leading-tight">{badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Footer CTA */}
            <div className="bg-white border-t border-slate-100 px-4 py-4 pb-8 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total</p>
                        <p className="text-xl font-black text-slate-900">₹{total}</p>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">{couponApplied ? `Saved ₹${discount}` : "Use code SAVE10"}</p>
                </div>
                <button
                    onClick={() => {
                        if (step === 1) {
                            if (!selectedDate) { toast.error("Please select a date"); return; }
                            if (!selectedSlot) { toast.error("Please select a time slot"); return; }
                            if (!addressText.trim()) { toast.error("Please enter your address"); return; }
                            setStep(2);
                        } else {
                            handlePlaceOrder();
                        }
                    }}
                    disabled={isPlacing}
                    className="w-full py-4 rounded-2xl bg-primary text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isPlacing ? (
                        <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Processing...
                        </>
                    ) : step === 1 ? (
                        <>Continue to Payment <ChevronRight size={16} /></>
                    ) : (
                        <>Confirm Booking — ₹{total}</>
                    )}
                </button>
            </div>
        </div>
    );
}
