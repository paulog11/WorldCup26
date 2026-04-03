<template>
  <div ref="triggerEl" class="inline-block" @mouseenter="showTooltip" @mouseleave="hideTooltip" @click.stop="toggleTooltip">
    <slot />
  </div>

  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="show && player"
        ref="tooltipEl"
        class="fixed z-[9999] w-64 rounded-xl shadow-2xl shadow-black/50 p-4 pointer-events-none"
        :style="{ top: tooltipPos.top + 'px', left: tooltipPos.left + 'px', backgroundColor: '#1a0a2e', border: '1px solid #3d1d72' }"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0" style="background-color: rgba(61, 29, 114, 0.8); color: #ffc107;">
            {{ player.number }}
          </div>
          <div class="min-w-0">
            <p class="font-bold text-sm leading-tight truncate" style="color: #f5f0ff;">{{ player.name }}</p>
            <p class="text-xs" style="color: rgba(245, 240, 255, 0.5);">{{ positionLabel }} &middot; Age {{ player.age }}</p>
          </div>
        </div>

        <!-- Rating bar -->
        <div class="mb-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs" style="color: rgba(245, 240, 255, 0.5);">FIFA Rating</span>
            <span class="text-sm font-bold" :style="{ color: ratingHex }">{{ player.fifaRating }}</span>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden" style="background-color: rgba(61, 29, 114, 0.4);">
            <div class="h-full rounded-full" :style="{ width: `${(player.fifaRating / 99) * 100}%`, backgroundColor: ratingHex }" />
          </div>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div><span style="color: rgba(245, 240, 255, 0.4);">Club</span></div>
          <div class="text-right truncate" style="color: #f5f0ff;">{{ player.club }}</div>

          <div><span style="color: rgba(245, 240, 255, 0.4);">Caps</span></div>
          <div class="text-right" style="color: #f5f0ff;">{{ player.caps }}</div>

          <div><span style="color: rgba(245, 240, 255, 0.4);">Intl Goals</span></div>
          <div class="text-right" style="color: #f5f0ff;">{{ player.internationalGoals }}</div>

          <div><span style="color: rgba(245, 240, 255, 0.4);">Value</span></div>
          <div class="text-right font-medium" style="color: #00bcd4;">&euro;{{ formatValue(player.marketValue) }}</div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
const triggerEl = ref<HTMLElement | null>(null)
const tooltipEl = ref<HTMLElement | null>(null)
const tooltipPos = ref({ top: 0, left: 0 })

function calculatePosition() {
  if (!triggerEl.value) return

  const rect = triggerEl.value.getBoundingClientRect()
  const tooltipWidth = 256 // w-64 = 16rem = 256px
  const tooltipHeight = 220 // approximate height

  let top: number
  let left = rect.left + rect.width / 2 - tooltipWidth / 2

  if (props.position === 'bottom') {
    top = rect.bottom + 8
  } else {
    top = rect.top - tooltipHeight - 8
  }

  // Keep within viewport horizontally
  if (left < 8) left = 8
  if (left + tooltipWidth > window.innerWidth - 8) {
    left = window.innerWidth - tooltipWidth - 8
  }

  // Flip vertically if needed
  if (top < 8) {
    top = rect.bottom + 8
  }
  if (top + tooltipHeight > window.innerHeight - 8) {
    top = rect.top - tooltipHeight - 8
  }

  tooltipPos.value = { top, left }
}

function showTooltip() {
  calculatePosition()
  show.value = true
}

function hideTooltip() {
  show.value = false
}

function toggleTooltip() {
  if (show.value) {
    show.value = false
  } else {
    calculatePosition()
    show.value = true
  }
}

const positionLabels: Record<string, string> = {
  GK: 'Goalkeeper',
  DF: 'Defender',
  MF: 'Midfielder',
  FW: 'Forward',
}

const positionLabel = computed(() => positionLabels[props.player.position] || props.player.position)

const ratingHex = computed(() => {
  const r = props.player.fifaRating
  if (r >= 85) return '#ffc107'
  if (r >= 75) return '#00bcd4'
  return '#f5f0ff'
})

function formatValue(val: number) {
  if (val >= 100) return `${Math.round(val)}M`
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
  transform: translateY(4px);
}
</style>
