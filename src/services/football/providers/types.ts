import { MatchInfo, StreamSource, League, Team } from '@/types/football';

export interface FootballProvider {
  id: string;
  name: string;
  
  getMatches(date: Date): Promise<MatchInfo[]>;
  getLiveMatches(): Promise<MatchInfo[]>;
  getUpcomingMatches(limit?: number): Promise<MatchInfo[]>;
  getMatchDetails(matchId: string): Promise<MatchInfo | null>;
  getLeagues(): Promise<League[]>;
  getTeams(query: string): Promise<Team[]>;
  getStreams(matchId: string): Promise<StreamSource[]>;
}
