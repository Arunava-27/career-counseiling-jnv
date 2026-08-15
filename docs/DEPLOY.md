# Deploying online (free) — for prep/admin access, alongside your offline laptop setup

This is separate from your day-to-day classroom use. **Nothing about running the app
locally on your laptop for live sessions changes** — see [SETUP.md](SETUP.md) for that.
This guide is for getting a second, always-on copy reachable over the internet, so you
and your colleague can both check the Dashboard, add sessions, or review results from
anywhere — using a free Turso database (shared, persistent data) and free Render hosting.

## Overview

- **Turso** — a free, hosted database. Both of you connect to the same one when using
  the deployed app, so you see each other's data.
- **Render** — free hosting for the app itself (the same single Express+React app you
  already have, no code changes needed).
- **Login** — the deployed copy requires a username/password (see below), since it's on
  the public internet. Student-facing pages (`/join`, answering polls/tests) never
  require login, on either the local or deployed copy.

You'll need your own free accounts on both services — account creation isn't something
that can be done on your behalf.

## 1. Push this project to GitHub

Render deploys from a GitHub repository. If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new repository on [github.com](https://github.com) (keep it **private** —
it'll contain your programme content, though no student data — the database lives in
Turso, not in the repo), then follow GitHub's instructions to push your existing repo.

## 2. Create a free Turso database

1. Go to [turso.tech](https://turso.tech) and sign up for a free account.
2. Create a new database (from their dashboard, or via their CLI if you prefer:
   `turso db create career-counseling`).
3. Get two values you'll need for Render:
   - The **database URL** (starts with `libsql://...`) — shown on the database's page,
     or via `turso db show career-counseling --url`.
   - An **auth token** — create one from the database's page, or via
     `turso db tokens create career-counseling`.

Keep both of these somewhere safe for step 4.

## 3. Deploy to Render

1. Go to [render.com](https://render.com) and sign up for a free account.
2. Click **New > Blueprint**, and connect the GitHub repository you pushed in step 1.
   Render will detect the `render.yaml` file already in this project and pre-fill the
   service configuration (build command, start command, free plan).
3. When prompted for environment variables, fill in:
   - `AUTH_USERS` — `name1:password1,name2:password2` — pick a username and password
     for each of you (e.g. `kunal:somepassword,priya:anotherpassword`). These are the
     credentials you'll use to log in to the deployed copy.
   - `AUTH_SECRET` — any long random string. You can generate one locally with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - `TURSO_DATABASE_URL` — from step 2.
   - `TURSO_AUTH_TOKEN` — from step 2.
4. Deploy. Render will build and start the app, then give you a public URL like
   `https://career-counseling.onrender.com`.

Open that URL, and you should land on the login page. Log in with the username/password
you set in `AUTH_USERS`.

## Notes

- **Free-tier cold starts**: Render's free web services spin down after 15 minutes of
  inactivity. The first request after that takes 30–60 seconds to wake back up — normal,
  not a bug. Fine for prep/admin use; not something to rely on mid-lesson.
- **This does not replace your offline laptop setup.** Live 90-minute sessions with the
  smartboard should keep running locally per [SETUP.md](SETUP.md) — no internet
  dependency, no cold-start delay, no risk of losing connectivity mid-class.
- **Local `.env` file**: for local runs, copy `server/.env.example` to `server/.env` and
  set `AUTH_USERS` and `AUTH_SECRET` there (leave `TURSO_*` unset locally — the app uses
  a local SQLite file automatically). This is loaded once per laptop; you won't need to
  set it again.
- **Redeploying**: any time you push new commits to the connected GitHub branch, Render
  redeploys automatically.
