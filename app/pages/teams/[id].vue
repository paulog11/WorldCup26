<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <NuxtLink to="/teams" class="text-wc-teal hover:text-wc-gold text-sm mb-6 inline-block">
      &larr; Back to Teams
    </NuxtLink>

    <div v-if="team">
      <!-- Team Header -->
      <div class="flex items-center gap-4 mb-8">
        <img :src="team.flag" :alt="team.name" class="w-20 h-14 object-cover rounded-lg shadow-lg" />
        <div>
          <h1 class="text-3xl font-bold">{{ team.name }}</h1>
          <p class="text-wc-light/50">{{ team.code }} &bull; Group {{ team.group }} &bull; {{ team.confederation }}</p>
        </div>
      </div>

      <!-- Market Value + Stats row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="bg-wc-purple/30 border border-wc-purple rounded-xl p-4 text-center">
          <p class="text-xs text-wc-light/40 uppercase tracking-wide mb-1">Squad Value</p>
          <p class="text-2xl font-bold text-wc-teal">&euro;{{ formatValue(totalMarketValue) }}</p>
        </div>
        <div class="bg-wc-purple/30 border border-wc-purple rounded-xl p-4 text-center">
          <p class="text-xs text-wc-light/40 uppercase tracking-wide mb-1">Avg Rating</p>
          <p class="text-2xl font-bold" :style="{ color: avgRatingColor }">{{ avgRating }}</p>
        </div>
        <div class="bg-wc-purple/30 border border-wc-purple rounded-xl p-4 text-center">
          <p class="text-xs text-wc-light/40 uppercase tracking-wide mb-1">Formation</p>
          <p class="text-2xl font-bold text-wc-gold">{{ teamMeta?.formation ?? '—' }}</p>
        </div>
        <div class="bg-wc-purple/30 border border-wc-purple rounded-xl p-4 text-center">
          <p class="text-xs text-wc-light/40 uppercase tracking-wide mb-1">Manager</p>
          <p class="text-sm font-medium text-wc-light leading-tight mt-1">{{ teamMeta?.manager ?? '—' }}</p>
        </div>
      </div>

      <!-- Squad Section -->
      <section v-if="players.length" class="mb-8">
        <h2 class="text-xl font-bold text-wc-gold mb-4">Squad</h2>
        <TeamFormation
          :team="team"
          :players="starting"
          :formation="teamMeta?.formation ?? '4-3-3'"
          :manager="teamMeta?.manager"
          side="home"
        />
        <SubstituteList :team="team" :subs="subs" />
      </section>

      <!-- Group Standing -->
      <section v-if="standings" class="mb-8">
        <h2 class="text-xl font-bold text-wc-gold mb-4">Group {{ team.group }} Standings</h2>
        <div class="bg-wc-purple/30 border border-wc-purple rounded-xl p-4">
          <StandingsTable :standings="standings" :qualify-count="3" />
        </div>
      </section>

      <!-- Team Matches -->
      <section>
        <h2 class="text-xl font-bold text-wc-gold mb-4">Matches</h2>
        <div v-if="teamMatches?.length" class="space-y-3">
          <MatchCard v-for="match in teamMatches" :key="match.id" :match="match" />
        </div>
        <p v-else class="text-wc-light/50">No matches found.</p>
      </section>
    </div>

    <div v-else class="text-wc-light/50 text-center py-12">Loading team...</div>
  </div>
</template>

<script setup lang="ts">
import type { Player, Team, TeamMeta } from '~/types'

const route = useRoute()
const teamId = route.params.id as string

const { data: team } = useTeam(teamId)
const { data: teamMatches } = useMatches({ team: teamId })
const { data: playersRaw } = usePlayers({ team: teamId })
const { data: teamMetaRaw } = useTeamMeta(teamId)

const players = computed(() => (playersRaw.value as Player[]) ?? [])
const teamMeta = computed(() => teamMetaRaw.value as TeamMeta | null)

const positionOrder: Record<string, number> = { GK: 0, DF: 1, MF: 2, FW: 3 }
const sortedPlayers = computed(() =>
  [...players.value].sort((a, b) => (positionOrder[a.position] ?? 4) - (positionOrder[b.position] ?? 4))
)

const starting = computed(() => sortedPlayers.value.slice(0, 11))
const subs = computed(() => sortedPlayers.value.slice(11))

const totalMarketValue = computed(() =>
  players.value.reduce((sum, p) => sum + (p.marketValue ?? 0), 0)
)

const avgRating = computed(() => {
  if (!players.value.length) return '—'
  const sum = players.value.reduce((s, p) => s + p.fifaRating, 0)
  return (sum / players.value.length).toFixed(1)
})

const avgRatingColor = computed(() => {
  const r = parseFloat(avgRating.value as string)
  if (r >= 78) return '#ffc107'
  if (r >= 72) return '#00bcd4'
  return '#f5f0ff'
})

function formatValue(val: number) {
  if (val >= 1000) return `${(val / 1000).toFixed(2)}B`
  if (val >= 100) return `${Math.round(val)}M`
  return `${val.toFixed(1)}M`
}

const { data: standings } = computed(() => {
  const group = (team.value as any)?.group
  return useStandings(group)
}).value
</script>
