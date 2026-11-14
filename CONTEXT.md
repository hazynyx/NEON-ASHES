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
- **Overall Completion:** 80% (Phase 0 Foundation, Phase 1 Prototype, Act I Missions M01-M04, Act II Missions M05, M06, M07, and M08 Complete; code-quality / playability hardening pass done)
- **Current Milestone:** Phase 3 / Act II: The Money Trail & Act III Setup (M01-M08 fully playable and chained).
- **Current Focus:** Police Cruiser patrol/pursuit AI (`src/police/PoliceAI.ts`) and Act III climax planning.
- **Last Completed:**
  - **Code-Quality & Playability Hardening (2026-11-14):** Fixed modal/gameplay overlap, stale HUD listeners, save/load mission restoration, debug-menu stage mismatches, mission-chain timer races, interaction priority, aiming/map heading conventions, and made the M05 Meridian office, M08 Municipal Trust office, and Mara Vale's diner patio physically reachable. See Session 10 below.
  - **Mission Failure on Player Death System (`src/missions/MissionManager.ts`, `src/core/Game.ts`, `src/ui/HUD.ts`):**
    - Immediate mission termination upon player death (HP = 0) with `isMissionActive = false` and `lastFailedMission = { id, stageIndex }`.
    - Hostile combatant purge via `enemyMgr.clear()`.
    - Synthesized descending minor audio stinger in `AudioManager.playMissionFailed()`.
    - Dedicated solid crimson `MISSION FAILED` modal with `RETRY MISSION` (warp to stage 0) and `ABANDON MISSION (FREE ROAM)` buttons.
  - **Developer Debug Menu & Pause Menu Mutual Exclusivity (`src/ui/DebugMenu.ts`, `src/ui/PauseMenu.ts`, `src/core/Game.ts`):**
    - Enforced strict mutual exclusivity between `F2`/`Backquote` and `Escape`/`KeyP`.
    - Canvas click-to-lock pointer lock reacquisition listener.
    - Start screen underlay hiding during debug warps to prevent prologue restarts.
  - **Campaign Missions M06, M07, M08 Integration:**
    - **M06 ("Bad Business"):** Eastline construction yard tailing, Dominic Alvarez payoff evidence photograph modal, Apex Land Holdings shell company discovery.
    - **M07 ("Old Friends"):** Jonah's debt resolution with 3-way branching choice encounter (A: $2,000 cash debt payoff; B: syndicate ambush combat shootout; C: Vincent Drake harbor contraband cache retrieval).
    - **M08 ("Paper Trail"):** Vespera Municipal Trust night infiltration, filing archive inspection, executive terminal 256-bit AES $4.2M wire transfer ledger modal, high-alert perimeter evasion.
    - **E2E Campaign Test Suite (`scripts/test_e2e_campaign.js`):** 90/90 assertions passed (100% pass rate).
- **Currently Broken:** None. All 8 missions and debug/failure systems verified in automated browser playtest (90/90 campaign assertions, 33/33 M08, 35/35 M06, M01/M02/death suites). Mission-blocking geometry issues in M05/M08 were fixed in Session 10.
- **Next Tasks:**
  1. Implement Police Pursuit AI (`src/police/PoliceAI.ts`):
     - Police cruisers actively pursuing Kaleb upon reaching 2+ wanted stars with siren audio and roadblock tactics.
  2. Implement Act III Climax Missions M09 ("Showdown at City Hall") & M10 ("The Docks Finale").

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
| Developer Debug & Mission Warp Menu | [COMPLETE] | Dedicated developer console (`F2` / `~` / HUD `DEV [F2]`), mission warp, objective jump, fast travel to 11 POIs, cheats, spawner |
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
- **M06 — Bad Business:** [COMPLETE]
  - Tail contractor Dominic Alvarez through the Eastline redevelopment site [COMPLETE]
  - Photograph the Marrow Syndicate payoff and identify Apex Land Holdings [COMPLETE]
  - Evade surveillance and expose the shell company [COMPLETE]
  - Complete mission & receive $2,000 + Apex lead [COMPLETE]
