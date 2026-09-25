# AIPAD — AI-run memecoin launchpad (front-end)

A landing + launch UI for a pump.fun-style launchpad where the coin's **creator fees are handed
to an AI agent** that operates the coin: buybacks, posting, community replies, floor defense.
You pick the operator — **ChatGPT**, **Claude** or **Grok** — and each has a different temperament.

> **Deploys are placeholders — nothing is live on-chain.** The deploy button runs a simulation:
> no wallet is asked to sign, no token is created, nothing is sent to pump.fun. Nothing connects
> to Solana or any model provider, and every number on the page is sample data.
>
> This is stated in six places in the UI: a marquee bar pinned above the nav, the nav status pill,
> a note under the hero CTAs, a highlighted notice above the deploy button, the deploy modal
> (steps, title and success copy) and the footer. When deploys go live, those come down.

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
- **Deploy flow.** Staged "simulating…" modal → placeholder-complete state with an example
  address → confetti in the current agent's colours.

## Animation inventory

**Ambient:** drifting gradient-mesh blobs · canvas starfield with periodic shooting stars ·
perspective grid floor that fades on scroll · film grain + scanlines · lerped cursor glow ·
scroll-linked parallax on the mesh and hero orb.

**Entrance:** word-by-word masked headline reveal · scroll-reveal with blur-in · count-up stats ·
staggered card entrances · animated step connector.

**Interaction:** magnetic buttons that lean toward the cursor · click ripples · 3D pointer-tilt
agent cards with a tracking spotlight · rotating conic halo on the selected agent ·
text-scramble when the operator name changes · hover lifts on chips, filters and coins.

**Continuous:** top scroll-progress bar · two independent marquees · sweeping glow lines ·
shimmering gradient text · shine-sweep buttons · pulsing placeholder stamp · stroke-dash bonding
curve with a dashed path-ahead · character-by-character terminal typing · ticking sparklines ·
canvas confetti.

## Accessibility & responsiveness

Respects `prefers-reduced-motion` (all animation collapses to its end state, canvas effects,
parallax, magnetic buttons and scrambling are skipped),
works down to 390px with no horizontal scroll, and the image dropzone is keyboard-operable.
