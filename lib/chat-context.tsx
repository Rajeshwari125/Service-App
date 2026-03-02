"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";

export interface ChatMessage {
    id: string;
    bookingId: string;
    senderId: string;
    senderName: string;
    senderRole: "customer" | "employee" | "provider";
    text: string;
    timestamp: Date;
    isRead: boolean;
}

interface ChatContextType {
    messages: ChatMessage[];
    sendMessage: (
        bookingId: string,
        senderId: string,
        senderName: string,
        senderRole: "customer" | "employee" | "provider",
        text: string
    ) => void;
    getBookingMessages: (bookingId: string) => ChatMessage[];
    getUnreadCount: (userId: string) => number;
    markAsRead: (bookingId: string, userId: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

// Demo seed messages
const SEED_MESSAGES: ChatMessage[] = [
    {
        id: "seed1",
        bookingId: "demo",
        senderId: "emp1",
        senderName: "Ravi Kumar",
        senderRole: "employee",
        text: "Hello! I'll be at your location by 10 AM tomorrow. Please keep the main valve accessible.",
        timestamp: new Date(Date.now() - 3600000),
        isRead: false,
    },
    {
        id: "seed2",
        bookingId: "demo",
        senderId: "cust1",
        senderName: "Test User",
        senderRole: "customer",
        text: "Sure, I'll be home. Should I prepare anything?",
        timestamp: new Date(Date.now() - 3000000),
        isRead: true,
    },
    {
        id: "seed3",
        bookingId: "demo",
        senderId: "emp1",
        senderName: "Ravi Kumar",
        senderRole: "employee",
        text: "No worries, I'll bring all the tools. See you tomorrow! 🔧",
        timestamp: new Date(Date.now() - 2400000),
        isRead: false,
    },
];

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);

    const sendMessage = useCallback(
        (
            bookingId: string,
            senderId: string,
            senderName: string,
            senderRole: "customer" | "employee" | "provider",
            text: string
        ) => {
            if (!text.trim()) return;
            const msg: ChatMessage = {
                id: `msg_${Date.now()}`,
                bookingId,
                senderId,
                senderName,
                senderRole,
                text: text.trim(),
                timestamp: new Date(),
                isRead: false,
            };
            setMessages((prev) => [...prev, msg]);
        },
        []
    );

    const getBookingMessages = useCallback(
        (bookingId: string) =>
            messages
                .filter((m) => m.bookingId === bookingId)
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
        [messages]
    );

    const getUnreadCount = useCallback(
        (userId: string) =>
            messages.filter((m) => m.senderId !== userId && !m.isRead).length,
        [messages]
    );

    const markAsRead = useCallback((bookingId: string, userId: string) => {
        setMessages((prev) =>
            prev.map((m) =>
                m.bookingId === bookingId && m.senderId !== userId
                    ? { ...m, isRead: true }
                    : m
            )
        );
    }, []);

    return (
        <ChatContext.Provider
            value={{ messages, sendMessage, getBookingMessages, getUnreadCount, markAsRead }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used inside ChatProvider");
    return ctx;
}
