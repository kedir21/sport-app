import React from 'react';
import { MatchInfo } from '@/types/football';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LiveMatchCardProps {
  match: MatchInfo;
  className?: string;
}

export const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ match, className }) => {
  return (
    <Link 
      to={`/match/${match.id}`}
      className={cn(
        "relative block w-full rounded-3xl overflow-hidden group border border-zinc-800/50 hover:border-zinc-700 transition-colors",
        "bg-gradient-to-br from-zinc-900 to-zinc-950",
        className
      )}
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="relative p-6 md:p-8 flex flex-col items-center">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {match.minute || 'LIVE NOW'}
        </div>

        {/* League Info */}
        <div className="flex items-center gap-2 mb-8 text-zinc-400">
          <img src={match.league.logoUrl} alt={match.league.name} className="w-5 h-5 opacity-70" />
          <span className="text-sm font-medium tracking-wide uppercase">{match.league.name}</span>
        </div>

        {/* Main Scoreboard / Event Area */}
        <div className="flex items-center justify-center w-full max-w-lg gap-4 md:gap-12 mb-8">
          {match.eventName ? (
            <div className="flex flex-col items-center flex-1">
              {match.eventLogo && (
                <img src={match.eventLogo} alt={match.eventName} className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl mb-6" />
              )}
              <span className="text-xl md:text-3xl font-bold text-center leading-tight">{match.eventName}</span>
            </div>
          ) : match.homeTeam && match.awayTeam ? (
            <>
              <div className="flex flex-col items-center gap-4 flex-1">
                <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl" />
                <span className="text-lg md:text-2xl font-bold text-center leading-tight">{match.homeTeam.name}</span>
              </div>

              <div className="flex items-center justify-center text-4xl md:text-6xl font-black tracking-tighter">
                {match.score ? (
                  <>
                    <span>{match.score.home}</span>
                    <span className="mx-2 md:mx-4 text-zinc-700 font-light">-</span>
                    <span>{match.score.away}</span>
                  </>
                ) : (
                  <span className="text-zinc-500 text-3xl font-bold uppercase tracking-widest bg-zinc-900 px-6 py-2 rounded-2xl border border-zinc-800">
                    VS
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center gap-4 flex-1">
                <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl" />
                <span className="text-lg md:text-2xl font-bold text-center leading-tight">{match.awayTeam.name}</span>
              </div>
            </>
          ) : null}
        </div>

        {/* Action Button */}
        <button className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 px-8 py-3 rounded-full font-bold transition-all group-hover:scale-105 active:scale-95">
          <Play className="w-5 h-5 fill-current" />
          WATCH LIVE
        </button>
      </div>
    </Link>
  );
}
