import { useEffect, useState } from 'react';
import { League } from '@/types/football';
import { providerManager } from '@/services/football/providers/providerManager';
import { Trophy } from 'lucide-react';

export default function Leagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await providerManager.getActiveProvider().getLeagues();
        setLeagues(data);
      } catch(e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          Competitions
        </h1>
        <p className="text-zinc-400">Browse football leagues and tournaments.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-zinc-800 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leagues.map(league => (
            <button key={league.id} className="flex flex-col items-center p-6 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all group">
              <img src={league.logoUrl} alt={league.name} className="w-20 h-20 object-contain mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg text-center">{league.name}</h3>
              <p className="text-sm text-zinc-500">{league.country}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
