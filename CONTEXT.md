# NEON ASHES — CONTEXT & LIVING MEMORY

## 1. PROJECT IDENTITY
- **Title:** NEON ASHES
- **Genre:** Open-world third-person action-adventure / crime drama
- **Setting:** Vespera City (fictional coastal metropolis in Aurelia)
- **Protagonist:** Kaleb Voss (27, mechanic / courier searching for missing sister Lena Voss)
- **Target Platform:** Desktop Web Browser (Chromium-first, WebGL/Three.js)
- **Design Philosophy:** Real playable game first (vertical slice), modular systems, data-driven missions, no fake buttons/placeholders, NO glassmorphism.

---

## 2. CURRENT DEVELOPMENT STATUS
- **Overall Completion:** 18% (Phase 0 Foundation, Phase 1 Prototype, and Vertical Slice Missions M01 & M02 Complete)
- **Current Milestone:** Phase 2: Vertical Slice (M01 & M02 Complete, starting M03 "The Harbor")
- **Current Focus:** Mission M03 ("The Harbor") implementation: investigating Pier 19 in Old Harbor based on Lena's hidden photograph, staking out the freight exchange, following a Marrow Syndicate target, and securing the storage locker key.
- **Last Completed:**
  - Mission M02 ("Old Debts") implemented and tested start-to-finish.
  - Enemy Combat AI (`src/ai/EnemyAI.ts`) with line-of-sight tracking, weapon firing, damage dealing, hit reactions, and death ragdoll.
  - Story character Jonah Reyes (`jonah_reyes`) added outside Adrian's Auto Repair garage with canonical dialogue.
  - Garage roll-up shutter interaction, interior workshop safe cracking, and Marrow Syndicate ambush shootout.
  - Vehicle escape sequence and mission reward payout ($800 cash + shotgun unlock).
- **Currently Broken:** None. All systems tested and verified in browser.
- **Next Tasks:**
  1. Implement Mission M03 ("The Harbor"):
     - Pier 19 waterfront environment in Old Harbor district (`World.ts` extension).
     - Surveillance / stakeout mechanic observing the suspicious exchange.
     - Vehicle tailing / pursuit sequence through the harbor district.
     - Recover the warehouse storage key.
  2. Implement Shotgun weapon class (`Player.ts` weapon switching with keys `1`, `2`, `3`).
  3. Expand Police Pursuit AI (`PoliceAI.ts`) responding to gunfire and vehicle crimes.

---

## 3. SYSTEM STATUS OVERVIEW

| System | Status | Notes |
| :--- | :--- | :--- |
| Project Foundation & Build System | [COMPLETE] | Vite 6 + TypeScript + Three.js 0.170 |
| Game Loop & State Machine | [COMPLETE] | Fixed 60Hz physics accumulator + variable rendering |
| Input Management | [COMPLETE] | Keyboard (WASD/Shift/Space/C/E/F/R), Mouse look, Pointer Lock API |
| 3D Rendering & Camera | [COMPLETE] | Three.js WebGL renderer, ACES tone mapping, spring 3rd-person & chase camera |
| Player Movement & Physics | [COMPLETE] | Walk, jog, sprint with stamina drain, jump, crouch, collision sliding |
| Vehicle Controller & Physics | [COMPLETE] | Vesper Sedan with steering, braking, speed readout in MPH, enter/exit [E] |
| World & City District (Eastline) | [COMPLETE] | Multi-lane avenues, lit window facades, streetlights, colliders, POIs |
| NPC & Traffic AI | [COMPLETE] | Mrs. Gable, Jonah Reyes + reactive pedestrians fleeing gunfire |
| Combat & Enemy AI | [COMPLETE] | Marrow Syndicate enforcers, line-of-sight shooting, hit detection, flinch, death |
| Police & Wanted System | [PARTIAL] | UI stars active upon crimes; patrol cruiser vehicle spawned |
| Mission Engine & Objectives | [COMPLETE] | Data-driven framework with distance tracking and auto-triggers |
| Mission M01 — Home Again | [COMPLETE] | Playable start-to-finish with dialogue, evidence inspection, and reward |
| Mission M02 — Old Debts | [COMPLETE] | Playable start-to-finish: Jonah dialogue, safe cracking, syndicate shootout, escape |
| Mission M03 — The Harbor | [NOT STARTED] | Next target per canonical storyline |
| UI & HUD (No Glassmorphism) | [COMPLETE] | Solid dark surfaces (`#0B0D0F`, `#15181B`, `#E58E26`), minimap, speedo, modals |
| Audio & Sound Synthesizer | [COMPLETE] | Web Audio API procedural synthesis with zero missing asset latency |
| Persistence & Save/Load | [COMPLETE] | LocalStorage/IndexedDB state persistence with auto-save toast |

---

## 4. MISSION IMPLEMENTATION STATUS

- **M01 — Home Again:** [COMPLETE]
  - Drive to Lena's apartment in Eastline [COMPLETE]
  - Talk to Mrs. Gable [COMPLETE]
  - Enter Lena's apartment [COMPLETE]
  - Search desk & bookcase for evidence [COMPLETE]
  - Inspect Harbor Photograph modal [COMPLETE]
  - Complete mission & receive $500 + ammo + safehouse [COMPLETE]
