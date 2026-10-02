<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import CalculatorDisplay from './components/CalculatorDisplay.vue';
import CalculatorKeypad from './components/CalculatorKeypad.vue';
import HistoryList from './components/HistoryList.vue';
import { ApiError, calculateExpression, deleteHistory, getHistory } from './services/calculatorApi.js';

const expression = ref('');
const result = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const history = ref([]);
const isHistoryLoading = ref(false);
const historyError = ref('');

const deletingHistoryId = ref(null);
const deleteHistoryError = ref('');

// Monotonic counter guarding overlapping GET /api/history requests.
// Each loadHistory() invocation increments the counter and captures
// its own id; only the response of the latest call is allowed to
// mutate history / historyError / isHistoryLoading. Older responses
// that resolve later are silently discarded, so an in-flight older
// GET cannot overwrite a newer authoritative list (for example,
// the list refreshed after a successful history deletion).
let historyRequestSequence = 0;

const allowedInputKeys = new Set([
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '.', '+', '-', '*', '/', '(', ')',
]);

function clearResultAndError() {
  result.value = '';
  errorMessage.value = '';
}

function handleAppend(token) {
  expression.value += token;
  clearResultAndError();
}

function handleClear() {
  expression.value = '';
  clearResultAndError();
}

function handleBackspace() {
  expression.value = expression.value.slice(0, -1);
  clearResultAndError();
}

async function handleCalculate() {
  if (isLoading.value) {
    return;
  }

  const currentExpression = expression.value;

  if (currentExpression.length === 0) {
    errorMessage.value = 'Enter an expression.';
    result.value = '';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  let calculated = false;

  try {
    const data = await calculateExpression(currentExpression);
    result.value = data.result;
    errorMessage.value = '';
    calculated = true;
  } catch (err) {
    if (err instanceof ApiError) {
      errorMessage.value = err.message;
    } else {
      errorMessage.value = 'Unable to connect to the calculator service.';
    }
    result.value = '';
  } finally {
    isLoading.value = false;
  }

  if (calculated) {
    await loadHistory();
  }
}

async function loadHistory() {
  const requestId = ++historyRequestSequence;
  isHistoryLoading.value = true;

  try {
    const items = await getHistory();

    if (requestId !== historyRequestSequence) {
      return;
    }

    history.value = items;
    historyError.value = '';
  } catch (err) {
    if (requestId !== historyRequestSequence) {
      return;
    }

    if (err instanceof ApiError) {
      historyError.value = err.message;
    } else {
      historyError.value = 'Unable to load calculation history.';
    }
  } finally {
    if (requestId === historyRequestSequence) {
      isHistoryLoading.value = false;
    }
  }
}

async function handleDeleteHistory(historyId) {
  if (deletingHistoryId.value !== null) {
    return;
  }

  deleteHistoryError.value = '';
  deletingHistoryId.value = historyId;

  let deleted = false;

  try {
    await deleteHistory(historyId);
    deleted = true;
  } catch (err) {
    if (err instanceof ApiError) {
      deleteHistoryError.value = err.message;
    } else {
      deleteHistoryError.value = 'Unable to delete history record.';
    }
  } finally {
    deletingHistoryId.value = null;
  }

  if (deleted) {
    await loadHistory();
  }
}

function handleKeydown(event) {
  if (isLoading.value) {
    return;
  }
  if (event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  const key = event.key;

  if (key === 'Backspace') {
    event.preventDefault();
    handleBackspace();
    return;
  }

  if (key === 'Escape' || key === 'Delete') {
    event.preventDefault();
    handleClear();
    return;
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    handleCalculate();
    return;
  }

  if (key.length === 1) {
    event.preventDefault();
    if (allowedInputKeys.has(key)) {
      handleAppend(key);
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  loadHistory();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <main class="app-shell" aria-label="Calculator application">
    <div class="calculator" aria-label="Calculator">
      <h1 class="calculator__title">Calculator</h1>
      <CalculatorDisplay
        :expression="expression"
        :result="result"
        :error-message="errorMessage"
        :is-loading="isLoading"
      />
      <CalculatorKeypad
        :disabled="isLoading"
        @append="handleAppend"
        @clear="handleClear"
        @backspace="handleBackspace"
        @calculate="handleCalculate"
      />
      <p class="calculator__hint" aria-hidden="true">
        Press “=” or Enter to evaluate via the backend.
      </p>
    </div>

    <HistoryList
      :history="history"
      :is-loading="isHistoryLoading"
      :error-message="historyError"
      :deleting-id="deletingHistoryId"
      :delete-error="deleteHistoryError"
      @delete="handleDeleteHistory"
    />
  </main>
</template>