- **M07 — Old Friends:** [COMPLETE]
  - Drive to Adrian's garage and talk to Jonah Reyes [COMPLETE]
  - Resolve the $2,000 debt via 3-way branch: cash payoff, shootout, or Drake contraband job [COMPLETE]
  - Debrief Jonah and complete mission & receive $2,500 + world-state flags [COMPLETE]
- **M08 — Paper Trail:** [COMPLETE]
  - Meet Mara Vale at the Southside Diner patio [COMPLETE]
  - Infiltrate Vespera Municipal Trust, search the archive, and download the Black Ledger wire transfers [COMPLETE]
  - Evade Vespera Security and complete mission & receive $3,000 + Act II finale fanfare [COMPLETE]
- **M09–M30:** [NOT STARTED]

---

## 5. WORLD IMPLEMENTATION STATUS
- **Vespera City Districts:**
  - **Eastline / Southside (District 1):** [COMPLETE] Contains Lena's apartment building (128 Eastline), Adrian's old auto repair garage, Southside Diner (24h retro diner with neon and a walkable patio where Mara Vale stands), multi-lane avenue network, sidewalks, streetlights, and traffic.
  - **Old Harbor (District 2):** [COMPLETE] Waterfront gantry crane, shipping container stacks, Pier 19 Warehouse 19 with interior and roll-up shutter.
  - **Central Vesper Corridor:** [COMPLETE] Meridian Properties corporate tower with a hollow, walkable ground-floor archive lobby; Vespera Municipal Trust with a hollow ground-floor archive/terminal suite; Apex Land Holdings shell office.
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
- `src/world/ApartmentInterior.ts` — Detached Unit 102 interior cell, props, colliders, and radar floorplan
- `src/world/DestinationMarker.ts` — Floating amber objective pillar, ring, and chevron
- `src/player/Player.ts` — Kaleb Voss character controller, kinematics, and raycast combat
- `src/vehicles/Vehicle.ts` — Arcade vehicle physics, suspension, steering, and wheel animation
- `src/vehicles/VehicleManager.ts` — Spawning, proximity interaction, and enter/exit logic
- `src/ai/NPCManager.ts` — Story NPCs (Mrs. Gable, Jonah Reyes, Mara Vale) and reactive pedestrians
- `src/ai/EnemyAI.ts` — Marrow Syndicate enemy AI with combat state machine and health
- `src/missions/MissionManager.ts` — Active mission state runner and objective coordinator
- `src/missions/data/M01_HomeAgain.ts` — Objective declarations for Mission M01
- `src/missions/data/M02_OldDebts.ts` — Objective declarations for Mission M02
- `src/ui/HUD.ts` — Minimap radar, vitals, speedometer, dialogue overlay, evidence modal
- `src/ui/DebugMenu.ts` — Developer console (mission warp, fast travel, cheats, spawner)
- `src/ui/PauseMenu.ts` — System hub, tactical map, settings, save/load, mission log
- `src/audio/AudioManager.ts` — Procedural Web Audio API sound synthesizer
- `src/audio/NarrationManager.ts` — Web Speech narration queue with stale-callback guards
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

