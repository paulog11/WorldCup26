import type {
  ApiFixture,
  ApiLineup,
  ApiStanding,
  ApiTopScorer,
} from './api-football'

export interface IdMapping {
  teams: Record<string, number>   // "bra" → 6
  players: Record<string, number> // "p0001" → 12345
}

export interface LiveMatch {
  id: string
  homeScore: number | null
  awayScore: number | null
  status: 'scheduled' | 'in_progress' | 'completed'
  homeLineup: { starting: string[]; subs: string[] } | null
  awayLineup: { starting: string[]; subs: string[] } | null
}

export interface LiveStanding {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface LivePlayerStat {
  playerId: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

export interface LiveSnapshot {
  fetchedAt: number
  matches: Record<string, LiveMatch>
  standings: Record<string, LiveStanding[]>
  playerStats: Record<string, LivePlayerStat>
}

// Maps API-Football fixture status codes to our status values
function mapStatus(short: string): 'scheduled' | 'in_progress' | 'completed' {
  if (['NS', 'TBD', 'PST', 'CANC', 'ABD', 'AWD', 'WO'].includes(short)) return 'scheduled'
  if (['FT', 'AET', 'PEN'].includes(short)) return 'completed'
  return 'in_progress'
}

// Inverted maps: apiId → ourId
function buildInvertedTeamMap(mapping: IdMapping): Map<number, string> {
  const m = new Map<number, string>()
  for (const [ourId, apiId] of Object.entries(mapping.teams)) {
    m.set(apiId, ourId)
  }
  return m
}

function buildInvertedPlayerMap(mapping: IdMapping): Map<number, string> {
  const m = new Map<number, string>()
  for (const [ourId, apiId] of Object.entries(mapping.players)) {
    m.set(apiId, ourId)
  }
  return m
}

export function transformFixtures(
  fixtures: ApiFixture[],
  lineupsByFixtureId: Map<number, ApiLineup[]>,
  mapping: IdMapping,
  // matchIdMap: apiFixtureId → our matchId (built from seed data at Worker startup)
  fixtureToMatchId: Map<number, string>
): Record<string, LiveMatch> {
  const result: Record<string, LiveMatch> = {}

  for (const f of fixtures) {
    const ourMatchId = fixtureToMatchId.get(f.fixture.id)
    if (!ourMatchId) continue

    const lineups = lineupsByFixtureId.get(f.fixture.id)
    const invertedPlayers = buildInvertedPlayerMap(mapping)

    function transformLineup(lineup: ApiLineup | undefined) {
      if (!lineup) return null
      return {
        starting: lineup.startXI.map((e) => invertedPlayers.get(e.player.id) ?? String(e.player.id)),
        subs: lineup.substitutes.map((e) => invertedPlayers.get(e.player.id) ?? String(e.player.id)),
      }
    }

    result[ourMatchId] = {
      id: ourMatchId,
      homeScore: f.goals.home,
      awayScore: f.goals.away,
      status: mapStatus(f.fixture.status.short),
      homeLineup: transformLineup(lineups?.find((l) => l.team.id === f.teams.home.id)),
      awayLineup: transformLineup(lineups?.find((l) => l.team.id === f.teams.away.id)),
    }
  }

  return result
}

export function transformStandings(
  standingGroups: ApiStanding[][],
  mapping: IdMapping
): Record<string, LiveStanding[]> {
  const invertedTeams = buildInvertedTeamMap(mapping)
  const result: Record<string, LiveStanding[]> = {}

  for (const group of standingGroups) {
    for (const entry of group) {
      const ourTeamId = invertedTeams.get(entry.team.id)
      if (!ourTeamId) continue

      // API-Football group name looks like "Group A" — extract the letter
      const groupLetter = entry.group.replace(/^Group\s+/i, '').trim()
      if (!result[groupLetter]) result[groupLetter] = []

      result[groupLetter].push({
        teamId: ourTeamId,
        played: entry.all.played,
        won: entry.all.win,
        drawn: entry.all.draw,
        lost: entry.all.lose,
        goalsFor: entry.all.goals.for,
        goalsAgainst: entry.all.goals.against,
        goalDifference: entry.goalsDiff,
        points: entry.points,
      })
    }
  }

  return result
}

export function transformPlayerStats(
  topScorers: ApiTopScorer[],
  topAssists: ApiTopScorer[],
  mapping: IdMapping
): Record<string, LivePlayerStat> {
  const invertedPlayers = buildInvertedPlayerMap(mapping)
  const result: Record<string, LivePlayerStat> = {}

  function ensureEntry(apiPlayerId: number): LivePlayerStat | null {
    const ourId = invertedPlayers.get(apiPlayerId)
    if (!ourId) return null
    if (!result[ourId]) {
      result[ourId] = { playerId: ourId, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
    }
    return result[ourId]
  }

  for (const scorer of topScorers) {
    const entry = ensureEntry(scorer.player.id)
    if (!entry) continue
    const stats = scorer.statistics[0]
    if (!stats) continue
    entry.goals = stats.goals.total ?? 0
    entry.yellowCards = stats.cards.yellow ?? 0
    entry.redCards = stats.cards.red ?? 0
  }

  for (const assister of topAssists) {
    const entry = ensureEntry(assister.player.id)
    if (!entry) continue
    const stats = assister.statistics[0]
    if (!stats) continue
    entry.assists = stats.goals.assists ?? 0
  }

  return result
}
