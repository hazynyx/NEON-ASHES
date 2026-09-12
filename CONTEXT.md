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
- **Overall Completion:** 42% (Phase 0 Foundation, Phase 1 Prototype, Act I Missions M01-M04, and Act II Mission M05 "The Journalist" Complete!)
- **Current Milestone:** Phase 3 / Act II: The Money Trail (M05 Complete, preparing Mission M06 "The City Hall Connection" & Police Pursuit AI)
- **Current Focus:** Mission M06 implementation and Police Cruiser patrol/pursuit AI (`src/police/PoliceAI.ts`).
- **Last Completed:**
  - **Dynamic Traffic AI (`src/vehicles/VehicleManager.ts`):** Ambient civilian traffic navigating road lanes (Vesper Cab, Metro Coupe, Harbor Sedan, Cargo Wagon) with illuminated headlights, lane tracking, obstacle/proximity braking, and full carjacking/entry via `[E]`.
  - **Ambient Pedestrian AI (`src/ai/NPCManager.ts`):** Sidewalk pedestrians patrolling city blocks with procedural walking speed, alternating leg swing animation, and reactive fleeing.
  - **3D Destination Waypoint Beacon (`src/world/DestinationMarker.ts`):** 32m tall vertical illuminated light pillar (`0xe58e26`), concentric pulsing ground radar rings, hovering rotating diamond marker, and ground point light.
  - **Real-Time GPS Route Navigation (`src/ui/HUD.ts` & `src/ui/PauseMenu.ts`):** Dashed amber breadcrumb route line dynamically plotted on both the in-game Minimap and the Fullscreen Tactical Map (`M` key) pointing directly to the active objective.
  - **Act II Mission M05 ("The Journalist") (`src/missions/data/M05_TheJournalist.ts`):**
    - Southside Diner with neon sign `SOUTHSIDE DINER // 24H` and outdoor covered patio.
    - Story NPC **Mara Vale** with auburn hair and 6-part branching investigative dialogue.
    - Meridian Properties corporate office with archival desk, filing cabinets, and cyan terminal screen.
    - Evidence Modal: Confidential municipal redevelopment buyout accord signed by Councilman Vance Albright.
    - Mission rewards: +$1,800 cash, decrypted audio journal tape, shotgun ammo.
- **Currently Broken:** None. All systems verified in automated browser playtest.
- **Next Tasks:**
  1. Implement Mission M06 ("The City Hall Connection"):
     - Albright's mayoral campaign gala surveillance and wiretap placement.
  2. Implement Police Pursuit AI (`src/police/PoliceAI.ts`):
     - Police cruisers actively pursuing Kaleb upon reaching 2+ wanted stars with siren audio and roadblock tactics.

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
| NPC & Traffic AI | [COMPLETE] | Multi-lane civilian traffic with collision braking & carjacking + animated sidewalk pedestrians |
| Combat & Enemy AI | [COMPLETE] | Marrow Syndicate enforcers, line-of-sight shooting, hit detection, flinch, death |
| Weapons & Arsenal | [COMPLETE] | Service Pistol (12/clip) + 12G Tactical Shotgun (6/tube, spread pellets), hotkeys |
| Police & Wanted System | [PARTIAL] | UI stars active upon crimes; patrol cruiser vehicle spawned |
| Mission Engine & Objectives | [COMPLETE] | Data-driven framework with distance tracking and auto-triggers |
| Mission M01 — Home Again | [COMPLETE] | Playable start-to-finish with dialogue, evidence inspection, and reward |
| Mission M02 — Old Debts | [COMPLETE] | Playable start-to-finish: Jonah dialogue, safe cracking, syndicate shootout, escape |
| Mission M03 — The Harbor | [COMPLETE] | Playable start-to-finish: Pier 19, surveillance stakeout, courier pursuit, key retrieval |
| Mission M04 — Cold Storage | [COMPLETE] | Playable start-to-finish: Warehouse 19 interior, manifest inspection, drive pickup, ambush, escape |
| Mission M05 — The Journalist | [COMPLETE] | Playable start-to-finish: Southside Diner, Mara Vale dialogue, Meridian office infiltration, evidence |
| UI & HUD (No Glassmorphism) | [COMPLETE] | Solid dark surfaces (`#0B0D0F`, `#15181B`, `#E58E26`), minimap, speedo, modals |
| Pause Menu & System Hub | [COMPLETE] | Integrated hub (`ESC`/`P`) with tabs for Map, Log, Graphics, Settings, Save/Load, Controls |
| Tactical World Map & GPS | [COMPLETE] | 2D vector map canvas (`M` key) showing streets, landmarks, vehicle, objective, and player arrow |
| Graphic & Audio Settings | [COMPLETE] | Real-time sliders/toggles: Exposure (0.8–2.4x), Shadows, Res Scale (50–100%), Fog, Volume, Sens, Invert Y |
| Audio & Sound Synthesizer | [COMPLETE] | Web Audio API procedural synthesis with zero missing asset latency |
| Persistence & Save/Load | [COMPLETE] | Multi-slot local persistence (Autosave, Slot 1–3) with manual save/load, mission names & timestamps |

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
- **M05 — The Journalist:** [COMPLETE]
  - Travel to Southside Diner in Southside Industrial [COMPLETE]
  - Meet investigative reporter Mara Vale on the diner patio [COMPLETE]
  - Branching dialogue regarding Lena's investigation and decrypting the drive [COMPLETE]
  - Infiltrate Meridian Properties corporate development office [COMPLETE]
  - Photograph confidential municipal buyout accord linking Albright to Syndicate [COMPLETE]
  - Return to Southside Diner and debrief Mara Vale [COMPLETE]
  - Complete mission & receive $1,800 + Decrypted Audio Journal Tape [COMPLETE]
