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
  ShoppingBag,
  Shirt,
  Pill,
  Apple,
  Gift,
  BookOpen,
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
  type: "service" | "product";
}

const popularCategories: Category[] = [
  { name: "Plumbing", icon: Droplets, color: "text-[#3182ce]", bg: "bg-[#ebf4ff]", type: "service" },
  { name: "Electrician", icon: Zap, color: "text-[#d69e2e]", bg: "bg-[#fefcbf]", type: "service" },
  { name: "Cleaning", icon: Sparkles, color: "text-[#38a169]", bg: "bg-[#f0fff4]", type: "service" },
  { name: "Painting", icon: Paintbrush, color: "text-[#e53e3e]", bg: "bg-[#fff5f5]", type: "service" },
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

const nonServiceCategories: Category[] = [
  { name: "Groceries", icon: Apple, color: "text-[#38a169]", bg: "bg-[#f0fff4]", type: "product" },
  { name: "Fashion", icon: Shirt, color: "text-[#d53f8c]", bg: "bg-[#fff5f7]", type: "product" },
  { name: "Medicine", icon: Pill, color: "text-[#3182ce]", bg: "bg-[#ebf4ff]", type: "product" },
  { name: "Shopping", icon: ShoppingBag, color: "text-[#d69e2e]", bg: "bg-[#fefcbf]", type: "product" },
  { name: "Gifts", icon: Gift, color: "text-[#e53e3e]", bg: "bg-[#fff5f5]", type: "product" },
  { name: "Stationery", icon: BookOpen, color: "text-[#553c9a]", bg: "bg-[#faf5ff]", type: "product" },
];

function CategoryItem({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <Link
      href={`/browse/${category.type}/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
      className="flex min-w-[70px] flex-col items-center gap-2 group snap-start"
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${category.bg} transition-transform group-hover:scale-105`}
      >
        <Icon size={26} className={category.color} />
      </div>
      <span className="text-[11px] font-medium text-foreground text-center line-clamp-2 w-full leading-tight">{category.name}</span>
    </Link>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-4 pb-2">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <button type="button" className="text-xs font-semibold text-accent">
        View All
      </button>
    </div>
  );
}

export function CategoriesSection() {
  const [activeTab, setActiveTab] = useState<"service" | "product">("service");

  const currentCategories = activeTab === "service" ? serviceCategories : nonServiceCategories;

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Popular Categories */}
      <section>
        <SectionTitle title="Popular Categories" />
        <div className="grid grid-cols-4 gap-4 px-4">
          {popularCategories.map((cat) => (
            <CategoryItem key={cat.name} category={cat} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-4 h-px bg-border" />

      {/* Services & Products Tabs */}
      <section className="flex flex-col gap-4">
        <div className="px-4">
          <div className="flex p-1 bg-muted/50 rounded-xl">
            <button
              onClick={() => setActiveTab("service")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === "service"
                ? "bg-white text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab("product")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === "product"
                ? "bg-white text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Products
            </button>
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-foreground">
              {activeTab === "service" ? "All Services" : "All Products"}
            </h2>
            <button type="button" className="text-xs font-semibold text-accent">
              View All
            </button>
          </div>

          <div
            className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
            style={{
              gridTemplateRows: "repeat(2, min-content)"
            }}
          >
            {currentCategories.map((cat) => (
              <CategoryItem key={`${activeTab}-${cat.name}`} category={cat} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
