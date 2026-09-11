import React from 'react';
import { MatchInfo } from '@/types/football';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow } from 'date-fns';
import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: MatchInfo;
  className?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, className }) => {
  const isLive = match.status === 'LIVE' || match.status === 'HALFTIME';
  const isUpcoming = match.status === 'UPCOMING';
  const isFinished = match.status === 'FINISHED';
  
  const kickoffDate = new Date(match.kickoff);
  
  const displayTime = () => {
    if (isLive) return <span className="text-emerald-500 font-bold animate-pulse">{match.minute || 'LIVE'}</span>;
    if (isFinished) return <span className="text-zinc-500 font-medium">FT</span>;
    
    // Upcoming
    const timeStr = format(kickoffDate, 'HH:mm');
    if (isToday(kickoffDate)) return <span className="text-zinc-400 font-medium">{timeStr}</span>;
    if (isTomorrow(kickoffDate)) return <span className="text-zinc-400 font-medium">Tomorrow {timeStr}</span>;
    return <span className="text-zinc-400 font-medium">{format(kickoffDate, 'MMM d, HH:mm')}</span>;
  };

  return (
    <Link 
      to={`/match/${match.id}`}
      className={cn(
        "block relative bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800/50 hover:border-zinc-700 rounded-2xl p-4 transition-all duration-300 group overflow-hidden",
        className
      )}
    >
      {/* Decorative gradient for live matches */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />
      )}

      {/* Header: League & Status */}
      <div className="flex justify-between items-center mb-4 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <img src={match.league.logoUrl} alt={match.league.name} className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="font-medium tracking-wide uppercase">{match.league.name}</span>
        </div>
        <div>
          {displayTime()}
        </div>
      </div>

      {/* Teams & Score / Event */}
      {match.eventName ? (
        <div className="flex flex-col items-center justify-center p-4 min-h-[100px]">
          {match.eventLogo && (
            <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center p-2 mb-3">
              <img src={match.eventLogo} alt={match.eventName} className="w-full h-full object-contain" />
            </div>
          )}
          <span className="text-sm font-bold text-center leading-tight px-2">{match.eventName}</span>
        </div>
      ) : match.homeTeam && match.awayTeam ? (
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center p-2">
              <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-semibold text-center leading-tight truncate w-full px-2">{match.homeTeam.shortName}</span>
          </div>

          <div className="flex flex-col items-center justify-center px-4 min-w-[80px]">
            {(isLive || isFinished) && match.score ? (
              <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
                <span>{match.score.home}</span>
                <span className="text-zinc-600 font-light">-</span>
                <span>{match.score.away}</span>
              </div>
            ) : (
              <div className="text-sm font-medium text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full uppercase">
                vs
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center p-2">
              <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-semibold text-center leading-tight truncate w-full px-2">{match.awayTeam.shortName}</span>
          </div>
        </div>
      ) : null}
    </Link>
  );
}
