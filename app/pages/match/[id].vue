<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <NuxtLink to="/schedule" class="text-wc-teal hover:text-wc-gold text-sm mb-6 inline-block">
      &larr; Back to Schedule
    </NuxtLink>

    <div v-if="match" class="bg-wc-purple/30 border border-wc-purple rounded-xl p-6 sm:p-8">
      <!-- Stage badge -->
      <div class="text-center mb-6">
        <span class="text-xs uppercase tracking-wide text-wc-light/50 bg-wc-purple/60 px-3 py-1 rounded-full">
          {{ match.stage === 'group' ? `Group ${match.group} &mdash; Matchday ${match.matchday}` : stageLabel }}
        </span>
      </div>

      <!-- Teams & Score -->
      <div class="flex items-center justify-between gap-6 mb-8">
        <div class="flex-1 text-center">
          <img v-if="match.homeTeam" :src="match.homeTeam.flag" :alt="match.homeTeam.name" class="w-16 h-10 object-cover rounded mx-auto mb-2" />
          <p class="font-bold text-lg">{{ match.homeTeam?.name || 'TBD' }}</p>
          <p v-if="match.homeTeam" class="text-xs text-wc-light/50">{{ match.homeTeam.confederation }}</p>
        </div>

        <div class="text-center">
          <template v-if="match.status !== 'scheduled'">
            <div class="text-4xl font-bold text-wc-gold">
              {{ match.homeScore }} - {{ match.awayScore }}
            </div>
            <span v-if="match.status === 'live'" class="text-xs text-wc-magenta font-bold animate-pulse">LIVE</span>
            <span v-else class="text-xs text-wc-light/40">Full Time</span>
          </template>
          <template v-else>
            <div class="text-2xl font-bold text-wc-light/30">vs</div>
            <div class="text-sm text-wc-light/50 mt-1">{{ match.time }}</div>
          </template>
        </div>

        <div class="flex-1 text-center">
          <img v-if="match.awayTeam" :src="match.awayTeam.flag" :alt="match.awayTeam.name" class="w-16 h-10 object-cover rounded mx-auto mb-2" />
          <p class="font-bold text-lg">{{ match.awayTeam?.name || 'TBD' }}</p>
          <p v-if="match.awayTeam" class="text-xs text-wc-light/50">{{ match.awayTeam.confederation }}</p>
        </div>
      </div>

      <!-- Winner Prediction -->
      <div
        v-if="match.status === 'scheduled' && match.homeTeam?.fifaRank && match.awayTeam?.fifaRank"
        class="border-t border-wc-purple pt-5 mb-5"
      >
        <h3 class="text-xs uppercase tracking-wide text-wc-teal font-semibold mb-3 text-center">
          Winner Prediction
        </h3>
        <PredictionBar
          :home-rank="match.homeTeam.fifaRank"
          :away-rank="match.awayTeam.fifaRank"
          :home-code="match.homeTeam.code"
          :away-code="match.awayTeam.code"
          size="lg"
        />
        <p class="text-[11px] text-wc-light/50 text-center mt-3">
          Based on FIFA world rankings ({{ match.homeTeam.code }} #{{ match.homeTeam.fifaRank }} &middot; {{ match.awayTeam.code }} #{{ match.awayTeam.fifaRank }})
        </p>
      </div>

      <!-- Match Info -->
      <div class="border-t border-wc-purple pt-4 space-y-3 text-sm text-wc-light/60">
        <div class="flex justify-between">
          <span>Date</span>
          <span class="text-wc-light">{{ formatDate(match.date) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Kickoff</span>
          <span class="text-wc-light">{{ match.time }}</span>
        </div>
        <div v-if="match.venueDetails" class="flex justify-between">
          <span>Venue</span>
          <NuxtLink :to="`/venues/${match.venueDetails.id}`" class="text-wc-teal hover:text-wc-gold">
            {{ match.venueDetails.name }}
          </NuxtLink>
        </div>
        <div v-if="match.venueDetails" class="flex justify-between">
          <span>Location</span>
          <span class="text-wc-light">{{ match.venueDetails.city }}, {{ match.venueDetails.country }}</span>
        </div>
        <div v-if="match.venueDetails" class="flex justify-between">
          <span>Capacity</span>
          <span class="text-wc-light">{{ match.venueDetails.capacity?.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Lineups Section -->
      <MatchLineup
        v-if="match.homeTeam && match.awayTeam && match.homeLineup && match.awayLineup"
        :home-team="match.homeTeam"
        :away-team="match.awayTeam"
        :home-lineup="match.homeLineup"
        :away-lineup="match.awayLineup"
      />
    </div>

    <div v-else class="text-wc-light/50 text-center py-12">Loading match...</div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const matchId = route.params.id as string

const { data: allMatches } = useMatches()

const match = computed(() => {
  if (!allMatches.value) return null
  return allMatches.value.find((m: any) => m.id === matchId) || null
})

const stageLabels: Record<string, string> = {
  'round-of-32': 'Round of 32',
  'round-of-16': 'Round of 16',
  'quarter-final': 'Quarter-Final',
  'semi-final': 'Semi-Final',
  'third-place': 'Third Place',
  'final': 'Final',
}
const stageLabel = computed(() => stageLabels[match.value?.stage] || match.value?.stage)

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
