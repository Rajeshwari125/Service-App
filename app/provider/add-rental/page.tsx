"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
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

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400&h=300&auto=format&fit=crop";

export default function AddRentalPage() {
    const { user } = useAuth();
    const { addRental } = useData();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFileName, setImageFileName] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        priceUnit: "day",
        durationUnit: "day",
        description: "",
        image: DEFAULT_IMAGE,
        isAvailable: true,
    });

    const categories = [
        "Vehicles",
        "Tools & Equipment",
        "Electronics",
        "Furniture",
        "Party & Events",
        "Sports & Recreation",
        "Cameras & Photography",
        "Musical Instruments",
        "Others",
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
            setFormData(prev => ({ ...prev, image: dataUrl }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFileName("");
        setFormData(prev => ({ ...prev, image: DEFAULT_IMAGE }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.category || !formData.price || !formData.description) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!user) {
            toast.error("You must be logged in as a provider");
            return;
        }

        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            addRental({
                providerId: user.id,
                providerName: user.name,
                name: formData.name,
                category: formData.category.toLowerCase(),
                price: parseFloat(formData.price),
                priceUnit: formData.priceUnit,
                description: formData.description,
                image: formData.image,
                durationUnit: formData.durationUnit,
                isAvailable: formData.isAvailable,
            });

            toast.success("Rental listed successfully!");
            router.push("/");
        } catch (error) {
            toast.error("Failed to list rental");
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
                    <h1 className="text-lg font-bold">List New Rental</h1>
                </div>
            </header>

            <main className="p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Rental Item Name *</label>
                            <Input
                                placeholder="e.g. Mahindra Thar 4x4, Power Drill, DSLR Camera"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                                <label className="text-sm font-bold text-foreground">Duration *</label>
                                <Select
                                    value={formData.durationUnit}
                                    onValueChange={val => setFormData({ ...formData, durationUnit: val, priceUnit: val })}
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
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                                className="rounded-xl min-h-[120px] resize-none"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Rental Photo</label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="rental-image-upload"
                        />

                        {imagePreview ? (
                            <div className="relative rounded-2xl border border-border overflow-hidden bg-secondary/20">
                                <img
                                    src={imagePreview}
                                    alt="Rental preview"
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
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                                        <Upload size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Upload Rental Photo</p>
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
                            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                "List Rental"
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
