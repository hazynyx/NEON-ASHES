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
- **Overall Completion:** 10% (Phase 0 Project Foundation & Phase 1 Core Prototype Complete; Vertical Slice Prologue M01 Playable)
- **Current Milestone:** Phase 2: Vertical Slice (M01 Complete, preparing M02 "Old Debts")
- **Current Focus:** Mission M02 ("Old Debts") implementation: visiting Jonah at Adrian's garage, investigating the garage safe, introducing combat against Marrow Syndicate thugs, and police pursuit.
- **Last Completed:**
  - Complete Phase 0 foundation (Vite + TypeScript + Three.js).
  - 3D Vespera City District 1 (Eastline / Southside) with roads, sidewalk grid, procedural lit buildings, streetlights, collision boxes.
  - Player controller for Kaleb Voss with 3rd-person spring camera, walk/jog/sprint/jump/crouch kinematics, aiming reticle, raycast pistol combat.
  - Arcade vehicle physics with Vesper Sedan (acceleration, steering, braking, collision bounce, enter/exit transitions).
  - Procedural Web Audio API sound synthesizer (engine RPM pitch modulation, tire screeches, gunshots, reloads, door slams, dialogue blips, fanfare).
  - Story NPC (Mrs. Gable) and reactive pedestrians.
  - Complete data-driven Mission M01 ("Home Again"): driving intro, neighbor conversation, apartment entrance, desk investigation, harbor photo evidence modal, reward payout ($500), and auto-save.
  - Solid dark console-quality HUD (strict NO glassmorphism): radar minimap, vitals, speedometer, wanted meter, dialogue overlay, evidence viewer, mission banner.
- **Currently Broken:** None. All implemented systems tested and verified in browser.
- **Next Tasks:**
  1. Implement Mission M02 ("Old Debts"):
     - Objective to meet Jonah Vance at Adrian's old auto repair garage (`src/missions/data/M02_OldDebts.ts`).
     - Garage rollup door interaction and interior exploration.
     - Inspect Adrian's mechanic safe for family records.
     - Ambush encounter by Marrow Syndicate break-in squad.
  2. Implement enemy combat AI (`src/ai/EnemyAI.ts`):
     - Line of sight, shooting at player, taking damage, cover taking, ragdoll/death animation.
  3. Implement Wanted / Police Pursuit System (`src/police/WantedSystem.ts`):
     - Patrol cruiser pursuit, siren audio, search radius on minimap.
  4. Save/checkpoint persistence hook for M02.

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
| NPC & Traffic AI | [COMPLETE] | Mrs. Gable story NPC + reactive pedestrians fleeing gunfire |
| Combat & Weapon System | [COMPLETE] | Service Pistol, aiming stance [RMB], raycast shooting [LMB], muzzle flash, reload [R] |
| Police & Wanted System | [PARTIAL] | UI stars ready; patrol AI pursuit scheduled for M02 |
| Mission Engine & Objectives | [COMPLETE] | Extensible data-driven framework with distance tracking and auto-triggers |
| Mission M01 — Home Again | [COMPLETE] | Fully playable start-to-finish with dialogue, evidence inspection, and reward |
| Mission M02 — Old Debts | [NOT STARTED] | Story design established; implementation ready |
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
- **M02 — Old Debts:** [NOT STARTED] — Next target.
- **M03 — The Harbor:** [NOT STARTED]
- **M04–M30:** [NOT STARTED]

---

## 5. WORLD IMPLEMENTATION STATUS
- **Vespera City Districts:**
  - **Eastline / Southside (District 1):** [COMPLETE - CORE] Contains Lena's apartment building (128 Eastline), Adrian's old auto repair garage, street network, props, dumpsters, streetlights, and building colliders.
  - **Central Vesper / Downtown:** [NOT STARTED]
  - **Old Harbor:** [NOT STARTED]
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
- `src/player/Player.ts` — Kaleb Voss character controller, kinematics, and pistol combat
- `src/vehicles/Vehicle.ts` — Arcade vehicle physics, suspension, steering, and wheel animation
- `src/vehicles/VehicleManager.ts` — Spawning, proximity interaction, and enter/exit logic
- `src/ai/NPCManager.ts` — Story NPCs (Mrs. Gable) and reactive pedestrians
- `src/missions/MissionManager.ts` — Active mission state runner and objective coordinator
- `src/missions/data/M01_HomeAgain.ts` — Objective declarations for Mission M01
- `src/ui/HUD.ts` — Minimap radar, vitals, speedometer, dialogue overlay, evidence modal
- `src/audio/AudioManager.ts` — Procedural Web Audio API sound synthesizer
- `src/style.css` — Authoritative UI stylesheet strictly avoiding glassmorphism

