import { defineEventHandler, getQuery } from 'h3'
import { getSeedData, getTeamById } from '../utils/api-client'

interface StandingEntry {
  team: ReturnType<typeof getTeamById>
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

function computeStandings(groupName: string): StandingEntry[] {
  const data = getSeedData()
  const teams = data.teams.filter((t) => t.group === groupName)
  const matches = data.matches.filter(
    (m) => m.group === groupName && m.status === 'completed'
  )

  const standings = new Map<string, StandingEntry>()

  for (const team of teams) {
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

  for (const match of matches) {
    if (match.homeTeamId && match.awayTeamId && match.homeScore !== null && match.awayScore !== null) {
      const home = standings.get(match.homeTeamId)
      const away = standings.get(match.awayTeamId)
      if (!home || !away) continue

      home.played++
      away.played++
      home.goalsFor += match.homeScore
      home.goalsAgainst += match.awayScore
      away.goalsFor += match.awayScore
      away.goalsAgainst += match.homeScore

      if (match.homeScore > match.awayScore) {
        home.won++
        home.points += 3
        away.lost++
      } else if (match.homeScore < match.awayScore) {
        away.won++
        away.points += 3
        home.lost++
      } else {
        home.drawn++
        away.drawn++
        home.points += 1
        away.points += 1
      }
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
    return a.team!.name.localeCompare(b.team!.name)
  })

  return result
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { group } = query as { group?: string }

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

  if (group) {
    return computeStandings(group)
  }

  const allStandings: Record<string, StandingEntry[]> = {}
  for (const g of groups) {
    allStandings[g] = computeStandings(g)
  }
  return allStandings
})
