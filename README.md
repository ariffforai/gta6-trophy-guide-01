# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/ariffforai/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/ariffforai/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that guides and tracks all 55 PlayStation 5 trophies of
Grand Theft Auto VI: the official list with saved progress, filters and a
spoiler setting, a roadmap to the platinum, and a guide to each trophy that
cites its sources. Built for the
[Build the best GTA 6 trophy guide](https://make.fun/c/gta6-trophy-guide-01)
bounty on make.fun.

## What it does

- **All 55 trophies, official and exact** — names, descriptions and grades
  exactly as listed by Exophase and PSNProfiles, with a guide in our own
  words for every one, plus steps, sources and a missable flag.
- **Cited guidance, honestly flagged** — each guide cites its sources
  beside the text. GTA VI launched 19 November 2026, so complete real
  guides barely exist yet: where a location, step or trigger is not pinned
  down, the guide says “not yet checked in the game” instead of guessing.
- **Roadmap to platinum** — four stages in order: story (21), activities
  (27), collectibles (5), then 100% cleanup and the platinum.
- **Tracker that remembers** — tick trophies off, progress saves in the
  browser (localStorage), with export/import as JSON and a reset.
- **Filters** — by kind (story, activities, collectibles, online), by grade,
  missable-only, free-text search, and a spoiler setting that hides story
  trophies until they are earned.
- **Fully offline** — no network requests at all. Open `app/index.html` in
  a desktop browser, or serve it with `node serve.ts`.

## Run it

```sh
node serve.ts        # then open http://localhost:8080
```

Or hand it in exactly as the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored make.fun
library. Running it twice writes identical bytes.

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide and tracker.
- `app/data/trophies.json` — the 55 trophies: official name, description and
  grade, plus kind, missable flag, roadmap stage, sources, steps and the
  guide. Written fresh for this entry; names match the kit reference exactly.
- `app/fonts/anton/` — Anton (SIL Open Font License) for the display type.
- `screenshots/` — the guide at its best: the checklist, a guide with its
  sources open, the roadmap, and the spoiler setting.

## Sources

Official names, descriptions and grades follow the GTA VI trophy list as
published by Exophase and PSNProfiles before launch; the two lists agree on
every name, description and grade. Guides are written in our own words from
those official descriptions. An unofficial fan guide, not affiliated with
Rockstar Games. No Rockstar artwork, logos or game images are used.
