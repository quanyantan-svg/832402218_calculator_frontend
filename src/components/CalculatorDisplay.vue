<script setup>
defineProps({
  expression: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    class="display"
    role="status"
    aria-live="polite"
    aria-label="Calculator expression"
  >
    <div class="display__value" data-test="display-value">
      {{ expression === '' ? '0' : expression }}
    </div>
  </div>
</template>
