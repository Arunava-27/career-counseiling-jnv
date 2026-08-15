# Setup Guide (local/offline — for actual classroom sessions)

This app runs entirely on your own laptop — no internet needed during class. You and
your colleague each run your own independent copy on your own laptop; each has its own
local data. (There's also an optional online copy you can both share for prep/admin
access — see [DEPLOY.md](DEPLOY.md) — but it's separate from this and not needed for
running sessions.)

## Before you travel (needs internet, do this once per laptop)

1. Install [Node.js](https://nodejs.org) (v22 or later — the app uses a SQLite-compatible
   database library, so no separate database software is needed).
2. Copy this project folder onto the laptop.
3. Open a terminal in the project folder and run:

   ```bash
   npm install
   npm run build
   ```

4. Set up your login. Copy `server/.env.example` to `server/.env`, then edit it and set:
   - `AUTH_USERS` — pick your own username and password, e.g. `kunal:mypassword`.
   - `AUTH_SECRET` — any long random string (a generator command is in the file).

   Leave the `TURSO_*` lines commented out/unset — that's only for the optional online
   copy. Locally, the app stores everything in a file at
   `server/data/career-counseling.db`.

5. Test it once **before you leave**, so any problems show up now instead of in front
   of students:

   ```bash
   npm start
   ```

   Open the printed `http://localhost:4173` address in a browser — you should land on
   a login page, then be able to log in with the username/password from `server/.env`.
   Stop it with Ctrl+C when done.

## At the school (no internet required)

### 1. Connect your laptop to the classroom smartboard

If the smartboard has its own web browser (most modern interactive panels do), connect
it to the same WiFi/hotspot as your laptop and open its browser to your laptop's LAN
address (printed when the app starts, see step 3) — it'll show the same live
Instructor Console, controlled from your own laptop, no cable needed.

If it's a plain display (HDMI/wireless-display input only), mirror your laptop's screen
to it instead — on Windows, press `Windows key + K` to open wireless display ("Connect")
if the board supports Miracast, or use the board's own casting app/dongle.

### 2. Allow the app through Windows Firewall

The first time you run the app, Windows may show a firewall prompt for Node.js — click
**Allow access**. Test this once before the real session so it doesn't come up as a
surprise mid-class.

### 3. Start the app each day

```bash
npm start
```

The terminal prints something like:

```
Server listening on port 4173
  Local:   http://localhost:4173
  Network: http://192.168.x.x:4173
```

Open the `Local` address yourself and log in. If the smartboard has its own browser,
point it at the `Network` address instead (same login).

### 4. Run a session

1. On the Dashboard, add a session (topic, class, instructor, scheduled time) if it
   isn't already listed, then click **Start**.
2. Open the session and use **Present (projector view)** to walk through that topic's
   full facilitator script on the smartboard — it tells you what to say and when.
3. At the points the script indicates, launch that topic's discussion poll or quiz from
   the Polls panel, ask the class for a show of hands per option, and type the counts
   into **Record show of hands** — the tally and (for quizzes) accuracy update live.
4. For the psychometric test day: launch the assessment from the Assessments panel,
   then use **Take test with a student →** to open the walk-up kiosk — one student at a
   time enters their name, answers on your laptop, and you click **Next Student** to
   reset for the next one. Results are never shown to the student, only in your console.
5. Fill in **Attendance** and **Activity Notes** on the Dashboard row for your records,
   then click **Complete** when the session is done.

### 5. At the end of the programme

- **Psychometry Report** (from the Dashboard) — a clean, printable per-student results
  table across both instruments, ready to hand to the Principal (use the browser's
  Print/Save-as-PDF).
- **Export Data** (from the Dashboard) — CSVs (sessions, poll responses, assessment
  results) or a full JSON dump, if you need the raw data for anything else.

## Troubleshooting

- **Can't log in**: make sure `server/.env` exists with `AUTH_USERS` set, and that you
  restarted the app after creating/editing it.
- **"Port already in use" on startup**: another copy of the app (or a leftover process)
  is still running — close existing terminal windows running `npm start`, or restart
  the laptop.
- **Two instructors, two laptops**: no coordination needed — each laptop runs its own
  independent copy with its own local data, both used entirely offline in the classroom.
