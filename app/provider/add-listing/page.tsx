"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload, X, Briefcase, Package } from "lucide-react";
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

const DEFAULT_SERVICE_IMAGE = "https://images.unsplash.com/photo-1581578731117-104f2a417954?q=80&w=400&h=300&auto=format&fit=crop";
const DEFAULT_RENTAL_IMAGE = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400&h=300&auto=format&fit=crop";

export default function AddListingPage() {
    const { user } = useAuth();
    const { addService, addRental } = useData();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"service" | "rental">("service");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFileName, setImageFileName] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Service form
    const [serviceForm, setServiceForm] = useState({
        title: "",
        category: "",
        price: "",
        priceUnit: "hour",
        description: "",
        location: "Madurai, India",
        image: DEFAULT_SERVICE_IMAGE,
    });

    // Rental form
    const [rentalForm, setRentalForm] = useState({
        name: "",
        category: "",
        price: "",
        durationUnit: "day",
        description: "",
        image: DEFAULT_RENTAL_IMAGE,
    });

    const serviceCategories = [
        "Plumbing", "Electrical", "Cleaning", "Painting",
        "Carpentry", "AC Repair", "Appliance Repair", "Others",
    ];

    const rentalCategories = [
        "Vehicles", "Tools & Equipment", "Electronics", "Furniture",
        "Party & Events", "Sports & Recreation", "Cameras & Photography",
        "Musical Instruments", "Others",
    ];

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setImageFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setImagePreview(dataUrl);
            if (activeTab === "service") {
                setServiceForm(prev => ({ ...prev, image: dataUrl }));
            } else {
                setRentalForm(prev => ({ ...prev, image: dataUrl }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFileName("");
        if (activeTab === "service") {
            setServiceForm(prev => ({ ...prev, image: DEFAULT_SERVICE_IMAGE }));
        } else {
            setRentalForm(prev => ({ ...prev, image: DEFAULT_RENTAL_IMAGE }));
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleTabSwitch = (tab: "service" | "rental") => {
        setActiveTab(tab);
        setImagePreview(null);
        setImageFileName("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in");
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            if (activeTab === "service") {
                if (!serviceForm.title || !serviceForm.category || !serviceForm.price || !serviceForm.description) {
                    toast.error("Please fill all required fields");
                    setLoading(false);
                    return;
                }
                await addService({
                    title: serviceForm.title,
                    providerId: user.id,
                    providerName: user.name,
                    category: serviceForm.category.toLowerCase(),
                    price: parseFloat(serviceForm.price),
                    priceUnit: serviceForm.priceUnit,
                    description: serviceForm.description,
                    location: serviceForm.location,
                    image: serviceForm.image,
                    availability: "Available",
                });
                toast.success("Service added successfully!");
            } else {
                if (!rentalForm.name || !rentalForm.category || !rentalForm.price || !rentalForm.description) {
                    toast.error("Please fill all required fields");
                    setLoading(false);
                    return;
                }
                await addRental({
                    providerId: user.id,
                    providerName: user.name,
                    name: rentalForm.name,
                    category: rentalForm.category.toLowerCase(),
                    price: parseFloat(rentalForm.price),
                    priceUnit: rentalForm.durationUnit,
                    description: rentalForm.description,
                    image: rentalForm.image,
                    durationUnit: rentalForm.durationUnit,
                    isAvailable: true,
                });
                toast.success("Rental listed successfully!");
            }
            router.push("/");
        } catch (error) {
            toast.error("Failed to add listing");
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
                    <h1 className="text-lg font-bold">Add New Listing</h1>
                </div>
            </header>

            <main className="p-4">
                {/* Tab Switcher */}
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl mb-6">
                    <button
                        type="button"
                        onClick={() => handleTabSwitch("service")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "service"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <Briefcase size={16} />
                        Service
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabSwitch("rental")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "rental"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <Package size={16} />
                        Rental
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Form */}
                    {activeTab === "service" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Service Title *</label>
                                <Input
                                    placeholder="e.g. AC Deep Cleaning, Plumbing Repair"
                                    value={serviceForm.title}
                                    onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                                    required
                                    className="rounded-xl h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Category *</label>
                                <Select
                                    value={serviceForm.category}
                                    onValueChange={val => setServiceForm({ ...serviceForm, category: val })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {serviceCategories.map(cat => (
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
                                        value={serviceForm.price}
                                        onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })}
                                        required
                                        className="rounded-xl h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground">Per *</label>
                                    <Select
                                        value={serviceForm.priceUnit}
                                        onValueChange={val => setServiceForm({ ...serviceForm, priceUnit: val })}
                                    >
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="hour">Per Hour</SelectItem>
                                            <SelectItem value="visit">Per Visit</SelectItem>
                                            <SelectItem value="unit">Per Unit</SelectItem>
                                            <SelectItem value="sqft">Per Sq.ft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Location *</label>
                                <Input
                                    placeholder="e.g. Anna Nagar, Madurai"
                                    value={serviceForm.location}
                                    onChange={e => setServiceForm({ ...serviceForm, location: e.target.value })}
                                    required
                                    className="rounded-xl h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Description *</label>
                                <Textarea
                                    placeholder="Describe your service, what you offer, experience..."
                                    value={serviceForm.description}
                                    onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                                    required
                                    className="rounded-xl min-h-[100px] resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Rental Form */}
                    {activeTab === "rental" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Rental Item Name *</label>
                                <Input
                                    placeholder="e.g. Mahindra Thar 4x4, Power Drill, DSLR Camera"
                                    value={rentalForm.name}
                                    onChange={e => setRentalForm({ ...rentalForm, name: e.target.value })}
                                    required
                                    className="rounded-xl h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Category *</label>
                                <Select
                                    value={rentalForm.category}
                                    onValueChange={val => setRentalForm({ ...rentalForm, category: val })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {rentalCategories.map(cat => (
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
                                        value={rentalForm.price}
                                        onChange={e => setRentalForm({ ...rentalForm, price: e.target.value })}
                                        required
                                        className="rounded-xl h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground">Duration *</label>
                                    <Select
                                        value={rentalForm.durationUnit}
                                        onValueChange={val => setRentalForm({ ...rentalForm, durationUnit: val })}
                                    >
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue placeholder="Duration" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="hour">Per Hour</SelectItem>
                                            <SelectItem value="day">Per Day</SelectItem>
                                            <SelectItem value="week">Per Week</SelectItem>
                                            <SelectItem value="month">Per Month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Description *</label>
                                <Textarea
                                    placeholder="Describe the rental item, its condition, and what's included..."
                                    value={rentalForm.description}
                                    onChange={e => setRentalForm({ ...rentalForm, description: e.target.value })}
                                    required
                                    className="rounded-xl min-h-[100px] resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Image Upload (shared) */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Photo</label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="listing-image-upload"
                        />

                        {imagePreview ? (
                            <div className="relative rounded-2xl border border-border overflow-hidden bg-secondary/20">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="px-4 py-3 bg-background/80 backdrop-blur-sm">
                                    <p className="text-sm font-medium text-foreground truncate">{imageFileName}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Tap to change image</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 cursor-pointer"
                                    style={{ background: "transparent", border: "none" }}
                                    aria-label="Change image"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors z-10"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full rounded-2xl border-2 border-dashed border-border bg-secondary/20 p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/40 transition-all duration-200 group"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${activeTab === "service"
                                        ? "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20"
                                        : "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20"
                                        }`}>
                                        <Upload size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Upload {activeTab === "service" ? "Service" : "Rental"} Photo
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Tap to select from your folder
                                        </p>
                                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                                            JPG, PNG, WebP • Max 5MB
                                        </p>
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            className={`w-full h-14 rounded-2xl text-lg font-bold shadow-lg ${activeTab === "service"
                                ? "bg-primary hover:bg-primary/90"
                                : "bg-emerald-600 hover:bg-emerald-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                activeTab === "service" ? "Add Service" : "List Rental"
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
