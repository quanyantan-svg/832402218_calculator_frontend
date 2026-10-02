<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import CalculatorDisplay from './components/CalculatorDisplay.vue';
import CalculatorKeypad from './components/CalculatorKeypad.vue';

const expression = ref('');

const allowedInputKeys = new Set([
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '.', '+', '-', '*', '/', '(', ')',
]);

function handleAppend(token) {
  expression.value += token;
}

function handleClear() {
  expression.value = '';
}

function handleBackspace() {
  expression.value = expression.value.slice(0, -1);
}

// Placeholder for Phase 2. Phase 3 will wire this to POST /api/calculate
// and render the returned result. Local evaluation is intentionally
// forbidden.
function handleCalculate() {
  // no-op: backend integration arrives in a later phase
}

function handleKeydown(event) {
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
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <main class="calculator" aria-label="Calculator">
    <h1 class="calculator__title">Calculator</h1>
    <CalculatorDisplay :expression="expression" />
    <CalculatorKeypad
      @append="handleAppend"
      @clear="handleClear"
      @backspace="handleBackspace"
      @calculate="handleCalculate"
    />
    <p class="calculator__hint" aria-hidden="true">
      Build an expression. The “=” button is reserved for backend
      evaluation in a later phase.
    </p>
  </main>
</template>
