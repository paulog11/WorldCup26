<template>
  <div class="bg-wc-purple/10 border border-wc-purple border-t-0 rounded-b-xl px-4 py-3">
    <button
      class="flex items-center gap-2 text-xs uppercase tracking-wide text-wc-light/40 hover:text-wc-light/60 transition-colors w-full"
      @click="expanded = !expanded"
    >
      <svg
        class="w-3.5 h-3.5 transition-transform"
        :class="{ 'rotate-90': expanded }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
      </svg>
      Substitutes ({{ subs.length }})
    </button>

    <Transition name="expand">
      <div v-if="expanded" class="mt-2 space-y-0.5">
        <PlayerTooltip v-for="player in sortedSubs" :key="player.id" :player="player" position="bottom">
          <div class="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-wc-purple/30 cursor-pointer transition-colors group">
            <span class="w-6 text-center text-xs text-wc-light/40 font-medium">{{ player.number }}</span>
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 opacity-70"
              :class="positionBadge[player.position]"
            >
              {{ player.position }}
            </span>
            <span class="text-sm text-wc-light/60 group-hover:text-wc-gold transition-colors truncate">{{ player.name }}</span>
            <span class="ml-auto text-xs text-wc-light/20 shrink-0">{{ player.club }}</span>
          </div>
        </PlayerTooltip>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Player, Team } from '~/types'

const props = defineProps<{
  team: Team
  subs: Player[]
}>()

const expanded = ref(false)

const positionOrder: Record<string, number> = { GK: 0, DF: 1, MF: 2, FW: 3 }

const sortedSubs = computed(() =>
  [...props.subs].sort((a, b) => (positionOrder[a.position] ?? 4) - (positionOrder[b.position] ?? 4))
)

const positionBadge: Record<string, string> = {
  GK: 'bg-amber-500/80 text-black',
  DF: 'bg-blue-500/80 text-white',
  MF: 'bg-emerald-500/80 text-white',
  FW: 'bg-red-500/80 text-white',
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
