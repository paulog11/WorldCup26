<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-wc-gold mb-6">Teams</h1>

    <!-- Filters & Sort -->
    <div class="flex flex-wrap gap-3 mb-8">
      <select
        v-model="groupFilter"
        class="bg-wc-purple/60 text-wc-light border border-wc-purple rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All Groups</option>
        <option v-for="g in groups" :key="g" :value="g">Group {{ g }}</option>
      </select>

      <select
        v-model="confFilter"
        class="bg-wc-purple/60 text-wc-light border border-wc-purple rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All Confederations</option>
        <option v-for="c in confederations" :key="c" :value="c">{{ c }}</option>
      </select>

      <select
        v-model="sortBy"
        class="bg-wc-purple/60 text-wc-light border border-wc-purple rounded-lg px-3 py-2 text-sm ml-auto"
      >
        <option value="group">Sort: Group</option>
        <option value="name">Sort: Name</option>
        <option value="value">Sort: Squad Value</option>
      </select>
    </div>

    <div v-if="teams" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <NuxtLink
        v-for="team in filteredTeams"
        :key="team.id"
        :to="`/teams/${team.id}`"
        class="bg-wc-purple/30 border border-wc-purple rounded-lg p-4 text-center hover:border-wc-gold/50 transition-colors group"
      >
        <img :src="team.flag" :alt="team.name" class="w-12 h-8 object-cover rounded mx-auto mb-2" />
        <p class="text-sm font-medium group-hover:text-wc-gold transition-colors">{{ team.name }}</p>
        <p class="text-xs text-wc-light/50 mb-2">Group {{ team.group }}</p>
        <p v-if="teamValues[team.id]" class="text-xs font-medium text-wc-teal">
          &euro;{{ formatValue(teamValues[team.id]) }}
        </p>
      </NuxtLink>
    </div>

    <p v-if="filteredTeams?.length === 0" class="text-wc-light/50 text-center py-8">
      No teams match the selected filters.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '~/types'

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
const confederations = ['UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC']

const groupFilter = ref('')
const confFilter = ref('')
const sortBy = ref('group')

const { data: teams } = useTeams()
const { data: allPlayersRaw } = usePlayers()

const teamValues = computed(() => {
  const players = (allPlayersRaw.value as Player[]) ?? []
  const map: Record<string, number> = {}
  for (const p of players) {
    map[p.teamId] = (map[p.teamId] ?? 0) + (p.marketValue ?? 0)
  }
  return map
})

const filteredTeams = computed(() => {
  if (!teams.value) return []
  let result = teams.value as any[]
  if (groupFilter.value) result = result.filter((t) => t.group === groupFilter.value)
  if (confFilter.value) result = result.filter((t) => t.confederation === confFilter.value)

  if (sortBy.value === 'name') {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'value') {
    result = [...result].sort((a, b) => (teamValues.value[b.id] ?? 0) - (teamValues.value[a.id] ?? 0))
  } else {
    result = [...result].sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))
  }
  return result
})

function formatValue(val: number) {
  if (val >= 1000) return `${(val / 1000).toFixed(2)}B`
  if (val >= 100) return `${Math.round(val)}M`
  return `${val.toFixed(1)}M`
}
</script>
