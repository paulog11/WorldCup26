<template>
  <div class="bg-wc-purple/20 border border-wc-purple rounded-xl overflow-hidden w-52 shrink-0">
    <!-- Date/venue header -->
    <div class="px-3 py-1.5 border-b border-wc-purple/50 text-center">
      <p class="text-[10px] text-wc-light/40 uppercase tracking-wide">
        {{ formattedDate }}
      </p>
    </div>

    <!-- Home team -->
    <button
      class="w-full flex items-center gap-2 px-3 py-2.5 transition-colors text-left"
      :class="homeClass"
      :disabled="!match.homeTeam"
      @click="match.homeTeam && emit('pick', match.homeTeam.id)"
    >
      <img
        v-if="match.homeTeam"
        :src="match.homeTeam.flag"
        :alt="match.homeTeam.name"
        class="w-7 h-5 object-cover rounded shrink-0"
      />
      <div v-else class="w-7 h-5 bg-wc-purple/40 rounded shrink-0" />
      <span class="text-sm font-medium truncate">
        {{ match.homeTeam?.name ?? homeTbd }}
      </span>
      <span v-if="isHomeWinner" class="ml-auto text-wc-gold shrink-0">✓</span>
    </button>

    <!-- Divider -->
    <div class="border-t border-wc-purple/30 mx-3" />

    <!-- Away team -->
    <button
      class="w-full flex items-center gap-2 px-3 py-2.5 transition-colors text-left"
      :class="awayClass"
      :disabled="!match.awayTeam"
      @click="match.awayTeam && emit('pick', match.awayTeam.id)"
    >
      <img
        v-if="match.awayTeam"
        :src="match.awayTeam.flag"
        :alt="match.awayTeam.name"
        class="w-7 h-5 object-cover rounded shrink-0"
      />
      <div v-else class="w-7 h-5 bg-wc-purple/40 rounded shrink-0" />
      <span class="text-sm font-medium truncate">
        {{ match.awayTeam?.name ?? awayTbd }}
      </span>
      <span v-if="isAwayWinner" class="ml-auto text-wc-gold shrink-0">✓</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { BracketMatch } from '~/composables/useBracket'

const props = defineProps<{
  match: BracketMatch
}>()

const emit = defineEmits<{
  pick: [teamId: string]
}>()

const isHomeWinner = computed(() => props.match.winnerId === props.match.homeTeam?.id)
const isAwayWinner = computed(() => props.match.winnerId === props.match.awayTeam?.id)

const homeClass = computed(() => {
  if (!props.match.homeTeam) return 'cursor-default opacity-50'
  if (isHomeWinner.value) return 'bg-wc-gold/10 border-l-2 border-wc-gold text-wc-gold cursor-pointer hover:bg-wc-gold/20'
  if (props.match.winnerId && !isHomeWinner.value) return 'opacity-40 cursor-pointer hover:opacity-60'
  return 'hover:bg-wc-purple/40 cursor-pointer text-wc-light'
})

const awayClass = computed(() => {
  if (!props.match.awayTeam) return 'cursor-default opacity-50'
  if (isAwayWinner.value) return 'bg-wc-gold/10 border-l-2 border-wc-gold text-wc-gold cursor-pointer hover:bg-wc-gold/20'
  if (props.match.winnerId && !isAwayWinner.value) return 'opacity-40 cursor-pointer hover:opacity-60'
  return 'hover:bg-wc-purple/40 cursor-pointer text-wc-light'
})

const formattedDate = computed(() => {
  if (!props.match.date) return '—'
  const d = new Date(props.match.date + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

// Slot-based TBD labels
function slotLabel(slot: string): string {
  if (!slot) return 'TBD'
  if (slot.startsWith('W-')) return `Winner of ${slot.slice(2)}`
  if (slot.startsWith('L-')) return `Loser of ${slot.slice(2)}`
  if (slot.startsWith('3rd-')) return `Best 3rd #${slot.slice(4)}`
  // slot like '1A', '2C'
  const pos = slot[0] === '1' ? 'Winner' : 'Runner-up'
  const group = slot.slice(1)
  return `${pos} Grp ${group}`
}

const homeTbd = computed(() => slotLabel(props.match.homeSlot))
const awayTbd = computed(() => slotLabel(props.match.awaySlot))
</script>
