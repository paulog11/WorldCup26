/**
 * One-time script to build data/id-mapping.json.
 *
 * Fetches API-Football's WC2026 teams and squads, matches them against seed.json
 * using FIFA code + name, and writes out the numeric ID mappings.
 *
 * Usage:
 *   RAPIDAPI_KEY=your_key node scripts/build-id-mapping.mjs
 *
 * After running, inspect data/id-mapping.json for any UNMATCHED entries
 * and hand-edit as needed before committing.
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedPath = resolve(__dirname, '..', 'data', 'seed.json')
const outputPath = resolve(__dirname, '..', 'data', 'id-mapping.json')

const seed = JSON.parse(readFileSync(seedPath, 'utf-8'))
const API_KEY = process.env.RAPIDAPI_KEY
if (!API_KEY) {
  console.error('Error: RAPIDAPI_KEY environment variable is required.')
  process.exit(1)
}

const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3'
const WC_LEAGUE_ID = 1
const WC_SEASON = 2026

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      'x-rapidapi-key': API_KEY,
    },
  })
  if (!res.ok) throw new Error(`API-Football ${path} returned ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.response
}

// Levenshtein distance for fuzzy name matching
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[a.length][b.length]
}

function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

function bestPlayerMatch(apiName, candidates) {
  const norm = normalize(apiName)
  let best = null
  let bestDist = Infinity
  for (const c of candidates) {
    const dist = levenshtein(norm, normalize(c.name))
    if (dist < bestDist) {
      bestDist = dist
      best = c
    }
  }
  // Accept if distance is within 30% of the longer name length
  const threshold = Math.max(norm.length, normalize(best?.name ?? '')) * 0.3
  return bestDist <= threshold ? { player: best, dist: bestDist } : null
}

async function main() {
  console.log('Fetching WC2026 teams from API-Football...')
  const apiTeams = await apiFetch(`/teams?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`)

  // Build seed lookups
  const seedTeamsByCode = new Map(seed.teams.map((t) => [t.code.toLowerCase(), t]))
  const seedTeamsByName = new Map(seed.teams.map((t) => [normalize(t.name), t]))

  const teamMapping = {}    // ourId → apiId
  const unmatchedTeams = []

  for (const { team: apiTeam } of apiTeams) {
    const byCode = seedTeamsByCode.get(apiTeam.code?.toLowerCase())
    const byName = seedTeamsByName.get(normalize(apiTeam.name))
    const match = byCode || byName
    if (match) {
      teamMapping[match.id] = apiTeam.id
    } else {
      unmatchedTeams.push({ apiId: apiTeam.id, name: apiTeam.name, code: apiTeam.code })
    }
  }

  console.log(`Teams matched: ${Object.keys(teamMapping).length}/${seed.teams.length}`)
  if (unmatchedTeams.length > 0) {
    console.warn('UNMATCHED TEAMS (hand-edit required):')
    console.warn(JSON.stringify(unmatchedTeams, null, 2))
  }

  // Fetch squads for each matched team
  const playerMapping = {}   // ourPlayerId → apiPlayerId
  const unmatchedPlayers = []

  const matchedApiTeamIds = Object.values(teamMapping)
  for (const [ourTeamId, apiTeamId] of Object.entries(teamMapping)) {
    console.log(`Fetching squad for team ${ourTeamId} (api id ${apiTeamId})...`)
    let squad
    try {
      const res = await apiFetch(`/players/squads?team=${apiTeamId}`)
      squad = res[0]?.players ?? []
    } catch (e) {
      console.warn(`  Failed to fetch squad: ${e.message}`)
      continue
    }

    const seedPlayers = seed.players.filter((p) => p.teamId === ourTeamId)

    for (const apiPlayer of squad) {
      const match = bestPlayerMatch(apiPlayer.name, seedPlayers)
      if (match) {
        playerMapping[match.player.id] = apiPlayer.id
      } else {
        unmatchedPlayers.push({
          teamId: ourTeamId,
          apiId: apiPlayer.id,
          apiName: apiPlayer.name,
        })
      }
    }
  }

  console.log(`Players matched: ${Object.keys(playerMapping).length}/${seed.players.length}`)
  if (unmatchedPlayers.length > 0) {
    console.warn(`UNMATCHED PLAYERS (${unmatchedPlayers.length}) — review and hand-edit as needed.`)
    console.warn(JSON.stringify(unmatchedPlayers, null, 2))
  }

  // Fetch today's fixtures to build the fixture → match ID map
  // NOTE: Run this script again closer to the tournament start once fixture IDs are assigned.
  console.log('Fetching WC2026 fixtures for match ID mapping...')
  let fixtureMapping = {}
  try {
    const fixtures = await apiFetch(`/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`)
    // We can't auto-map fixtures to our match IDs without reliable external data.
    // The fixture list will have teams assigned, so we match by home+away team IDs and date.
    const seedMatchesByKey = new Map()
    for (const m of seed.matches) {
      if (m.homeTeamId && m.awayTeamId) {
        const key = `${m.homeTeamId}:${m.awayTeamId}:${m.date}`
        seedMatchesByKey.set(key, m.id)
      }
    }

    const invertedTeams = Object.fromEntries(
      Object.entries(teamMapping).map(([ourId, apiId]) => [apiId, ourId])
    )

    for (const f of fixtures) {
      const ourHomeId = invertedTeams[f.teams.home.id]
      const ourAwayId = invertedTeams[f.teams.away.id]
      const date = f.fixture.date?.slice(0, 10)
      if (!ourHomeId || !ourAwayId || !date) continue
      const key = `${ourHomeId}:${ourAwayId}:${date}`
      const ourMatchId = seedMatchesByKey.get(key)
      if (ourMatchId) {
        fixtureMapping[ourMatchId] = f.fixture.id
      }
    }
    console.log(`Fixtures matched: ${Object.keys(fixtureMapping).length}/${seed.matches.length}`)
  } catch (e) {
    console.warn(`Could not fetch fixtures (may not be available yet): ${e.message}`)
    console.warn('The "fixtures" section of id-mapping.json will be empty.')
  }

  const output = {
    teams: teamMapping,
    players: playerMapping,
    fixtures: fixtureMapping,
  }

  writeFileSync(outputPath, JSON.stringify(output, null, 2))
  console.log(`\nWritten to ${outputPath}`)
  console.log('Review the file, hand-edit any UNMATCHED entries, then commit.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
