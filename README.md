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

> Note: Frontend-backend HTTP integration for calculations, history
> retrieval, and individual history record deletion is
> **implemented** — the current code sends `POST /api/calculate`
> for evaluation, `GET /api/history` for history, and `DELETE
> /api/history/{id}` for deletion. The backend / database is the
> source of truth for history. Clear-all and batch deletion are
> **not** part of the backend API and are intentionally not
> implemented in the frontend.

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

Current frontend structure:

```
.
├── src/
│   ├── components/
│   │   ├── CalculatorDisplay.vue
│   │   ├── CalculatorKeypad.vue
│   │   └── HistoryList.vue
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
- `HistoryList.vue` is a presentational component that renders the
  calculator history returned by the backend. It receives `history`,
  `isLoading`, `errorMessage`, `deletingId`, and `deleteError` as
  props, and emits a single `delete` event carrying the selected
  backend record id. It performs no `fetch` calls, imports no
  service module, does not use any browser storage, and does not
  mutate the `history` array itself.
- `src/services/calculatorApi.js` owns all HTTP communication with
  the backend. It exposes `calculateExpression(expression)`,
  `getHistory()`, `deleteHistory(historyId)`, and an `ApiError`
  class. The service is the sole owner of HTTP traffic; components
  must not contain duplicated `fetch` logic.
- `App.vue` owns the calculator UI state, history state, and
  deletion state. The calculator state holds `expression`,
  `result`, `errorMessage`, and `isLoading`. The history state holds
  `history`, `isHistoryLoading`, and `historyError`. The deletion
  state holds `deletingHistoryId` and `deleteHistoryError`. It
  wires keypad / keyboard input to the calculator state and
  orchestrates: the initial `GET /api/history` on mount, the
  `POST /api/calculate` request, the `GET /api/history` refresh
  after a successful calculation, the `DELETE /api/history/{id}`
  request for a selected record, and the authoritative `GET
  /api/history` refresh after a successful deletion.

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
**is** required by the current frontend, both for evaluating
expressions through `POST /api/calculate`, for retrieving
calculation history through `GET /api/history`, and for deleting
individual history records through `DELETE /api/history/{id}`.
Without the backend, the calculator UI itself still loads and the
user can still construct, edit, and clear an expression, but:

- pressing `=` does **not** produce a new valid calculation result
  (the frontend shows the generic *"Unable to connect to the
  calculator service."* message and never falls back to local
  evaluation);
- calculation history cannot be retrieved or refreshed (the history
  panel shows *"Unable to load calculation history."*);
- clicking Delete on a history record does **not** remove it; the
  history panel shows *"Unable to delete history record."* (or the
  backend's safe `message`, e.g. *"History record not found"*), and
  the row stays visible until an authoritative refresh succeeds;
- no local fallback calculation is performed and no browser-stored
  history (LocalStorage, sessionStorage, IndexedDB) is used.

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

The current frontend calls:

- `POST http://127.0.0.1:8000/api/calculate` with a JSON body of
  `{"expression": "<expression string>"}`. The backend's `result`
  string is displayed verbatim on success.
- `GET http://127.0.0.1:8000/api/history` once on initial page
  load, after every successful calculation, and after every
  successful history record deletion. The response is rendered
  newest-first in the history panel.
- `DELETE http://127.0.0.1:8000/api/history/{history_id}` when the
  user clicks a record's Delete button. The id sent is the
  backend's `record.id` from `GET /api/history`.

When the backend is stopped or unreachable:

- `POST /api/calculate` failures show the generic
  *"Unable to connect to the calculator service."* message in the
  calculator area, and no local fallback result is produced.
- `GET /api/history` failures show *"Unable to load calculation
  history."* (or the backend's safe `message` when available) in
  the history panel. A previously rendered history list is
  preserved during a refresh failure.
- `DELETE /api/history/{id}` failures show *"Unable to delete
  history record."* (or the backend's safe `message`, such as
  *"History record not found"* for `HTTP 404`) in the history
  area. The row remains visible until an authoritative refresh
  removes it.

LocalStorage, sessionStorage, and IndexedDB are not used. History
shown in the UI always comes from `GET /api/history`, and history
deletions are confirmed by the backend before the UI updates.

---

## 13. Current Implementation Status

