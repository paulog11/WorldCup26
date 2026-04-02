<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-wc-gold mb-6">Venues</h1>

    <!-- Country Filter -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button
        v-for="country in ['', 'USA', 'Canada', 'Mexico']"
        :key="country"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="countryFilter === country
          ? 'bg-wc-magenta text-white'
          : 'bg-wc-purple/60 text-wc-light hover:bg-wc-purple'"
        @click="countryFilter = country"
      >
        {{ country || 'All' }}
      </button>
    </div>

    <div v-if="venues" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="venue in filteredVenues"
        :key="venue.id"
        :to="`/venues/${venue.id}`"
        class="bg-wc-purple/30 border border-wc-purple rounded-xl p-5 hover:border-wc-gold/50 transition-colors"
      >
        <h2 class="text-lg font-bold mb-1">{{ venue.name }}</h2>
        <p class="text-sm text-wc-light/60">{{ venue.city }}, {{ venue.country }}</p>
        <p class="text-xs text-wc-teal mt-2">Capacity: {{ venue.capacity?.toLocaleString() }}</p>
      </NuxtLink>
    </div>

    <div v-else class="text-wc-light/50 text-center py-12">Loading venues...</div>
  </div>
</template>

<script setup lang="ts">
const countryFilter = ref('')

const { data: venues } = useVenues()

const filteredVenues = computed(() => {
  if (!venues.value) return []
  let result = venues.value as any[]
  if (countryFilter.value) result = result.filter((v) => v.country === countryFilter.value)
  return result
})
</script>
