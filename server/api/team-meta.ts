import { defineEventHandler, getQuery } from 'h3'
import { getTeamMeta, getSeedData } from '../utils/api-client'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { team } = query as { team?: string }

  if (team) {
    return getTeamMeta(team) || null
  }

  return getSeedData().teamMeta
})
