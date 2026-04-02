<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-wc-gold mb-8">Group Standings</h1>

    <div v-if="standings" class="grid md:grid-cols-2 gap-6">
      <div
        v-for="group in groups"
        :key="group"
        class="bg-wc-purple/30 border border-wc-purple rounded-xl p-5"
      >
        <h2 class="text-lg font-bold text-wc-teal mb-4">Group {{ group }}</h2>
        <StandingsTable :standings="standings[group] || []" :qualify-count="3" />

        <!-- Group matches -->
        <div class="mt-4 space-y-2">
          <h3 class="text-xs uppercase tracking-wide text-wc-light/40 mb-2">Matches</h3>
          <MatchCard
            v-for="match in groupMatches(group)"
            :key="match.id"
            :match="match"
            :show-venue="false"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-wc-light/50 text-center py-12">Loading standings...</div>
  </div>
</template>

<script setup lang="ts">
const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const { data: standings } = useStandings()
const { data: matches } = useMatches({ stage: 'group' })

function groupMatches(group: string) {
  if (!matches.value) return []
  return matches.value.filter((m: any) => m.group === group)
}
</script>