The core frontend implementation is complete. The frontend
integrates calculation requests via `POST /api/calculate`, history
retrieval and display via `GET /api/history`, and individual
history record deletion via `DELETE /api/history/{id}`. The
frontend does not persist history in the browser; the backend /
database is authoritative.

Production deployment is also complete. The public deployment is
reachable at http://129.204.51.149:8082. Nginx serves the Vue
production build as static files and reverse-proxies `/api/` and
`/health` to the local FastAPI backend; the backend and database
remain authoritative.

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
- Expression string construction, clear, backspace, supported
  keyboard entry, responsive layout, and accessible markup.

Implemented in Phase 3:

- `src/services/calculatorApi.js` — backend HTTP client that owns
  the `POST /api/calculate` request and the existing error model.
- Real `=` behavior — pressing `=` sends the current expression to
  the backend and renders the returned `result` string verbatim.
- Backend error display — division-by-zero, malformed expressions,
  and other backend `HTTP 400` / `HTTP 500` responses are shown as
  the backend's safe `message` text.
- Connection-failure handling — when the backend is unreachable the
  frontend shows a generic "Unable to connect to the calculator
  service." message and never falls back to local evaluation.
- Loading state — the keypad is disabled and the display shows
  "Calculating…" while a `POST /api/calculate` request is in
  flight, and a duplicate `=` press is ignored.
- Result-reset on edit — editing the expression clears any previous
  result and error.

Implemented in Phase 4:

- `getHistory()` exported from `src/services/calculatorApi.js` —
  issues `GET /api/history`, validates the response, and returns
  the array of records returned by the backend. The same `ApiError`
  model is used; no separate `fetch` implementation exists outside
  the service module.
- `HistoryList.vue` — presentational history component. Receives
  `history`, `isLoading`, and `errorMessage` as props. Renders
  expression, result, and timestamp per record. Renders an empty
  state when the backend returns an empty array and a controlled
  error state when history retrieval fails. Does not perform
  network requests.
- Initial history load — `App.vue` calls `loadHistory()` once
  inside the existing `onMounted` lifecycle hook alongside the
  keyboard listener registration.
- History refresh after a successful calculation — a `POST
  /api/calculate` success is followed by `loadHistory()`. The
  previously rendered history remains visible if the refresh fails;
  the failure is reported in `historyError`, not in the calculation
  error area, so a successful calculation is never reported as
  failed because of a subsequent history refresh failure.
- Newest-first rendering — the backend already returns records
  newest-first; the frontend preserves that order without
  resorting.
- Date / time rendering — backend `created_at` values are
  formatted with `new Date(value).toLocaleString()` for display.
  The backend value is not altered. Because the backend timestamp
  string is timezone-naive, the frontend does not invent
  timezone semantics; it formats presentation only.
- Database-backed persistence — the frontend reloads history from
  `GET /api/history` on every page load and after every successful
  calculation. LocalStorage, sessionStorage, and IndexedDB are not
  used.

Implemented in Phase 5:

- `deleteHistory(historyId)` exported from `src/services/calculatorApi.js` —
  issues `DELETE /api/history/{historyId}` against the same base
  URL as the other endpoints, using the existing `ApiError` model.
  Network failures throw `ApiError("Unable to delete history
  record.", 0)`; HTTP 4xx / 5xx responses throw `ApiError(...)` with
  the backend's safe `message` (so `HTTP 404` surfaces
  *"History record not found"*); malformed responses throw a
  controlled fallback `ApiError`. Success requires the JSON body to
  contain `success: true`. The id passed in must come from a record
  returned by `GET /api/history` — the frontend does not derive ids
  from array position, expression text, timestamp, or result.
- Per-record Delete button in `HistoryList.vue` — each record
  renders a `<button type="button">Delete</button>` with a
  descriptive `aria-label` that includes the record's expression.
  The button is disabled while any other deletion is in flight.
  The button text temporarily switches to *"Deleting…"* for the
  active row. No `fetch` or storage logic is added to the
  component — it remains presentational and only emits `delete`
  with the record id.
- Deletion state in `App.vue` — `deletingHistoryId` (number or
  `null`) tracks which record is currently being deleted;
  `deleteHistoryError` holds the controlled error message. These
  states are deliberately separate from the existing
  `isLoading` / `isHistoryLoading` / calculation / history-error
  state so that a deletion cannot be confused with a calculation
  or a history refresh.
