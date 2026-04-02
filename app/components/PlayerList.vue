<template>
  <div class="bg-wc-purple/20 border border-wc-purple rounded-xl overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-wc-purple/30 border-b border-wc-purple">
      <div class="flex items-center gap-2">
        <img :src="team.flag" :alt="team.name" class="w-8 h-5 object-cover rounded" />
        <span class="font-bold text-wc-light">{{ team.name }}</span>
      </div>
      <p v-if="manager" class="text-xs text-wc-light/40">{{ manager }}</p>
    </div>

    <!-- Starting XI -->
    <div class="px-4 py-3">
      <h4 class="text-xs uppercase tracking-wide text-wc-gold/70 mb-2">Starting XI</h4>
      <div class="space-y-1">
        <PlayerTooltip v-for="player in starting" :key="player.id" :player="player" position="bottom">
          <div class="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-wc-purple/30 cursor-pointer transition-colors group">
            <span class="w-6 text-center text-sm font-bold text-wc-light/60">{{ player.number }}</span>
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              :class="positionBadge[player.position]"
            >
              {{ player.position }}
            </span>
            <span class="text-sm text-wc-light group-hover:text-wc-gold transition-colors truncate">{{ player.name }}</span>
            <span class="ml-auto text-xs text-wc-light/30 shrink-0">{{ player.fifaRating }}</span>
          </div>
        </PlayerTooltip>
      </div>
    </div>

    <!-- Substitutes -->
    <div class="px-4 py-3 border-t border-wc-purple/50">
      <h4 class="text-xs uppercase tracking-wide text-wc-light/30 mb-2">Substitutes</h4>
      <div class="space-y-0.5">
        <PlayerTooltip v-for="player in subs" :key="player.id" :player="player" position="bottom">
          <div class="flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-wc-purple/30 cursor-pointer transition-colors group">
            <span class="w-6 text-center text-xs text-wc-light/40">{{ player.number }}</span>
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 opacity-60"
              :class="positionBadge[player.position]"
            >
              {{ player.position }}
            </span>
            <span class="text-xs text-wc-light/60 group-hover:text-wc-light transition-colors truncate">{{ player.name }}</span>
            <span class="ml-auto text-xs text-wc-light/20 shrink-0">{{ player.fifaRating }}</span>
          </div>
        </PlayerTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player, Team } from '~/types'

defineProps<{
  team: Team
  starting: Player[]
  subs: Player[]
  manager?: string
}>()

const positionBadge: Record<string, string> = {
  GK: 'bg-amber-500/80 text-black',
  DF: 'bg-blue-500/80 text-white',
  MF: 'bg-emerald-500/80 text-white',
  FW: 'bg-red-500/80 text-white',
}
</script>
