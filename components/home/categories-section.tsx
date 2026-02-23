"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Wrench,
  Paintbrush,
  Zap,
  Droplets,
  ShieldCheck,
  Truck,
  Car,
  Bike,
  Construction,
  Projector,
  Tent,
  Camera,
  Sparkles,
  Wind,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Category {
  name: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  type: "service" | "rental";
}

const popularCategories: Category[] = [
  { name: "Plumbing", icon: Droplets, color: "text-[#3182ce]", bg: "bg-[#ebf4ff]", type: "service" },
  { name: "Electrician", icon: Zap, color: "text-[#d69e2e]", bg: "bg-[#fefcbf]", type: "service" },
  { name: "Car Rental", icon: Car, color: "text-rose-600", bg: "bg-rose-50", type: "rental" },
  { name: "Cleaning", icon: Sparkles, color: "text-[#38a169]", bg: "bg-[#f0fff4]", type: "service" },
];

const serviceCategories: Category[] = [
  { name: "Plumbing", icon: Droplets, color: "text-[#3182ce]", bg: "bg-[#ebf4ff]", type: "service" },
  { name: "Electrician", icon: Zap, color: "text-[#d69e2e]", bg: "bg-[#fefcbf]", type: "service" },
  { name: "Cleaning", icon: Sparkles, color: "text-[#38a169]", bg: "bg-[#f0fff4]", type: "service" },
  { name: "Painting", icon: Paintbrush, color: "text-[#e53e3e]", bg: "bg-[#fff5f5]", type: "service" },
  { name: "Repairs", icon: Wrench, color: "text-[#718096]", bg: "bg-[#f7fafc]", type: "service" },
  { name: "AC Service", icon: Wind, color: "text-[#319795]", bg: "bg-[#e6fffa]", type: "service" },
  { name: "Security", icon: ShieldCheck, color: "text-[#553c9a]", bg: "bg-[#faf5ff]", type: "service" },
  { name: "Moving", icon: Truck, color: "text-[#c05621]", bg: "bg-[#fffaf0]", type: "service" },
  { name: "Interior", icon: Home, color: "text-[#b83280]", bg: "bg-[#fff5f7]", type: "service" },
];

const rentalCategories: Category[] = [
  { name: "Cars", icon: Car, color: "text-blue-600", bg: "bg-blue-50", type: "rental" },
  { name: "Bikes", icon: Bike, color: "text-emerald-600", bg: "bg-emerald-50", type: "rental" },
  { name: "Tools", icon: Construction, color: "text-orange-600", bg: "bg-orange-50", type: "rental" },
  { name: "AV/Events", icon: Projector, color: "text-purple-600", bg: "bg-purple-50", type: "rental" },
  { name: "Camping", icon: Tent, color: "text-amber-600", bg: "bg-amber-50", type: "rental" },
  { name: "Cameras", icon: Camera, color: "text-slate-600", bg: "bg-slate-50", type: "rental" },
];

function CategoryItem({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <Link
      href={`/browse/${category.type}/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
      className="flex min-w-[80px] flex-col items-center gap-2.5 group snap-start transition-all"
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${category.bg} shadow-sm border border-black/5 transition-all group-hover:scale-105 active:scale-95`}
      >
        <Icon size={24} className={category.color} strokeWidth={2.5} />
      </div>
      <span className="text-[10px] font-black text-foreground/80 text-center line-clamp-2 w-full tracking-tight uppercase leading-none">
        {category.name}
      </span>
    </Link>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-4 pb-3">
      <h2 className="text-lg font-black text-foreground tracking-tight">{title}</h2>
      <button type="button" className="text-[11px] font-black text-primary uppercase tracking-wider bg-primary/5 px-3 py-1.5 rounded-full">
        View All
      </button>
    </div>
  );
}

export function CategoriesSection() {
  const [activeTab, setActiveTab] = useState<"service" | "rental">("service");

  const currentCategories = activeTab === "service" ? serviceCategories : rentalCategories;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Popular Categories */}
      <section className="animate-fade-in">
        <SectionTitle title="Popular Quick Picks" />
        <div className="grid grid-cols-4 gap-4 px-4">
          {popularCategories.map((cat, idx) => (
            <div key={cat.name} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <CategoryItem category={cat} />
            </div>
          ))}
        </div>
      </section>

      {/* Services & Rentals Tabs */}
      <section className="flex flex-col gap-5 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="px-4">
          <div className="flex p-1.5 bg-muted/80 rounded-2xl border border-border shadow-inner">
            <button
              onClick={() => setActiveTab("service")}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${activeTab === "service"
                ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab("rental")}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${activeTab === "rental"
                ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Rentals
            </button>
          </div>
        </div>

        <div className="px-4">
          <div
            className="flex gap-x-5 overflow-x-auto pb-6 scrollbar-hide snap-x"
          >
            {currentCategories.map((cat, idx) => (
              <div key={`${activeTab}-${cat.name}`} className="animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <CategoryItem category={cat} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
