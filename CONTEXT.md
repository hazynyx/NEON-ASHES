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
- **Overall Completion:** 33% (Phase 0 Foundation, Phase 1 Prototype, and all 4 Act I Vertical Slice Missions M01, M02, M03, M04 Complete!)
- **Current Milestone:** Phase 3 / Act II: The Money Trail (Starting Mission M05 "The Journalist" & Police Pursuit AI)
- **Current Focus:** Mission M05 ("The Journalist") implementation: meeting investigative journalist Mara Vale at the Southside diner, piecing together Lena's notes, infiltrating the Meridian Properties redevelopment office, photographing corporate zoning records, and evading police surveillance.
- **Last Completed:**
  - Mission M04 ("Cold Storage") implemented and verified start-to-finish in browser.
  - Tactical 12G Shotgun weapon class: procedural sub-bass and pump-action audio synthesis (`AudioManager.ts`), 6-pellet spread raycasting with damage calculation, weapon switching keys (`1`: Pistol, `2`: Shotgun, `3`: Unarmed), and dynamic HUD weapon/ammo display.
  - Pier 19 Warehouse 19 interior (`World.ts`): hollow walk-in warehouse, animated roll-up security shutter, office manifest desk and terminal screen, Cold Storage Locker 4B, refrigeration storage racks, and tactical cover.
  - Evidence Modal extension: authentic Meridian Logistics Bill of Lading document linking Councilman Vance Albright directly to the Marrow Syndicate.
  - Syndicate heavy guards ambush firefight (`EnemyAI.ts`), guard elimination, and harbor perimeter vehicle getaway.
- **Currently Broken:** None. All systems tested and verified in browser.
- **Next Tasks:**
  1. Implement Mission M05 ("The Journalist"):
     - Southside Diner location and Mara Vale story NPC.
     - Dialogue tree sharing Lena's findings and the encrypted drive.
     - Travel to Meridian Properties office in Central Vesper.
     - Photograph suspicious property acquisition records.
  2. Implement Police Pursuit AI (`src/police/PoliceAI.ts`):
     - Police cruisers actively pursuing Kaleb upon reaching 2+ wanted stars.
     - Line-of-sight radar evade mechanic.

---

## 3. SYSTEM STATUS OVERVIEW

| System | Status | Notes |
| :--- | :--- | :--- |
| Project Foundation & Build System | [COMPLETE] | Vite 6 + TypeScript + Three.js 0.170 |
| Game Loop & State Machine | [COMPLETE] | Fixed 60Hz physics accumulator + variable rendering |
| Input Management | [COMPLETE] | Keyboard (WASD/Shift/Space/C/E/F/R/1/2/3), Mouse look, Pointer Lock API |
| 3D Rendering & Camera | [COMPLETE] | Three.js WebGL renderer, ACES tone mapping, spring 3rd-person & chase camera |
| Player Movement & Physics | [COMPLETE] | Walk, jog, sprint with stamina drain, jump, crouch, collision sliding |
| Vehicle Controller & Physics | [COMPLETE] | Vesper Sedan with steering, braking, speed readout in MPH, enter/exit [E] |
| World & City District (Eastline & Harbor) | [COMPLETE] | Multi-lane avenues, lit window facades, Pier 19 docks, Warehouse 19, POIs |
| NPC & Traffic AI | [COMPLETE] | Mrs. Gable, Jonah Reyes + reactive pedestrians fleeing gunfire |
| Combat & Enemy AI | [COMPLETE] | Marrow Syndicate enforcers, line-of-sight shooting, hit detection, flinch, death |
| Weapons & Arsenal | [COMPLETE] | Service Pistol (12/clip) + 12G Tactical Shotgun (6/tube, spread pellets), hotkeys |
| Police & Wanted System | [PARTIAL] | UI stars active upon crimes; patrol cruiser vehicle spawned |
| Mission Engine & Objectives | [COMPLETE] | Data-driven framework with distance tracking and auto-triggers |
| Mission M01 — Home Again | [COMPLETE] | Playable start-to-finish with dialogue, evidence inspection, and reward |
| Mission M02 — Old Debts | [COMPLETE] | Playable start-to-finish: Jonah dialogue, safe cracking, syndicate shootout, escape |
| Mission M03 — The Harbor | [COMPLETE] | Playable start-to-finish: Pier 19, surveillance stakeout, courier pursuit, key retrieval |
| Mission M04 — Cold Storage | [COMPLETE] | Playable start-to-finish: Warehouse 19 interior, manifest inspection, drive pickup, ambush, escape |
| Mission M05 — The Journalist | [NOT STARTED] | Next target per Act II storyline |
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
- **M04 — Cold Storage:** [COMPLETE]
  - Return to Pier 19 Warehouse 19 with keycard [COMPLETE]
  - Unlock high-security roll-up gate [COMPLETE]
  - Search office terminal & inspect Meridian manifest [COMPLETE]
  - Recover encrypted military data drive from Locker 4B [COMPLETE]
  - Eliminate arriving Syndicate heavy guards [COMPLETE]
  - Escape Pier 19 perimeter with evidence [COMPLETE]
  - Complete mission & receive $1500 + Military Drive + Shotgun ammo [COMPLETE]
