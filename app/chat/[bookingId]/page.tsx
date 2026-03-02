"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Phone, MoreVertical, CheckCheck, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { useChat } from "@/lib/chat-context";

function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function formatDate(date: Date) {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.bookingId as string;
    const { user } = useAuth();
    const { bookings } = useData();
    const { getBookingMessages, sendMessage, markAsRead } = useChat();
    const [inputText, setInputText] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const booking = bookings.find((b) => b.id === bookingId) || {
        id: bookingId,
        serviceTitle: "Booking Chat",
        providerName: "Service Provider",
        status: "Active",
    };

    const messages = getBookingMessages(bookingId !== "demo" ? bookingId : "demo");
    const demoMessages = bookingId === "demo" || messages.length === 0
        ? getBookingMessages("demo")
        : messages;
    const displayMessages = bookingId === "demo" ? demoMessages : (messages.length > 0 ? messages : demoMessages);

    useEffect(() => {
        if (user?.id) markAsRead(bookingId, user.id);
    }, [bookingId, user?.id, markAsRead]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [displayMessages]);

    const handleSend = () => {
        if (!inputText.trim() || !user) return;
        sendMessage(
            bookingId === "demo" ? "demo" : bookingId,
            user.id,
            user.name,
            user.role === "employee" ? "employee" : "customer",
            inputText
        );
        setInputText("");
    };

    // Group messages by date
    const grouped: { date: string; msgs: typeof displayMessages }[] = [];
    displayMessages.forEach((msg) => {
        const dateLabel = formatDate(msg.timestamp);
        const last = grouped[grouped.length - 1];
        if (!last || last.date !== dateLabel) {
            grouped.push({ date: dateLabel, msgs: [msg] });
        } else {
            last.msgs.push(msg);
        }
    });

    const isMe = (senderId: string) => senderId === user?.id;

    return (
        <div className="flex h-full flex-col bg-slate-50 animate-fade-in">
            {/* Chat Header */}
            <div className="bg-white border-b border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 px-4 pt-10 pb-4">
                    <button
                        onClick={() => router.back()}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 active:scale-90 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                            {(booking as any).serviceTitle || "Service Chat"}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Online</p>
                            <span className="text-slate-200 text-[10px]">•</span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {(booking as any).providerName || "Provider"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary active:scale-90 transition-all">
                            <Phone size={16} />
                        </button>
                        <button className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-all">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                {/* Booking Info Strip */}
                <div className="mx-4 mb-4 bg-gradient-to-r from-primary/5 to-blue-50 rounded-2xl px-4 py-2.5 flex items-center justify-between border border-primary/10">
                    <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">Booking ID</p>
                        <p className="text-xs font-black text-slate-700">#{bookingId.slice(-6).toUpperCase()}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${(booking as any).status === "Completed" ? "bg-emerald-100 text-emerald-600" :
                            (booking as any).status === "Pending" ? "bg-amber-100 text-amber-600" :
                                "bg-blue-100 text-blue-600"
                        }`}>
                        {(booking as any).status || "Active"}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide space-y-4">
                {grouped.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <div className="h-20 w-20 rounded-3xl bg-white shadow-lg border border-slate-100 flex items-center justify-center">
                            <MessageCircle size={32} className="text-slate-200" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 text-center">
                            Start the conversation!<br />Ask about your booking here.
                        </p>
                    </div>
                )}

                {grouped.map((group) => (
                    <div key={group.date} className="flex flex-col gap-3">
                        {/* Date separator */}
                        <div className="flex items-center gap-3 my-2">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                {group.date}
                            </span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        {group.msgs.map((msg, i) => {
                            const mine = isMe(msg.senderId);
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-2 animate-slide-up ${mine ? "flex-row-reverse" : "flex-row"}`}
                                    style={{ animationDelay: `${i * 30}ms` }}
                                >
                                    {/* Avatar */}
                                    {!mine && (
                                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                            <span className="text-[10px] font-black text-white">
                                                {msg.senderName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}

                                    {/* Bubble */}
                                    <div className={`max-w-[75%] flex flex-col ${mine ? "items-end" : "items-start"}`}>
                                        {!mine && (
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 px-1">
                                                {msg.senderName}
                                            </p>
                                        )}
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl shadow-sm ${mine
                                                    ? "bg-primary text-white rounded-br-sm"
                                                    : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                        <div className={`flex items-center gap-1 mt-1 px-1 ${mine ? "flex-row-reverse" : "flex-row"}`}>
                                            <span className="text-[9px] text-slate-400">{formatTime(msg.timestamp)}</span>
                                            {mine && <CheckCheck size={12} className="text-primary/60" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div className="bg-white border-t border-slate-100 px-4 py-3 pb-8">
                <div className="flex items-end gap-2">
                    <div className="flex-1 bg-slate-50 rounded-[1.5rem] border border-slate-200 px-4 py-3 min-h-[48px] flex items-center">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Type a message..."
                            rows={1}
                            className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium leading-relaxed"
                            style={{ maxHeight: "100px" }}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-90 transition-all disabled:opacity-40 disabled:scale-100 flex-shrink-0"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
