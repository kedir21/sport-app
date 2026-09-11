import { useEffect, useState } from 'react';
import { MatchInfo } from '@/types/football';
import { providerManager } from '@/services/football/providers/providerManager';
import { LiveMatchCard } from '@/components/match/LiveMatchCard';
import { MatchCard } from '@/components/match/MatchCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [liveMatches, setLiveMatches] = useState<MatchInfo[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const provider = providerManager.getActiveProvider();
        const [live, upcoming] = await Promise.all([
          provider.getLiveMatches(),
          provider.getUpcomingMatches(6)
        ]);
        setLiveMatches(live);
        setUpcomingMatches(upcoming);
      } catch (error) {
        console.error("Failed to load matches", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const featuredMatch = liveMatches[0];
  const otherLiveMatches = liveMatches.slice(1);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      {featuredMatch ? (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Live Now</h2>
            <Link to="/live" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <LiveMatchCard match={featuredMatch} />
        </section>
      ) : null}

      {/* Other Live Matches */}
      {otherLiveMatches.length > 0 && (
        <section>
          <h3 className="text-xl font-bold tracking-tight mb-4 text-zinc-300">More Live Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherLiveMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Upcoming</h2>
          <Link to="/matches" className="text-sm font-medium text-zinc-400 hover:text-zinc-300 flex items-center gap-1">
            See Schedule <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
            No upcoming matches scheduled right now.
          </div>
        )}
      </section>
    </div>
  );
}
