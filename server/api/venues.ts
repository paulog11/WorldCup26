import { defineEventHandler, getQuery } from 'h3'
import { getSeedData } from '../utils/api-client'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { id } = query as { id?: string }

  const venues = getSeedData().venues

  if (id) {
    return venues.find((v) => v.id === id) || null
  }

  return venues
})