- Authoritative refresh after deletion — after `deleteHistory()`
  resolves successfully, `App.vue` calls `loadHistory()` and
  replaces the displayed history with the backend's response. The
  frontend does **not** locally filter the history array as the
  authoritative mechanism for hiding a deleted row; the final
  rendered list comes from `GET /api/history` so the database
  ownership is observable.
- 404 / not-found handling — when the backend returns
  `HTTP 404`, the frontend surfaces the backend's
  *"History record not found"* message in the history area. The
  row remains visible until a subsequent authoritative refresh
  removes it.
- Backend-offline delete — when the backend is unreachable the
  frontend shows *"Unable to delete history record."* in the
  history area; the existing list stays intact and the calculator
  remains usable.
- DELETE-success / GET-refresh-failure separation — if `DELETE
  /api/history/{id}` succeeds but the subsequent `loadHistory()`
  fails, the deletion is still treated as successful; the
  refresh-failure error flows into `historyError` only and does
  not overwrite `deleteHistoryError` or the calculation result.
- Persistence — because deletion is performed by the backend
  against MySQL, deleted records do not return after a browser
  refresh, frontend dev-server restart, or backend process
  restart.

Final polish / Phase 6:

- Race hardening for `GET /api/history` — `App.vue` keeps a
  monotonic `historyRequestSequence` counter. Every `loadHistory()`
  call increments the counter, captures its own id, and only mutates
  `history`, `historyError`, and `isHistoryLoading` when its id
  still matches the counter after the request resolves. Older
  in-flight `GET` responses are discarded silently. This guarantees:
  - a slower older `GET` cannot overwrite the result of a newer
    `GET`;
  - an older `GET` that fails after a newer `GET` succeeds cannot
    replace the successful state with an error;
  - an older `GET` started before a deletion cannot restore the
    deleted row after the post-delete `GET` has completed;
  - `isHistoryLoading` is only cleared by the latest in-flight
    request.
- Responsive page layout — the `#app` container uses top-safe
  vertical alignment (`align-items: flex-start`) with horizontal
  centering preserved. On short viewports the page scrolls
  vertically as expected and the calculator + history stay
  reachable. The calculator card never becomes inaccessible above
  the visible viewport. No horizontal page overflow is introduced.
- History panel scrolling — the desktop history panel retains its
  internal `overflow-y: auto` cap so very long lists do not push
  the page taller than the viewport on tall desktop layouts; on
  mobile the cap is removed and the page itself scrolls, avoiding
  nested-scroll problems.
- Accessibility review — every interactive control is a native
  `<button type="button">` with a meaningful `aria-label`, a
  visible `:focus-visible` ring, and a native `:disabled` state
  during in-flight requests. The expression, result, loading,
  error, history loading, history refresh error, and history delete
  error regions use appropriate `role="alert"` / `aria-live`
  semantics without redundant ARIA.
- Source / security regression — final source search confirms
  zero `eval` / `Function` / expression-parser / math-library
  hits, zero `localStorage` / `sessionStorage` / `IndexedDB`
  hits, and exactly three `fetch(` calls, all in
  `src/services/calculatorApi.js` (POST calculate, GET history,
  DELETE history).
- No LocalStorage / sessionStorage / IndexedDB is used for
  history or any other state. No `axios` dependency was added.

The frontend still does not perform arithmetic locally. Every
calculation result displayed in the UI comes from a successful
response of `POST /api/calculate`, every rendered history record
comes from `GET /api/history`, and every successful deletion is
confirmed by the backend before the UI updates.

Not implemented (and intentionally out of scope):

- Clear-all history.
- Batch / multi-select deletion.
- Optimistic local deletion that hides a row before backend
  confirmation.
- LocalStorage, sessionStorage, or IndexedDB usage for history
  state.
- Frontend arithmetic / expression evaluation.

---

## 14. Production Deployment

The frontend has been deployed to a public server and verified
end-to-end against the deployed FastAPI backend and MySQL
database. This section documents the live deployment only.
Local-development documentation remains in the surrounding
sections.

### Public URL

```
http://129.204.51.149:8082
```

The public deployment was verified from an external browser.

### Production Architecture

Public traffic flow for the calculator UI:

