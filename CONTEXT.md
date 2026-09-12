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
- **Overall Completion:** 25% (Phase 0 Foundation, Phase 1 Prototype, and Vertical Slice Missions M01, M02, M03 Complete)
- **Current Milestone:** Phase 2: Vertical Slice (M01, M02, M03 Complete, starting M04 "Cold Storage")
- **Current Focus:** Mission M04 ("Cold Storage") implementation: infiltrating Pier 19 Warehouse 19 using the recovered storage key, cracking the internal security lock, searching freight manifests and cold storage lockers for encrypted data drives linking Meridian Properties to Lena's disappearance, and neutralizing armed warehouse guards.
- **Last Completed:**
  - Mission M03 ("The Harbor") implemented and verified start-to-finish in browser.
  - Old Harbor Pier 19 waterfront environment (`World.ts`): concrete wharf, water surface, Warehouse 19 exterior with neon cyan signage, yellow gantry crane, and stacked cargo containers.
  - Objective sequence in `src/missions/data/M03_TheHarbor.ts`: driving to Pier 19, container stack vantage point stakeout, courier pursuit, disabling target vehicle, recovering warehouse storage key, and escaping the harbor.
- **Currently Broken:** None. All systems tested and verified in browser.
- **Next Tasks:**
  1. Implement Mission M04 ("Cold Storage"):
     - Pier 19 Warehouse 19 interior environment with freight pallets, cold storage racks, and security terminal.
     - Storage keycard door interaction.
     - Document / encrypted drive search puzzle.
     - Armed warehouse guards shootout (`EnemyAI.ts`).
     - Escape Pier 19 with evidence.
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
| World & City District (Eastline & Harbor) | [COMPLETE] | Multi-lane avenues, lit window facades, Pier 19 docks, colliders, POIs |
| NPC & Traffic AI | [COMPLETE] | Mrs. Gable, Jonah Reyes + reactive pedestrians fleeing gunfire |
| Combat & Enemy AI | [COMPLETE] | Marrow Syndicate enforcers, line-of-sight shooting, hit detection, flinch, death |
| Police & Wanted System | [PARTIAL] | UI stars active upon crimes; patrol cruiser vehicle spawned |
| Mission Engine & Objectives | [COMPLETE] | Data-driven framework with distance tracking and auto-triggers |
| Mission M01 — Home Again | [COMPLETE] | Playable start-to-finish with dialogue, evidence inspection, and reward |
| Mission M02 — Old Debts | [COMPLETE] | Playable start-to-finish: Jonah dialogue, safe cracking, syndicate shootout, escape |
| Mission M03 — The Harbor | [COMPLETE] | Playable start-to-finish: Pier 19, surveillance stakeout, courier pursuit, key retrieval |
| Mission M04 — Cold Storage | [NOT STARTED] | Next target per canonical storyline |
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
- **M03 — The Harbor:** [COMPLETE]
  - Drive to Pier 19 in Old Harbor [COMPLETE]
  - Reach container stack vantage point [COMPLETE]
  - Stake out crate exchange using binoculars [COMPLETE]
  - Pursue and intercept courier vehicle [COMPLETE]
  - Recover Pier 19 Cold Storage Key [COMPLETE]
  - Escape harbor area with key [COMPLETE]
  - Complete mission & receive $1000 + Pier 19 Key [COMPLETE]
- **M04 — Cold Storage:** [NOT STARTED] — Next target.
  - Return to Pier 19 Warehouse 19 with keycard [NOT STARTED]
  - Unlock high-security roll-up gate [NOT STARTED]
  - Search interior refrigerated shipping crates [NOT STARTED]
  - Recover encrypted Marrow/Meridian shipment manifest [NOT STARTED]
  - Eliminate arriving Syndicate heavy guards [NOT STARTED]
  - Escape Pier 19 perimeter [NOT STARTED]
- **M05–M30:** [NOT STARTED]

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
### 2026-09-12 (Session 3)
- Created Old Harbor Pier 19 waterfront in `src/world/World.ts`: deep water surface, concrete wharf platform, Pier 19 Warehouse 19 with cyan signage, 32m yellow gantry crane, and multi-colored stacked shipping containers.
- Created `src/missions/data/M03_TheHarbor.ts` defining canonical data-driven mission objectives for Mission M03.
- Integrated M03 into `src/core/Game.ts`:
  - Pier 19 GPS waypoint tracking and container stack vantage point navigation.
  - Binocular stakeout prompt and dialogue with Kaleb identifying the man in the trench coat from Lena's photograph.
  - High-speed courier pursuit sequence and vehicle interception mechanic.
  - Physical recovery of the Pier 19 Cold Storage Key from the disabled vehicle.
  - Harbor perimeter vehicle escape trigger and mission completion rewarding $1000 cash and inventory storage key.
- Verified Mission M03 end-to-end via automated browser test with recorded screenshots and WebP gameplay recording.
- Production bundle verification (`npm run build`) passing cleanly with zero errors.

---

## 8. ACTIVE HANDOFF NOTES
- **Missions M01 ("Home Again"), M02 ("Old Debts"), and M03 ("The Harbor")** are fully playable, tested, and verified.
- Kaleb possesses the **Pier 19 Cold Storage Key** in his inventory.
- The next development chunk is **Mission M04 ("Cold Storage")** per `MISSION_DESIGN.md` & `STORY_BIBLE.md`:
  - Return to Pier 19 Warehouse 19.
  - Use the keycard to unlock the refrigerated warehouse roll-up gate.
  - Search interior crates for the encrypted Meridian/Marrow shipment manifest.
  - Eliminate arriving Syndicate heavy guards.
  - Escape Pier 19 perimeter.
- Weapon system expansion: implement Shotgun weapon class and weapon switching (`1`: Unarmed/Pistol, `2`: Shotgun).
