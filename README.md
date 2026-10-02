# 832402218 Calculator Frontend

## 1. Project Introduction

This repository contains the **frontend** for the
*Front-End and Back-End Separation Calculator System*.

It is a single-page calculator application built with **Vue 3** and
**Vite**. The frontend is responsible for the user interface and for
exchanging calculation requests and history with a separate backend
service.

The frontend does **not** compute calculation results on its own; all
arithmetic, validation, and persistence are handled by the backend.

---

## 2. Architecture

This project follows a strict **frontend/backend separation**:

- This repository: **frontend only** (Vue 3 + Vite, browser-side).
- Backend repository: **`832402218_calculator_backend`**
  (FastAPI + SQLAlchemy + MySQL 8.0), running independently as an
  HTTP API.

The browser loads the Vue application, then communicates with the
backend over HTTP using the native `fetch` API. Calculation logic,
database operations, and persistence live exclusively in the
backend repository.

> Note: Frontend-backend HTTP integration (calculation requests and
> history) is **not yet implemented** in this repository — see
> *Current Implementation Status* below. The current code implements
> the calculator UI and expression input only; it does not yet call
> any backend endpoint.

---

## 3. Frontend Responsibilities

The frontend is responsible for:

- Rendering the calculator user interface.
- Accepting user input (expression strings).
- Sending HTTP requests to the backend for calculations and
  history.
- Displaying calculation results returned by the backend.
- Displaying history records returned by the backend.
- Requesting deletion of selected history records via the backend
  API.

---

## 4. Backend Responsibilities

The backend (separate repository `832402218_calculator_backend`) is
responsible for:

- Expression validation and parsing.
- Arithmetic calculation, including operator precedence,
  parentheses, unary operators, decimal arithmetic, and
  division-by-zero handling.
- Persisting calculation records.
- Retrieving calculation history.
- Deleting calculation history records by id.

The frontend never reimplements any of the above locally.

---

## 5. Tech Stack

- **Vue 3** (`<script setup>` SFCs)
- **Vite** (build tool and dev server)
- **JavaScript** (ES modules)
- **Plain CSS** (no CSS frameworks)
- **fetch API** (planned for backend communication)

No TypeScript, no UI/CSS frameworks, no router, no state library,
no HTTP client library, and no calculator library are used in this
phase.

---

## 6. Project Structure

The current Phase 2 structure of this repository:

