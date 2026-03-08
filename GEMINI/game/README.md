# The Prompt

A fast-paced, arcade survival game where you play as a terminal cursor attempting to build a coherent prompt while avoiding hallucination errors.

## The Game
You control the cursor `_`. Your goal is to collect valid **Tokens** (cyan text like "context", "system", "generate") to build your prompt string and increase your score.

However, the system is unstable. Red **Hallucinations** (like "NaN", "NullPointerException") will actively chase you down. If they touch you, your Coherence (health) drops, and your prompt becomes corrupted. 

If you are cornered, you can perform a **Context Flush** to clear the area around you, but it costs 5 Tokens.

## How to Run
No build steps, no servers, no dependencies. 
Just open the file in your browser:
```bash
open index.html
```
*(Or double-click `index.html` in your file explorer)*

## Controls
- **Mouse**: Guide the cursor. The cursor smoothly follows your pointer.
- **Spacebar / Left Click**: Execute a **Context Flush**. This releases a shockwave that destroys nearby Hallucinations, but costs 5 Tokens.

## Features
- Terminal/CRT aesthetic with custom scanlines and chromatic aberration styling
- Physics-based text particle explosions
- Procedurally generated Web Audio API synthesizer sounds
- Dynamic difficulty scaling
- The "prompt" you build physically appears at the bottom of the screen

> *A brand new game built from scratch focusing on the theme of "Prompt".*