---

## 7. IMPORTANT DESIGN DECISIONS
- **Browser-First Desktop:** 60 FPS target on Chromium-based browsers using WebGL/Three.js.
- **Procedural Sound Engine:** Synthesizes vehicle engines, gunshots, tire screech, and UI audio in real-time via Web Audio API so the game has zero audio asset download latency or 404s.
- **UI Aesthetics:** Grounded console-style dark UI (`#0B0D0F`, `#15181B`, `#E58E26`), high contrast, solid surfaces. ZERO glassmorphism.
- **Data-Driven Missions:** Missions defined via clean data structures with objective types (`DRIVE_TO`, `TALK_TO`, `ENTER`, `INVESTIGATE`, `COLLECT`), enabling rapid horizontal expansion without monolithic hard-coding.
- **Modular Physics:** Decoupled player kinematics and vehicle arcade physics with fixed 60Hz timestep to ensure consistent handling across varying browser frame rates.

---

## 8. REJECTED APPROACHES
- *Monolithic single HTML/JS file:* Violates architecture spec, unmaintainable.
- *Glassmorphism UI:* Explicitly forbidden by UI spec.
- *Fake visual prototype / non-functional buttons:* All systems are truly playable and interactive.
- *Multi-gigabyte unoptimized external 3D asset bundles:* Procedural modular geometry guarantees instant load time and 60 FPS.

---

## 9. KNOWN BUGS / TECH DEBT
- None identified in M01 testing.

---

## 10. RECENT CHANGES & CHANGE LOG
### 2026-09-12
- Read all 11 specification markdown files.
- Created `CONTEXT.md` as living memory.
- Established Phase 0 foundation: Vite, TypeScript, Three.js build toolchain.
- Implemented core engine architecture (`Game`, `GameLoop`, `GameState`, `InputManager`, `Renderer`, `Camera`, `Lighting`, `AudioManager`).
- Built Vespera City District 1 environment with roads, sidewalk grid, lit building facades, streetlights, Lena's apartment building, and Adrian's garage.
- Built Kaleb Voss character controller with third-person camera, walk/jog/sprint/jump/crouch, and raycast pistol combat.
- Built Vesper Sedan vehicle entity with arcade driving physics, tire friction, braking, steering, speedometer HUD, and enter/exit logic.
- Built procedural Web Audio synthesizer for vehicle engine pitch modulation, tire screeches, gunshots, reloads, and dialogue beeps.
- Built story character Mrs. Gable and reactive pedestrians.
- Built data-driven Mission Engine and implemented complete Prologue Mission **M01 — "Home Again"**.
- Built console-quality HUD without glassmorphism (radar minimap, vitals, speedometer, dialogue box, photo inspection modal, mission banner).
- Added `SaveSystem` for automatic checkpoint persistence.
- Verified and tested entire M01 flow via browser subagent with recorded screenshots.
- Updated `README.md` with complete controls, architecture, and instructions.

---

## 11. ACTIVE HANDOFF NOTES
- **Phase 0 (Project Foundation)** and **Phase 1 (Core Prototype)** are complete.
- **Mission M01 ("Home Again")** is fully playable start-to-finish.
- Next AI / session should proceed directly to **Mission M02 ("Old Debts")** per `DEVELOPMENT_ROADMAP.md`:
  - Kaleb travels to Adrian's old garage (`World.adrianGaragePos`, already placed at `(-60, 0, 50)`).
  - Meet Jonah Vance.
  - Search Adrian's tool bench / safe.
  - Implement enemy combat thugs (`EnemyAI.ts`) who break in, triggering a shootout and vehicle getaway!
