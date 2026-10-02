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

> Note: Frontend-backend integration is **not yet implemented** in
> this Phase 1 repository. See *Current Implementation Status* below.

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

The cleaned Phase 1 structure of this repository:

```
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
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

- `src/components/` and `src/services/` are reserved directories for
  future Vue components and backend HTTP service modules.
- `src/assets/` and demo Vite content have been removed.

---

## 7. Environment Requirements

- **Node.js**
- **npm** (bundled with Node.js)

This Phase 1 repository was developed and verified locally with:

- Node.js **v22.23.2**
- npm **10.9.8**

No `engines` field is declared in `package.json`; the repository does
not enforce a specific Node.js or npm version. The versions above
are reported because they are the versions actually used to build
and run the Phase 1 commit.

A running instance of the backend service (`832402218_calculator_backend`)
is **not** required for Phase 1 development, because Phase 1 does
not yet make any API calls.

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

API integration is planned for a later frontend phase and is **not
yet implemented** in this Phase 1 repository.

---

## 13. Current Implementation Status

This repository is currently at **Phase 1**: project foundation,
cleanup, documentation, configuration, and build verification.

Implemented in Phase 1:

- Vue 3 + Vite project foundation.
- Removal of default Vite demo content.
- Cleaned project structure with reserved `src/components/` and
  `src/services/` directories.
- Minimal application shell displaying the project title and a
  status message.
- Clean global stylesheet (plain CSS).
- `.env.example` for backend base URL configuration.
- Updated `.gitignore`.
- `codestyle.md` documenting coding conventions.
- This `README.md`.

Not yet implemented (planned for later phases):

- Calculator keypad UI.
- Expression input behavior and calculate button behavior.
- Keyboard calculator controls.
- `src/services/` API client implementation.
- Integration with `POST /api/calculate`.
- Integration with `GET /api/history`.
- Integration with `DELETE /api/history/{id}`.
- History display panel.
- History deletion UI.
- Loading indicators and error-state UI for backend requests.

The frontend never performs arithmetic locally; all of the above
will be implemented by delegating to the backend API.

---

## 14. Build Verification

To verify that the frontend builds and runs locally:

```bash
npm install
npm run build
npm run dev
```

Expected results in Phase 1:

- `npm install` completes without errors.
- `npm run build` produces a `dist/` directory and exits with
  status code `0`.
- `npm run dev` starts the Vite dev server; the page loads and
  displays the minimal Phase 1 shell:
  - Title: `Calculator`
  - Status text: `Frontend application initialized successfully.`
- The browser console reports no errors related to missing assets
  or failed module loads.
- No API requests are made in Phase 1.

No automated test framework has been added in Phase 1, so there are
no `npm test` scripts at this time.

---

## License

This repository is part of a university assignment. Use is subject
to the course's academic integrity policies.
