<template>
  <div class="bg-wc-purple/20 border border-wc-purple rounded-xl overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-wc-purple/30 border-b border-wc-purple">
      <div class="flex items-center gap-2">
        <img :src="team.flag" :alt="team.name" class="w-8 h-5 object-cover rounded" />
        <span class="font-bold text-wc-light">{{ team.name }}</span>
      </div>
      <div class="text-right">
        <span class="text-xs text-wc-gold font-medium">{{ formation }}</span>
        <p v-if="manager" class="text-xs text-wc-light/40">{{ manager }}</p>
      </div>
    </div>

    <!-- Pitch -->
    <div class="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-gradient-to-b from-emerald-900/40 to-emerald-800/40 overflow-hidden">
      <!-- Pitch markings -->
      <div class="absolute inset-0">
        <!-- Center line -->
        <div class="absolute top-1/2 left-4 right-4 h-px bg-white/10" />
        <!-- Center circle -->
        <div class="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 border border-white/10 rounded-full" />
        <!-- Penalty area top -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[18%] border-b border-l border-r border-white/10" />
        <!-- Goal area top -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[8%] border-b border-l border-r border-white/10" />
        <!-- Penalty area bottom -->
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[18%] border-t border-l border-r border-white/10" />
      </div>

      <!-- Players -->
      <div
        v-for="(player, index) in players"
        :key="player.id"
        class="absolute transform -translate-x-1/2 -translate-y-1/2"
        :style="getPlayerPosition(index)"
      >
        <PlayerTooltip :player="player" :position="getTooltipPosition(index)">
          <div class="flex flex-col items-center cursor-pointer group">
            <div
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-transform group-hover:scale-110"
              :class="positionColors[player.position]"
            >
              {{ player.number }}
            </div>
            <span class="text-[10px] sm:text-xs text-white font-medium mt-0.5 max-w-[70px] truncate text-center drop-shadow-lg">
              {{ lastName(player.name) }}
            </span>
          </div>
        </PlayerTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player, Team } from '~/types'

const props = defineProps<{
  team: Team
  players: Player[]
  formation: string
  manager?: string
  side: 'home' | 'away'
}>()

const positionColors: Record<string, string> = {
  GK: 'bg-amber-500/90 text-black',
  DF: 'bg-blue-500/90 text-white',
  MF: 'bg-emerald-500/90 text-white',
  FW: 'bg-red-500/90 text-white',
}

// Parse formation string like "4-3-3" into rows [4, 3, 3]
const formationRows = computed(() => {
  return props.formation.split('-').map(Number)
})

// Calculate position on the pitch for each player
function getPlayerPosition(index: number): { top: string; left: string } {
  if (index === 0) {
    // GK always at the back
    return { top: '90%', left: '50%' }
  }

  const rows = formationRows.value
  let playerIndex = index - 1 // skip GK
  let rowStart = 0

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const rowSize = rows[rowIdx]
    if (playerIndex < rowStart + rowSize) {
      const posInRow = playerIndex - rowStart
      const totalRows = rows.length

      // Vertical position: spread rows from ~75% (defenders) to ~15% (forwards)
      const topPct = 75 - (rowIdx / (totalRows - 1)) * 60

      // Horizontal position: evenly space within row
      const leftPct = ((posInRow + 1) / (rowSize + 1)) * 80 + 10

      return { top: `${topPct}%`, left: `${leftPct}%` }
    }
    rowStart += rowSize
  }

  // Fallback
  return { top: '50%', left: '50%' }
}

function getTooltipPosition(index: number): 'top' | 'bottom' {
  if (index === 0) return 'top' // GK at bottom of pitch
  const rows = formationRows.value
  let playerIndex = index - 1
  let rowStart = 0
  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    if (playerIndex < rowStart + rows[rowIdx]) {
      // Top rows (forwards) — show tooltip below; bottom rows (defenders) — show above
      return rowIdx >= rows.length - 1 ? 'bottom' : 'top'
    }
    rowStart += rows[rowIdx]
  }
  return 'top'
}

function lastName(fullName: string): string {
  const parts = fullName.split(' ')
  return parts.length > 1 ? parts[parts.length - 1] : fullName
}
</script>
