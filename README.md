# Lantern Lane — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/kongkong070/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/kongkong070/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A spot-the-difference game played with keyboard and mouse, built for the
[make.fun best spot the difference game bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

Two near-identical pictures sit side by side — both drawn from scratch in
code, no borrowed images. Click every difference you can spot, in either
picture, before the timer runs out. Found differences get a green circle
and a check mark in both panels; a wrong click costs 5 points and 2
seconds; a hint (H) points at one difference for 25 points.

## The hunt

Three original hand-drawn scenes, each harder than the last:

1. **Lantern Lane** — a quiet night street lit by paper lanterns. 8 differences, 3:00.
2. **Harbor Dawn** — fishing boats under a lighthouse at first light. 8 differences, 3:00.
3. **Mushroom Hollow** — fireflies and toadstools deep in the old woods. 9 differences, 3:30.

Score 100 points per find, with a streak bonus, plus a time bonus for
clearing a level. Find every difference in all three scenes to earn your
rank: Keen Observer, Sharp-Eyed Sleuth, or Eagle-Eyed Detective.

## Controls

- **Mouse** — click a difference in either picture; click the on-screen buttons.
- **H** — hint (max 3 per level, −25 points).
- **R** — restart the level.
- **Enter / Space** — start, next level, or play again.

## Play it

Static files, no build step, no network requests. Serve `game/` with any
static server — or run `node serve.ts` and open http://localhost:8080 —
and `game/index.html` plays in desktop Chrome.

## Layout

- `game/index.html` — the page, one full-screen canvas.
- `game/src/main.js` — bootstrap and animation loop.
- `game/src/state.js` — screens, levels, timer, score, hints.
- `game/src/scenes.js` — the three scenes and their differences.
- `game/src/art.js` — shared canvas drawing helpers.
- `game/src/render.js` — HUD, panels, markers, and screens.
- `game/src/input.js` — mouse and keyboard play.
- `game/src/audio.js` — synthesized WebAudio sounds (no audio files).
- `game/src/shots.js` — deterministic states for screenshots.
- `main.ts` — the make.fun entry program: copies `game/` and
  `screenshots/` to `/output` and writes `dossier.json`.
- `screenshots/` — real renders of the game in a browser.

## License

MIT — see [LICENSE](LICENSE).
