import { defineEventHandler, getQuery } from 'h3'
import { getSeedData, getTeamById, getVenueById } from '../utils/api-client'
import { getLiveSnapshot } from '../utils/live-snapshot'

function resolveMatch(match: any) {
  return {
    ...match,
    homeTeam: match.homeTeamId ? getTeamById(match.homeTeamId) : null,
    awayTeam: match.awayTeamId ? getTeamById(match.awayTeamId) : null,
    venueDetails: getVenueById(match.venue) || null,
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { group, date, team, stage } = query as {
    group?: string
    date?: string
    team?: string
    stage?: string
  }

  let matches = getSeedData().matches

  if (group) {
    matches = matches.filter((m) => m.group === group)
  }

  if (date) {
    matches = matches.filter((m) => m.date === date)
  }

  if (team) {
    matches = matches.filter(
      (m) => m.homeTeamId === team || m.awayTeamId === team
    )
  }

  if (stage) {
    matches = matches.filter((m) => m.stage === stage)
  }

  const resolved = matches.map(resolveMatch)

  const snapshot = await getLiveSnapshot(event)
  if (!snapshot) return resolved

  return resolved.map((m: any) => {
    const live = snapshot.matches[m.id]
    if (!live) return m
    return {
      ...m,
      homeScore: live.homeScore ?? m.homeScore,
      awayScore: live.awayScore ?? m.awayScore,
      status: live.status ?? m.status,
      homeLineup: live.homeLineup ?? m.homeLineup,
      awayLineup: live.awayLineup ?? m.awayLineup,
    }
  })
})