```
Browser
  → Nginx :8082
  → Vue production static files (under /var/www/calculator)
```

Public traffic flow for backend API and health checks:

```
Browser
  → http://129.204.51.149:8082/api/...   (or /health)
  → Nginx :8082
  → FastAPI on 127.0.0.1:8000
  → MySQL on 127.0.0.1:3306
```

Nginx is the only public-facing web layer for this calculator
deployment. The FastAPI backend is not exposed directly on a
public port, and MySQL is not exposed publicly on port 3306.

### Frontend Build

The production frontend was built with:

```bash
VITE_API_BASE_URL=http://129.204.51.149:8082 npm run build
```

The production frontend must **not** use `http://127.0.0.1:8000`
as its browser-visible API base URL: in a remote user's browser,
`127.0.0.1` refers to that user's own machine, not to the
production server. For local development `127.0.0.1` is correct
because the browser runs on the same machine as the backend; for
the deployed frontend the API base URL must point at the public
Nginx endpoint.

The resulting `dist/` files were copied to:

```
/var/www/calculator
```

which Nginx serves as the static frontend document root.

### Nginx Routing

Routing summary for the public deployment:

```
/          → Vue production static files (under /var/www/calculator)
/api/      → http://127.0.0.1:8000
/health    → http://127.0.0.1:8000/health
```

Nginx terminates public traffic on TCP port 8082 and reverse-proxies
`/api/` and `/health` to the local FastAPI service. The FastAPI
service itself listens only on the server's loopback interface.

### Production Verification

The following facts were verified against the live deployment:

- The public page is reachable at http://129.204.51.149:8082.
- Successful calculations work through the deployed frontend
  (expressions are evaluated by the FastAPI backend).
- Compound expressions work (operator precedence and parentheses).
- The decimal result `0.1 + 0.2` resolves to `0.3`.
- Calculation history loads from the backend / MySQL.
- History record deletion works and the list refreshes from the
  backend afterwards.
- `/health` reports the production environment with the database
  connected.
- Server reboot was tested; the frontend, backend, and database
  services recover and history data persisted across the reboot.
- History remained persisted after restart (backend MySQL is
  authoritative).

The production deployment currently uses HTTP on port 8082.
HTTPS has **not** been configured, so this README does not claim
HTTPS.

### Security

Security posture of the deployed frontend and its supporting
services:

- The frontend contains no secrets. No database password, API
  token, private key, or backend credential is bundled into the
  Vue build or shipped to the browser.
- `VITE_API_BASE_URL` is public configuration (the URL the browser
  uses to reach the API). It is **not** a credential and exposing
  it to browser code is by design.
- The FastAPI backend listens only on the server's loopback
  interface at `127.0.0.1:8000`. It is not bound to a public
  interface.
- MySQL listens locally and is not intentionally exposed publicly.
- Production secrets (database credentials and any backend
  configuration values that must remain private) remain in the
  backend server's `.env` file and are **not** committed to Git.

---

## 15. Build Verification

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
- History verification:
  - On initial page load the frontend issues a `GET /api/history`
    request and renders the records returned by the backend.
  - After each successful `POST /api/calculate` the frontend issues
    a fresh `GET /api/history`; the new record appears at the top
    of the history panel.
  - Refreshing the browser page re-runs `GET /api/history`; the
    records persisted by the backend reload correctly.
  - Restarting the frontend dev server does not affect persisted
    history (the backend's MySQL store is authoritative).
- Delete verification:
  - Each visible history record shows a Delete button.
  - Clicking Delete sends `DELETE http://127.0.0.1:8000/api/history/{id}`
    with the id taken from the backend's `record.id`.
  - On `HTTP 200` the row disappears from the history panel after
    the subsequent `GET /api/history` returns the updated list;
    surrounding rows are unchanged.
  - On `HTTP 404` the backend's *"History record not found"*
    message is displayed in the history area; the row stays
    visible.
  - When the backend is offline, clicking Delete shows
    *"Unable to delete history record."* and the row stays visible.
  - Refreshing the browser page after a deletion does not restore
    the deleted record.
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
    message is shown in the calculator area.
  - The history panel shows "Unable to load calculation history."
    or the backend's safe `message` on the initial load.
  - A previously rendered history list stays visible during a
    subsequent refresh failure — only the inline error notice
    appears.
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
