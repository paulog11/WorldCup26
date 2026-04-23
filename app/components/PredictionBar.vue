<template>
  <div class="px-1">
    <div
      class="flex items-center justify-between mb-1.5 font-semibold uppercase tracking-wide"
      :class="size === 'lg' ? 'text-xs' : 'text-[10px]'"
    >
      <span class="text-wc-gold">{{ homeCode }}</span>
      <span class="text-wc-light/70">{{ size === 'lg' ? 'Draw' : 'Prediction' }}</span>
      <span class="text-wc-teal">{{ awayCode }}</span>
    </div>

    <!-- Bar -->
    <div
      class="flex rounded-full overflow-hidden gap-px"
      :class="size === 'lg' ? 'h-3' : 'h-2'"
    >
      <div
        class="bg-wc-gold transition-all duration-500"
        :style="{ width: prediction.homeWin + '%' }"
      />
      <div
        class="bg-wc-light/40 transition-all duration-500"
        :style="{ width: prediction.draw + '%' }"
      />
      <div
        class="bg-wc-teal transition-all duration-500"
        :style="{ width: prediction.awayWin + '%' }"
      />
    </div>

    <!-- Percentages -->
    <div
      class="flex items-center justify-between mt-1.5 font-bold"
      :class="size === 'lg' ? 'text-sm' : 'text-xs'"
    >
      <span class="text-wc-gold">{{ prediction.homeWin }}%</span>
      <span class="text-wc-light/80 font-semibold">
        <span v-if="size !== 'lg'" class="text-wc-light/60 font-normal">Draw </span>{{ prediction.draw }}%
      </span>
      <span class="text-wc-teal">{{ prediction.awayWin }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { predictMatch } from '~/utils/predictions'

const props = withDefaults(defineProps<{
  homeRank: number
  awayRank: number
  homeCode: string
  awayCode: string
  size?: 'sm' | 'lg'
}>(), {
  size: 'sm',
})

const prediction = computed(() => predictMatch(props.homeRank, props.awayRank))
</script>
