"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useData, type Rental } from "@/lib/data-context";
import { CalendarIcon, Clock, Package } from "lucide-react";

interface RentalBookingModalProps {
    rental: Rental | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RentalBookingModal({ rental, open, onOpenChange }: RentalBookingModalProps) {
    const { user } = useAuth();
    const { addBooking } = useData();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const timeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM",
        "03:00 PM", "04:00 PM", "05:00 PM",
        "06:00 PM", "07:00 PM"
    ];

    const handleBooking = async () => {
        if (!user) {
            toast.error("Please login to book a rental");
            return;
        }
        if (!rental || !date || !time) {
            toast.error("Please select date and time");
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            await addBooking({
                serviceId: rental.id,
                serviceTitle: rental.name,
                customerId: user.id,
                customerName: user.name,
                providerId: rental.providerId,
                providerName: rental.providerName,
                date: format(date, "dd MMM, yyyy"),
                time: time,
                amount: rental.price,
                type: "rental"
            });

            toast.success("Rental Booking Sent!", {
                description: "The provider will confirm your rental shortly."
            });

            onOpenChange(false);
            setDate(new Date());
            setTime("");
        } catch (error) {
            toast.error("Failed to book rental");
        } finally {
            setLoading(false);
        }
    };

    if (!rental) return null;

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[85%] flex-col rounded-t-[2.5rem] bg-background outline-none shadow-2xl">
                    <div className="flex-1 overflow-y-auto rounded-t-[2.5rem] bg-background p-6 scrollbar-hide">
                        {/* Handle */}
                        <div className="mx-auto mb-6 h-1 w-12 flex-shrink-0 rounded-full bg-slate-200" />

                        <div className="mx-auto max-w-md">
                            <div className="text-center mb-8">
                                <Drawer.Title className="text-2xl font-black text-slate-900 tracking-tight">
                                    Rent Item
                                </Drawer.Title>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select your preferred slot</p>
                            </div>

                            {/* Rental Summary */}
                            <div className="mb-8 rounded-3xl border border-slate-100 bg-slate-50/50 p-5 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
                                        <Package size={22} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-slate-900 leading-tight">{rental.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-1">by {rental.providerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Rate</p>
                                        <p className="text-lg font-black text-primary">₹{rental.price}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <CalendarIcon size={16} className="text-primary" />
                                    </div>
                                    <label className="text-sm font-black text-slate-900">Select Date</label>
                                </div>
                                <div className="rounded-3xl border border-slate-100 p-4 bg-white shadow-sm overflow-hidden">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        className="mx-auto rounded-md border-none scale-95 origin-center"
                                    />
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
                                        <Clock size={16} className="text-amber-500" />
                                    </div>
                                    <label className="text-sm font-black text-slate-900">Select Time</label>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setTime(slot)}
                                            className={`rounded-xl border py-3 text-[11px] font-black transition-all active:scale-95 ${time === slot
                                                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                                                : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sticky Bottom Actions */}
                            <div className="pb-12 text-center">
                                <Button
                                    className="w-full rounded-2xl py-7 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                                    onClick={handleBooking}
                                    disabled={loading || !date || !time}
                                >
                                    {loading ? "Confirming..." : "Confirm Rental"}
                                </Button>
                                <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Pay at pickup
                                </p>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
