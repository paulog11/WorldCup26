<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-wc-gold mb-6">Match Schedule</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-8">
      <select
        v-model="stageFilter"
        class="bg-wc-purple/60 text-wc-light border border-wc-purple rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All Stages</option>
        <option value="group">Group Stage</option>
        <option value="round-of-32">Round of 32</option>
        <option value="round-of-16">Round of 16</option>
        <option value="quarter-final">Quarter-Finals</option>
        <option value="semi-final">Semi-Finals</option>
        <option value="third-place">Third Place</option>
        <option value="final">Final</option>
      </select>

      <select
        v-model="groupFilter"
        class="bg-wc-purple/60 text-wc-light border border-wc-purple rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All Groups</option>
        <option v-for="g in groups" :key="g" :value="g">Group {{ g }}</option>
      </select>
    </div>

    <!-- Matches grouped by date -->
    <div v-if="matches" class="space-y-8">
      <div v-for="[date, dayMatches] in groupedByDate" :key="date">
        <h2 class="text-lg font-semibold text-wc-teal mb-3 sticky top-0 bg-wc-dark py-2 z-10">
          {{ formatDate(date) }}
        </h2>
        <div class="grid sm:grid-cols-2 gap-3">
          <MatchCard v-for="match in dayMatches" :key="match.id" :match="match" />
        </div>
      </div>

      <p v-if="groupedByDate.length === 0" class="text-wc-light/50 text-center py-8">
        No matches found for the selected filters.
      </p>
    </div>
    <div v-else class="text-wc-light/50 text-center py-8">Loading schedule...</div>
  </div>
</template>

<script setup lang="ts">
const stageFilter = ref('')
const groupFilter = ref('')
const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const queryParams = computed(() => {
  const params: Record<string, string> = {}
  if (stageFilter.value) params.stage = stageFilter.value
  if (groupFilter.value) params.group = groupFilter.value
  return params
})

const { data: matches } = useMatches(queryParams)

const groupedByDate = computed(() => {
  if (!matches.value) return []
  const map = new Map<string, any[]>()
  for (const match of matches.value) {
    const existing = map.get(match.date) || []
    existing.push(match)
    map.set(match.date, existing)
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
})

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
