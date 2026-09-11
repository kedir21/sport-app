import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MatchInfo, StreamSource } from '@/types/football';
import { providerManager } from '@/services/football/providers/providerManager';
import { ArrowLeft, Play, MonitorPlay, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchInfo | null>(null);
  const [streams, setStreams] = useState<StreamSource[]>([]);
  const [activeStream, setActiveStream] = useState<StreamSource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const provider = providerManager.getActiveProvider();
        const [matchData, streamData] = await Promise.all([
          provider.getMatchDetails(id),
          provider.getStreams(id)
        ]);
        setMatch(matchData);
        setStreams(streamData);
      } catch (error) {
        console.error("Failed to load match details", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleStreamSelect = (stream: StreamSource) => {
    setActiveStream(stream);
    setStreamError(null);
  };

  const handleStreamError = () => {
    setStreamError("This streaming source is currently unavailable.");
    // Attempt fallback to next stream
    const currentIndex = streams.findIndex(s => s.id === activeStream?.id);
    if (currentIndex !== -1 && currentIndex < streams.length - 1) {
      const nextStream = streams[currentIndex + 1];
      setActiveStream(nextStream);
      setStreamError(`Switching to backup source...`);
      setTimeout(() => setStreamError(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-24 text-zinc-500">
        Match not found or data is unavailable.
      </div>
    );
  }

  const isLive = match.status === 'LIVE' || match.status === 'HALFTIME';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Match Header */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-6 md:p-12 relative overflow-hidden">
        {/* Background glow effects */}
        {isLive && (
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
        )}

        <div className="relative flex flex-col items-center">
          {/* League Info */}
          <div className="flex items-center gap-2 mb-8 text-zinc-400">
            <img src={match.league.logoUrl} alt={match.league.name} className="w-5 h-5 opacity-70" />
            <span className="text-sm font-medium tracking-wide uppercase">{match.league.name}</span>
          </div>

          {/* Main Scoreboard / Event */}
          <div className="flex items-center justify-center w-full max-w-2xl gap-4 md:gap-16 mb-6">
            {match.eventName ? (
              <div className="flex flex-col items-center flex-1 py-8">
                {match.eventLogo && (
                  <img src={match.eventLogo} alt={match.eventName} className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl mb-8" />
                )}
                <span className="text-2xl md:text-4xl font-bold text-center leading-tight">{match.eventName}</span>
              </div>
            ) : match.homeTeam && match.awayTeam ? (
              <>
                <div className="flex flex-col items-center gap-4 flex-1">
                  <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl" />
                  <span className="text-lg md:text-2xl font-bold text-center leading-tight">{match.homeTeam.name}</span>
                </div>

                <div className="flex flex-col items-center justify-center min-w-[120px]">
                  {(isLive || match.status === 'FINISHED') && match.score ? (
                    <div className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                      <span>{match.score.home}</span>
                      <span className="mx-2 md:mx-4 text-zinc-700 font-light">-</span>
                      <span>{match.score.away}</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-zinc-500 mb-4 bg-zinc-950 px-6 py-2 rounded-2xl border border-zinc-800">
                      VS
                    </div>
                  )}
                  
                  {isLive ? (
                    <div className="flex items-center gap-2 text-emerald-500 font-bold tracking-widest uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {match.minute || 'LIVE'}
                    </div>
                  ) : (
                    <div className="text-zinc-500 font-medium text-sm">
                      {match.status === 'FINISHED' ? 'FT' : format(new Date(match.kickoff), 'MMM d, HH:mm')}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4 flex-1">
                  <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl" />
                  <span className="text-lg md:text-2xl font-bold text-center leading-tight">{match.awayTeam.name}</span>
                </div>
              </>
            ) : null}
          </div>
          
          {match.venue && (
            <div className="text-zinc-500 text-sm mt-4">
              📍 {match.venue}
            </div>
          )}
        </div>
      </div>

      {/* Streaming Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        {/* Player Container */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-emerald-500" />
            Watch Live
          </h2>
          
          <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 relative shadow-2xl">
            {activeStream ? (
              <div className="w-full h-full relative">
                {streamError && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                    <ShieldAlert className="w-4 h-4" />
                    {streamError}
                  </div>
                )}
                {/* Simulated player for authorized stream URL */}
                {activeStream.type === 'IFRAME' ? (
                  <iframe 
                    src={activeStream.url} 
                    className="w-full h-full border-0"
                    allowFullScreen
                    onError={handleStreamError}
                  />
                ) : (
                  // For native HLS/DASH we would use video.js or hls.js. 
                  // Using a placeholder HTML5 video tag.
                  <video 
                    controls 
                    className="w-full h-full object-contain bg-black"
                    poster={match.homeTeam.logoUrl} // placeholder poster
                    src={activeStream.url}
                    autoPlay
                    onError={handleStreamError}
                  />
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 p-8 text-center bg-zinc-950">
                <Play className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium mb-2">Ready to watch</p>
                <p className="text-sm">Select an available authorized streaming source from the list to begin.</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Sources */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-300">Available Sources</h3>
          
          {streams.length > 0 ? (
            <div className="space-y-3">
              {streams.map(stream => (
                <button
                  key={stream.id}
                  onClick={() => handleStreamSelect(stream)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                    activeStream?.id === stream.id
                      ? "bg-zinc-800 border-emerald-500/50 ring-1 ring-emerald-500/50"
                      : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80"
                  )}
                >
                  <div>
                    <div className="font-medium text-zinc-200 mb-1">{stream.title}</div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{stream.quality}</span>
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{stream.language}</span>
                    </div>
                  </div>
                  {activeStream?.id === stream.id ? (
                    <div className="flex h-3 items-end gap-1">
                      <div className="w-1 bg-emerald-500 animate-[bounce_1s_infinite] h-full" />
                      <div className="w-1 bg-emerald-500 animate-[bounce_1.2s_infinite] h-2/3" />
                      <div className="w-1 bg-emerald-500 animate-[bounce_0.8s_infinite] h-full" />
                    </div>
                  ) : (
                    <Play className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 text-center text-zinc-400 text-sm">
              <ShieldAlert className="w-8 h-8 mx-auto mb-3 opacity-50" />
              Streaming source currently unavailable for this match.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