- **M02 — Old Debts:** [COMPLETE]
  - Drive to Adrian's Auto Repair garage in Southside [COMPLETE]
  - Talk to Jonah Reyes [COMPLETE]
  - Open garage shutter and enter [COMPLETE]
  - Crack Adrian's workbench safe [COMPLETE]
  - Survive Marrow Syndicate ambush shootout [COMPLETE]
  - Escape the area in vehicle [COMPLETE]
  - Complete mission & receive $800 + shotgun unlock [COMPLETE]
- **M03 — The Harbor:** [NOT STARTED] — Next target.
- **M04–M30:** [NOT STARTED]

---

## 5. WORLD IMPLEMENTATION STATUS
- **Vespera City Districts:**
  - **Eastline / Southside (District 1):** [COMPLETE - CORE] Contains Lena's apartment building (128 Eastline), Adrian's old auto repair garage, street network, props, dumpsters, streetlights, and building colliders.
  - **Old Harbor:** [IN PROGRESS] Waterfront piers and warehouses being established for M03.
  - **Central Vesper / Downtown:** [NOT STARTED]
  - **Redwater / Meridian / North Heights / Silver Coast:** [NOT STARTED]

---

## 6. IMPORTANT ARCHITECTURAL FILES
- `src/main.ts` — Application entry point & bootstrapper
- `src/core/Game.ts` — Master game coordinator tying engine systems together
- `src/core/GameLoop.ts` — Fixed 60Hz physics accumulator and render loop
- `src/core/GameState.ts` — Game mode state machine (Free Roam, Mission, Vehicle, Dialogue)
- `src/core/InputManager.ts` — Unified keyboard, mouse, and Pointer Lock API manager
- `src/core/SaveSystem.ts` — Persistent state storage for player stats and mission progression
- `src/rendering/Renderer.ts` — Three.js WebGL renderer setup & tone mapping
- `src/rendering/Camera.ts` — Third-person follow camera with aiming zoom and vehicle chase mode
- `src/rendering/Lighting.ts` — Directional sun/moon with day/night cycle and shadow mapping
- `src/world/World.ts` — City block builder, road network, colliders, and POI markers
- `src/player/Player.ts` — Kaleb Voss character controller, kinematics, and raycast combat
- `src/vehicles/Vehicle.ts` — Arcade vehicle physics, suspension, steering, and wheel animation
- `src/vehicles/VehicleManager.ts` — Spawning, proximity interaction, and enter/exit logic
- `src/ai/NPCManager.ts` — Story NPCs (Mrs. Gable, Jonah Reyes) and reactive pedestrians
- `src/ai/EnemyAI.ts` — Marrow Syndicate enemy AI with combat state machine and health
- `src/missions/MissionManager.ts` — Active mission state runner and objective coordinator
- `src/missions/data/M01_HomeAgain.ts` — Objective declarations for Mission M01
- `src/missions/data/M02_OldDebts.ts` — Objective declarations for Mission M02
- `src/ui/HUD.ts` — Minimap radar, vitals, speedometer, dialogue overlay, evidence modal
- `src/audio/AudioManager.ts` — Procedural Web Audio API sound synthesizer
- `src/style.css` — Authoritative UI stylesheet strictly avoiding glassmorphism

---

## 7. RECENT CHANGES & CHANGE LOG
### 2026-09-12 (Session 2)
- Created `src/ai/EnemyAI.ts` with Enemy entity, combat state machine, line-of-sight engagement, gunfire audio, flinching, and death ragdoll.
- Created `src/missions/data/M02_OldDebts.ts` defining data-driven objectives for Mission M02.
- Added story character **Jonah Reyes** to `src/ai/NPCManager.ts` stationed at Adrian's garage with full dialogue tree.
- Updated `src/player/Player.ts` raycast shooting to detect and damage enemy entities.
- Integrated M02 into `src/core/Game.ts`: meeting Jonah, entering Adrian's garage, safe cracking, Marrow Syndicate ambush shootout, and vehicle getaway.
- Automatic mission chaining: completing M01 now queues M02, rewarding cash, ammo, and unlocking weapons.
- Tested and verified Mission M02 in browser subagent: verified HUD updates, Jonah dialogue overlay, 2-star wanted status, shootout combat, and M02 Mission Passed banner ($1490 cash total).

---

## 8. ACTIVE HANDOFF NOTES
- **Missions M01 ("Home Again") and M02 ("Old Debts")** are both fully playable and tested.
- **Enemy AI & Combat** are established and functioning.
- The next development chunk is **Mission M03 ("The Harbor")** per `MISSION_DESIGN.md`:
  - Kaleb heads down to Pier 19 in Old Harbor using the photograph lead.
  - Stakeout observing a covert container handoff.
  - Tailing/chasing the target's vehicle.
  - Acquiring the storage key to access the cold storage warehouse in M04.
