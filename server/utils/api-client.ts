import { readFileSync } from 'fs'
import { resolve } from 'path'

interface Team {
  id: string
  name: string
  code: string
  flag: string
  group: string
  confederation: string
}

interface Venue {
  id: string
  name: string
  city: string
  country: string
  capacity: number
  image: string
}

interface Match {
  id: string
  group: string | null
  stage: string
  homeTeamId: string | null
  awayTeamId: string | null
  homeScore: number | null
  awayScore: number | null
  date: string
  time: string
  venue: string
  status: string
  matchday: number
}

interface SeedData {
  tournament: {
    name: string
    startDate: string
    endDate: string
    hostCountries: string[]
  }
  venues: Venue[]
  teams: Team[]
  matches: Match[]
}

let cachedData: SeedData | null = null

export function getSeedData(): SeedData {
  if (!cachedData) {
    const filePath = resolve(process.cwd(), 'data/seed.json')
    const raw = readFileSync(filePath, 'utf-8')
    cachedData = JSON.parse(raw) as SeedData
  }
  return cachedData
}

export function getTeamById(id: string): Team | undefined {
  const data = getSeedData()
  return data.teams.find((t) => t.id === id)
}

export function getVenueById(id: string): Venue | undefined {
  const data = getSeedData()
  return data.venues.find((v) => v.id === id)
}

export function getMatchesByGroup(group: string): Match[] {
  const data = getSeedData()
  return data.matches.filter((m) => m.group === group)
}

export function getMatchesByDate(date: string): Match[] {
  const data = getSeedData()
  return data.matches.filter((m) => m.date === date)
}

export function getMatchesByVenue(venueId: string): Match[] {
  const data = getSeedData()
  return data.matches.filter((m) => m.venue === venueId)
}

export function getMatchesByTeam(teamId: string): Match[] {
  const data = getSeedData()
  return data.matches.filter(
    (m) => m.homeTeamId === teamId || m.awayTeamId === teamId
  )
}
