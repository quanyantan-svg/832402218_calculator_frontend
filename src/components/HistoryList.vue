<script setup>
const emit = defineEmits(['delete']);

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
  deletingId: {
    type: Number,
    default: null,
  },
  deleteError: {
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

function deleteLabel(record) {
  return `Delete history record ${record.expression}`;
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
        :class="{ 'history__item--deleting': deletingId === record.id }"
        :data-id="record.id"
      >
        <div class="history__item-body">
          <div class="history__expression">{{ record.expression }}</div>
          <div class="history__result">= {{ record.result }}</div>
          <div class="history__time">{{ formatTimestamp(record.created_at) }}</div>
        </div>
        <button
          type="button"
          class="history__delete"
          :aria-label="deleteLabel(record)"
          :disabled="deletingId !== null"
          :data-test="`history-delete-${record.id}`"
          @click="emit('delete', record.id)"
        >
          {{ deletingId === record.id ? 'Deleting…' : 'Delete' }}
        </button>
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

    <p
      v-if="deleteError"
      class="history__status history__status--error history__status--inline"
      role="alert"
      data-test="history-delete-error"
    >
      {{ deleteError }}
    </p>
  </section>
</template>
