<template>
  <svg :width="size" :height="size * 1.5" :viewBox="`0 0 ${size} ${size * 1.5}`">
    <circle v-for="d in 6" :key="d"
      :cx="dotPos[d][0] * size * 0.45 + size * 0.2"
      :cy="dotPos[d][1] * size * 0.45 + size * 0.15"
      :r="size * 0.12"
      :fill="dots.includes(d) ? '#a855f7' : '#374151'" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ dots: number[]; size: number }>()
const dotPos: Record<number, [number, number]> = {
  1: [0, 0], 2: [0, 1], 3: [0, 2],
  4: [1, 0], 5: [1, 1], 6: [1, 2],
}
</script>
