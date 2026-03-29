"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, MessageSquare, User, ThumbsUp, Filter, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { useReviews } from "@/lib/review-context";

type RatingFilter = "all" | 5 | 4 | 3 | 2 | 1;

export default function ReviewsPage() {
    const { user } = useAuth();
    const { services } = useData();
    const { getProviderReviews } = useReviews();
    const [filter, setFilter] = useState<RatingFilter>("all");

    const isEmployee = user?.role === "employee" || user?.role === "provider";
    const providerReviews = isEmployee ? getProviderReviews(user?.id || "") : [];

    const filteredReviews = filter === "all"
        ? providerReviews
        : providerReviews.filter(r => r.rating === filter);

    // Compute stats
    const totalReviews = providerReviews.length;
    const avgRating = totalReviews > 0
        ? (providerReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : "0.0";

    // Rating distribution
    const distribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: providerReviews.filter(r => r.rating === star).length,
        pct: totalReviews > 0 ? (providerReviews.filter(r => r.rating === star).length / totalReviews) * 100 : 0,
    }));

    const formatDate = (isoDate: string) => {
        try {
            const d = new Date(isoDate);
            return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        } catch {
            return isoDate;
        }
    };

    // Find service title for a review
    const getServiceTitle = (serviceId: string) => {
        const svc = services.find(s => s.id === serviceId);
        return svc?.title || "Service";
    };

    return (
        <div className="flex h-full flex-col bg-slate-50/50 animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 pt-10 pb-6 border-b border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center gap-4">
                    <Link
                        href="/settings"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg active:scale-90 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Customer Reviews</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {totalReviews} feedback{totalReviews !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide pb-32">
                <div className="flex flex-col gap-6">

                    {/* Rating Overview Card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 animate-slide-up">
                        <div className="flex items-start gap-6">
                            {/* Big Rating */}
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-5xl font-black text-slate-900 tracking-tighter">{avgRating}</p>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                                        />
                                    ))}
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                    {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                                </p>
                            </div>

                            {/* Distribution Bars */}
                            <div className="flex-1 flex flex-col gap-1.5">
                                {distribution.map(d => (
                                    <div key={d.star} className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400 w-3">{d.star}</span>
                                        <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${d.star >= 4 ? "bg-emerald-400" : d.star === 3 ? "bg-amber-400" : "bg-red-400"
                                                    }`}
                                                style={{ width: `${d.pct}%` }}
                                            />
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 w-5 text-right">{d.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide animate-slide-up" style={{ animationDelay: '100ms' }}>
                        {(["all", 5, 4, 3, 2, 1] as RatingFilter[]).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "bg-white text-slate-400 border border-slate-100"
                                    }`}
                            >
                                {f === "all" ? (
                                    <>
                                        <Filter size={10} />
                                        All ({totalReviews})
                                    </>
                                ) : (
                                    <>
                                        <Star size={10} className={filter === f ? "fill-white" : "fill-amber-400 text-amber-400"} />
                                        {f} ({distribution.find(d => d.star === f)?.count || 0})
                                    </>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Reviews List */}
                    {filteredReviews.length > 0 ? (
                        <div className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            {filteredReviews.map((review, idx) => (
                                <div
                                    key={review.id}
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-slide-up"
                                    style={{ animationDelay: `${idx * 60}ms` }}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                                <User size={18} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{review.customerName}</p>
                                                <p className="text-[10px] font-bold text-slate-400">{formatDate(review.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star
                                                    key={i}
                                                    size={11}
                                                    className={i <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Service Name */}
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">
                                            {getServiceTitle(review.serviceId)}
                                        </span>
                                    </div>

                                    {/* Review Comment */}
                                    {review.comment && (
                                        <div className="bg-slate-50 rounded-xl p-3 mt-1">
                                            <div className="flex items-start gap-2">
                                                <MessageSquare size={12} className="text-slate-300 mt-0.5 shrink-0" />
                                                <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                                                    &ldquo;{review.comment}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                            <div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-lg flex items-center justify-center border border-slate-100 mb-6">
                                <MessageSquare size={40} className="text-slate-200" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                {filter === "all" ? "No Reviews Yet" : `No ${filter}-Star Reviews`}
                            </h3>
                            <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[220px]">
                                {filter === "all"
                                    ? "Customer feedback will appear here after they rate your service"
                                    : "No reviews found for this rating filter"
                                }
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