- **M05 — The Journalist:** [NOT STARTED] — Next target.
  - Travel to Southside Diner [NOT STARTED]
  - Meet investigative reporter Mara Vale [NOT STARTED]
  - Decrypt drive contents and examine Lena's notes [NOT STARTED]
  - Infiltrate Meridian Properties property development office [NOT STARTED]
  - Photograph suspicious acquisition files [NOT STARTED]
  - Evade city security patrol [NOT STARTED]
- **M06–M30:** [NOT STARTED]

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
### 2026-09-12 (Session 5)
- **Vehicle Driving Direction & Mesh Orientation Fix:**
  - Resolved vehicle reversing on W key in `src/vehicles/Vehicle.ts` and `src/vehicles/VehicleManager.ts`.
  - Reoriented 3D car mesh: front bumper, headlights, and front wheels placed along `-Z` (standard forward camera look vector) and rear bumper/taillights at `+Z`.
  - Corrected forward motion vector to `x: -sin(heading), z: -cos(heading)`.
  - Added dual-cone forward headlight beams (`SpotLight` + forward road flood `PointLight`), emissive glowing red taillights with ground reflection, chrome bumper trim, license plate, and rich crimson burgundy metallic paint (`0x6b1a26`).
  - Pressing `W` now accelerates forward into the distance away from camera; `S` brakes and reverses.
- **Lighting & World Visibility Overhaul:**
  - Boosted WebGL ACES tone mapping exposure to `1.45` in `src/rendering/Renderer.ts`.
  - Adjusted atmospheric twilight time to `19.0` (dusk golden hour) in `src/rendering/Lighting.ts`, boosting ambient light to `1.1` (`0x475569`), hemisphere light to `1.0` (`0x93c5fd`), and directional light to `1.4` (sun) / `1.1` (moon).
  - Added a secondary `cityFillLight` (`THREE.DirectionalLight(0x60a5fa, 0.45)`) eliminating pitch-black building silhouettes.
  - Increased streetlight point light intensity to `4.2` with radius `38m` in `src/world/World.ts`.
  - Tuned atmospheric fog in `src/core/Game.ts` from pitch-black `0x0b0d0f, 0.007` to atmospheric indigo `0x131a26, 0.0022`, ensuring clear visibility up to 450m while retaining moody film noir tone.
- **Voice Narration & Monologue System:**
  - Created `src/audio/NarrationManager.ts` utilizing browser Web Speech API (`window.speechSynthesis`) with customized voice pitches (deep noir pitch `0.85`, rate `0.92` for Kaleb, distinct pitches for Mrs. Gable, Jonah, and Syndicate enforcers).
  - Added radio chirp/squelch procedural audio effect (`AudioManager.playRadioClick()`).
  - Integrated full queue system for monologue thoughts and wired dialogue speech synthesis in `src/dialogue/DialogueManager.ts`.
  - Added bottom HUD `#narration-bar` with amber pulse indicator, speaker tag (`KALEB (INTERNAL)`), and high-contrast typography (strictly adhering to solid dark surfaces, NO glassmorphism).
  - Added `#voice-toggle-btn` to top HUD status panel (`VOICE: ON/OFF`).
  - Triggered Kaleb's Prologue Monologue upon entering Vespera City.
- **Verification:**
  - Automated browser subagent playtest verified vehicle forward acceleration with W, illuminated world, glowing taillights, and narration speech/subtitles.
  - Production build passed clean (`npm run build`).

---

## 8. ACTIVE HANDOFF NOTES
- **Act I is 100% complete!** All 4 vertical slice missions (M01 "Home Again", M02 "Old Debts", M03 "The Harbor", and M04 "Cold Storage") are fully implemented, verified, and chained.
- Vehicle physics, forward steering/acceleration, atmospheric lighting, and voice narration systems are verified and active.
- Next development chunk is **Act II — The Money Trail (Starting Mission M05 "The Journalist")**:
  - Meeting investigative journalist **Mara Vale** at Southside Diner.
  - Exchanging intelligence on Lena's disappearance and decrypting the drive.
  - Infiltrating the Meridian Properties corporate office in Central Vesper.
  - Photographing property acquisition documents.
- Police Pursuit AI (`src/police/PoliceAI.ts`) and Cruiser response mechanics.
