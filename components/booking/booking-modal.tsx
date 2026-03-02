"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useData, type Service } from "@/lib/data-context";
import { CalendarIcon, Clock } from "lucide-react";

interface BookingModalProps {
    service: Service | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BookingModal({ service, open, onOpenChange }: BookingModalProps) {
    const { user } = useAuth();
    const { addBooking } = useData();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // Time slots
    const timeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM",
        "03:00 PM", "04:00 PM", "05:00 PM",
        "06:00 PM", "07:00 PM"
    ];

    const handleBooking = async () => {
        if (!user) {
            toast.error("Please login to book a service");
            return;
        }
        if (!service || !date || !time) {
            toast.error("Please select date and time");
            return;
        }

        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            await addBooking({
                serviceId: service.id,
                serviceTitle: service.title,
                customerId: user.id,
                customerName: user.name,
                providerId: service.providerId,
                providerName: service.providerName,
                date: format(date, "dd MMM, yyyy"),
                time: time,
                amount: service.price,
                type: "service"
            });

            toast.success("Booking Request Sent!", {
                description: "The provider will confirm your slot shortly."
            });

            onOpenChange(false);
            // Reset
            setDate(new Date());
            setTime("");
        } catch (error) {
            toast.error("Failed to book service");
        } finally {
            setLoading(false);
        }
    };

    if (!service) return null;

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
                                    Book Service
                                </Drawer.Title>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select your preferred slot</p>
                            </div>

                            {/* Service Summary */}
                            <div className="mb-8 rounded-3xl border border-slate-100 bg-slate-50/50 p-5 shadow-sm">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-black text-slate-900">{service.title}</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-0.5">by {service.providerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Amount</p>
                                        <p className="text-xl font-black text-primary">₹{service.price}</p>
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
                                    {loading ? "Confirming..." : "Confirm Booking"}
                                </Button>
                                <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Pay after service
                                </p>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
