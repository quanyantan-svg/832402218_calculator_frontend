<script setup>
defineProps({
  expression: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="display" aria-label="Calculator display">
    <div class="display__expression" aria-live="polite" data-test="display-expression">
      {{ expression === '' ? '0' : expression }}
    </div>

    <div
      v-if="errorMessage"
      class="display__error"
      role="alert"
      data-test="display-error"
    >
      {{ errorMessage }}
    </div>

    <div
      v-else-if="isLoading"
      class="display__loading"
      aria-live="polite"
      data-test="display-loading"
    >
      Calculating…
    </div>

    <div
      v-else-if="result"
      class="display__result"
      aria-live="polite"
      data-test="display-result"
    >
      = {{ result }}
    </div>
  </div>
</template>
