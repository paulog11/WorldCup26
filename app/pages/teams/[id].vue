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
const route = useRoute()
const teamId = route.params.id as string

const { data: team } = useTeam(teamId)
const { data: teamMatches } = useMatches({ team: teamId })

const { data: standings } = computed(() => {
  const group = (team.value as any)?.group
  return useStandings(group)
}).value
</script>
