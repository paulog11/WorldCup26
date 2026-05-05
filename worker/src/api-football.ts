const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3'
const WC_LEAGUE_ID = 1    // FIFA World Cup
const WC_SEASON = 2026

export interface ApiFixture {
  fixture: {
    id: number
    status: { short: string } // 'NS' | '1H' | 'HT' | '2H' | 'FT' | 'AET' | 'PEN'
  }
  teams: {
    home: { id: number; name: string; winner: boolean | null }
    away: { id: number; name: string; winner: boolean | null }
  }
  goals: { home: number | null; away: number | null }
  score: { halftime: { home: number | null; away: number | null } }
}

export interface ApiLineupPlayer {
  player: { id: number; name: string; number: number; pos: string }
}

export interface ApiLineup {
  team: { id: number }
  formation: string
  startXI: ApiLineupPlayer[]
  substitutes: ApiLineupPlayer[]
}

export interface ApiStanding {
  team: { id: number; name: string }
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } }
  goalsDiff: number
  points: number
  group: string
}

export interface ApiTopScorer {
  player: { id: number; name: string }
  statistics: Array<{
    team: { id: number }
    goals: { total: number | null; assists: number | null }
    cards: { yellow: number; red: number }
  }>
}

async function apiFetch<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      'x-rapidapi-key': apiKey,
    },
  })
  if (!res.ok) throw new Error(`API-Football ${path} returned ${res.status}`)
  const json = await res.json() as { response: T }
  return json.response
}

export async function fetchTodayFixtures(apiKey: string): Promise<ApiFixture[]> {
  const today = new Date().toISOString().slice(0, 10)
  return apiFetch<ApiFixture[]>(
    `/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}&date=${today}`,
    apiKey
  )
}

export async function fetchFixtureLineups(fixtureId: number, apiKey: string): Promise<ApiLineup[]> {
  return apiFetch<ApiLineup[]>(`/fixtures/lineups?fixture=${fixtureId}`, apiKey)
}

export async function fetchStandings(apiKey: string): Promise<ApiStanding[][]> {
  return apiFetch<ApiStanding[][]>(
    `/standings?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
    apiKey
  )
}

export async function fetchTopScorers(apiKey: string): Promise<ApiTopScorer[]> {
  return apiFetch<ApiTopScorer[]>(
    `/players/topscorers?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
    apiKey
  )
}

export async function fetchTopAssists(apiKey: string): Promise<ApiTopScorer[]> {
  return apiFetch<ApiTopScorer[]>(
    `/players/topassists?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
    apiKey
  )
}
