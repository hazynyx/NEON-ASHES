# Project: NEON ASHES — Missions M06, M07, M08 Campaign Expansion

## Architecture
- **Engine Core (`src/core/Game.ts`)**: Central orchestrator managing game loop, input, player state, camera, world, mission manager, event bus, and subsystem updates.
- **Mission Subsystem (`src/missions/`)**:
  - `Mission.ts`: Core data structures (`ObjectiveType`, `MissionObjective`, `MissionData`).
  - `MissionManager.ts`: State container managing current mission, stage advancement, proximity checks, and `mission:complete` events.
  - `src/missions/data/`: Modular data factories (`M01_HomeAgain.ts` through `M08_PaperTrail.ts`).
- **World & Simulation Subsystems**:
  - `src/world/World.ts`: 3D city geometry, district coordinates, and navigation landmarks.
  - `src/vehicles/VehicleManager.ts`: Vehicle spawning and speed/route control.
  - `src/ai/NPCManager.ts`: 3D animated NPCs and story character dialogues.
  - `src/ai/EnemyAI.ts`: Hostile combatants, ambush spawning, and hit registration.
  - `src/ui/HUD.ts`: 2D canvas procedural evidence modals, minimap GPS route, mission passed fanfare, interaction prompts.
  - `src/ui/DebugMenu.ts`: Developer debug panel with mission warp checkpoints.
- **Testing Architecture (`scripts/`)**: Standalone Node ES modules utilizing `puppeteer-core` driving headless Chrome with WebGL ANGLE against Vite dev server on port 3000.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | M06 Data Definition | `createMission06Data` with 6 typed objectives in `src/missions/data/M06_BadBusiness.ts` | M06 | MISSION_DESIGN.md:693 |
| 2 | M06 Surveillance & Tailing | Foot and vehicle tailing mechanics maintaining distance thresholds in construction yard | M06 | MISSION_DESIGN.md:698 |
| 3 | M06 Photo Evidence Modal | 2D canvas evidence modal for Dominic Alvarez bribe handoff | M06 | MISSION_DESIGN.md:700 |
| 4 | M06 Shell Company Discovery | Identification of Apex Land Holdings directory plaque and escape trigger | M06 | MISSION_DESIGN.md:702 |
| 5 | M06 Dedicated Playtest | `scripts/test_m06_bad_business.js` headless verification of all 6 stages and fail states | M06 | ORIGINAL_REQUEST R3 |
| 6 | M07 Data Definition | `createMission07Data` with branching objectives in `src/missions/data/M07_OldFriends.ts` | M07 | MISSION_DESIGN.md:714 |
| 7 | M07 Choice Encounter System | 3-way branching choice resolution (Pay Debt, Threaten/Shootout, Drake Errand) | M07 | MISSION_DESIGN.md:720 |
| 8 | M07 Branch A: Debt Payoff | Peaceful cash payment (-$2000), Jonah loyalty state update | M07 | MISSION_DESIGN.md:722 |
| 9 | M07 Branch B: Creditor Combat | Syndicate ambush combat squad elimination at garage | M07 | MISSION_DESIGN.md:724 |
| 10 | M07 Branch C: Drake Package | Contraband retrieval from harbor depot cache | M07 | MISSION_DESIGN.md:726 |
| 11 | M07 Dedicated Playtest | `scripts/test_m07_old_friends.js` headless verification of all 3 branches and outcomes | M07 | ORIGINAL_REQUEST R3 |
| 12 | M08 Data Definition | `createMission08Data` with Act II infiltration flow in `src/missions/data/M08_PaperTrail.ts` | M08 | MISSION_DESIGN.md:744 |
| 13 | M08 Mara Debrief & Financial Intel | Mara Vale debrief at diner and finance office navigation | M08 | MISSION_DESIGN.md:752 |
| 14 | M08 Office Infiltration & Night Mode | Infiltration of Vespera Municipal Trust with altered lighting | M08 | MISSION_DESIGN.md:755 |
| 15 | M08 Document Search & Wire Download | Filing inspection, terminal download, Black Ledger evidence modal | M08 | MISSION_DESIGN.md:758 |
| 16 | M08 Security Escape | High-alert security evasion (>75m perimeter escape) | M08 | MISSION_DESIGN.md:760 |
| 17 | M08 Dedicated Playtest | `scripts/test_m08_paper_trail.js` headless verification of office infiltration and records | M08 | ORIGINAL_REQUEST R3 |
| 18 | Campaign Chaining Pipeline | Sequential chaining in `Game.ts` (M05 -> M06 -> M07 -> M08) | M-INTEG | ORIGINAL_REQUEST R2 |
| 19 | Debug Menu Stage Registration | Full registration of M06, M07, M08 in `DebugMenu.ts` and `index.html` dropdown | M-INTEG | ORIGINAL_REQUEST R2 |
| 20 | E2E Campaign Verification Suite | Comprehensive verification verifying full campaign continuity and regression safety | M-INTEG | ORIGINAL_REQUEST R2/R3 |
| 21 | Incremental Git Commit & Push | Granular commits after each milestone and final push to `origin/main` | M-INTEG | ORIGINAL_REQUEST R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M06: BAD BUSINESS | Implement M06 data, surveillance/tailing mechanics, photo evidence, and dedicated test | none | IN_PROGRESS |
| 2 | M07: OLD FRIENDS | Implement M07 data, 3-way branching choice encounter, combat/package branches, and dedicated test | none | IN_PROGRESS |
| 3 | M08: PAPER TRAIL | Implement M08 data, office infiltration, financial records investigation, terminal download, and dedicated test | none | IN_PROGRESS |
| 4 | M-INTEG: Campaign Integration & E2E | Integrate chaining M05->M06->M07->M08 in Game.ts, DebugMenu, E2E test, and git commits/push | M06, M07, M08 | PLANNED |

