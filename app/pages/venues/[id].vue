<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <NuxtLink to="/venues" class="text-wc-teal hover:text-wc-gold text-sm mb-6 inline-block">
      &larr; Back to Venues
    </NuxtLink>

    <div v-if="venue">
      <!-- Venue Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">{{ venue.name }}</h1>
        <p class="text-wc-light/60">{{ venue.city }}, {{ venue.country }}</p>
        <p class="text-wc-teal text-sm mt-1">Capacity: {{ venue.capacity?.toLocaleString() }}</p>
      </div>

      <!-- Matches at this venue -->
      <section>
        <h2 class="text-xl font-bold text-wc-gold mb-4">Matches at this Venue</h2>
        <div v-if="venueMatches?.length" class="space-y-3">
          <MatchCard v-for="match in venueMatches" :key="match.id" :match="match" :show-venue="false" />
        </div>
        <p v-else class="text-wc-light/50">No matches scheduled at this venue.</p>
      </section>
    </div>

    <div v-else class="text-wc-light/50 text-center py-12">Loading venue...</div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const venueId = route.params.id as string

const { data: venue } = useVenue(venueId)
const { data: allMatches } = useMatches()

const venueMatches = computed(() => {
  if (!allMatches.value) return []
  return allMatches.value.filter((m: any) => m.venue === venueId)
})
</script>
