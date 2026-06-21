# Personal Dashboard

A clean, minimal personal tracker that pulls live data from Google Calendar & Gmail, plus lets you manage tasks and habits — all in one place.

---

## Features

- **Google Calendar** — upcoming events for the next 3 days
- **Gmail** — recent emails with unread count
- **Tasks** — add, complete, delete with priority levels (saved locally)
- **Daily Habits** — 7-day tracker with streak metrics (saved locally)
- **Metrics bar** — live summary of your day
- **Auto-sync** — refreshes every 5 minutes

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd personal-dashboard
npm install
```

### 2. Get your Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create an API key
3. Copy it

### 3. Set up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Gmail API** and **Google Calendar API**
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URI: `http://localhost:3000`
7. Copy the **Client ID**

### 4. Configure

```bash
cp src/config.example.js src/config.js
```

Edit `src/config.js` and fill in:

```js
ANTHROPIC_API_KEY: 'sk-ant-...',
GOOGLE_CLIENT_ID: '123456789.apps.googleusercontent.com',
```

> `config.js` is in `.gitignore` — your keys are never committed.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project structure

```
personal-dashboard/
├── index.html
├── vite.config.js
├── package.json
├── .gitignore
└── src/
    ├── main.js                 # App entry point
    ├── config.example.js       # Config template (commit this)
    ├── config.js               # Your actual config (never commit)
    ├── api/
    │   └── claude.js           # Anthropic API + MCP calls
    ├── components/
    │   ├── Header.js
    │   ├── Metrics.js
    │   ├── EventsCard.js
    │   ├── EmailsCard.js
    │   ├── TasksCard.js
    │   └── HabitsCard.js
    ├── utils/
    │   └── store.js            # State + localStorage
    └── styles/
        └── main.css
```

---

## Customizing

**Add a new metric card** — edit `src/components/Metrics.js`, add an object to the `metrics` array.

**Add a new section** (e.g. notes, countdowns) — create a new component in `src/components/`, import it in `src/main.js`, and add it to the grid.

**Change sync interval** — edit `SYNC_INTERVAL_MS` in `src/config.js`.

---

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host.

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: personal dashboard"
git remote add origin https://github.com/YOUR_USERNAME/personal-dashboard.git
git push -u origin main
```
