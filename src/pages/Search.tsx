import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Team } from '@/types/football';
import { providerManager } from '@/services/football/providers/providerManager';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Team[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await providerManager.getActiveProvider().getTeams(query);
        setResults(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-500" />
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search teams, leagues, matches..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
          autoFocus
        />
      </div>

      <div className="space-y-4">
        {isSearching ? (
          <div className="text-center py-12 text-zinc-500">Searching...</div>
        ) : query.trim() && results.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
            No results found for "{query}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map(team => (
              <button key={team.id} className="flex items-center gap-4 p-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all text-left">
                <div className="w-12 h-12 bg-white rounded-full p-2 flex-shrink-0">
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold">{team.name}</h4>
                  <p className="text-sm text-zinc-500">Team • {team.country}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
