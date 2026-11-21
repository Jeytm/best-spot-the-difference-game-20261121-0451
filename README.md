[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Jeytm/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Jeytm/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Find the Difference — Three Little Worlds

A complete, original spot-the-difference browser game, built for the make.fun bounty
[best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

Two near-identical pictures side by side, 10 fair-but-hidden differences per scene, 3 scenes of rising
difficulty — a cosy reading room at dusk, a lantern-lit night market, and a mountain lake. Click a
difference in either picture to circle it in both. A wrong tap costs 5 seconds; 3 hints per scene;
leftover time becomes bonus points.

## Play

```sh
node serve.ts   # then open http://localhost:8080
```

No build step, no network requests — everything is static files under `game/`, all art drawn by
Canvas 2D code in `game/scenes.js`, sounds are WebAudio tones generated in `game/audio.js`.

## Files

- `game/index.html` — page layout, HUD, two panels
- `game/styles.css` — the look
- `game/scenes.js` — the three scenes, each drawn twice (left plain, right with 10 differences)
- `game/game.js` — state, clicks, timer, scoring, level flow
- `game/ui.js` — HUD, toasts, overlays
- `game/audio.js` — WebAudio beeps
- `game/main.js` — bootstrap
- `main.ts` — hands the game in (copies `game/` + `screenshots/` to `$MAKEFUN_OUTPUT_DIR`, writes `dossier.json`)
- `screenshots/` — 4 real renders of the game running in headless Chrome

## License

MIT — see `LICENSE`.