### 2026-11-13 (Session 7)
- **Mission 1 Apartment Interior & Teleportation Overhaul:**
  - **Dedicated Interior Room Cell (`src/world/ApartmentInterior.ts`):**
    - Isolated interior space centered at `(300, 0, -300)` measuring `10m x 8m x 3.4m` preventing collision or audio bleed from city streets.
    - Polished dark oak parquet floor, molded ceiling trim, vintage teal plaster walls, mahogany wainscoting.
    - Investigation desk with pulled-out drawer, spilled Manila folders, papers on floor, overturned wooden chair, corkboard with pinned evidence Polaroids and red yarn.
    - Secret loose floorboard cavity with pulsing gold investigation beacon (`this.floorboardBeacon`).
    - Lena's rumpled bed, navy duvet, nightstand, ransacked bookshelf with knocked-over books.
    - Atmospheric multi-source lighting: warm ambient light (`0xffedd5, 1.8`), ceiling fixture (`3.2`), emerald green banker's lamp (`4.5`), bedside lamp (`2.8`), and window moonlight (`1.6`).
    - Dedicated interior radar floorplan on minimap (`128 EASTLINE // UNIT 102`) with dashed GPS breadcrumb route.
  - **Camera Alignment & Teleport Snap (`src/rendering/Camera.ts`):**
    - Added `snap(targetPos, yaw, pitch, colliders)` instantly placing smoothed target and camera position without lerping across the map.
    - Added auto-snap guard in `Camera.update()` if target jumps > 5.0m to guarantee smooth teleportation.
    - Centered `interiorOffset` to `(0, 1.45, 0)` and set `interiorDistance = 1.85m` for centered over-the-shoulder framing.
    - Clamped indoor camera pitch to `[-Math.PI / 4.5, Math.PI / 3.4]` preventing clipping through floor or ceiling.
  - **Player Teleport & Heading (`src/player/Player.ts`):**
    - Added `teleport(pos, heading)` to cancel previous velocity, sync mesh position and rotation, and face North into the room (`heading = Math.PI`).
    - Exited vehicle state automatically on teleport.
  - **Input & Interaction Glitch Fixes (`src/core/Game.ts` & `src/core/InputManager.ts`):**
    - Added `consumeKey(code)` in `InputManager.ts`.
    - Fixed same-frame entry-to-exit bug where pressing `E` at the door instantly re-triggered the exit door within proximity.
    - Added `isEvidenceOpen` state in `src/ui/HUD.ts` and blocked pointer lock change callback from opening the Pause Menu / Map over the evidence modal.
    - Set `exit_apartment` objective type to `INTERACT` in `src/missions/data/M01_HomeAgain.ts` so proximity does not prematurely trigger mission completion before exiting.
    - Updated porch exit position to `(30, 0, -23.5)` facing South toward Eastline Avenue.
  - **Automated Regression Suite (`scripts/test_m01_apartment.js`):**
    - End-to-end Puppeteer verification testing: entering Unit 102, camera alignment, desk investigation prompt, harbor photo modal examination, exit door prompt, and mission passed rewards.
    - Captured verified screenshots: `m01_apartment_just_entered.png`, `m01_apartment_desk_search_prompt.png`, `m01_apartment_evidence_modal.png`, `m01_apartment_exit_door_prompt.png`, `m01_mission_passed_outside.png`.

### 2026-11-13 (Session 8)
- **GTA 5 Style Camera View Cycling System (`src/rendering/Camera.ts` & `src/core/Game.ts`):**
  - Added multi-perspective camera cycling bound to `V` key, replicating Grand Theft Auto V:
    - **On Foot Modes:** Close Over-The-Shoulder (`1.65m`), Medium Standard (`3.4m`), Far Tactical (`5.8m`), and First-Person Head-Cam (`0.0m`).
    - **In Vehicle Modes:** Vehicle Close Chase (`5.8m`), Vehicle Far Chase (`8.6m`), and Vehicle Hood/Bumper Cam (`0.0m`).
  - Implemented First-Person mesh culling in `Player.ts`: completely hides head, hair, torso, and legs while retaining the right weapon arm, service pistol, and shotgun in view.
  - Added `#camera-view-badge` HUD element with smooth fade-out confirming view mode name (`VIEW // CLOSE`, `VIEW // MEDIUM`, `VIEW // FAR`, `VIEW // FIRST PERSON`, `VEHICLE // HOOD CAM`).
  - Verified across all camera views with screenshot captures (`gta5_camera_close.png`, `gta5_camera_far.png`, `gta5_camera_firstperson.png`, `gta5_camera_vehicle_hood.png`).

