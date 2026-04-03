import type { ComputedRef } from 'vue'
import type { Team, Match, Standing } from '~/types'

// R32 slot labels (e.g. '1A' = winner group A, '2C' = runner-up group C, '3rd-1' = best 3rd place #1)
// m73-m84: 12 matches pairing group winners vs runners-up (cross-group, no same-group clashes)
// m85-m88: 4 matches pairing the 8 best third-place finishers
const R32_SEEDING: Record<string, { home: string; away: string }> = {
  m73: { home: '1A', away: '2C' },
  m74: { home: '1C', away: '2A' },
  m75: { home: '1B', away: '2D' },
  m76: { home: '1D', away: '2B' },
  m77: { home: '1E', away: '2G' },
  m78: { home: '1G', away: '2E' },
  m79: { home: '1F', away: '2H' },
  m80: { home: '1H', away: '2F' },
  m81: { home: '1I', away: '2K' },
  m82: { home: '1K', away: '2I' },
  m83: { home: '1J', away: '2L' },
  m84: { home: '1L', away: '2J' },
  m85: { home: '3rd-1', away: '3rd-2' },
  m86: { home: '3rd-3', away: '3rd-4' },
  m87: { home: '3rd-5', away: '3rd-6' },
  m88: { home: '3rd-7', away: '3rd-8' },
}

// Maps each R16 match to which two R32 match winners feed it
const R16_FEEDS: Record<string, [string, string]> = {
  m89: ['m73', 'm74'],
  m90: ['m75', 'm76'],
  m91: ['m77', 'm78'],
  m92: ['m79', 'm80'],
  m93: ['m81', 'm82'],
  m94: ['m83', 'm84'],
  m95: ['m85', 'm86'],
  m96: ['m87', 'm88'],
}

const QF_FEEDS: Record<string, [string, string]> = {
  m97: ['m89', 'm90'],
  m98: ['m91', 'm92'],
  m99: ['m93', 'm94'],
  m100: ['m95', 'm96'],
}

const SF_FEEDS: Record<string, [string, string]> = {
  m101: ['m97', 'm98'],
  m102: ['m99', 'm100'],
}

const STORAGE_KEY = 'wc26-bracket-picks'

export interface BracketTeam extends Team {
  slot?: string
}

