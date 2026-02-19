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
            addBooking({
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
                <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[90%] flex-col rounded-t-[10px] bg-background outline-none">
                    <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-background p-4">
                        {/* Handle */}
                        <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />

                        <div className="mx-auto max-w-md">
                            <Drawer.Title className="mb-4 text-xl font-bold">
                                Book Service
                            </Drawer.Title>

                            {/* Service Summary */}
                            <div className="mb-6 rounded-xl border border-border bg-card p-4">
                                <h3 className="font-semibold">{service.title}</h3>
                                <p className="text-sm text-muted-foreground">by {service.providerName}</p>
                                <div className="mt-2 flex justify-between text-sm">
                                    <span className="font-medium">Total Amount:</span>
                                    <span className="font-bold text-primary">₹{service.price}</span>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">Select Date</label>
                                <div className="rounded-xl border border-border p-3">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        className="mx-auto rounded-md border-none"
                                    />
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="mb-8">
                                <label className="mb-2 block text-sm font-medium">Select Time</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setTime(slot)}
                                            className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${time === slot
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-input hover:bg-accent hover:text-accent-foreground"
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sticky Bottom Actions */}
                            <div className=" pb-8">
                                <Button
                                    className="w-full rounded-xl py-6 text-lg font-bold"
                                    onClick={handleBooking}
                                    disabled={loading || !date || !time}
                                >
                                    {loading ? "Confirming..." : "Confirm Booking"}
                                </Button>
                                <p className="mt-3 text-center text-xs text-muted-foreground">
                                    No payment required now. Pay after service.
                                </p>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
