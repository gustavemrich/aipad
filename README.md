# AIPAD — AI-run memecoin launchpad (front-end)

A landing + launch UI for a pump.fun-style launchpad where the coin's **creator fees are handed
to an AI agent** that operates the coin: buybacks, posting, community replies, floor defense.
You pick the operator — **ChatGPT**, **Claude** or **Grok** — and each has a different temperament.

> This is a front-end demo only. Nothing connects to Solana, pump.fun or any model provider,
> and every number on the page is simulated.

## Run it

No build step, no dependencies:

```bash
open index.html          # macOS
# or
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Files

| File | What's in it |
|---|---|
| `index.html` | All markup — hero, agent picker, launch form, how-it-works, live board, deploy modal |
| `styles.css` | Design tokens, glass panels, and every animation/keyframe |
| `app.js` | Agent data + all behaviour (canvas, live preview, typing terminal, board, confetti) |

## What's interactive

- **Agent selection re-themes the whole site.** Each agent owns an accent pair that's written to
  CSS custom properties (`--a1`/`--a2`), so gradients, glows, buttons and the cursor light all
  shift when you switch operator.
- **Live preview.** Name, ticker, description, image (drag & drop) and fee split render into a
  coin card as you type, next to an animated bonding curve that drifts toward graduation.
- **Agent terminal.** Types out the selected agent's mandate log in character, rebuilt whenever
  you change operator, fee split or mandate chips.
- **Live board.** 12 coins with SVG sparklines, market caps and curve progress that tick every
  900ms, filterable by operator.
- **Deploy flow.** Staged progress modal → success state with a fake mint address → confetti in
  the current agent's colours.

## Animation inventory

Drifting gradient-mesh blobs · canvas starfield · perspective grid floor · film grain + scanlines ·
lerped cursor glow · scroll-reveal with blur-in · count-up stats · infinite marquee ticker ·
3D pointer-tilt agent cards with a radial spotlight · sweeping glow lines · shimmering gradient
text · shine-sweep buttons · animated stat bars · stroke-dash bonding curve · character-by-character
terminal typing · canvas confetti.

## Accessibility & responsiveness

Respects `prefers-reduced-motion` (all animation collapses, canvas effects are skipped),
works down to 390px with no horizontal scroll, and the image dropzone is keyboard-operable.
