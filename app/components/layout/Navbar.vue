<template>
  <nav class="bg-wc-dark border-b border-wc-purple">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-2xl font-bold text-wc-gold">WC</span>
          <span class="text-wc-light font-semibold hidden sm:inline">2026</span>
        </NuxtLink>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-6">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-wc-light/70 hover:text-wc-gold transition-colors text-sm font-medium"
            active-class="!text-wc-gold"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Mobile toggle -->
        <button
          class="md:hidden text-wc-light p-2"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile nav -->
      <div v-if="mobileOpen" class="md:hidden pb-4 space-y-2">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block text-wc-light/70 hover:text-wc-gold transition-colors text-sm font-medium py-2"
          active-class="!text-wc-gold"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const mobileOpen = ref(false)

const links = [
  { to: '/schedule', label: 'Schedule' },
  { to: '/groups', label: 'Groups' },
  { to: '/teams', label: 'Teams' },
  { to: '/venues', label: 'Venues' },
  { to: '/bracket', label: 'Bracket' },
]
</script>