```
.
├── src/
│   ├── components/
│   │   ├── CalculatorDisplay.vue
│   │   └── CalculatorKeypad.vue
│   ├── services/
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env.example
├── .gitignore
├── codestyle.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

Notes:

- `CalculatorDisplay.vue` is a presentational component that renders
  the current expression. It is display-only — input is handled by
  the keypad buttons and supported keyboard keys.
- `CalculatorKeypad.vue` is a presentational component that renders
  the calculator button grid and emits intent events (`append`,
  `clear`, `backspace`, `calculate`). It performs no string
  mutation itself.
- `App.vue` owns the expression state and wires keypad/keyboard
  input to that state.
- `src/services/` is still reserved for the future backend API
  client (Phase 3+).

---

## 7. Environment Requirements

- **Node.js**
- **npm** (bundled with Node.js)

This repository was developed and verified locally with:

- Node.js **v22.23.2**
- npm **10.9.8**

No `engines` field is declared in `package.json`; the repository does
not enforce a specific Node.js or npm version. The versions above
are reported because they are the versions actually used to build
and run the current commit.

A running instance of the backend service (`832402218_calculator_backend`)
is **not** required for current Phase 2 UI/input development, because
no API calls are made yet. The calculator UI is fully usable offline.

---

## 8. Installation

Install dependencies:

```bash
npm install
```

---

## 9. Development

Start the Vite development server:

```bash
npm run dev
```

By default the development server is available at:

```
http://localhost:5173
```

The exact URL is printed by Vite when the server starts.

---

## 10. Production Build

Create an optimized production build:

```bash
npm run build
```

The build output is written to `dist/`.

Preview the production build locally:

```bash
npm run preview
```

---

## 11. Environment Configuration

A template environment file is provided:

```
.env.example
```

It contains:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

To override the backend base URL for local development, copy the
template to a local `.env`:

```bash
cp .env.example .env
```

Then edit `.env` if needed.

Only values prefixed with `VITE_` are exposed to browser code. Do
not put secrets (database credentials, tokens, passwords) in any
frontend environment file.

Local environment files (`.env`, `.env.local`, `.env.*.local`) are
git-ignored.

---

## 12. Backend Connection

The intended local backend base URL is:

```
http://127.0.0.1:8000
```

This corresponds to the default FastAPI development server in the
backend repository.

API integration is planned for a later frontend phase (Phase 3) and
is **not yet implemented** in this repository. The current code
implements the calculator UI and expression input only; it does not
yet call any backend endpoint.

---

## 13. Current Implementation Status

This repository is currently at **Phase 2**: calculator UI and
expression input. The frontend constructs an expression string and
displays it; it does not compute a result.

Implemented in Phase 1 (still present):

- Vue 3 + Vite project foundation.
- Removed default Vite demo content (including `public/favicon.svg`).
- Cleaned project structure.
- Plain-CSS global stylesheet.
- `.env.example` for backend base URL configuration.
- Updated `.gitignore`.
- `codestyle.md` documenting coding conventions.
- This `README.md`.

Implemented in Phase 2:

- Calculator interface (`CalculatorKeypad.vue`, `CalculatorDisplay.vue`).
- Calculator display that shows the current expression (with `0`
  shown as an empty-state placeholder).
- Calculator keypad containing digits `0`–`9`, decimal point,
  operators `+ - * /`, parentheses `( )`, `C` (clear), `⌫`
  (backspace), and `=` (placeholder action).
- Expression string construction — pressing buttons or supported
  keyboard keys appends the corresponding character to the
  expression.
- Clear (`C`) behavior — empties the expression.
- Backspace (`⌫`) behavior — removes only the last character of the
  expression (string operation only, no parsing).
- Supported keyboard entry — `0`–`9`, `.`, `+`, `-`, `*`, `/`, `(`,
  `)`, `Backspace`, `Delete` / `Escape`, and `Enter` / `=`.
  Unsupported printable keys are ignored and do not modify the
  expression.
- Responsive calculator layout for desktop, tablet, and mobile
  widths.
- Accessible semantic markup, including visible focus states and
  appropriate `aria-label`s on icon-like buttons.

The `=` button is **not yet wired to any calculation**. In Phase 2
it is a visual placeholder whose handler is intentionally a no-op;
the expression is never replaced by a result and the browser
performs no network request.

Not yet implemented (planned for later phases):

- Backend calculation integration (`POST /api/calculate`).
- Display of a calculated result returned by the backend.
- `src/services/` API client implementation.
- Integration with `GET /api/history`.
- History display panel.
- Integration with `DELETE /api/history/{id}`.
- History deletion UI.
- Loading indicators and error-state UI for backend requests.

The frontend never performs arithmetic locally; all numeric
evaluation belongs to the backend.

---

## 14. Build Verification

To verify that the frontend builds and runs locally:

```bash
npm install
npm run build
npm run dev
```

Expected results:

- `npm install` completes without errors.
- `npm run build` produces a `dist/` directory and exits with
  status code `0`.
- `npm run dev` starts the Vite dev server; the page loads and the
  calculator application renders.
- The calculator page is visible with:
  - A title of `Calculator`.
  - The expression display visible (showing `0` in the empty state).
  - The keypad visible with digit, operator, parenthesis, decimal,
    clear, backspace, and `=` buttons.
- Manual UI / input verification:
  - Button input constructs the expression string (e.g. pressing
    `1 + 2` produces `1+2`; pressing `( 1 + 2 ) * 3` produces
    `(1+2)*3`; pressing `0 . 5 + 2` produces `0.5+2`).
  - Keyboard input (digits, operators, parentheses, decimal point)
    constructs the expression string the same way.
  - `C` clears the expression; the display returns to `0`.
  - `Backspace` removes exactly one character from the expression.
  - Pressing `=` does **not** calculate the expression locally and
    does **not** modify the expression string.
  - Pressing `=` makes **no** network request.
- No API requests are issued in Phase 2. The browser's network
  panel remains empty of frontend-originated traffic.
- The browser console reports no errors, no Vue warnings, and no
  missing-asset errors.

No automated test framework has been added, so there are no `npm
test` scripts at this time.

---

## License

This repository is part of a university assignment. Use is subject
to the course's academic integrity policies.
