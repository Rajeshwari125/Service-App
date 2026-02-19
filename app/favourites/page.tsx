import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FavouritesPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Link
                    href="/"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-lg font-bold">My Favourites</h1>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
                <p className="text-muted-foreground">No favourites yet.</p>
            </div>
        </div>
    );
}
