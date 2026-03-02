"use client";

import { Search, X } from "lucide-react";
import { useSearch } from "@/lib/search-context";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Search size={20} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search services, tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground font-medium outline-none placeholder:text-muted-foreground"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
