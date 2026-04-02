import { defineEventHandler, getQuery } from 'h3'
import { getSeedData, getPlayersByTeam, getTeamById } from '../utils/api-client'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { team, id } = query as { team?: string; id?: string }

  if (id) {
    const data = getSeedData()
    const player = data.players.find((p) => p.id === id)
    if (!player) return null
    const playerTeam = getTeamById(player.teamId)
    return { ...player, team: playerTeam || null }
  }

  if (team) {
    return getPlayersByTeam(team)
  }

  return getSeedData().players
})