## Interface Contracts
### Mission Data ↔ MissionManager
- Factory functions:
  `createMission06Data(redevPos: THREE.Vector3, meetingPos: THREE.Vector3, shellPos: THREE.Vector3): MissionData`
  `createMission07Data(garagePos: THREE.Vector3, jonahPos: THREE.Vector3, depotPos: THREE.Vector3): MissionData`
  `createMission08Data(dinerPos: THREE.Vector3, officePos: THREE.Vector3, terminalPos: THREE.Vector3): MissionData`
- Each returns `MissionData` conforming to `src/missions/Mission.ts`.

### Mission Logic ↔ Game Loop (`Game.ts`)
- `getInteractionPrompt()` returns `{ text: string, key: string } | null` based on `currentObjective.id` and proximity.
- `updateMissionAndInteractions()` handles stage progression (`[E]`, `[F]`, dialogues, photos, combat kills, distance checks).
- `eventBus.on('mission:complete')` handles chaining: M05 -> M06 -> M07 -> M08 -> Act II transition.

### DebugMenu ↔ Playtest Scripts
- `DebugMenu.warpToMission(missionId: string, stageIndex: number)` teleports player, initializes objective state, and executes setup hooks.
- Script runners launch Puppeteer and interact via `window.game.debugMenu.warpToMission()`.

## Code Layout
- `src/missions/data/M06_BadBusiness.ts`: Data definition for Mission 06.
- `src/missions/data/M07_OldFriends.ts`: Data definition for Mission 07.
- `src/missions/data/M08_PaperTrail.ts`: Data definition for Mission 08.
- `src/core/Game.ts`: Campaign progression chaining, interaction prompt routing, objective update logic.
- `src/ui/HUD.ts`: Evidence modal renderers for M06, M07, and M08.
- `src/ui/DebugMenu.ts`: Stage definitions and warp positions for M06, M07, M08.
- `index.html`: Debug menu select options.
- `scripts/test_m06_bad_business.js`: Dedicated playtest for M06.
- `scripts/test_m07_old_friends.js`: Dedicated playtest for M07.
- `scripts/test_m08_paper_trail.js`: Dedicated playtest for M08.
- `scripts/test_e2e_campaign.js`: E2E full campaign verification script.
