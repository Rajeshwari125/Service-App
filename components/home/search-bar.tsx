"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
        <Search size={20} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search services, products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-muted-foreground"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
