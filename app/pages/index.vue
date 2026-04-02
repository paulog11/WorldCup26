<template>
  <div>
    <!-- Hero -->
    <section class="py-16 sm:py-24 text-center bg-gradient-to-b from-wc-purple/50 to-transparent">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl sm:text-6xl font-bold mb-2">
          <span class="text-wc-gold">FIFA World Cup</span>
        </h1>
        <p class="text-xl sm:text-2xl text-wc-light/70 mb-8">
          USA &bull; Canada &bull; Mexico &mdash; 2026
        </p>

        <div class="mb-10">
          <p class="text-sm text-wc-light/50 mb-3 uppercase tracking-wide">Kickoff in</p>
          <CountdownTimer :target="tournamentStart" />
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="link.primary
              ? 'bg-wc-magenta text-white hover:bg-wc-magenta/80'
              : 'bg-wc-purple/60 text-wc-light hover:bg-wc-purple'"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Upcoming Matches -->
    <section class="max-w-4xl mx-auto px-4 py-12">
      <h2 class="text-xl font-bold text-wc-gold mb-6">Upcoming Matches</h2>
      <div v-if="matches" class="grid sm:grid-cols-2 gap-4">
        <MatchCard v-for="match in upcomingMatches" :key="match.id" :match="match" />
      </div>
      <div v-else class="text-wc-light/50">Loading matches...</div>
      <div class="mt-6 text-center">
        <NuxtLink to="/schedule" class="text-wc-teal hover:text-wc-gold transition-colors text-sm">
          View full schedule &rarr;
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const tournamentStart = config.public.tournamentStart

const { data: matches } = useMatches()

const upcomingMatches = computed(() => {
  if (!matches.value) return []
  return matches.value
    .filter((m: any) => m.status === 'scheduled')
    .slice(0, 4)
})

const quickLinks = [
  { to: '/schedule', label: 'Schedule', primary: true },
  { to: '/groups', label: 'Groups', primary: false },
  { to: '/teams', label: 'Teams', primary: false },
  { to: '/venues', label: 'Venues', primary: false },
]
</script>
