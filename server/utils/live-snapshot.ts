import type { H3Event } from 'h3'

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
  matches: Record<string, LiveMatch>        // keyed by our match id (e.g. "m1")
  standings: Record<string, LiveStanding[]> // keyed by group letter
  playerStats: Record<string, LivePlayerStat> // keyed by our player id
}

const SNAPSHOT_KEY = 'wc26:snapshot'

export async function getLiveSnapshot(event: H3Event): Promise<LiveSnapshot | null> {
  // Return cached version for this request if already fetched
  if (event.context._liveSnapshot !== undefined) {
    return event.context._liveSnapshot as LiveSnapshot | null
  }

  const env = (event.context as any).cloudflare?.env
  if (!env?.LIVE_CACHE) {
    event.context._liveSnapshot = null
    return null
  }

  try {
    const raw = await env.LIVE_CACHE.get(SNAPSHOT_KEY)
    const snapshot = raw ? (JSON.parse(raw) as LiveSnapshot) : null
    event.context._liveSnapshot = snapshot
    return snapshot
  } catch {
    event.context._liveSnapshot = null
    return null
  }
}
