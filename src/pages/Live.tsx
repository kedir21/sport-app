import { useEffect, useState } from 'react';
import { MatchInfo } from '@/types/football';
import { providerManager } from '@/services/football/providers/providerManager';
import { MatchCard } from '@/components/match/MatchCard';

export default function Live() {
  const [liveMatches, setLiveMatches] = useState<MatchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function loadLiveMatches() {
      try {
        const provider = providerManager.getActiveProvider();
        const live = await provider.getLiveMatches();
        setLiveMatches(live);
      } catch (error) {
        console.error("Failed to load live matches", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLiveMatches();
    
    // Poll every 30 seconds for live updates
    intervalId = setInterval(loadLiveMatches, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
          Live Matches
        </h1>
        <p className="text-zinc-400">Currently in progress</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-8 h-8 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : liveMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 flex flex-col items-center gap-4">
          <span className="text-4xl">⚽</span>
          <p className="text-lg">No live matches at the moment.</p>
        </div>
      )}
    </div>
  );
}
