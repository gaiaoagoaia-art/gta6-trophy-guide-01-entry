[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/gaiaoagoaia-art/gta6-trophy-guide-01-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/gaiaoagoaia-art/gta6-trophy-guide-01-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# GTA VI Trophy Guide — Leonida Checklist & Roadmap

An offline checklist and guide for all 55 Grand Theft Auto VI trophies on
PlayStation 5: a clickable checklist with earned toggles and progress
tracking, a full guide for every trophy, a five-stage roadmap to the
platinum, a missables page, a next-up planner, search and filters, spoiler
hiding for story trophies, paper and night themes, and progress export and
import. Everything runs locally in the browser with no network at runtime.

## How to run offline

Serve the `app/` directory with any static server and open it in a browser:

```sh
cd app
python3 -m http.server 8000
# then open http://localhost:8000/
```

Or with Node, from the repo root, using a tiny static server script kept in
`/tmp` (not in this repo):

```sh
node /tmp/serve-gta6-guide.mjs
# serves app/ at http://localhost:8000/
```

Progress is stored only in your browser's localStorage.

## Features

- **Checklist** — all 55 trophies with official name, description and grade
  (platinum/gold/silver/bronze medal swatches), earned toggle, per-grade
  counts and the list make-up: 55 trophies — 1 platinum, 2 gold, 6 silver,
  46 bronze.
- **Guide pane** — clicking a trophy opens its guide beside the list: full
  guide text, sources, missable note when applicable, PSN count where the
  official description states one, roadmap stage, and a per-trophy notes
  field.
- **Filters** — by kind (story, missable, collectibles, activities, online),
  by grade, by earned/unearned, and search across name, description and
  guide. The online filter honestly shows 0: this list has no online
  trophies.
- **Spoiler setting** — hides the names and descriptions of story trophies
  until they are earned. Toggle in Settings or from the header switch.
- **Roadmap page** — five stages to the platinum, each with its trophies
  and a progress bar.
- **Missables page** — every missable trophy with when and where it can be
  missed.
- **Next-up planner** — suggests the next 3–5 unearned trophies in roadmap
  order with one-line reasons.
- **Export / import** — download progress as JSON, import it back, reset
  progress with a confirm.
- **Themes** — paper (default) and night. Keyboard shortcuts: `/` search,
  `t` theme, `s` spoilers, `e` export.

## Data sources

Official trophy list (names, descriptions, grades): Exophase and
PSNProfiles. All guides are original advice written from the official
descriptions and have not yet been checked in the game; where a specific
place or step is not pinned down by the official description, the guide
says so plainly. Story and missable flags are derived from the official
trophy descriptions; PlayStation's own hidden list was not cross-checked
from this machine.

## License

MIT — see [LICENSE](LICENSE).