- **M06 — The City Hall Connection:** [NOT STARTED] — Next target.
- **M07–M30:** [NOT STARTED]

---

## 5. WORLD IMPLEMENTATION STATUS
- **Vespera City Districts:**
  - **Eastline / Southside (District 1):** [COMPLETE] Contains Lena's apartment building (128 Eastline), Adrian's old auto repair garage, Southside Diner (24h retro diner with neon and patio), multi-lane avenue network, sidewalks, streetlights, and traffic.
  - **Old Harbor (District 2):** [COMPLETE] Waterfront gantry crane, shipping container stacks, Pier 19 Warehouse 19 with interior and roll-up shutter.
  - **Central Vesper Corridor:** [IN PROGRESS] Meridian Properties corporate headquarters tower, canopy, archival desk, and terminals.
  - **Redwater / North Heights / Silver Coast:** [NOT STARTED]

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

### 2026-09-12 (Session 6)
- **Pause Menu & System Hub (`src/ui/PauseMenu.ts`):**
  - Integrated full console-grade pause menu accessible via `ESC`, `KeyP`, `KeyM`, `F1`, or the top-right HUD `MENU [ESC]` button.
  - Pauses physics and game world loop while keeping UI fully interactive and unlocking pointer lock.
- **2D Tactical World Map & GPS (`M` key / Map Tab):**
  - High-definition 2D canvas map rendering Vespera City waterway (`Vespera Sound`), district boundaries (*Eastline, Southside, Old Harbor Pier 19, Central Vesper*), multi-lane avenue network with centerlines.
  - Interactive tactical POI icons: Lena's Apartment (`128 Eastline`), Adrian's Auto Repair, Pier 19 Warehouse 19, Southside Diner, Parked Vehicle (`Vesper Sedan`), pulsing gold active Mission Objective waypoint, and rotating Cyan GPS player heading arrow.
  - Live coordinates telemetry bar: `GPS [X, Z] | HEADING: ° | DISTRICT`.
- **In-Game Graphic Settings:**
  - Real-time Post-Processing Exposure slider (`0.8x` to `2.4x`, default `1.45x`).
  - Real-Time Dynamic Shadows toggle switch (enables/disables PCF soft shadow maps).
  - Render Resolution Scale dropdown (`100% Native Crisp`, `75% Balanced`, `50% Performance`).
  - Atmospheric Fog Density slider (`0.0005` to `0.0060`, default `0.0022`).
- **In-Game Audio & Game Settings:**
  - Master Volume slider (`0%` to `100%`) hooked directly to `AudioManager.setMasterVolume()`.
  - Voice Narration & Dialogue toggle switch (`NarrationManager.setEnabled()`).
  - Mouse Look Sensitivity slider (`0.4x` to `2.5x`, default `1.0x`) scaling `ThirdPersonCamera`.
  - Invert Mouse Y-Axis pitch toggle switch.
- **Multi-Slot Save / Load System (`src/core/SaveSystem.ts`):**
  - Multi-slot local persistence: `Autosave` checkpoint card + `Manual Slot 1`, `Manual Slot 2`, `Manual Slot 3`.
  - Displays slot status, active mission title, player cash, health percentage, and formatted date/time stamps.
  - Working `SAVE` and `LOAD` actions verified in automated browser playtest.
- **Mission Log & Controls Reference:**
  - Active operation briefing card, objective timeline with completed checkboxes, and dossier archive.
  - Full keyboard & mouse controls grid.

---

## 8. ACTIVE HANDOFF NOTES
- **All core infrastructure systems are 100% complete:**
  - Heads-Up Display (HUD) with minimap, speedometer, vitals, cash, clock, wanted stars, crosshair, and narration bar.
  - Pause Menu & System Hub with Tactical Map, Graphic Settings, Audio/Game Settings, and Multi-Slot Save/Load.
  - Vehicle physics and forward driving direction verified.
  - Act I (Missions M01, M02, M03, M04) verified start-to-finish.
- **Next Task:**
  - Proceed directly to **Act II — The Money Trail (Mission M05 "The Journalist")**:
    - Build Southside Diner exterior/interior and spawn investigative journalist **Mara Vale**.
    - Dialogue exchange examining Lena's stolen notebook and decrypting the Pier 19 military drive.
    - Infiltration of Meridian Properties corporate office in Central Vesper.
    - Police pursuit cruiser AI (`src/police/PoliceAI.ts`).
