<script setup>
const emit = defineEmits(['append', 'clear', 'backspace', 'calculate']);

const buttons = [
  { id: 'clear', label: 'C', ariaLabel: 'Clear expression', emit: 'clear', variant: 'utility' },
  { id: 'backspace', label: '⌫', ariaLabel: 'Backspace', emit: 'backspace', variant: 'utility' },
  { id: 'paren-open', label: '(', ariaLabel: 'Left parenthesis', emit: 'append', token: '(', variant: 'paren' },
  { id: 'paren-close', label: ')', ariaLabel: 'Right parenthesis', emit: 'append', token: ')', variant: 'paren' },
  { id: 'digit-7', label: '7', ariaLabel: '7', emit: 'append', token: '7', variant: 'digit' },
  { id: 'digit-8', label: '8', ariaLabel: '8', emit: 'append', token: '8', variant: 'digit' },
  { id: 'digit-9', label: '9', ariaLabel: '9', emit: 'append', token: '9', variant: 'digit' },
  { id: 'op-div', label: '÷', ariaLabel: 'Divide', emit: 'append', token: '/', variant: 'operator' },
  { id: 'digit-4', label: '4', ariaLabel: '4', emit: 'append', token: '4', variant: 'digit' },
  { id: 'digit-5', label: '5', ariaLabel: '5', emit: 'append', token: '5', variant: 'digit' },
  { id: 'digit-6', label: '6', ariaLabel: '6', emit: 'append', token: '6', variant: 'digit' },
  { id: 'op-mul', label: '×', ariaLabel: 'Multiply', emit: 'append', token: '*', variant: 'operator' },
  { id: 'digit-1', label: '1', ariaLabel: '1', emit: 'append', token: '1', variant: 'digit' },
  { id: 'digit-2', label: '2', ariaLabel: '2', emit: 'append', token: '2', variant: 'digit' },
  { id: 'digit-3', label: '3', ariaLabel: '3', emit: 'append', token: '3', variant: 'digit' },
  { id: 'op-sub', label: '−', ariaLabel: 'Subtract', emit: 'append', token: '-', variant: 'operator' },
  { id: 'digit-0', label: '0', ariaLabel: '0', emit: 'append', token: '0', variant: 'digit' },
  { id: 'dot', label: '.', ariaLabel: 'Decimal point', emit: 'append', token: '.', variant: 'paren' },
  { id: 'equals', label: '=', ariaLabel: 'Calculate', emit: 'calculate', variant: 'equals' },
  { id: 'op-add', label: '+', ariaLabel: 'Add', emit: 'append', token: '+', variant: 'operator' },
];

function onClick(button) {
  if (button.emit === 'append') {
    emit('append', button.token);
  } else {
    emit(button.emit);
  }
}
</script>

<template>
  <div class="keypad" role="group" aria-label="Calculator keypad">
    <button
      v-for="button in buttons"
      :key="button.id"
      type="button"
      class="keypad__button"
      :class="['keypad__button--' + button.variant]"
      :aria-label="button.ariaLabel"
      :data-key="button.id"
      @click="onClick(button)"
    >
      {{ button.label }}
    </button>
  </div>
</template>
