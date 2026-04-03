<template>
  <div class="flex items-center gap-0.5">
    <button
      class="w-5 h-5 rounded text-xs text-wc-light/40 hover:text-wc-light hover:bg-wc-purple/60 transition-colors flex items-center justify-center leading-none"
      :disabled="value === null || value <= 0"
      :class="{ 'opacity-20 cursor-default': value === null || value <= 0 }"
      @click="decrement"
    >−</button>

    <div
      class="w-7 h-7 flex items-center justify-center rounded text-sm font-bold cursor-pointer select-none transition-colors"
      :class="value !== null
        ? 'bg-wc-purple/60 text-wc-light'
        : 'bg-wc-purple/20 text-wc-light/25'"
      @click="initOrClear"
    >
      {{ value !== null ? value : '?' }}
    </div>

    <button
      class="w-5 h-5 rounded text-xs text-wc-light/40 hover:text-wc-light hover:bg-wc-purple/60 transition-colors flex items-center justify-center leading-none"
      :class="{ 'opacity-20 cursor-default': value !== null && value >= 20 }"
      @click="increment"
    >+</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number | null
}>()

const emit = defineEmits<{
  update: [value: number | null]
}>()

function increment() {
  if (props.value === null) {
    emit('update', 0)
  } else if (props.value < 20) {
    emit('update', props.value + 1)
  }
}

function decrement() {
  if (props.value === null || props.value <= 0) return
  emit('update', props.value - 1)
}

function initOrClear() {
  // Click the score cell: if not set, set to 0; if set, clear it
  if (props.value === null) {
    emit('update', 0)
  } else {
    emit('update', null)
  }
}
</script>
