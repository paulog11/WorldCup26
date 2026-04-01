import { defineEventHandler, getQuery } from 'h3'
import { getSeedData, getTeamById, getVenueById } from '../utils/api-client'

function resolveMatch(match: any) {
  return {
    ...match,
    homeTeam: match.homeTeamId ? getTeamById(match.homeTeamId) : null,
    awayTeam: match.awayTeamId ? getTeamById(match.awayTeamId) : null,
    venueDetails: getVenueById(match.venue) || null,
  }
}

export default defineEventHandler((event) => {
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

  return matches.map(resolveMatch)
})
