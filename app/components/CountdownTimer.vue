<template>
  <div class="flex gap-4 justify-center">
    <div v-for="unit in units" :key="unit.label" class="text-center">
      <div class="text-3xl sm:text-4xl font-bold text-wc-gold tabular-nums">
        {{ String(unit.value).padStart(2, '0') }}
      </div>
      <div class="text-xs text-wc-light/50 uppercase tracking-wide mt-1">{{ unit.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ target: string }>()

const now = useNow({ interval: 1000 })

const units = computed(() => {
  const diff = new Date(props.target).getTime() - now.value.getTime()
  if (diff <= 0) return [{ label: 'Days', value: 0 }, { label: 'Hours', value: 0 }, { label: 'Min', value: 0 }, { label: 'Sec', value: 0 }]

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Min', value: minutes },
    { label: 'Sec', value: seconds },
  ]
})
</script>