- **Player Death System & WASTED Screen (`src/player/Player.ts`, `src/core/Game.ts`, `src/ui/HUD.ts`, `src/style.css`):**
  - Fixed invincibility at 0 HP: `Player.takeDamage()` sets `isDead = true`, cancels horizontal velocity, and triggers ragdoll collapse (`rotation.x = -Math.PI / 2`, `rotation.z = 0.25`, limbs sprawled).
  - Web Audio synthesis `AudioManager.playWastedSound()`: deep sub-bass impact boom (85Hz down to 24Hz), muffled low-pass impact thud, and eerie high-pitched flatline tinnitus tone.
  - Implemented solid `#wasted-screen` overlay (strictly adhering to NO GLASSMORPHISM): dark red radial vignette, solid `#0b0d0f` card with crimson border `#991b1b`, glowing crimson `WASTED` title, medical expense deduction notice (`-$100`), and 3.2-second animated progress bar.
  - Automated clinic respawn: deducts medical fee, restores 100 HP, resets character rotation and limbs, snaps camera, and respawns outside Lena's Apartment Safehouse / Central Metro Clinic at `(30, 0, -22)`.
  - Blocked pointer lock callback from opening the Pause Menu / Map over the WASTED death screen.

- **Adrian's Auto Repair Garage Workshop & Roll-Up Shutter (`src/world/World.ts`):**
  - Replaced legacy solid collision box at `(-60, 0, 50)` with a fully playable, hollow, high-detail automotive workshop ($24\text{m} \times 28\text{m} \times 8.5\text{m}$):
    - Concrete workshop floor with grease stains, oily patina, and yellow hazard safety stripes around work bays.
    - Weathered dark masonry and industrial steel walls with individual Box3 colliders.
    - Large front bay opening with motorized roll-up security shutter door (`8.8m x 5.4m x 0.3m`) that animates upward to $y = 7.8\text{m}$ upon interaction (`[E] Open Workshop Shutter`) and removes shutter collision.
    - Hydraulic twin-post car lift with structural posts and an elevated project sports coupe (`0x991b1b`) suspended at $y = 2.4\text{m}$ with undercarriage inspection light.
    - Adrian's heavy-duty steel-frame hardwood workbench at `(-64, 0, 38)` equipped with cast-iron vice, open socket trays, toolboxes, blueprints, and green-shaded task lamp.
    - Wall-mounted tool pegboard hanging chrome vanadium wrenches and pliers.
    - Adrian's concealed heavy wall safe embedded in back wall at `(-64, 1.5, 36.65)` behind hinged Aurelia vintage license plates with active blinking green LED.
    - Pulsing golden investigation beacon hovering above the safe/workbench for objective `crack_safe`.
    - Heavy storage shelf racks, oxygen/argon welding cylinders, red oil drums, and ceiling fluorescent shop lights.
    - Concrete forecourt driveway apron extending to street with racing tire stacks and work floodlight.

- **Jonah Reyes Story Character & Forecourt Setup (`src/ai/NPCManager.ts`):**
  - Built custom mechanic 3D model for Jonah Reyes:
    - Petrol navy work coveralls (`0x1e3a5f`) with embroidered amber "JONAH" chest badge.
    - Heavy leather toolbelt with hanging socket wrench.
    - Grey mechanic baseball cap with forward visor and weathered facial features.
    - Right arm holding a heavy-duty chrome adjustable torque wrench.
    - Steel-toe work boots with reinforced knee patches.
  - Positioned Jonah in the clear forecourt at `(-56, 0, 67)` facing South towards the approaching street.
  - Relocated conflicting ambient pedestrian to prevent interaction theft.