export interface BracketMatch {
  matchId: string
  stage: string
  date: string
  time: string
  venue: string
  homeTeam: BracketTeam | null
  awayTeam: BracketTeam | null
  homeSlot: string
  awaySlot: string
  winnerId: string | null
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export function useBracket(
  externalStandings: ComputedRef<Record<string, Standing[]> | null>
) {
  // Fetch all knockout matches
  const { data: knockoutMatchesRaw } = useFetch<Match[]>('/api/matches', {
    query: { stage: 'round-of-32' },
  })
  const { data: r16Raw } = useFetch<Match[]>('/api/matches', { query: { stage: 'round-of-16' } })
  const { data: qfRaw } = useFetch<Match[]>('/api/matches', { query: { stage: 'quarter-final' } })
  const { data: sfRaw } = useFetch<Match[]>('/api/matches', { query: { stage: 'semi-final' } })
  const { data: thirdRaw } = useFetch<Match[]>('/api/matches', { query: { stage: 'third-place' } })
  const { data: finalRaw } = useFetch<Match[]>('/api/matches', { query: { stage: 'final' } })

  // User picks: matchId → winning teamId
  const picks = ref<Record<string, string>>({})

  if (import.meta.client) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) picks.value = JSON.parse(saved)
    } catch {}
  }

  function savePicks() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(picks.value))
    }
  }

  function pickWinner(matchId: string, teamId: string) {
    if (picks.value[matchId] === teamId) {
      const updated = { ...picks.value }
      delete updated[matchId]
      picks.value = updated
    } else {
      picks.value = { ...picks.value, [matchId]: teamId }
      clearDownstreamPicks(matchId)
    }
    savePicks()
  }

  function clearDownstreamPicks(matchId: string) {
    const dependents = findDependents(matchId)
    const updated = { ...picks.value }
    for (const dep of dependents) {
      delete updated[dep]
    }
    picks.value = updated
  }

  function findDependents(matchId: string): string[] {
    const result: string[] = []
    const allFeeds = { ...R16_FEEDS, ...QF_FEEDS, ...SF_FEEDS }
    for (const [nextId, feeds] of Object.entries(allFeeds)) {
      if ((feeds as string[]).includes(matchId)) {
        result.push(nextId)
        result.push(...findDependents(nextId))
      }
    }
    if ((['m101', 'm102'] as string[]).includes(matchId)) result.push('m103')
    if ((['m101', 'm102'] as string[]).includes(matchId)) result.push('m104')
    return [...new Set(result)]
  }

  function resetPicks() {
    picks.value = {}
    savePicks()
  }

  // Derive qualified teams from provided standings
  const qualifiedTeams = computed(() => {
    const raw = externalStandings.value
    if (!raw) return null

    const winners: Record<string, Team> = {}
    const runners: Record<string, Team> = {}
    const thirds: Standing[] = []

    for (const group of GROUPS) {
      const groupStandings: Standing[] = raw[group] ?? []
      if (groupStandings.length >= 1) winners[`1${group}`] = groupStandings[0].team
      if (groupStandings.length >= 2) runners[`2${group}`] = groupStandings[1].team
      if (groupStandings.length >= 3) thirds.push(groupStandings[2])
    }

    // Rank third-place teams
    const rankedThirds = [...thirds].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    const thirdSlots: Record<string, Team> = {}
    rankedThirds.slice(0, 8).forEach((s, i) => {
      thirdSlots[`3rd-${i + 1}`] = s.team
    })

    return { ...winners, ...runners, ...thirdSlots }
  })

  function resolveTeam(slot: string, feeder?: string): BracketTeam | null {
    const qt = qualifiedTeams.value
    if (!qt) return null

    if (qt[slot]) return { ...qt[slot], slot }

    if (feeder) {
      const winnerId = picks.value[feeder]
      if (!winnerId) return null
      const team = Object.values(qt).find(t => t.id === winnerId)
      return team ? { ...team } : null
    }

    return null
  }

  function buildBracketMatch(
    matchId: string,
    homeSlot: string,
    awaySlot: string,
    homeFeeder?: string,
    awayFeeder?: string,
    rawMatch?: Match | null
  ): BracketMatch {
    return {
      matchId,
      stage: rawMatch?.stage ?? '',
      date: (rawMatch as any)?.date ?? '',
      time: (rawMatch as any)?.time ?? '',
      venue: (rawMatch as any)?.venue ?? '',
      homeSlot,
      awaySlot,
      homeTeam: resolveTeam(homeSlot, homeFeeder),
      awayTeam: resolveTeam(awaySlot, awayFeeder),
      winnerId: picks.value[matchId] ?? null,
    }
  }

  function getMatchById(id: string, allRaw: Match[][]): Match | null {
    for (const arr of allRaw) {
      const found = arr?.find?.((m: Match) => m.id === id)
      if (found) return found
    }
    return null
  }

  const allRawMatches = computed(() => [
    (knockoutMatchesRaw.value as Match[]) ?? [],
    (r16Raw.value as Match[]) ?? [],
    (qfRaw.value as Match[]) ?? [],
    (sfRaw.value as Match[]) ?? [],
    (thirdRaw.value as Match[]) ?? [],
    (finalRaw.value as Match[]) ?? [],
  ])

  const r32Matches = computed((): BracketMatch[] =>
    Object.entries(R32_SEEDING).map(([matchId, seeding]) => {
      const raw = getMatchById(matchId, allRawMatches.value)
      return buildBracketMatch(matchId, seeding.home, seeding.away, undefined, undefined, raw)
    })
  )

  const r16Matches = computed((): BracketMatch[] =>
    Object.entries(R16_FEEDS).map(([matchId, [homeFeeder, awayFeeder]]) => {
      const raw = getMatchById(matchId, allRawMatches.value)
      return buildBracketMatch(matchId, `W-${homeFeeder}`, `W-${awayFeeder}`, homeFeeder, awayFeeder, raw)
    })
  )

  const qfMatches = computed((): BracketMatch[] =>
    Object.entries(QF_FEEDS).map(([matchId, [homeFeeder, awayFeeder]]) => {
      const raw = getMatchById(matchId, allRawMatches.value)
      return buildBracketMatch(matchId, `W-${homeFeeder}`, `W-${awayFeeder}`, homeFeeder, awayFeeder, raw)
    })
  )

  const sfMatches = computed((): BracketMatch[] =>
    Object.entries(SF_FEEDS).map(([matchId, [homeFeeder, awayFeeder]]) => {
      const raw = getMatchById(matchId, allRawMatches.value)
      return buildBracketMatch(matchId, `W-${homeFeeder}`, `W-${awayFeeder}`, homeFeeder, awayFeeder, raw)
    })
  )

  const thirdPlaceMatch = computed((): BracketMatch | null => {
    const raw = getMatchById('m103', allRawMatches.value)
    return buildBracketMatch('m103', 'L-m101', 'L-m102', undefined, undefined, raw)
  })

  const finalMatch = computed((): BracketMatch | null => {
    const raw = getMatchById('m104', allRawMatches.value)
    return buildBracketMatch('m104', 'W-m101', 'W-m102', 'm101', 'm102', raw)
  })

  const isLoading = computed(() => !knockoutMatchesRaw.value)

  return {
    isLoading,
    r32Matches,
    r16Matches,
    qfMatches,
    sfMatches,
    thirdPlaceMatch,
    finalMatch,
    picks,
    pickWinner,
    resetPicks,
  }
}
