<script setup>
defineProps({
  history: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
});

// Backend returns naive ISO-like timestamps (no explicit timezone).
// Display is presentation formatting only; the underlying value is
// not interpreted as a precise timezone-aware instant.
function formatTimestamp(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}
</script>

<template>
  <section class="history" aria-labelledby="history-title">
    <h2 id="history-title" class="history__title">History</h2>

    <p
      v-if="isLoading && history.length === 0"
      class="history__status"
      data-test="history-loading"
    >
      Loading history…
    </p>

    <p
      v-else-if="errorMessage && history.length === 0"
      class="history__status history__status--error"
      role="alert"
      data-test="history-error"
    >
      {{ errorMessage }}
    </p>

    <p
      v-else-if="history.length === 0"
      class="history__status"
      data-test="history-empty"
    >
      No calculation history yet.
    </p>

    <ul v-else class="history__list" data-test="history-list">
      <li
        v-for="record in history"
        :key="record.id"
        class="history__item"
        :data-id="record.id"
      >
        <div class="history__expression">{{ record.expression }}</div>
        <div class="history__result">= {{ record.result }}</div>
        <div class="history__time">{{ formatTimestamp(record.created_at) }}</div>
      </li>
    </ul>

    <p
      v-if="errorMessage && history.length > 0"
      class="history__status history__status--error history__status--inline"
      role="alert"
      data-test="history-refresh-error"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>
