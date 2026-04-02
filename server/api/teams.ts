import { defineEventHandler, getQuery } from 'h3'
import { getSeedData } from '../utils/api-client'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { id, group } = query as { id?: string; group?: string }

  let teams = getSeedData().teams

  if (id) {
    return teams.find((t) => t.id === id) || null
  }

  if (group) {
    teams = teams.filter((t) => t.group === group)
  }

  return teams
})
