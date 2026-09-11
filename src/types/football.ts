export type MatchStatus = 
  | 'UPCOMING' 
  | 'LIVE' 
  | 'HALFTIME' 
  | 'FINISHED' 
  | 'POSTPONED' 
  | 'CANCELLED';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  country: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  logoUrl: string;
  type: 'LEAGUE' | 'CUP' | 'INTERNATIONAL';
}

export interface MatchInfo {
  id: string;
  league: League;
  
  // Team vs Team format (Soccer, NBA, NFL, etc.)
  homeTeam?: Team;
  awayTeam?: Team;
  
  // Event-based format (Tennis, Golf, UFC, etc.)
  eventName?: string;
  eventLogo?: string;
  
  sport?: string;
  kickoff: string; // ISO 8601 string
  status: MatchStatus;
  score?: {
    home: number;
    away: number;
  };
  minute?: string; // e.g., "45+2'", "67'"
  venue?: string;
}

export interface StreamSource {
  id: string;
  providerId: string;
  matchId: string;
  title: string;
  url: string;
  type: 'HLS' | 'DASH' | 'IFRAME' | 'EXTERNAL';
  quality: string;
  language: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'GEOBLOCKED';
}