- **Mission M02 ("Old Debts") Full Playability & Regression Suite (`scripts/test_m02_garage.js`):**
  - Updated M02 objective coordinates and interactions:
    - `drive_to_garage` -> `talk_to_jonah` outside the garage.
    - `enter_garage` raises the workshop shutter with door slam SFX.
    - `crack_safe` at workbench inspects safe, unhides evidence, and unlocks 12G tactical shotgun + ammo.
    - `eliminate_syndicate` spawns 2 Marrow Syndicate ambushers inside the garage entrance.
    - `escape_area` triggers vehicular escape past 65m perimeter.
  - Automated Puppeteer playtest completed 100% of objectives and captured verified screenshots:
    - `gta5_camera_views.png`, `gta5_camera_close.png`, `gta5_camera_far.png`, `gta5_camera_firstperson.png`, `gta5_camera_vehicle_hood.png`.
    - `m02_player_wasted_screen.png`.
    - `m02_jonah_mechanic_talk.png`.
    - `m02_garage_workshop_inside.png`.
    - `m02_crack_safe_prompt.png`.
    - `m02_mission_passed.png`.

### 2026-11-13 (Session 9)
- **Developer Debug Menu & Mission Warp System (`src/ui/DebugMenu.ts`, `src/core/Game.ts`, `src/missions/MissionManager.ts`, `src/player/Player.ts`, `src/vehicles/VehicleManager.ts`):**
  - Implemented full standalone developer debug controller toggled via `F2`, `~` (`Backquote`), or the top-right HUD button (`DEV [F2]`).
  - Strict adherence to solid, grounded UI (NO glassmorphism) using `#0b0d10`, `#11151c`, `#1e293b` with indigo (`#6366f1`) and amber (`#e58e26`) accents.
  - **Missions & Warp Tab:**
    - Dropdown mission selector (M01 Home Again, M02 Old Debts, M03 The Harbor, M04 Cold Storage, M05 The Journalist).
    - Objective stage selector populating real stage names dynamically upon mission selection.
    - **Warp to Mission & Start**: Automatically sets up prerequisites (opens required shutters, sets camera mode, sets ambient time), starts mission cleanly, and warps Kaleb Voss directly to the mission start point.
    - **Jump to Selected Objective**: Directly moves active mission to chosen stage (`MissionManager.jumpToObjective()`) and warps player to that objective's exact coordinates.
    - **Advance +1 Objective** & **Instant Pass Mission** for rapid testing workflows.
    - Real-time active mission readout card with live cash and health.
  - **Fast Travel Tab:**
    - 15 direct instant teleport buttons to all key city landmarks and interiors:
      - Lena's Apartment (Outside & Inside Unit 102)
      - Adrian's Auto Repair (Forecourt & Inside Workshop)
      - Southside Diner (Patio)
      - Old Harbor Pier 19 (Entrance)
      - Pier 19 Container Stack (Vantage Point)
      - Warehouse 19 (Security Entrance & Terminal Desk)
      - Meridian Properties Tower
      - Central Metro Clinic (Respawn Point)
      - Downtown Main Intersection
  - **Player & Cheats Tab:**
    - **God Mode** toggle button (`player.isGodMode` preventing damage in `takeDamage()`).
    - **Full Health & Stamina** instant refill.
    - **Give +$1,000 Cash** and **Give +$10,000 Cash**.
    - **Give All Weapons & Max Ammo** (unlocks shotgun, fills pistol and shotgun clips/reserves).
    - **Kill Player (Test WASTED)** triggering instant ragdoll and death sequence.
    - **Set Wanted Level** buttons (0 to 5 stars).
  - **World & Vehicles Tab:**
    - Vehicle Spawner: Spawns Vesper Sedan, VCPD Police Cruiser, or Metro Sport Coupe directly 6m in front of player with forward heading.
    - Time of Day Presets: Dawn (06:30), Noon (12:00), Dusk (19:00), Midnight (00:00).
    - World Interactive Shutters: Toggles Adrian's Garage shutter and Warehouse 19 security roll-up gate on demand.
  - **Live Coordinates Telemetry:**
    - Real-time bottom bar displaying `POS: X: ..., Y: ..., Z: ... | HEADING: ...°`.
  - **Pointer Lock Safety Guard:**
    - Unlocks pointer lock upon opening; guards `onPointerLockChange` in `Game.ts` so opening the debug menu never triggers the Pause Menu or Map.
  - **Modular Cleanup Ready:**
    - Cleanly separated into `src/ui/DebugMenu.ts` and `#debug-menu` modal in `index.html`. Can be easily removed or disabled with zero impact on gameplay code prior to final release.
  - **Automated Verification Suite (`scripts/test_debug_menu.js`):**
    - Verified all 6 automated tests: opening menu, fast travel grid, player cheats (+cash, god mode, weapons), world spawner, warping into M03 at Pier 19, and warping into M05 at Southside Diner.
    - Screenshots captured: `debug_menu_missions_tab.png`, `debug_menu_fast_travel_tab.png`, `debug_menu_player_cheats_tab.png`, `debug_menu_world_spawner_tab.png`, `debug_warp_m03_pier19.png`, `debug_warp_m05_diner.png`.

