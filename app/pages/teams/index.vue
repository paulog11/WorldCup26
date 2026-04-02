<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-wc-gold mb-6">Teams</h1>

    <!-- Filters -->
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
    </div>

    <div v-if="teams" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <NuxtLink
        v-for="team in filteredTeams"
        :key="team.id"
        :to="`/teams/${team.id}`"
        class="bg-wc-purple/30 border border-wc-purple rounded-lg p-4 text-center hover:border-wc-gold/50 transition-colors"
      >
        <img :src="team.flag" :alt="team.name" class="w-12 h-8 object-cover rounded mx-auto mb-2" />
        <p class="text-sm font-medium">{{ team.name }}</p>
        <p class="text-xs text-wc-light/50">Group {{ team.group }}</p>
      </NuxtLink>
    </div>

    <p v-if="filteredTeams?.length === 0" class="text-wc-light/50 text-center py-8">
      No teams match the selected filters.
    </p>
  </div>
</template>

<script setup lang="ts">
const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
const confederations = ['UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC']

const groupFilter = ref('')
const confFilter = ref('')

const { data: teams } = useTeams()

const filteredTeams = computed(() => {
  if (!teams.value) return []
  let result = teams.value as any[]
  if (groupFilter.value) result = result.filter((t) => t.group === groupFilter.value)
  if (confFilter.value) result = result.filter((t) => t.confederation === confFilter.value)
  return result
})
</script>
