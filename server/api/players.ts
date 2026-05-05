import { defineEventHandler, getQuery } from 'h3'
import { getSeedData, getPlayersByTeam, getTeamById } from '../utils/api-client'
import { getLiveSnapshot } from '../utils/live-snapshot'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { team, id } = query as { team?: string; id?: string }
  const snapshot = await getLiveSnapshot(event)

  function overlayStats(player: any) {
    const live = snapshot?.playerStats[player.id]
    if (!live) return player
    return {
      ...player,
      goals: live.goals,
      assists: live.assists,
      yellowCards: live.yellowCards,
      redCards: live.redCards,
    }
  }

  if (id) {
    const data = getSeedData()
    const player = data.players.find((p) => p.id === id)
    if (!player) return null
    const playerTeam = getTeamById(player.teamId)
    return overlayStats({ ...player, team: playerTeam || null })
  }

  if (team) {
    return getPlayersByTeam(team).map(overlayStats)
  }

  return getSeedData().players.map(overlayStats)
})
