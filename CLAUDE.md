# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

There is no test suite configured.

## Architecture

Single-page React app (React 19, Vite 8, no TypeScript). All styling is inline CSS — there is no CSS framework, no CSS modules, no Tailwind.

**Entry point:** `src/main.jsx` → renders `<App />` from `src/App.jsx`

**The entire application lives in one component:** `CreditTracker` (exported from `src/App.jsx`). It manages all state with `useState` — there is no external state management library and no routing.

**Note:** `src/credit-tracker.jsx` is an older/alternate version of the same component with slightly different initial card balances. It is not currently imported anywhere.

### Persistence

State (`cards`, `score`, `wifeScore`, `milestones`, `history`) is persisted two ways, layered so the app degrades gracefully:

1. **`localStorage`** (key `creditTracker.v1`) — written synchronously on every state change. Works offline, and is the only persistence layer when running plain `vite`/`npm run dev` (no `/api` route available).
2. **Vercel Blob**, via `api/data.js` — a serverless function (`GET`/`POST`) that reads/writes a single shared JSON blob (`credit-tracker-data.json`). On mount, the app fetches `/api/data`; if a remote copy exists it overwrites local state, so all users/devices converge on the same data. On change, the app POSTs the new state to `/api/data`, debounced ~800ms. There is no polling — one device's edits only appear on another device the next time that device reloads the app. There is no auth on this route; anyone with the deployed URL can read/write the data.

Requires a Vercel Blob store created in the Vercel dashboard and linked to the project (auto-populates the `BLOB_READ_WRITE_TOKEN` env var). Without it, `/api/data` calls fail silently and the app just falls back to `localStorage`.

### State shape

| State var             | Purpose                                                                     |
| --------------------- | --------------------------------------------------------------------------- |
| `cards`               | Array of credit card objects `{id, name, balance, limit, color, bg, owner}` |
| `score` / `wifeScore` | Credit scores for Antonio / Damarys (controlled by range sliders)           |
| `milestones`          | 6-month plan items with `done` toggle                                       |
| `editing` / `editVal` | Which card is in inline-edit mode and its draft values                      |
| `tab`                 | Active tab: `"dashboard"` \| `"cards"` \| `"milestones"`                    |
| `cardFilter`          | Cards tab filter: `"all"` \| `"antonio"` \| `"wife"`                        |

### Color logic

- `getUtilColor(pct)` — green ≤10%, amber ≤30%, red >30%
- `getScoreColor(score)` — green ≥700, amber ≥660, red <660

### Design tokens (used throughout inline styles)

- Background: `#0A1628` (dark navy)
- Accent orange (Antonio): `#F4600C`
- Accent purple (Damarys): `#9B59B6`
- Muted text: `#8499AE`
- Body text: `#F5F8FA`

## ESLint notes

- Config is flat ESLint 9 format (`eslint.config.js`)
- `no-unused-vars` ignores names matching `/^[A-Z_]/` (uppercase or underscore-prefixed)
- `useEffect` is imported in `App.jsx` but currently unused — adding it to features is fine
