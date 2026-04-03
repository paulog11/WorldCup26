import type { Match, Team, Standing } from '~/types'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
const STORAGE_KEY = 'wc26-group-predictions'

export interface MatchPrediction {
  homeScore: number | null
  awayScore: number | null
}

function computeGroupStandings(
  groupName: string,
  groupMatches: Match[],
  predictions: Record<string, MatchPrediction>
): Standing[] {
  // Gather the 4 teams in this group from match data
  const teamMap = new Map<string, Team>()
  for (const match of groupMatches) {
    if (match.homeTeam) teamMap.set(match.homeTeam.id, match.homeTeam)
    if (match.awayTeam) teamMap.set(match.awayTeam.id, match.awayTeam)
  }

  const standings = new Map<string, Standing>()
  for (const team of teamMap.values()) {
    standings.set(team.id, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    })
  }

  for (const match of groupMatches) {
    const pred = predictions[match.id]
    if (!pred || pred.homeScore === null || pred.awayScore === null) continue
    if (!match.homeTeam || !match.awayTeam) continue

    const home = standings.get(match.homeTeam.id)
    const away = standings.get(match.awayTeam.id)
    if (!home || !away) continue

    const hs = pred.homeScore
    const as_ = pred.awayScore

    home.played++
    away.played++
    home.goalsFor += hs
    home.goalsAgainst += as_
    away.goalsFor += as_
    away.goalsAgainst += hs

    if (hs > as_) {
      home.won++; home.points += 3
      away.lost++
    } else if (hs < as_) {
      away.won++; away.points += 3
      home.lost++
    } else {
      home.drawn++; home.points++
      away.drawn++; away.points++
    }
  }

  const result = Array.from(standings.values())
  for (const entry of result) {
    entry.goalDifference = entry.goalsFor - entry.goalsAgainst
  }

  result.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return a.team.name.localeCompare(b.team.name)
  })

  return result
}

export function useGroupPredictions() {
  // Fetch all 72 group stage matches (already includes homeTeam/awayTeam objects from API)
  const { data: rawMatches } = useFetch<Match[]>('/api/matches', {
    query: { stage: 'group' },
  })

  const groupMatches = computed((): Match[] => (rawMatches.value as Match[]) ?? [])

  // matchId → { homeScore, awayScore }
  const predictions = ref<Record<string, MatchPrediction>>({})

  if (import.meta.client) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) predictions.value = JSON.parse(saved)
    } catch {}
  }

  function savePredictions() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions.value))
    }
  }

  function predict(matchId: string, homeScore: number | null, awayScore: number | null) {
    predictions.value = { ...predictions.value, [matchId]: { homeScore, awayScore } }
    savePredictions()
  }

  function resetPredictions() {
    predictions.value = {}
    savePredictions()
  }

  // Group matches split by group letter
  const matchesByGroup = computed(() => {
    const map: Record<string, Match[]> = {}
    for (const g of GROUPS) map[g] = []
    for (const match of groupMatches.value) {
      if (match.group && map[match.group]) {
        map[match.group].push(match)
      }
    }
    // Sort each group's matches by date/matchday
    for (const g of GROUPS) {
      map[g].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    }
    return map
  })

  // Computed standings for all 12 groups derived purely from predictions
  const predictedStandings = computed((): Record<string, Standing[]> | null => {
    if (!rawMatches.value) return null
    const result: Record<string, Standing[]> = {}
    for (const g of GROUPS) {
      result[g] = computeGroupStandings(g, matchesByGroup.value[g] ?? [], predictions.value)
    }
    return result
  })

  // Count of completed predictions
  const predictedCount = computed(() =>
    Object.values(predictions.value).filter(
      p => p.homeScore !== null && p.awayScore !== null
    ).length
  )

  return {
    groupMatches,
    matchesByGroup,
    predictions,
    predict,
    resetPredictions,
    predictedStandings,
    predictedCount,
    totalGroupMatches: 72,
  }
}
