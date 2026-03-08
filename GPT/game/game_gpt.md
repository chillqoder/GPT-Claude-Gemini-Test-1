# Creative Brief: Browser Game — Vibe Coding Session

**Role:** Creative Game Developer & Frontend Engineer  
**Format:** Single-session vibe coding — full creative autonomy  
**Constraint:** Zero pre-supplied assets. Zero external servers required for play.

---

## 1. CREATIVE DIRECTIVE

You have complete creative freedom over what this game *is*.  
Do not build something safe. Do not build something expected.  
Choose a mechanic that feels surprising, satisfying, or slightly strange.  
The theme, genre, and narrative — entirely yours.

> The only wrong answer is boring.

---

## 2. TECHNICAL REQUIREMENTS

### Runtime
- Runs entirely in the **browser** — no backend, no auth, no API keys
- Single file preferred (`index.html`) — or a minimal local project (e.g. Vite, Next.js) if the scope demands it
- If using a bundler: must launch with a single command (`npm run dev` or equivalent)

### Assets
- **No images, models, or audio files are pre-supplied**
- Generate visuals procedurally (Canvas 2D, WebGL, SVG, CSS) — or
- Pull free assets at runtime from a public CDN (e.g. `https://cdn.jsdelivr.net`, `https://unpkg.com`) — or
- Use a library that ships its own assets (e.g. a sprite library, a tileset embedded in JS)
- Sound: Web Audio API synthesis only — no `.mp3` / `.wav` files

### Libraries (available via CDN or npm)
Use whatever fits the vision. Suggestions if needed:
- `Phaser 3` — full game framework with physics, tilemaps, input
- `Three.js` — 3D rendering via WebGL
- `PixiJS` — fast 2D renderer
- `Matter.js` — standalone physics engine
- `Howler.js` — audio (synthesis-compatible)
- Vanilla Canvas / WebGL — perfectly valid

---

## 3. GAMEPLAY REQUIREMENTS

These are the only hard rules on the game itself:

### Controls
- **Must feel good** — responsive, tight, zero input lag
- Support at least one of the following schemes (choose what fits):
  - `WASD` or arrow keys for movement / navigation
  - `Mouse` for aiming, dragging, selecting, or drawing
  - `Space` / `Enter` for a primary action (jump, shoot, confirm, deploy)
  - Combinations of the above

### Mechanic
- There must be **one core mechanic** that is clear within 10 seconds of play
- The mechanic should have **depth** — easy to understand, satisfying to master
- Include at least one of: score, progression, win condition, or endless loop with escalation

### Feel
- Add **juice**: screen shake, particle effects, sound feedback, or visual pop on key moments
- Even minimal visuals should have **intentional style** — a consistent color palette, a clear visual language

---

## 4. SCOPE GUIDANCE

This is a **small game** — not a studio production.  
Aim for something completable in a single session.  
Depth over breadth. One great mechanic beats five mediocre ones.

**Suggested scale:**
- 1–3 distinct "states" (menu → play → game over / win)
- Session length: 1–5 minutes of meaningful play
- Leaderboard or high score: optional but appreciated

---

## 5. DELIVERY

- All source code committed and runnable
- A `README.md` with:
  - One-line description of the game
  - How to run it
  - Controls listed clearly
  - Any CDN dependencies noted

> **Execution Directive:** This is not a demo. This is not a proof of concept.  
> Build something you'd actually want to play for five minutes.  
> If the mechanic doesn't make you want to try one more time — rethink the mechanic.