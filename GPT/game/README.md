# Glasswire Garden

A small browser survival game about weaving temporary lines and turning them into traps.

## How to run

Open `index.html` directly in a modern browser, or serve the folder locally:

```bash
cd /Users/konstantin/Documents/Dev/GPT-OPUS-Gemini/GPT/game
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Controls

- `WASD` or `Arrow Keys`: move
- `Hold Space`: weave a filament behind you
- `Release Space`: harden the filament into lethal glasswire
- `Enter`: start or restart
- `Esc`: return to title

## Notes

- No external libraries or CDN dependencies
- Visuals are procedural Canvas 2D
- Sound effects are synthesized with the Web Audio API
