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

> Note: Frontend-backend HTTP integration for calculations is
> **implemented** — the current code sends `POST /api/calculate` to
> the backend and renders the returned result. History HTTP
> integration (`GET /api/history`, `DELETE /api/history/{id}`) is
> **not yet implemented** — see *Current Implementation Status*
> below.

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
- **fetch API** (backend HTTP communication)

No TypeScript, no UI/CSS frameworks, no router, no state library,
no HTTP client library, and no calculator library are used in this
phase.

---

## 6. Project Structure

The current Phase 3 structure of this repository:

```
.
├── src/
│   ├── components/
│   │   ├── CalculatorDisplay.vue
│   │   └── CalculatorKeypad.vue
│   ├── services/
│   │   └── calculatorApi.js
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
  the current expression, the backend result, an error message, or a
  loading indicator. It does not perform any network or string
  mutation.
- `CalculatorKeypad.vue` is a presentational component that renders
  the calculator button grid and emits intent events (`append`,
  `clear`, `backspace`, `calculate`). It performs no string mutation
  or network logic itself. It accepts a `disabled` prop used while a
  calculation request is in flight.
- `src/services/calculatorApi.js` owns all HTTP communication with
  the backend. It exposes `calculateExpression(expression)` and an
  `ApiError` class. Components must not contain duplicated `fetch`
  logic.
- `App.vue` owns the calculator UI state (`expression`, `result`,
  `errorMessage`, `isLoading`) and wires keypad / keyboard input to
  that state.

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
**is** required to actually evaluate expressions in the current
Phase 3 application — every calculation result is produced by
`POST /api/calculate`. Without the backend, the calculator UI
itself still loads and the user can construct / edit / clear an
expression, but pressing `=` does **not** produce a new valid
calculation result (the frontend shows the generic
*"Unable to connect to the calculator service."* message and never
falls back to local evaluation).

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

The frontend reads this URL from the `VITE_API_BASE_URL`
environment variable (defined in `.env.example`). The frontend must
be running with this variable set; otherwise the calculator
service returns the controlled error
*"Calculator service URL is not configured. Set VITE_API_BASE_URL in
a local .env file."* and no request is issued.

The Phase 3 integration calls:

- `POST http://127.0.0.1:8000/api/calculate`

with a JSON body of `{"expression": "<expression string>"}` and
displays the backend's `result` string verbatim on success.

When the backend is stopped or unreachable, the frontend shows the
generic message *"Unable to connect to the calculator service."* and
does **not** produce any local fallback result.

---

## 13. Current Implementation Status

This repository is currently at **Phase 3**: integration with the
backend `POST /api/calculate` endpoint. The frontend constructs an
expression, sends it to the backend, and displays the backend result
or the backend's safe error message.

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
  (backspace), and `=`.
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

Implemented in Phase 3:

- `src/services/calculatorApi.js` — backend HTTP client that owns
  the `POST /api/calculate` request, base-URL normalization, JSON
  parsing, and error mapping. Components do not contain duplicated
  `fetch` logic.
- Real `=` behavior — pressing `=` (button or `Enter`) sends the
  current expression to the backend and renders the returned
  result.
- Backend result display — the calculator display shows the
  backend's `result` string verbatim, prefixed with `=`.
- Backend error display — division-by-zero, malformed expressions,
  and other backend `HTTP 400` / `HTTP 500` responses are shown as
  the backend's safe `message` text.
- Connection-failure handling — when the backend is unreachable the
  frontend shows a generic "Unable to connect to the calculator
  service." message and does not produce any local fallback result.
- Loading state — while a request is in flight, the entire keypad
  is disabled, the display shows "Calculating…", and keyboard
  input that would mutate or resubmit is ignored.
- Duplicate-request protection — a second `=` press while a
  request is in flight is ignored.
- Result-reset on edit — appending, backspacing, or clearing the
  expression clears any previous result and error so stale values
  from a previous expression do not linger.
- `ApiError` exception type with `message` and `status` fields is
  used for both HTTP and network errors.

The frontend still does not perform arithmetic locally. Every
calculation result displayed in the UI comes from a successful
response of `POST /api/calculate`.

Not yet implemented (planned for later phases):

- Integration with `GET /api/history`.
- History display panel.
- Integration with `DELETE /api/history/{id}`.
- History deletion UI.
- LocalStorage is still **not** used as a source of truth for any
  history data.

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
- Backend integration verification (with the backend running on
  `http://127.0.0.1:8000`):
  - `1+2` → result `3`.
  - `(1+2)*3` → result `9`.
  - `10-3-2` → result `5`.
  - `8/4/2` → result `1`.
  - `0.1+0.2` → result `0.3`.
  - `.5*2` → result `1`.
  - `5.` → result `5`.
  - `-(1+2)` → result `-3`.
  - `--5` → result `5`.
  - `1/0` → backend error displayed ("division by zero" or similar).
  - Malformed expressions that can be constructed through the UI
    (e.g. `1++*`, `((1+`) → backend error displayed.
- Browser Network panel shows a real `POST http://127.0.0.1:8000/api/calculate`
  request with a JSON body of `{"expression": "<expression>"}`.
- Manual UI / input verification:
  - Button input constructs the expression string.
  - Keyboard input (digits, operators, parentheses, decimal point)
    constructs the expression string the same way.
  - `C` clears the expression; the display returns to `0`.
  - `Backspace` removes exactly one character from the expression.
  - While a calculation request is in flight, the entire keypad is
    disabled and the display shows "Calculating…".
  - Editing the expression after a successful calculation clears
    the previous result and any previous error.
- Backend-offline verification (after stopping the backend):
  - Pressing `=` with `1+2` produces no `3`.
  - The generic "Unable to connect to the calculator service."
    message is shown.
  - The application remains usable — the user can edit and clear
    the expression and retry once the backend is back.
- The browser console reports no errors, no Vue warnings, and no
  missing-asset errors.

No automated test framework has been added, so there are no `npm
test` scripts at this time.

---

## License

This repository is part of a university assignment. Use is subject
to the course's academic integrity policies.
