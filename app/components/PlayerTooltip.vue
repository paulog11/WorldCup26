<template>
  <div class="relative inline-block" @mouseenter="show = true" @mouseleave="show = false" @click.stop="show = !show">
    <slot />
    <Transition name="tooltip">
      <div
        v-if="show && player"
        class="absolute z-50 w-64 bg-wc-dark border border-wc-purple rounded-xl shadow-2xl shadow-wc-purple/30 p-4 pointer-events-none"
        :class="positionClass"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-wc-purple/60 flex items-center justify-center text-wc-gold font-bold text-lg shrink-0">
            {{ player.number }}
          </div>
          <div class="min-w-0">
            <p class="font-bold text-wc-light text-sm leading-tight truncate">{{ player.name }}</p>
            <p class="text-xs text-wc-light/50">{{ positionLabel }} &middot; Age {{ player.age }}</p>
          </div>
        </div>

        <!-- Rating bar -->
        <div class="mb-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs text-wc-light/50">FIFA Rating</span>
            <span class="text-sm font-bold" :class="ratingColor">{{ player.fifaRating }}</span>
          </div>
          <div class="h-1.5 bg-wc-purple/40 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all" :class="ratingBarColor" :style="{ width: `${(player.fifaRating / 99) * 100}%` }" />
          </div>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div class="flex justify-between">
            <span class="text-wc-light/40">Club</span>
          </div>
          <div class="text-right text-wc-light truncate">{{ player.club }}</div>

          <div class="flex justify-between">
            <span class="text-wc-light/40">Caps</span>
          </div>
          <div class="text-right text-wc-light">{{ player.caps }}</div>

          <div class="flex justify-between">
            <span class="text-wc-light/40">Intl Goals</span>
          </div>
          <div class="text-right text-wc-light">{{ player.internationalGoals }}</div>

          <div class="flex justify-between">
            <span class="text-wc-light/40">Value</span>
          </div>
          <div class="text-right text-wc-teal font-medium">&euro;{{ formatValue(player.marketValue) }}</div>
        </div>

        <!-- Arrow -->
        <div class="absolute w-3 h-3 bg-wc-dark border-wc-purple rotate-45" :class="arrowClass" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '~/types'

const props = withDefaults(defineProps<{
  player: Player
  position?: 'top' | 'bottom'
}>(), {
  position: 'top',
})

const show = ref(false)

const positionLabels: Record<string, string> = {
  GK: 'Goalkeeper',
  DF: 'Defender',
  MF: 'Midfielder',
  FW: 'Forward',
}

const positionLabel = computed(() => positionLabels[props.player.position] || props.player.position)

const ratingColor = computed(() => {
  const r = props.player.fifaRating
  if (r >= 85) return 'text-wc-gold'
  if (r >= 75) return 'text-wc-teal'
  return 'text-wc-light'
})

const ratingBarColor = computed(() => {
  const r = props.player.fifaRating
  if (r >= 85) return 'bg-wc-gold'
  if (r >= 75) return 'bg-wc-teal'
  return 'bg-wc-light/50'
})

const positionClass = computed(() => {
  return props.position === 'bottom'
    ? 'top-full mt-2 left-1/2 -translate-x-1/2'
    : 'bottom-full mb-2 left-1/2 -translate-x-1/2'
})

const arrowClass = computed(() => {
  return props.position === 'bottom'
    ? '-top-1.5 left-1/2 -translate-x-1/2 border-l border-t'
    : '-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b'
})

function formatValue(val: number) {
  if (val >= 100) return `${Math.round(val)}M`
  if (val >= 10) return `${val.toFixed(1)}M`
  return `${val.toFixed(1)}M`
}
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
