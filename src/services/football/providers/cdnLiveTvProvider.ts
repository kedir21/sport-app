import { FootballProvider } from './types';
import { MatchInfo, StreamSource, League, Team, MatchStatus } from '@/types/football';

export class CdnLiveTvProvider implements FootballProvider {
  id = 'cdnlivetv';
  name = 'CDN Live TV Provider';
  
  private cache: MatchInfo[] | null = null;
  private lastFetch: number = 0;
  
  private async fetchAllEvents(): Promise<MatchInfo[]> {
    // 60 second simple caching
    if (this.cache && Date.now() - this.lastFetch < 60000) {
      return this.cache;
    }
    
    try {
      const res = await fetch('/api/sports/all');
      if (!res.ok) throw new Error("Failed to fetch sports events");
      
      const data = await res.json();
      const sportsData = data['cdnlivetv.is'] || {};
      
      const matches: MatchInfo[] = [];

      for (const [sport, events] of Object.entries(sportsData)) {
        if (sport.startsWith('total_events')) continue;
        if (!Array.isArray(events)) continue;

        events.forEach((event: any) => {
          // Map status
          let status: MatchStatus = 'UPCOMING';
          if (event.status === 'live') status = 'LIVE';
          if (event.status === 'finished') status = 'FINISHED';

          // Parse date. Event start format: "2025-11-21 15:30"
          const kickoffTime = new Date(event.start.replace(' ', 'T') + ':00Z').toISOString();
          
          const matchInfo: MatchInfo = {
            id: event.gameID,
            sport: sport,
            league: {
              id: event.tournament,
              name: event.tournament,
              country: event.country,
              logoUrl: event.countryIMG, 
              type: 'LEAGUE'
            },
            kickoff: kickoffTime,
            status: status,
            venue: '',
            ...({ _rawChannels: event.channels } as any) // Store for getStreams
          };

          // Check for Team vs Team or Event-Based format
          if (event.homeTeam && event.awayTeam) {
            matchInfo.homeTeam = {
              id: event.homeTeam,
              name: event.homeTeam,
              shortName: event.homeTeam.substring(0, 3).toUpperCase(),
              logoUrl: event.homeTeamIMG,
              country: event.country
            };
            matchInfo.awayTeam = {
              id: event.awayTeam,
              name: event.awayTeam,
              shortName: event.awayTeam.substring(0, 3).toUpperCase(),
              logoUrl: event.awayTeamIMG,
              country: event.country
            };
          } else if (event.event) {
            matchInfo.eventName = event.event;
            matchInfo.eventLogo = event.eventIMG;
          }

          matches.push(matchInfo);
        });
      }
      
      this.cache = matches;
      this.lastFetch = Date.now();
      return matches;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getMatches(date: Date): Promise<MatchInfo[]> {
    return this.fetchAllEvents();
  }

  async getLiveMatches(): Promise<MatchInfo[]> {
    const matches = await this.fetchAllEvents();
    return matches.filter(m => m.status === 'LIVE');
  }

  async getUpcomingMatches(limit?: number): Promise<MatchInfo[]> {
    const matches = await this.fetchAllEvents();
    const upcoming = matches.filter(m => m.status === 'UPCOMING');
    return limit ? upcoming.slice(0, limit) : upcoming;
  }

  async getMatchDetails(matchId: string): Promise<MatchInfo | null> {
    const matches = await this.fetchAllEvents();
    return matches.find(m => m.id === matchId) || null;
  }

  async getLeagues(): Promise<League[]> {
    const matches = await this.fetchAllEvents();
    const leaguesMap = new Map<string, League>();
    matches.forEach(m => leaguesMap.set(m.league.id, m.league));
    return Array.from(leaguesMap.values());
  }

  async getTeams(query: string): Promise<Team[]> {
    const matches = await this.fetchAllEvents();
    const teamsMap = new Map<string, Team>();
    matches.forEach(m => {
      if (m.homeTeam) teamsMap.set(m.homeTeam.id, m.homeTeam);
      if (m.awayTeam) teamsMap.set(m.awayTeam.id, m.awayTeam);
    });
    
    const teams = Array.from(teamsMap.values());
    if (query) {
      return teams.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
    }
    return teams;
  }

  async getStreams(matchId: string): Promise<StreamSource[]> {
    const match = await this.getMatchDetails(matchId);
    if (!match || !(match as any)._rawChannels) return [];
    
    const rawChannels = (match as any)._rawChannels;
    
    return rawChannels.map((ch: any) => {
      return {
        id: ch.channel_name,
        providerId: this.id,
        matchId: matchId,
        title: ch.channel_name,
        url: ch.url, // This is an iframe url
        type: 'IFRAME',
        quality: 'Auto',
        language: (ch.channel_code || '').toUpperCase(),
        status: 'AVAILABLE'
      } as StreamSource;
    });
  }
}
