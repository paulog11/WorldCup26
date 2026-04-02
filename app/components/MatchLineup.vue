<template>
  <div v-if="homePlayers.length && awayPlayers.length" class="mt-8">
    <!-- Tab selector -->
    <div class="flex border-b border-wc-purple mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="px-4 py-2 text-sm font-medium transition-colors relative"
        :class="activeTab === tab.key
          ? 'text-wc-gold'
          : 'text-wc-light/40 hover:text-wc-light/70'"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <div v-if="activeTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-wc-gold" />
      </button>
    </div>

    <!-- Formation View -->
    <div v-if="activeTab === 'formation'" class="space-y-8">
      <!-- Home team formation -->
      <TeamFormation
        :team="homeTeam"
        :players="homeStarting"
        :formation="homeMeta?.formation || '4-3-3'"
        :manager="homeMeta?.manager"
        side="home"
      />
      <!-- Away team formation -->
      <TeamFormation
        :team="awayTeam"
        :players="awayStarting"
        :formation="awayMeta?.formation || '4-3-3'"
        :manager="awayMeta?.manager"
        side="away"
      />
    </div>

    <!-- List View -->
    <div v-else-if="activeTab === 'list'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PlayerList :team="homeTeam" :starting="homeStarting" :subs="homeSubs" :manager="homeMeta?.manager" />
      <PlayerList :team="awayTeam" :starting="awayStarting" :subs="awaySubs" :manager="awayMeta?.manager" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player, Team, TeamMeta } from '~/types'

const props = defineProps<{
  homeTeam: Team
  awayTeam: Team
  homeLineup: { starting: string[]; subs: string[] }
  awayLineup: { starting: string[]; subs: string[] }
}>()

const { data: homePlayersRaw } = usePlayers({ team: props.homeTeam.id })
const { data: awayPlayersRaw } = usePlayers({ team: props.awayTeam.id })
const { data: homeMetaRaw } = useTeamMeta(props.homeTeam.id)
const { data: awayMetaRaw } = useTeamMeta(props.awayTeam.id)

const homeMeta = computed(() => homeMetaRaw.value as TeamMeta | null)
const awayMeta = computed(() => awayMetaRaw.value as TeamMeta | null)

const homePlayers = computed(() => (homePlayersRaw.value as Player[]) || [])
const awayPlayers = computed(() => (awayPlayersRaw.value as Player[]) || [])

function resolvePlayers(ids: string[], pool: Player[]): Player[] {
  return ids.map(id => pool.find(p => p.id === id)).filter(Boolean) as Player[]
}

const homeStarting = computed(() => resolvePlayers(props.homeLineup.starting, homePlayers.value))
const homeSubs = computed(() => resolvePlayers(props.homeLineup.subs, homePlayers.value))
const awayStarting = computed(() => resolvePlayers(props.awayLineup.starting, awayPlayers.value))
const awaySubs = computed(() => resolvePlayers(props.awayLineup.subs, awayPlayers.value))

const tabs = [
  { key: 'formation', label: 'Formation' },
  { key: 'list', label: 'Squad List' },
]
const activeTab = ref('formation')
</script>
