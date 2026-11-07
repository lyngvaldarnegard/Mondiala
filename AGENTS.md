# Instructions for AI agents working on this repo

Read this before doing anything. It exists so that new AI sessions (Claude, Cursor,
Vibe Code, …) don't get confused about how this repo is structured and shipped.

## What this repo is

Three things served by one GitHub Pages site (deploys from `main` automatically,
~1–2 minutes after push — no build step, no CI):

1. **The front page** — `index.html` at the root. A landing page linking the three
   parts below. It is NOT a redirect to the city map; the city map is reached
   through it, framed as "an idea for how a city could be built".
2. **The manifesto** — `policy/`. An illustrated, interactive personal manifesto
   for a rule-driven welfare state ("Autopilot"), with workbench pages (tax,
   pension, food card, budget, municipal, electoral, constitution, checks,
   data register). Plain ES-module JS + Chart.js/d3 from CDN. No framework.
3. **The city map** — `city-designer/`. The hex-grid world capital. Read-only
   viewer over generated seating tables.
4. **The society simulator** — `simulator/index.html`. A self-contained copy of
   the build from the separate
   [politics-economics-sim](https://github.com/lyngvaldarnegard/politics-economics-sim)
   repo (that repo owns the version history; this copy is just the shipped build).

## Hard rules

- **Numbers live in the data layer, never in code.** All concrete constants for the
  policy app are in `policy/data/data.json` + `policy/data/update-register.json`.
  Adding a tracked number = new register entry, no code change.
- **Never hand-edit `city-designer/mondiala-seating.js`** — it is generated. After
  a roster edit run `sh city-designer/test/regen.sh` and commit the regenerated
  table.
- **`VERSIONS.md` gets a new row for every shipped push** — the repo's convention
  is that every push is a permanent, indexed snapshot.
- **The budget always balances through the LVT valve** — never show an unbalanced
  budget. **One tax base implementation** in `policy/js/tax.js`; variants are
  toggles, not forks. Plan B's "card-tracking theory" is illustration copy only;
  the sjablong formula is the implementation.
- English everywhere in the policy app.

## Tests — run these before declaring done

```sh
node policy/test/smoke.mjs      # every route renders headlessly
node policy/test/formulas.mjs   # 45 formula/spec checks (incl. the Plan A staircase spec)
sh city-designer/test/run.sh    # city-map suite (only if you touched city-designer/)
```

## Delivery workflow — and the merge gotcha

Normal flow: branch (`vibe/<slug>`), commit, push, open a draft PR with
`gh pr create`, report the PR URL.

**The gotcha:** `gh pr merge` fails here with
`Error: Merging pull requests via CLI is not allowed.` This is a restriction of
the AI agent environment, NOT a GitHub repo setting — there is no setting the
owner can change to enable it, so don't send them looking for one, and don't
claim the repo is misconfigured. Two legitimate ways to finish:

1. Ask the owner to click "Merge pull request" in the web UI, or
2. With the owner's explicit approval, merge locally and push `main` directly:

```sh
git fetch origin
git checkout main && git reset --hard origin/main
git merge --no-ff origin/<branch> -m "Merge pull request #N from ..."
git push origin main
```

GitHub marks the PR `MERGED` automatically once its head commits are reachable
from `main`. Pushing to `main` is a write to the default branch — get explicit
user approval first (the owner of this repo has said they want the AI to handle
delivery end-to-end, but confirm if the change is anything beyond what they asked
for). Verify the live site at https://lyngvaldarnegard.github.io/Mondiala/ after
merging (note: plain `curl` may be blocked in the sandbox; use the web fetch tool).

## Conventions worth copying

- CSS/design: dark theme tokens `--bg:#0d1117 --panel:#161b22 --line:#2b3244
  --fg:#dce3ec --dim:#7d8b9d --gold:#e8b04b`, Inter/system-ui font.
- UI helpers in `policy/js/ui.js` (`el`, `card`, `table`, `fmt`, `fmtNOK`,
  `formulaBox`, `chartCanvas`) — reuse them instead of raw DOM.
- The manifesto page (`policy/js/manifesto.js`) is the default route and the
  tone to match: first-person, explained to a friend, interactive illustrations
  built as inline SVG, numbers computed live from the formula modules.