### 2026-11-14 (Session 10) — Code-Quality & Playability Hardening
- **Update-loop / modal correctness (`src/core/Game.ts`):**
  - Added a title-screen simulation gate so M01 can no longer auto-complete its first objective before the player presses **ENTER VESPERA CITY**.
  - Evidence modal, WASTED screen, and Mission Passed/Failed banner now freeze gameplay entirely; previously WASD still moved Kaleb, clicks on modal buttons could fire the pistol, and mission handlers kept running behind the UI.
  - Removed the duplicate F1 `keydown` listener that toggled the standalone controls overlay at the same time as the Pause Menu controls tab.
  - Camera view cycling (`V`) is now processed only during active gameplay (not while paused/dialogue/overlays).
  - Pause menu resume restores `MISSION_ACTIVE` when a mission is active instead of always forcing `FREE_ROAM`; the HUD `MENU [ESC]` button now also pauses the simulation.
  - Added `createMissionDataById()` and `restoreFromSave()` so loading a slot re-creates the saved mission data, objective index, apartment-interior mode, vehicle state, and camera. Old/invalid mission ids fall back to free roam.
  - Chained campaign transitions now run through `scheduleMissionChain()`, which aborts if a debug warp/save load/restart started another mission during the 800ms banner delay. This fixes M07 branch tests being reset by the previous M06 chain timer.
