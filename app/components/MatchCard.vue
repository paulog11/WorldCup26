<template>
  <NuxtLink
    :to="`/match/${match.id}`"
    class="block bg-wc-purple/40 border border-wc-purple rounded-lg p-4 hover:border-wc-gold/50 transition-colors"
  >
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs text-wc-light/50 uppercase tracking-wide">
        {{ match.stage === 'group' ? `Group ${match.group}` : stageLabel }}
      </span>
      <span
        v-if="match.status === 'live'"
        class="text-xs font-bold text-wc-magenta animate-pulse"
      >
        LIVE
      </span>
      <span v-else class="text-xs text-wc-light/40">{{ match.time }}</span>
    </div>

    <div class="flex items-center justify-between gap-4">
      <TeamBadge :team="match.homeTeam" class="flex-1" />

      <div class="text-center min-w-[60px]">
        <template v-if="match.status !== 'scheduled'">
          <span class="text-lg font-bold text-wc-gold">
            {{ match.homeScore }} - {{ match.awayScore }}
          </span>
        </template>
        <template v-else>
          <span class="text-sm text-wc-light/40">vs</span>
        </template>
      </div>

      <TeamBadge :team="match.awayTeam" reverse class="flex-1 justify-end" />
    </div>

    <div v-if="showVenue && match.venueDetails" class="mt-2 text-xs text-wc-light/40 text-center">
      {{ match.venueDetails.name }}, {{ match.venueDetails.city }}
    </div>

    <div
      v-if="match.status === 'scheduled' && match.homeTeam?.fifaRank && match.awayTeam?.fifaRank"
      class="mt-3"
    >
      <PredictionBar
        :home-rank="match.homeTeam.fifaRank"
        :away-rank="match.awayTeam.fifaRank"
        :home-code="match.homeTeam.code"
        :away-code="match.awayTeam.code"
      />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  match: any
  showVenue?: boolean
}>(), {
  showVenue: true,
})

const stageLabels: Record<string, string> = {
  'round-of-32': 'Round of 32',
  'round-of-16': 'Round of 16',
  'quarter-final': 'Quarter-Final',
  'semi-final': 'Semi-Final',
  'third-place': 'Third Place',
  'final': 'Final',
}

const stageLabel = computed(() => stageLabels[props.match.stage] || props.match.stage)
</script>
