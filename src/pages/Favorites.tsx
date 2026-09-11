import { Heart } from 'lucide-react';

export default function Favorites() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          My Favorites
        </h1>
        <p className="text-zinc-400">Your personalized feed of teams and leagues.</p>
      </div>

      <div className="text-center py-24 text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 flex flex-col items-center gap-4">
        <Heart className="w-12 h-12 text-zinc-700" />
        <div>
          <p className="text-lg font-medium text-zinc-300">No favorites yet</p>
          <p className="text-sm">Start adding teams and leagues to see them here.</p>
        </div>
      </div>
    </div>
  );
}
