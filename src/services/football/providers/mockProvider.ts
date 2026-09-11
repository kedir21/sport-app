import { FootballProvider } from './types';
import { MatchInfo, StreamSource, League, Team } from '@/types/football';
import { addHours, subHours, addDays } from 'date-fns';

const MOCK_LEAGUES: League[] = [
  { id: 'l1', name: 'Premier League', country: 'England', logoUrl: 'https://cdn.worldvectorlogo.com/logos/premier-league-2.svg', type: 'LEAGUE' },
  { id: 'l2', name: 'La Liga', country: 'Spain', logoUrl: 'https://cdn.worldvectorlogo.com/logos/la-liga-1.svg', type: 'LEAGUE' },
  { id: 'l3', name: 'Champions League', country: 'Europe', logoUrl: 'https://cdn.worldvectorlogo.com/logos/uefa-champions-league.svg', type: 'CUP' },
];

const MOCK_TEAMS: Team[] = [
  { id: 't1', name: 'Arsenal FC', shortName: 'ARS', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', country: 'England' },
  { id: 't2', name: 'Manchester City', shortName: 'MCI', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', country: 'England' },
  { id: 't3', name: 'Real Madrid', shortName: 'RMA', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', country: 'Spain' },
  { id: 't4', name: 'Barcelona', shortName: 'BAR', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg', country: 'Spain' },
  { id: 't5', name: 'Liverpool', shortName: 'LIV', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', country: 'England' },
  { id: 't6', name: 'Chelsea', shortName: 'CHE', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg', country: 'England' },
];

const now = new Date();

const MOCK_MATCHES: MatchInfo[] = [
  {
    id: 'm1',
    league: MOCK_LEAGUES[0],
    homeTeam: MOCK_TEAMS[0], // Arsenal
    awayTeam: MOCK_TEAMS[1], // Man City
    kickoff: subHours(now, 1).toISOString(), // Started 1 hr ago
    status: 'LIVE',
    score: { home: 2, away: 1 },
    minute: "67'",
    venue: 'Emirates Stadium',
  },
  {
    id: 'm2',
    league: MOCK_LEAGUES[1],
    homeTeam: MOCK_TEAMS[2], // Real Madrid
    awayTeam: MOCK_TEAMS[3], // Barcelona
    kickoff: addHours(now, 2).toISOString(),
    status: 'UPCOMING',
    venue: 'Santiago Bernabéu',
  },
  {
    id: 'm3',
    league: MOCK_LEAGUES[0],
    homeTeam: MOCK_TEAMS[4], // Liverpool
    awayTeam: MOCK_TEAMS[5], // Chelsea
    kickoff: subHours(now, 3).toISOString(),
    status: 'FINISHED',
    score: { home: 1, away: 1 },
    venue: 'Anfield',
  }
];

export class MockFootballProvider implements FootballProvider {
  id = 'mock_provider';
  name = 'Mock Data Provider';

  async getMatches(date: Date): Promise<MatchInfo[]> {
    return MOCK_MATCHES;
  }

  async getLiveMatches(): Promise<MatchInfo[]> {
    return MOCK_MATCHES.filter(m => m.status === 'LIVE');
  }

  async getUpcomingMatches(limit?: number): Promise<MatchInfo[]> {
    const upcoming = MOCK_MATCHES.filter(m => m.status === 'UPCOMING');
    return limit ? upcoming.slice(0, limit) : upcoming;
  }

  async getMatchDetails(matchId: string): Promise<MatchInfo | null> {
    return MOCK_MATCHES.find(m => m.id === matchId) || null;
  }

  async getLeagues(): Promise<League[]> {
    return MOCK_LEAGUES;
  }

  async getTeams(query: string): Promise<Team[]> {
    return MOCK_TEAMS.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  }

  async getStreams(matchId: string): Promise<StreamSource[]> {
    return [
      {
        id: 's1',
        providerId: this.id,
        matchId,
        title: 'Main Broadcast (EN)',
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Public test stream
        type: 'HLS',
        quality: '1080p',
        language: 'EN',
        status: 'AVAILABLE'
      },
      {
        id: 's2',
        providerId: this.id,
        matchId,
        title: 'Backup Stream',
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        type: 'HLS',
        quality: '720p',
        language: 'EN',
        status: 'AVAILABLE'
      }
    ];
  }
}
