# Code Style

This document describes the coding conventions used in this repository.

## External Base Standard

The base JavaScript style guide for this project is:

**Google JavaScript Style Guide**
https://google.github.io/styleguide/jsguide.html

The Google JavaScript Style Guide is the authoritative reference for
general JavaScript language conventions (declarations, naming, control
flow, comments, etc.) used throughout this project.

Conventions in this document are split into two groups:

1. Conventions inherited directly from the Google JavaScript Style
   Guide. These are restated here as reminders; the Google guide
   remains the source of truth.
2. Project-specific Vue and frontend conventions that extend or
   clarify the base guide for this codebase.

Any conflict between this document and the Google guide is resolved
in favor of the Google guide for general JavaScript rules, and in
favor of the project-specific section below for Vue/frontend rules.

---

## 1. Conventions Based on the Google JavaScript Style Guide

### Indentation

- Use **2-space** indentation for JavaScript, Vue `<script>` blocks,
  Vue templates, and CSS.
- Do not use tabs.

### Semicolons

- Use semicolons at the end of every statement.
- Do not rely on automatic semicolon insertion.

### Quotes

- Use **single quotes** (`'`) for string literals.
- Use template literals only when interpolation or multi-line strings
  are required.

### Naming

- Use **camelCase** for variables, functions, and object properties.
- Use **PascalCase** for constructors, classes, and Vue component
  filenames (e.g. `CalculatorKeypad.vue`).
- Use **UPPER_SNAKE_CASE** for module-level constants whose value is
  fixed at definition time.

### Variables

- Prefer `const` for bindings that are never reassigned.
- Use `let` only when reassignment is genuinely required.
- Declare one variable per declaration.
- Declare variables as close to their first use as practical.

### Functions

- Use named functions rather than anonymous functions when a name
  aids readability.
- Keep functions small and focused on a single responsibility.
- Prefer `function` declarations for top-level helpers and
  arrow functions for callbacks and short inline logic.

### Imports

- Group imports in this order, separated by blank lines:
  1. Standard library / framework imports
  2. Third-party imports
  3. Local imports
- Remove unused imports.
- Do not leave commented-out import statements.

### Comments

- Comments should explain **why** something is done, not what the
  code is literally doing.
- Avoid restating the code in English.
- Remove stale comments when the related code is removed.
- Prefer self-explanatory names over explanatory comments.

### General

- Remove unused variables, imports, and dead code before committing.
- Avoid deeply nested control flow; extract helpers when needed.
- Avoid mutating function arguments and module-level state.
- Keep files small and focused.

---

## 2. Project-Specific Vue and Frontend Conventions

These conventions extend the Google JavaScript Style Guide for
this Vue 3 + Vite project. They are **not** required by the Google
guide itself; they are decisions made for this codebase.

### File Organization

- Vue Single File Components (SFCs) live under `src/components/`.
- HTTP / API client code lives under `src/services/`.
- Reusable presentational components are placed in
  `src/components/`.
- Components should not contain direct `fetch` calls; they delegate
  to functions in `src/services/`.

### Component Naming

- Component file names use **PascalCase** with a descriptive suffix,
  for example `CalculatorDisplay.vue`, `HistoryList.vue`.
- The component name registered in a Vue SFC must match its
  filename (PascalCase).

### Component Design

- Prefer small, focused components over large multi-responsibility
  components.
- Avoid unnecessary global state. Component-local state belongs in
  the component; shared state, when truly needed, should be lifted
  to a parent or a service.
- Event handlers should delegate to named functions when the
  handler body is non-trivial. Inline expressions in templates
  should remain short.

### HTTP and API Code

- All network requests go through modules in `src/services/`.
- Components must not duplicate HTTP request code.
- Read the backend base URL from the `VITE_API_BASE_URL`
  environment variable; do not hard-code URLs in components.

### Frontend Calculation Discipline

This project follows a strict frontend/backend separation. The
following rules are mandatory in the frontend codebase:

- The frontend **must not** evaluate user arithmetic expressions
  locally.
- The frontend **must not** import or implement an expression
  parser, operator-precedence parser, or arithmetic evaluator.
- The frontend **must not** call `eval()`, `new Function()`,
  `Function(...)`, or any equivalent dynamic code construction
  mechanism to compute results.
- The browser must always request the final calculation result from
  the backend.
- No frontend code should copy backend parsing logic.

### History Data

- History is owned by the backend.
- LocalStorage must not be used as the source of truth for
  calculation history.
- LocalStorage may only be used for non-authoritative UI state
  (preferences, draft input) when explicitly justified in the PR
  description.

### Database and Backend Code

- This repository contains **no** database code.
- Do not add `axios` or any SQLAlchemy/PyMySQL dependencies here.
- Do not copy backend source files into this repository.

### CSS Naming

- Use plain CSS with class names written in **kebab-case**.
- Prefer BEM-style block names when a component grows
  (e.g. `calculator-display`, `calculator-display__value`).
- Avoid overly generic class names such as `box`, `wrapper`, or
  `container`; prefer names that describe purpose.
- Do not introduce CSS frameworks or preprocessors in this phase.

### Vue Template Style

- Use Vue 3 `<script setup>` syntax.
- Bind handlers with `@click="handleSomething"` style, where
  `handleSomething` is a named function for non-trivial behavior.
- Keep template expressions simple; move complex logic into
  computed properties or methods.

### Comments

- A code comment is justified only when it explains reasoning that
  is not obvious from reading the code.
- Do not add "TODO: implement later" comments in shipped code
  without a corresponding task or issue reference.
- Do not add comments that simply restate what the next line does.

---

## Summary

- Base standard: Google JavaScript Style Guide.
- Indentation: 2 spaces.
- Semicolons: always.
- Quotes: single quotes.
- Naming: camelCase for variables/functions, PascalCase for Vue
  component filenames.
- Vue components live in `src/components/`; HTTP code lives in
  `src/services/`.
- The frontend never evaluates expressions locally; the backend is
  the only source of calculation results and history data.
