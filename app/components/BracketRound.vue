<template>
  <div class="flex flex-col shrink-0" :style="{ width: '208px' }">
    <!-- Round header -->
    <div class="text-center mb-4">
      <h3 class="text-xs uppercase tracking-widest font-semibold text-wc-teal">{{ title }}</h3>
      <p v-if="subtitle" class="text-[10px] text-wc-light/30 mt-0.5">{{ subtitle }}</p>
    </div>

    <!-- Match cards, vertically spaced to align with the bracket -->
    <div
      class="flex flex-col"
      :style="{ gap: `${gap}px` }"
    >
      <div v-for="match in matches" :key="match.matchId" class="flex items-center justify-center">
        <BracketMatch :match="match" @pick="(id) => emit('pick', match.matchId, id)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BracketMatch } from '~/composables/useBracket'

defineProps<{
  title: string
  subtitle?: string
  matches: BracketMatch[]
  gap?: number
}>()

const emit = defineEmits<{
  pick: [matchId: string, teamId: string]
}>()
</script>
