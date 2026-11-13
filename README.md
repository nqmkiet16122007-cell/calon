# DEEP CURRENT

A compact, endless underwater arcade survival game built with Canvas 2D and vanilla JavaScript. Swim through a layered blue-water scene, eat smaller fish, grow through levels, chain meals for score multipliers, and survive predators.

## Run

Open `index.html` in a modern browser, or with XAMPP start Apache and visit `http://localhost/test/`. The game uses no build step or external runtime. Both the original Kenney PNGs and the integrated BATTLE OF THE SEAS SVG pack load from relative paths; keep `kenney_fish-pack_2` and `assets/BATTLE_OF_THE_SEAS/pack` beside `index.html`.

## Controls

- **WASD / Arrow keys:** swim
- **Esc / P:** pause or resume
- **F3:** show player and fish collision circles
- **Mobile landscape:** on-screen directional pad

## Gameplay

Eat fish at least 21% smaller than your current size. Similar-size fish are risky neutral encounters; fish over 12% larger can hurt you. You have three hearts and brief damage immunity. Meals grant score and XP; consecutive meals within five seconds build a score chain. Fish enter from the left or right and stay above the sandy floor. Small and mid-size species form loose shoals and evade the player. A single large predator can hunt at a time: rounded puffer-like fish telegraph a short lunge by inflating, then cool down; larger hunters track a short player trail before breaking off. Body pitch and a separately animated tail follow each fish's swimming direction. Level ups gradually increase the player fish's size. The ecosystem scales up over time and offers occasional speed, shield, and magnet pickups. Your best score is stored in localStorage.

## Structure

- `index.html`, `style.css`: responsive game frame, HUD and menus
- `js/config.js`: asset preload and shared constants
- `js/entities.js`: player, fish and particle entities
- `js/game.js`: Canvas rendering, movement, collisions and progression
- `js/ui.js`: HUD and screen updates
- `js/main.js`: input bindings, audio feedback and UI events
- `assets/BATTLE_OF_THE_SEAS/pack`: integrated 518-file modular SVG pack, including level-scaled animated player fish, enemy species, shark and puffer, hearts, boosts, depth backgrounds, floating trash, seaweed, and effects
- `assets/BATTLE_OF_THE_SEAS/generate-pack.js`: deterministic source generator for the modular SVG pack
- `assets/BATTLE_OF_THE_SEAS/production-sheet.png`: visual asset overview
- `kenney_fish-pack_2/PNG/Default`: original supplied game art

## Asset attribution and license

Artwork is from **Kenney Fish Pack 2.0**, created/distributed by Kenney (kenney.nl), provided in `kenney_fish-pack_2`. The included `License.txt` identifies the pack as **Creative Commons Zero (CC0)**, allowing personal, educational and commercial use. Attribution is optional; this project credits Kenney here.
