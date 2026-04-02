<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-wc-light/50 text-xs uppercase tracking-wide border-b border-wc-purple">
          <th class="text-left py-2 px-2">#</th>
          <th class="text-left py-2 px-2">Team</th>
          <th class="text-center py-2 px-1">P</th>
          <th class="text-center py-2 px-1">W</th>
          <th class="text-center py-2 px-1">D</th>
          <th class="text-center py-2 px-1">L</th>
          <th class="text-center py-2 px-1">GF</th>
          <th class="text-center py-2 px-1">GA</th>
          <th class="text-center py-2 px-1">GD</th>
          <th class="text-center py-2 px-1 text-wc-gold font-bold">Pts</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(entry, index) in standings"
          :key="entry.team?.id"
          class="border-b border-wc-purple/30"
          :class="{ 'bg-wc-teal/10': index < qualifyCount }"
        >
          <td class="py-2 px-2 text-wc-light/50">{{ index + 1 }}</td>
          <td class="py-2 px-2">
            <NuxtLink v-if="entry.team" :to="`/teams/${entry.team.id}`" class="hover:text-wc-gold transition-colors">
              <TeamBadge :team="entry.team" show-name />
            </NuxtLink>
          </td>
          <td class="text-center py-2 px-1">{{ entry.played }}</td>
          <td class="text-center py-2 px-1">{{ entry.won }}</td>
          <td class="text-center py-2 px-1">{{ entry.drawn }}</td>
          <td class="text-center py-2 px-1">{{ entry.lost }}</td>
          <td class="text-center py-2 px-1">{{ entry.goalsFor }}</td>
          <td class="text-center py-2 px-1">{{ entry.goalsAgainst }}</td>
          <td class="text-center py-2 px-1">{{ entry.goalDifference > 0 ? '+' : '' }}{{ entry.goalDifference }}</td>
          <td class="text-center py-2 px-1 font-bold text-wc-gold">{{ entry.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  standings: any[]
  qualifyCount?: number
}>(), {
  qualifyCount: 2,
})
</script>
