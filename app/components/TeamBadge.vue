<template>
  <div class="flex items-center gap-2" :class="{ 'flex-row-reverse': reverse }">
    <img
      v-if="team"
      :src="team.flag"
      :alt="team.name"
      class="w-6 h-4 object-cover rounded-sm"
    />
    <span class="text-sm font-medium" :class="textClass">
      {{ team ? (showName ? team.name : team.code) : 'TBD' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Team } from '~/types'

withDefaults(defineProps<{
  team: Team | null
  reverse?: boolean
  showName?: boolean
  textClass?: string
}>(), {
  reverse: false,
  showName: false,
  textClass: 'text-wc-light',
})
</script>
