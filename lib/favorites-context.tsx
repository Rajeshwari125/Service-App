"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from "react";

interface FavoriteItem {
    id: string;
    type: "service" | "rental";
}

interface FavoritesContextType {
    favorites: FavoriteItem[];
    toggleFavorite: (id: string, type: "service" | "rental") => void;
    isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("servicehub_favorites");
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse favorites:", e);
                setFavorites([]);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("servicehub_favorites", JSON.stringify(favorites));
        }
    }, [favorites, isLoaded]);

    const toggleFavorite = useCallback((id: string, type: "service" | "rental") => {
        setFavorites((prev) => {
            const exists = prev.find((fav) => fav.id === id);
            if (exists) {
                return prev.filter((fav) => fav.id !== id);
            } else {
                return [...prev, { id, type }];
            }
        });
    }, []);

    const isFavorite = useCallback((id: string) => {
        return favorites.some((fav) => fav.id === id);
    }, [favorites]);

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                toggleFavorite,
                isFavorite,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
    return ctx;
}
