<template>
  <div
    class="flex items-center gap-2 py-2 px-3 rounded-lg border transition-colors"
    :class="isPredicted
      ? 'border-wc-purple/60 bg-wc-purple/10'
      : 'border-wc-purple/30 bg-transparent hover:border-wc-purple/50'"
  >
    <!-- Home team -->
    <div class="flex items-center gap-2 flex-1 min-w-0 justify-end">
      <span class="text-sm font-medium text-wc-light truncate text-right">{{ match.homeTeam?.name ?? '?' }}</span>
      <img
        v-if="match.homeTeam"
        :src="match.homeTeam.flag"
        :alt="match.homeTeam.name"
        class="w-7 h-5 object-cover rounded shrink-0"
      />
    </div>

    <!-- Score inputs -->
    <div class="flex items-center gap-1 shrink-0">
      <ScoreInput :value="homeScore" @update="setHome" />
      <span class="text-wc-light/30 text-xs font-bold px-0.5">–</span>
      <ScoreInput :value="awayScore" @update="setAway" />
    </div>

    <!-- Away team -->
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <img
        v-if="match.awayTeam"
        :src="match.awayTeam.flag"
        :alt="match.awayTeam.name"
        class="w-7 h-5 object-cover rounded shrink-0"
      />
      <span class="text-sm font-medium text-wc-light truncate">{{ match.awayTeam?.name ?? '?' }}</span>
    </div>

    <!-- Matchday label -->
    <span class="text-[10px] text-wc-light/25 shrink-0 hidden sm:inline">MD{{ match.matchday }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Match } from '~/types'
import type { MatchPrediction } from '~/composables/useGroupPredictions'

const props = defineProps<{
  match: Match
  prediction: MatchPrediction | undefined
}>()

const emit = defineEmits<{
  predict: [matchId: string, homeScore: number | null, awayScore: number | null]
}>()

const homeScore = computed(() => props.prediction?.homeScore ?? null)
const awayScore = computed(() => props.prediction?.awayScore ?? null)
const isPredicted = computed(() => homeScore.value !== null && awayScore.value !== null)

function setHome(val: number | null) {
  emit('predict', props.match.id, val, awayScore.value)
}
function setAway(val: number | null) {
  emit('predict', props.match.id, homeScore.value, val)
}
</script>