- **Player / combat fixes (`src/player/Player.ts`):**
  - `hasShotgun` now starts `false` (the 12G is still unlocked by M02's safe, the debug weapons cheat, or a loaded save that completed M02).
  - Shooting now requires pointer lock, preventing UI clicks from firing rounds.
  - Raycasts exclude Kaleb's entire mesh hierarchy (head, torso, arms, held weapons), so shots no longer stop on his own model.
  - Aiming body heading now uses `camera.yaw + PI` (the player model faces +Z while the camera looks down -Z), so Kaleb faces the direction he is shooting.
  - `teleport()` clears ragdoll/aim limb poses; `resetCombatState()` is used by respawn and save loading.
- **HUD / UI lifecycle fixes (`src/ui/HUD.ts`, `src/ui/PauseMenu.ts`):**
  - Evidence modal callbacks are stored and removed on every close, preventing a dismissed modal's stale continue handler from double-advancing a later mission.
  - Mission Passed/Failed retry/continue handlers are cleaned up before each new banner, preventing duplicate retry/abandon callbacks after repeated deaths.
  - WASTED and notification timers are cleared correctly; debug notifications auto-hide after 2.8s.
  - World map now uses live `World` coordinates for landmarks, matches the real avenue/cross-street grid, reports the correct district, and uses convention-aware GPS arrow/heading math for on-foot vs vehicle.
  - Minimap radar rotation now matches the actual on-foot/vehicle heading conventions.
  - Mission log clears stale entries when no mission is active.
  - Save/load button now passes slot data to `Game.restoreFromSave()`.
- **Save system (`src/core/SaveSystem.ts`):**
  - Bumped schema to v2 while remaining backward-compatible; saves heading, shotgun ownership/ammo, and current weapon.
  - Completed/failed missions are no longer written as `currentMissionId`; autosave after a mission pass loads into free roam instead of resurrecting a finished mission at an out-of-range objective index.
  - Loading revives the player, clears vehicle/dead state, and clamps health.
- **Debug menu (`src/ui/DebugMenu.ts`):**
  - Vehicle spawner now spawns 4.5m **in front** of the player (was spawning behind).
  - M03, M04, and M05 stage lists now align one-to-one with their real objective arrays (added `observe_handoff`, `retrieve_key`, `unlock_gate`, `return_to_mara`, `debrief_mara`, etc.); fixed M04/M05 label/index drift.
  - Warp/teleport clears the Mission Passed/Failed banner, evidence modal, WASTED overlay, and revives a dead player so the new mission is never frozen by leftover UI.
  - Fast-travel diner/Meridian positions updated to the walkable patio/entrance.
- **World / mission reachability (`src/world/World.ts`, `src/ai/NPCManager.ts`):**
  - `southsideDinerPos` is now the walkable patio at `(50, 0, 34.8)`; the diner building itself stays at `(50, 0, 46)`. Mara Vale stands at the patio, so M05/M08 diner objectives are reachable without teleporting inside a solid wall.
  - Meridian Properties tower and Vespera Municipal Trust are no longer single solid boxes: both have hollow, lit ground-floor lobbies with split front walls and real 6.4m/5.6m entrance openings. The M05 archive desk and M08 filing cabinets/executive terminal can now be reached by walking in normally.
  - Both offices gained interior floors, low ceilings, wall colliders, and interior lights.
- **Audio / NPC / interaction fixes:**
  - `NarrationManager` uses speech/queue generation tokens so cancelled utterances can no longer hide a newer subtitle; queue replacement cancels stale callbacks.
  - `AudioManager.playTireScreech()` is throttled to 0.25s, preventing dozens of overlapping noise nodes during a held handbrake turn.
  - NPC gunfire panic now flees away from the actual shooter position instead of world origin.
  - Vehicle enter/exit consumes `[E]`, and mission/NPC/interior interactions take priority over a nearby parked car, eliminating same-frame double triggers.
  - M06/M07 mission categories corrected to `ACT II`.
- **Regression tests updated/verified:**
  - Updated diner teleport coordinates in `scripts/test_e2e_campaign.js` and `scripts/test_m08_paper_trail.js` for the new patio position.
  - Changed `scripts/test_m01_apartment.js` navigation wait from `networkidle0` to `domcontentloaded` (Vite HMR kept the network from going idle).
  - Verified: `test_e2e_campaign.js` **90/90**, `test_m08_paper_trail.js` **33/33**, `test_m06_bad_business.js` **35/35**, `test_m01_apartment.js`, `test_m02_garage.js`, `test_death_and_debug_menu.js`, `test_debug_menu.js`, and `test_camera_views.js` all pass.
  - `npm run build` passes clean (`dist/assets/index-hP-yIsgW.js`, 892.64 kB / 229.99 kB gzip).
  - Additional save/load + walkability verification: mission restored to M05 stage 3 with cash/objective intact, apartment save restored interior mode, and the player successfully walked through both new office entrances.

---

## 8. ACTIVE HANDOFF NOTES
- **Developer Debug Menu & Mission Warp System Complete:**
  - Press `F2` (or click `DEV [F2]`) at any time to warp to any mission (M01–M08), jump directly to specific stages, fast-travel across Vespera City, toggle god mode, give weapons/cash, spawn vehicles, or change time of day without needing to play sequentially.
  - Debug warps now clean up open result/evidence/WASTED overlays and revive the player, so warping cannot leave the simulation frozen.
- **Save/Load Is Mission-Aware:**
  - Loading restores the active mission's real objective array, interior mode, heading, weapons, time of day, and camera instead of applying a saved index to an unrelated stale mission.
- **Next Task:**
  - Implement Police Pursuit AI (`src/police/PoliceAI.ts`) with 2+ star pursuit behavior, siren audio, and roadblocks; then Act III Missions M09–M10.
