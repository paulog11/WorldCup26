<template>
  <div class="max-w-full px-4 py-8">
    <!-- Page header -->
    <div class="max-w-6xl mx-auto mb-8 flex items-start justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold text-wc-gold">Bracket Maker</h1>
        <p class="text-wc-light/40 text-sm mt-1">
          Predict group stage results, then pick your knockout winners. All picks saved in your browser.
        </p>
      </div>
      <button
        class="text-sm text-wc-light/50 hover:text-wc-magenta border border-wc-purple hover:border-wc-magenta px-4 py-2 rounded-lg transition-colors"
        @click="resetAll"
      >
        Reset All
      </button>
    </div>

    <!-- Top-level tabs -->
    <div class="max-w-6xl mx-auto mb-6">
      <div class="flex gap-1 flex-wrap border-b border-wc-purple">
        <button
          v-for="tab in topTabs"
          :key="tab.key"
          class="px-4 py-2 text-sm font-medium transition-colors relative"
          :class="topTab === tab.key ? 'text-wc-gold' : 'text-wc-light/40 hover:text-wc-light/70'"
          @click="topTab = tab.key"
        >
          {{ tab.label }}
          <span
            v-if="tab.key === 'groups' && groupPredictedCount > 0"
            class="ml-1 text-[10px] bg-wc-teal/20 text-wc-teal px-1.5 py-0.5 rounded-full"
          >
            {{ groupPredictedCount }}/72
          </span>
          <div v-if="topTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-wc-gold" />
        </button>
      </div>
    </div>

    <!-- ========== GROUP STAGE TAB ========== -->
    <div v-if="topTab === 'groups'" class="max-w-6xl mx-auto">
      <p class="text-xs text-wc-light/30 mb-5">
        Enter predicted scores for each match. The results will determine which teams qualify for the knockout stage.
      </p>

      <!-- Group selector -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="g in allGroups"
          :key="g"
          class="w-9 h-9 rounded-lg text-sm font-semibold transition-colors border"
          :class="selectedGroup === g
            ? 'bg-wc-gold text-wc-dark border-wc-gold'
            : 'bg-wc-purple/20 text-wc-light/60 border-wc-purple/50 hover:border-wc-gold/50 hover:text-wc-light'"
          @click="selectedGroup = g"
        >
          {{ g }}
        </button>
      </div>

      <!-- Selected group content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Matches column -->
        <div>
          <h2 class="text-sm font-semibold text-wc-teal uppercase tracking-wide mb-3">
            Group {{ selectedGroup }} Matches
          </h2>
          <div class="space-y-1.5">
            <GroupPredictionMatch
              v-for="match in matchesByGroup[selectedGroup] ?? []"
              :key="match.id"
              :match="match"
              :prediction="predictions[match.id]"
              @predict="predict"
            />
          </div>
          <p class="text-xs text-wc-light/25 mt-3">
            Click a score to clear it. Use + / − to adjust.
          </p>
        </div>

        <!-- Standings column -->
        <div>
          <h2 class="text-sm font-semibold text-wc-teal uppercase tracking-wide mb-3">
            Predicted Standings
          </h2>
          <div class="bg-wc-purple/20 border border-wc-purple rounded-xl p-4">
            <StandingsTable
              :standings="predictedStandings?.[selectedGroup] ?? emptyStandings[selectedGroup] ?? []"
              :qualify-count="3"
            />
            <p class="text-[10px] text-wc-light/25 mt-3 text-center">
              Top 2 qualify automatically · 3rd place may qualify as one of the 8 best third-place teams
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== KNOCKOUT TABS ========== -->
    <template v-else>
      <div v-if="isLoading" class="text-center py-20 text-wc-light/30">
        Loading bracket...
      </div>

      <template v-else>
        <!-- Knockout sub-tabs -->
        <div class="max-w-6xl mx-auto mb-6">
          <div class="flex gap-1 flex-wrap border-b border-wc-purple/50">
            <button
              v-for="tab in knockoutTabs"
              :key="tab.key"
              class="px-4 py-2 text-sm font-medium transition-colors relative"
              :class="knockoutTab === tab.key ? 'text-wc-gold' : 'text-wc-light/40 hover:text-wc-light/70'"
              @click="knockoutTab = tab.key"
            >
              {{ tab.label }}
              <div v-if="knockoutTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-wc-gold" />
            </button>
          </div>
        </div>

        <!-- No predictions banner -->
        <div v-if="groupPredictedCount === 0" class="max-w-6xl mx-auto mb-6">
          <div class="bg-wc-purple/20 border border-wc-purple/50 rounded-xl px-5 py-4 flex items-center gap-4">
            <span class="text-2xl">⚽</span>
            <div>
              <p class="text-sm font-medium text-wc-light">Predict the Group Stage first</p>
              <p class="text-xs text-wc-light/40 mt-0.5">
                Head to the <button class="text-wc-teal underline" @click="topTab = 'groups'">Group Stage</button> tab to enter scores. The qualified teams will automatically fill the bracket.
              </p>
            </div>
          </div>
        </div>

        <!-- Round of 32 -->
        <div v-if="knockoutTab === 'r32'" class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <BracketMatch
              v-for="match in r32Matches"
              :key="match.matchId"
              :match="match"
              @pick="(id) => pickWinner(match.matchId, id)"
            />
          </div>
        </div>

        <!-- Round of 16 -->
        <div v-if="knockoutTab === 'r16'" class="max-w-6xl mx-auto">
          <p v-if="r32Picks < 16" class="text-wc-light/40 text-sm mb-4">
            Pick all {{ 16 - r32Picks }} remaining Round of 32 winners to unlock this round.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BracketMatch
              v-for="match in r16Matches"
              :key="match.matchId"
              :match="match"
              @pick="(id) => pickWinner(match.matchId, id)"
            />
          </div>
        </div>

        <!-- Quarter-Finals -->
        <div v-if="knockoutTab === 'qf'" class="max-w-6xl mx-auto">
          <p v-if="r16Picks < 8" class="text-wc-light/40 text-sm mb-4">
            Pick all {{ 8 - r16Picks }} remaining Round of 16 winners to unlock this round.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BracketMatch
              v-for="match in qfMatches"
              :key="match.matchId"
              :match="match"
              @pick="(id) => pickWinner(match.matchId, id)"
            />
          </div>
        </div>

        <!-- Semi-Finals -->
        <div v-if="knockoutTab === 'sf'" class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BracketMatch
              v-for="match in sfMatches"
              :key="match.matchId"
              :match="match"
              @pick="(id) => pickWinner(match.matchId, id)"
            />
          </div>
        </div>

        <!-- Final -->
        <div v-if="knockoutTab === 'final'" class="max-w-6xl mx-auto flex flex-col items-center gap-8">
          <div v-if="thirdPlaceMatch" class="w-full max-w-sm">
            <h2 class="text-lg font-bold text-wc-light/50 mb-3 text-center">Third Place</h2>
            <div class="flex justify-center">
              <BracketMatch :match="thirdPlaceMatch" @pick="(id) => pickWinner('m103', id)" />
            </div>
          </div>
          <div v-if="finalMatch" class="w-full max-w-sm">
            <h2 class="text-2xl font-bold text-wc-gold mb-3 text-center">THE FINAL</h2>
            <div class="flex justify-center">
              <BracketMatch :match="finalMatch" @pick="(id) => pickWinner('m104', id)" />
            </div>
            <div v-if="champion" class="mt-6 text-center">
              <p class="text-xs text-wc-light/40 uppercase tracking-widest mb-2">Your Champion</p>
              <div class="flex items-center justify-center gap-3">
                <img :src="champion.flag" :alt="champion.name" class="w-12 h-8 object-cover rounded shadow-lg" />
                <span class="text-2xl font-bold text-wc-gold">{{ champion.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Full Bracket horizontal scroll -->
        <div v-if="knockoutTab === 'full'" class="overflow-x-auto pb-8">
          <div class="flex gap-6 min-w-max px-4 items-start">
            <BracketRound
              title="Round of 32"
              subtitle="July 4–9"
              :matches="r32Matches"
              :gap="8"
              @pick="pickWinner"
            />
            <div class="flex items-center self-stretch">
              <div class="w-6 border-t border-wc-purple/30" />
            </div>
            <BracketRound
              title="Round of 16"
              subtitle="July 10–13"
              :matches="r16Matches"
              :gap="96"
              class="mt-[64px]"
              @pick="pickWinner"
            />
            <div class="flex items-center self-stretch">
              <div class="w-6 border-t border-wc-purple/30" />
            </div>
            <BracketRound
              title="Quarter-Finals"
              subtitle="July 14–15"
              :matches="qfMatches"
              :gap="220"
              class="mt-[200px]"
              @pick="pickWinner"
            />
            <div class="flex items-center self-stretch">
              <div class="w-6 border-t border-wc-purple/30" />
            </div>
            <BracketRound
              title="Semi-Finals"
              subtitle="July 18–19"
              :matches="sfMatches"
              :gap="480"
              class="mt-[456px]"
              @pick="pickWinner"
            />
            <div class="flex items-center self-stretch">
              <div class="w-6 border-t border-wc-purple/30" />
            </div>
            <div class="shrink-0 flex flex-col gap-6 mt-[970px]">
              <div class="text-center mb-4">
                <h3 class="text-xs uppercase tracking-widest font-semibold text-wc-teal">Final</h3>
                <p class="text-[10px] text-wc-light/30 mt-0.5">July 19</p>
              </div>
              <BracketMatch v-if="finalMatch" :match="finalMatch" @pick="(id) => pickWinner('m104', id)" />
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="max-w-6xl mx-auto mt-8 border-t border-wc-purple pt-6">
          <div class="flex items-center gap-4">
            <span class="text-xs text-wc-light/40">Knockout picks: {{ knockoutPicks }} / {{ totalKnockoutMatches }}</span>
            <div class="flex-1 h-1.5 bg-wc-purple/30 rounded-full overflow-hidden">
              <div
                class="h-full bg-wc-gold rounded-full transition-all duration-300"
                :style="{ width: `${(knockoutPicks / totalKnockoutMatches) * 100}%` }"
              />
            </div>
            <span class="text-xs text-wc-gold font-medium">{{ Math.round((knockoutPicks / totalKnockoutMatches) * 100) }}%</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Standing } from '~/types'

const allGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

// Group predictions composable
const {
  matchesByGroup,
  predictions,
  predict,
  resetPredictions,
  predictedStandings,
  predictedCount: groupPredictedCount,
} = useGroupPredictions()

// Bracket composable — driven by predicted standings
const {
  isLoading,
  r32Matches,
  r16Matches,
  qfMatches,
  sfMatches,
  thirdPlaceMatch,
  finalMatch,
  picks,
  pickWinner,
  resetPicks,
} = useBracket(predictedStandings)

// Tab state
const topTab = ref<'groups' | 'knockout'>('groups')
const knockoutTab = ref('r32')
const selectedGroup = ref('A')

const topTabs = [
  { key: 'groups', label: 'Group Stage' },
  { key: 'knockout', label: 'Knockout Stage' },
]

const knockoutTabs = [
  { key: 'r32', label: 'Round of 32' },
  { key: 'r16', label: 'Round of 16' },
  { key: 'qf', label: 'Quarter-Finals' },
  { key: 'sf', label: 'Semi-Finals' },
  { key: 'final', label: 'Final' },
  { key: 'full', label: 'Full Bracket' },
]

// Fallback empty standings for groups with no predictions yet
// (StandingsTable needs the team objects, so we derive from match data)
const { data: teamsRaw } = useFetch('/api/teams')
const emptyStandings = computed(() => {
  const teams = (teamsRaw.value as any[]) ?? []
  const result: Record<string, Standing[]> = {}
  for (const g of allGroups) {
    const groupTeams = teams.filter((t: any) => t.group === g)
    result[g] = groupTeams.map((t: any): Standing => ({
      team: t,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
    }))
  }
  return result
})

const r32Picks = computed(() => r32Matches.value.filter(m => m.winnerId).length)
const r16Picks = computed(() => r16Matches.value.filter(m => m.winnerId).length)

const totalKnockoutMatches = 31
const knockoutPicks = computed(() =>
  Object.keys(picks.value).filter(id => id !== 'm103').length
)

const champion = computed(() => {
  const m = finalMatch.value
  if (!m?.winnerId) return null
  return m.homeTeam?.id === m.winnerId ? m.homeTeam : m.awayTeam
})

function resetAll() {
  resetPredictions()
  resetPicks()
}
</script>
