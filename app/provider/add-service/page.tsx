"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { toast } from "sonner";

export default function AddServicePage() {
    const { user } = useAuth();
    const { addService } = useData();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        price: "",
        priceUnit: "visit",
        description: "",
        location: "Madurai, India",
        image: "https://images.unsplash.com/photo-1581578731117-104f2a417954?q=80&w=400&h=300&auto=format&fit=crop",
        availability: "Available Now"
    });

    const categories = [
        "Plumbing",
        "Electrician",
        "Cleaning",
        "Painting",
        "AC Service",
        "Moving"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.category || !formData.price || !formData.description) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!user) {
            toast.error("You must be logged in as a provider");
            return;
        }

        setLoading(true);

        // Simulate network
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            addService({
                providerId: user.id,
                providerName: user.name,
                title: formData.title,
                category: formData.category.toLowerCase(),
                price: parseFloat(formData.price),
                priceUnit: formData.priceUnit,
                description: formData.description,
                location: formData.location,
                image: formData.image,
                availability: formData.availability
            });

            toast.success("Service added successfully!");
            router.push("/");
        } catch (error) {
            toast.error("Failed to add service");
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-lg font-bold">Add New Service</h1>
                </div>
            </header>

            <main className="p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Service Title *</label>
                            <Input
                                placeholder="e.g. Professional AC Deep Cleaning"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="rounded-xl h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Category *</label>
                            <Select
                                value={formData.category}
                                onValueChange={val => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Price (₹) *</label>
                                <Input
                                    type="number"
                                    placeholder="500"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Unit *</label>
                                <Select
                                    value={formData.priceUnit}
                                    onValueChange={val => setFormData({ ...formData, priceUnit: val })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="visit">Per Visit</SelectItem>
                                        <SelectItem value="hour">Per Hour</SelectItem>
                                        <SelectItem value="day">Per Day</SelectItem>
                                        <SelectItem value="sqft">Per Sq. Ft.</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Description *</label>
                            <Textarea
                                placeholder="Describe what's included in your service..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                                className="rounded-xl min-h-[120px] resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Location</label>
                            <Input
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="rounded-xl h-11"
                            />
                        </div>
                    </div>

                    {/* Image Helper */}
                    <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-6 text-center">
                        <ImageIcon className="mx-auto mb-2 text-muted-foreground/40" size={32} />
                        <p className="text-sm font-medium text-muted-foreground">Service Photo</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Default demo image is selected.</p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                "List Service"
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
