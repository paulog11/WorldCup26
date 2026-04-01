export interface Team {
  id: string
  name: string
  code: string // FIFA 3-letter code
  flag: string // path to flag image
  group: string
  confederation: string
}

export interface Player {
  id: string
  name: string
  number: number
  position: 'GK' | 'DF' | 'MF' | 'FW'
  teamId: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

export interface Match {
  id: string
  group: string | null // null for knockout matches
  stage: 'group' | 'round-of-32' | 'round-of-16' | 'quarter-final' | 'semi-final' | 'third-place' | 'final'
  homeTeam: Team | null
  awayTeam: Team | null
  homeScore: number | null
  awayScore: number | null
  date: string // ISO date string
  time: string // e.g. "21:00"
  venue: string // venue id
  status: 'scheduled' | 'live' | 'completed'
  matchday: number
}

export interface Standing {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface Group {
  name: string // e.g. "A"
  teams: Team[]
  standings: Standing[]
  matches: Match[]
}

export interface Venue {
  id: string
  name: string
  city: string
  country: 'USA' | 'Canada' | 'Mexico'
  capacity: number
  image: string
  matches: string[] // match ids
}
