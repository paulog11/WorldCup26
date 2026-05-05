import {
  fetchTodayFixtures,
  fetchFixtureLineups,
  fetchStandings,
  fetchTopScorers,
  fetchTopAssists,
} from './api-football'
import {
  transformFixtures,
  transformStandings,
  transformPlayerStats,
  type IdMapping,
  type LiveSnapshot,
} from './transform'
import idMapping from '../../data/id-mapping.json'

export interface Env {
  LIVE_CACHE: KVNamespace
  RAPIDAPI_KEY: string
}

const SNAPSHOT_KEY = 'wc26:snapshot'
const TOURNAMENT_START = new Date('2026-06-11T00:00:00Z')
const TOURNAMENT_END = new Date('2026-07-20T00:00:00Z')

// Build a map of API-Football fixture ID → our match ID.
// The mapping is built once at module load from the id-mapping file.
// The fixture IDs are stored in id-mapping.json under "fixtures".
function buildFixtureToMatchIdMap(mapping: IdMapping & { fixtures?: Record<string, number> }): Map<number, string> {
  const m = new Map<number, string>()
  if (mapping.fixtures) {
    for (const [ourMatchId, apiFixtureId] of Object.entries(mapping.fixtures)) {
      m.set(apiFixtureId, ourMatchId)
    }
  }
  return m
}

function isTournamentActive(): boolean {
  const now = new Date()
  return now >= TOURNAMENT_START && now <= TOURNAMENT_END
}

// Returns true if there are likely matches happening ±3 hours from now.
// Used to skip lineup fetches when no matches are imminent.
function isMatchWindow(): boolean {
  const hour = new Date().getUTCHours()
  // Matches typically kick off between 17:00–23:00 UTC. Fetch lineups 3h before.
  return hour >= 14 && hour <= 23
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    if (!isTournamentActive()) {
      // Outside tournament: write a minimal heartbeat so KV has something fresh.
      const snapshot: LiveSnapshot = {
        fetchedAt: Date.now(),
        matches: {},
        standings: {},
        playerStats: {},
      }
      await env.LIVE_CACHE.put(SNAPSHOT_KEY, JSON.stringify(snapshot))
      return
    }

    const apiKey = env.RAPIDAPI_KEY
    const mapping = idMapping as IdMapping & { fixtures?: Record<string, number> }
    const fixtureToMatchId = buildFixtureToMatchIdMap(mapping)

    // Fetch today's fixtures (always)
    const fixtures = await fetchTodayFixtures(apiKey)

    // Fetch lineups only during match windows (saves API quota)
    const lineupsByFixtureId = new Map<number, import('./api-football').ApiLineup[]>()
    if (isMatchWindow()) {
      await Promise.all(
        fixtures.map(async (f) => {
          try {
            const lineups = await fetchFixtureLineups(f.fixture.id, apiKey)
            if (lineups.length > 0) lineupsByFixtureId.set(f.fixture.id, lineups)
          } catch {
            // Non-fatal: lineup fetch failed for this fixture
          }
        })
      )
    }

    // Fetch standings and player stats in parallel
    const [standingGroups, topScorers, topAssists] = await Promise.all([
      fetchStandings(apiKey),
      fetchTopScorers(apiKey),
      fetchTopAssists(apiKey),
    ])

    const snapshot: LiveSnapshot = {
      fetchedAt: Date.now(),
      matches: transformFixtures(fixtures, lineupsByFixtureId, mapping, fixtureToMatchId),
      standings: transformStandings(standingGroups, mapping),
      playerStats: transformPlayerStats(topScorers, topAssists, mapping),
    }

    await env.LIVE_CACHE.put(SNAPSHOT_KEY, JSON.stringify(snapshot))
  },
}
