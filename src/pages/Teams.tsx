import { useEffect, useState } from 'react';
import { Team } from '@/types/football';
import { providerManager } from '@/services/football/providers/providerManager';
import { Shield } from 'lucide-react';

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await providerManager.getActiveProvider().getTeams(''); // empty query gets all mock
        setTeams(data);
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
          <Shield className="w-8 h-8 text-blue-500" />
          Teams
        </h1>
        <p className="text-zinc-400">Discover and follow your favorite clubs.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {teams.map(team => (
            <button key={team.id} className="flex flex-col items-center p-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all group">
              <div className="w-16 h-16 mb-4 flex items-center justify-center p-2 bg-white rounded-full">
                <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-sm text-center leading-tight">{team.name}</h3>
              <p className="text-xs text-zinc-500 mt-1">{team.country}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
