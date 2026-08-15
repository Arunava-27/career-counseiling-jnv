# Career Counselling Session App

A React + Express app for running instructor-led career-counselling sessions on a
classroom smartboard — full facilitator scripts, live polls/quizzes recorded by show of
hands, one-on-one psychometric testing, and session record-keeping — designed to run
fully offline on a laptop with no internet required during class.

Built for parallel use: each instructor runs their own independent copy on their own
laptop, with its own local data. An optional shared, deployed copy (with login) is also
supported for prep/admin access between sessions — see [docs/DEPLOY.md](docs/DEPLOY.md).

## Quick start

```bash
npm install
cp server/.env.example server/.env   # then edit it — set AUTH_USERS and AUTH_SECRET
npm run dev      # starts both the API server and the client with hot reload
```

Open `http://localhost:5173` and log in with the username/password you set in
`server/.env`.

For running this for real at a school (building for production, smartboard setup,
firewall), see [docs/SETUP.md](docs/SETUP.md). For deploying a shared online copy, see
[docs/DEPLOY.md](docs/DEPLOY.md).

## Project structure

- `server/` — Express API + a SQLite-compatible database (`@libsql/client`, works as
  either a local file or a hosted Turso database), serves the built client in
  production so the whole app runs as a single process on one port.
- `client/` — React + Vite frontend. `/console/*` is the instructor console (login
  required), `/join` is the student-facing join page (no login).
- `docs/SETUP.md` — field deployment guide (local/offline, for actual sessions).
- `docs/DEPLOY.md` — optional online deployment guide (Render + Turso, free tier).

## Key design points

- **Offline-first**: no internet dependency during class — the app runs entirely on
  the instructor's laptop, connected to the smartboard.
- **Instructor-led, not BYOD**: students have no individual devices. Polls/quizzes are
  recorded as show-of-hands tallies; the psychometric test is taken one student at a
  time on the instructor's own laptop via a walk-up kiosk.
- **Psychometric/aptitude results are instructor-only** — no student-facing route ever
  returns assessment scores, and the instructor console itself requires login.
- **Data persists** (locally by default, or in a shared hosted database when deployed)
  and can be exported as CSV/JSON, or viewed as a printable report, for compiling an
  end-of-programme report to the Principal.
