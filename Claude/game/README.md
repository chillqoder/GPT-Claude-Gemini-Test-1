# LUMINOUS

Paint light. Push back the void. Survive.

## How to Run

Open `index.html` in any modern browser. No server, no dependencies, no build step.

## Controls

| Key | Action |
|---|---|
| `WASD` / Arrow keys | Move |
| `Space` | Light Pulse (expanding ring that destroys enemies) |
| Click | Start game (from menu) |

## How to Play

You are a being of light in an endless void. As you move, you paint luminescent trails behind you — your only defense. Dark creatures emerge from the void and hunt you, but they **cannot cross bright light**.

Your trails fade over time, so keep moving. Press **Space** to emit a devastating light pulse that obliterates nearby enemies and paints a wide ring of light.

Score grows from surviving and destroying enemies. Pulse kills chain for quadratic bonus points.

## Tech

- Single `index.html` — vanilla Canvas 2D, zero dependencies
- Web Audio API synthesis for all sound (ambient drone, pulse, impacts)
- Offscreen light map at 1/4 resolution for performant per-pixel brightness queries
- No images, models, or audio files
