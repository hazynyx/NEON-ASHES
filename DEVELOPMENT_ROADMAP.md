# NEON ASHES — DEVELOPMENT ROADMAP

## 1. PURPOSE

This document defines the development sequence for NEON ASHES.

The project must be developed as a **real playable game**, not as a collection of disconnected demonstrations.

The development process prioritizes:

1. working gameplay
2. stable architecture
3. persistent world state
4. mission functionality
5. asset quality
6. content expansion
7. optimization
8. polish

Do not attempt to build the entire game simultaneously.

Build vertically first, then expand horizontally.

---

# 2. DEVELOPMENT PHILOSOPHY

The project follows this rule:

> **Build one complete piece of the game before building ten incomplete pieces.**

For example:

Bad:

```text
100 NPC types
+
50 cars
+
huge map
+
30 mission markers
+
no functional missions
```

Good:

```text
1 district
+
working player
+
working traffic
+
working NPCs
+
working combat
+
working police
+
working mission
+
working save system
```

The second approach produces an actual game much earlier.

---

# 3. DEVELOPMENT PHASES

```text
PHASE 0  → Project Foundation
PHASE 1  → Core Prototype
PHASE 2  → Vertical Slice
PHASE 3  → Core Systems
PHASE 4  → World Expansion
PHASE 5  → Campaign Production
PHASE 6  → Side Content
PHASE 7  → World Simulation
PHASE 8  → Visual / Audio Polish
PHASE 9  → Optimization
PHASE 10 → QA / Release
```

---

# 4. PHASE 0 — PROJECT FOUNDATION

## Objective

Create the technical foundation before implementing large gameplay systems.

### Tasks

- initialize project
- establish directory structure
- establish build system
- establish runtime entry point
- establish renderer
- establish input system
- establish game loop
- establish asset manager
- establish scene/world manager
- establish save architecture
- establish debug mode
- create `CONTEXT.md`
- create development logging system

### Required Result

The application should successfully:

```text
launch
↓
initialize engine
↓
load configuration
↓
initialize renderer
↓
load a test scene
↓
accept input
↓
run game loop
↓
display debug information
```

---

# 5. PHASE 0.1 — PROJECT MEMORY SYSTEM

Before significant development begins, create:

```text
CONTEXT.md
```

This file is mandatory.

The AI must continuously maintain it.

It should allow another AI to understand the project without relying on previous chat history.

See the dedicated `CONTEXT.md` specification at the end of this document.

---

# 6. PHASE 1 — CORE PROTOTYPE

## Objective

Prove that the fundamental gameplay works.

Implement:

### Player

- movement
- camera
- sprint
- jump where appropriate
- crouch
- interaction
- health
- death

### World

- one small playable area
- collision
- basic lighting
- basic environment

### Vehicles

- enter vehicle
- exit vehicle
- drive
- accelerate
- brake
- steering
- collision

### NPCs

- spawn
- walk
- idle
- basic reactions

### Combat

- equip weapon
- aim
- shoot
- reload
- damage
- death

### UI

- HUD
- objective
- interaction prompt

---

# 7. PHASE 1 SUCCESS CRITERIA

The following must work:

```text
Player can walk.
Player can run.
Player can enter a car.
Player can drive.
Player can leave the car.
NPCs exist.
NPCs react.
Player can shoot.
Enemies can shoot back.
Player can die.
Player can restart.
```

If these do not work reliably:

> DO NOT move to large-scale content production.

---

# 8. PHASE 2 — VERTICAL SLICE

## Objective

Create a convincing 15–30 minute section of the actual game.

This is the most important milestone.

The vertical slice should include:

- one polished district section
- one safehouse
- one interior
- multiple NPC types
- traffic
- police
- one faction
- weapons
- vehicle chase
- one complete main mission
- dialogue
- cinematic sequence
- save/load
- basic economy
- basic wanted system
- day/night
- basic weather
- audio
- VFX
- polished HUD

---

# 9. VERTICAL SLICE MISSION

The vertical slice should use one of the early canonical missions.

Recommended:

```text
M01 — Home Again
M02 — Old Debts
M03 — The Harbor
```

Prefer `M01 — Home Again` initially because it establishes:

- Kaleb
- Vespera
- Adrian
- Lena mystery
- exploration
- driving
- dialogue
- investigation

---

# 10. VERTICAL SLICE QUALITY BAR

A tester should be able to play the slice and say:

> "This is an actual game."

Not:

> "This is a cool technical demo."

The difference is:

- coherent presentation
- functional systems
- believable world
- meaningful objectives
- feedback
- consequences
- proper transitions
- persistent state

---

# 11. PHASE 3 — CORE SYSTEMS

After the vertical slice works, expand the systems.

## Player

- inventory
- clothing
- weapon switching
- advanced movement
- interaction system

## Vehicles

- multiple vehicle classes
- vehicle damage
- garages
- repair
- customization

## Combat

- enemy archetypes
- cover
- stealth
- melee
- detection
- tactical AI

## Police

- wanted levels
- witnesses
- search behavior
- roadblocks
- escalation
- police AI

## NPCs

- daily routines
- conversations
- reactions
- panic
- faction awareness

---

# 12. PHASE 3 — MISSION ENGINE

Implement the full data-driven mission framework.

It must support:

- objectives
- optional objectives
- checkpoints
- failure
- branching
- alternate approaches
- dialogue
- vehicle objectives
- combat objectives
- stealth objectives
- investigation
- world-state changes
- rewards
- consequences

Mission logic must not be hard-coded as giant monolithic functions.

---

# 13. PHASE 3 — SAVE SYSTEM

Implement robust persistence.

Save:

- player position
- player health
- money
- weapons
- vehicles
- vehicle state
- mission progress
- mission choices
- character relationships
- faction reputation
- discovered locations
- world-state flags
- time
- weather
- safehouse state

Use versioned saves.

---

# 14. PHASE 4 — WORLD EXPANSION

Expand Vespera City district by district.

Recommended order:

```text
1. Central Vesper
2. Old Harbor
3. Eastline
4. Redwater
5. Meridian
6. Southside
7. North Heights
8. Silver Coast
9. Industrial Belt
10. Outer County
```

Do not build all districts at maximum detail simultaneously.

---

# 15. DISTRICT PRODUCTION LOOP

For every district:

```text
Blockout
↓
Road network
↓
Terrain
↓
Buildings
↓
Landmarks
↓
Props
↓
NPC population
↓
Traffic
↓
Interiors
↓
Faction presence
↓
Activities
↓
Random events
↓
Mission locations
↓
Lighting
↓
Audio
↓
Optimization
↓
QA
```

Only mark a district complete when it supports gameplay.

---

# 16. PHASE 4 — WORLD STREAMING

Implement:

- spatial cells
- asset streaming
- NPC streaming
- vehicle streaming
- interior streaming
- LOD
- culling
- memory management

Persistent gameplay state must survive streaming.

---

# 17. PHASE 5 — CAMPAIGN PRODUCTION

Implement the complete 30-mission campaign.

Production order:

```text
Prologue
↓
Act I
↓
Act II
↓
Act III
↓
Act IV
↓
Act V
↓
Epilogue
```

Do not build all missions simultaneously.

Complete each mission through:

```text
Design
↓
Implementation
↓
Dialogue
↓
Assets
↓
Audio
↓
Cinematics
↓
Testing
↓
Polish
↓
CONTEXT.md update
```

---

# 18. MISSION PRODUCTION STANDARD

Every main mission should include:

### Design

- purpose
- prerequisites
- objectives
- optional objectives
- approaches
- failure states
- consequences

### Implementation

- mission script
- triggers
- NPCs
- vehicles
- dialogue
- checkpoints

### Presentation

- environment dressing
- VFX
- audio
- music
- UI
- cinematic elements

### QA

- completion test
- failure test
- alternate path test
- save/load test
- edge-case test

---

# 19. PHASE 6 — SIDE CONTENT

After the main campaign framework is stable, implement:

- Jonah arc
- Mara arc
- Nora arc
- Ward arc
- city stories
- random events
- optional activities

Side content must enrich the world.

Do not use repetitive filler missions such as:

```text
Drive here.
Kill 5 guys.
Drive back.
Collect $500.
Repeat.
```

unless the mission has additional narrative or systemic purpose.

---

# 20. PHASE 7 — WORLD SIMULATION

Add deeper simulation.

### NPCs

- schedules
- jobs
- destinations
- social behavior
- reactions

### Traffic

- routes
- traffic density
- congestion
- accidents
- emergency vehicles

### Police

- patrols
- dispatch
- response
- searches

### Economy

- stores
- vehicle prices
- repairs
- property
- mission income

### Factions

- territory
- activity
- hostility
- reputation

---

# 21. PHASE 7 — RANDOM EVENTS

Implement dynamic events such as:

- robbery
- vehicle theft
- police pursuit
- street argument
- accident
- faction confrontation
- stranded driver
- suspicious exchange
- emergency response
- witness encounter

Events should use the existing systems rather than being isolated scripted animations.

---

# 22. PHASE 8 — VISUAL POLISH

Once gameplay and content are stable:

Improve:

- lighting
- materials
- textures
- character models
- vehicle models
- animation
- VFX
- weather
- reflections
- environmental clutter
- vegetation
- landmarks

Do not spend weeks polishing an area that will later be redesigned.

---

# 23. PHASE 8 — AUDIO POLISH

Implement:

- dynamic music
- district ambience
- vehicle audio
- weapon audio
- footsteps
- dialogue
- environmental sounds
- police radio
- phone sounds
- UI feedback

Audio should respond to gameplay state.

---

# 24. PHASE 9 — OPTIMIZATION

Optimization happens throughout development, but this phase performs full optimization.

Profile:

```text
CPU
GPU
RAM
VRAM/browser graphics memory
draw calls
texture memory
JavaScript execution
asset loading
garbage collection
NPC simulation
traffic simulation
physics
audio
```

---

# 25. OPTIMIZATION PRIORITY

When performance is poor:

```text
1. identify bottleneck
2. measure
3. fix bottleneck
4. measure again
5. preserve gameplay
6. only then reduce visual quality
```

Do not randomly remove features.

---

# 26. PERFORMANCE FALLBACKS

The game should gracefully reduce:

- NPC density
- traffic density
- draw distance
- shadow quality
- particle count
- texture resolution
- reflection quality
- vegetation density

before disabling core gameplay.

---

# 27. PHASE 10 — QA

Create test passes for:

### Gameplay

- movement
- combat
- driving
- missions
- interactions

### World

- streaming
- collision
- interiors
- NPCs
- traffic

### Persistence

- save
- load
- autosave
- checkpoints
- mission recovery

### UI

- HUD
- map
- phone
- menus
- accessibility

### Performance

- low-end desktop
- mid-range desktop
- high-end desktop

---

# 28. BUG SEVERITY

Use:

### P0 — Critical

Game cannot launch or progress.

Examples:

- crash on startup
- corrupted save
- campaign impossible to complete

### P1 — Major

Major gameplay system broken.

### P2 — Moderate

Significant bug but workaround exists.

### P3 — Minor

Cosmetic or low-impact issue.

### P4 — Polish

Small visual/audio imperfections.

Fix in this order:

```text
P0 → P1 → P2 → P3 → P4
```

---

# 29. DEVELOPMENT CHECKPOINTS

Create explicit milestones.

## Milestone A — Engine Boot

```text
[ ] application launches
[ ] renderer works
[ ] input works
[ ] debug tools work
```

## Milestone B — Playable Character

```text
[ ] movement
[ ] camera
[ ] interaction
[ ] health
[ ] death
```

## Milestone C — Playable World

```text
[ ] environment
[ ] collision
[ ] NPCs
[ ] traffic
```

## Milestone D — Combat

```text
[ ] weapons
[ ] damage
[ ] enemies
[ ] death
```

## Milestone E — Driving

```text
[ ] vehicle entry
[ ] vehicle control
[ ] collision
[ ] vehicle exit
```

## Milestone F — Mission

```text
[ ] mission start
[ ] objectives
[ ] dialogue
[ ] combat/driving
[ ] completion
[ ] failure
```

## Milestone G — Vertical Slice

```text
[ ] 15–30 minute playable experience
[ ] save/load
[ ] police
[ ] economy
[ ] weather
[ ] audio
[ ] polished environment
```

## Milestone H — Full Game

```text
[ ] 30 main missions
[ ] side missions
[ ] complete world
[ ] endings
[ ] post-game state
```

---

# 30. AI DEVELOPMENT WORKFLOW

AI agents are expected to perform implementation work directly.

When given a task:

```text
Read project documentation
↓
Read CONTEXT.md
↓
Inspect existing implementation
↓
Understand dependencies
↓
Plan changes
↓
Implement
↓
Test
↓
Fix regressions
↓
Update CONTEXT.md
↓
Report completed work
```

Never assume the repository is empty.

Never rewrite working systems unnecessarily.

---

# 31. AI HANDOFF RULE

The project must be designed so that:

> **Any competent AI can take over development after reading the repository.**

The AI must NOT depend on:

- previous chat messages
- hidden context
- memory of previous conversations
- assumptions about what another AI intended

The repository itself must contain the project state.

---

# 32. CONTEXT.MD — LIVING PROJECT MEMORY

Create:

```text
CONTEXT.md
```

at the project root.

This is one of the most important files in the repository.

It is the project's **living memory**.

---

# 33. CONTEXT.MD PURPOSE

`CONTEXT.md` must answer:

> "If a completely different AI opened this repository right now, what would it need to know to continue development correctly?"

It must describe:

- what the game is
- what has been built
- what is currently being built
- what works
- what does not work
- known bugs
- architecture
- important files
- recent changes
- current milestone
- next tasks
- unfinished systems
- design decisions
- rejected approaches
- technical limitations
- temporary hacks
- asset status
- mission status
- testing status

---

# 34. CONTEXT.MD STRUCTURE

The AI must maintain this structure:

```markdown
# NEON ASHES — PROJECT CONTEXT

## 1. PROJECT IDENTITY

## 2. CURRENT DEVELOPMENT STATUS

## 3. CURRENT MILESTONE

## 4. WHAT IS CURRENTLY WORKING

## 5. WHAT IS CURRENTLY BROKEN

## 6. WHAT IS CURRENTLY BEING IMPLEMENTED

## 7. IMMEDIATE NEXT TASKS

## 8. RECENT CHANGES

## 9. ARCHITECTURE

## 10. IMPORTANT FILES

## 11. GAME SYSTEM STATUS

## 12. WORLD STATUS

## 13. MISSION STATUS

## 14. CHARACTER STATUS

## 15. ASSET STATUS

## 16. AUDIO STATUS

## 17. UI STATUS

## 18. SAVE / PERSISTENCE STATUS

## 19. KNOWN BUGS

## 20. TEMPORARY HACKS / TECH DEBT

## 21. IMPORTANT DESIGN DECISIONS

## 22. REJECTED APPROACHES

## 23. PERFORMANCE STATUS

## 24. TESTING STATUS

## 25. CHANGE LOG

## 26. HANDOFF NOTES
```

---

# 35. CONTEXT.MD — CURRENT STATUS

This section must always reflect reality.

Example:

```markdown
## CURRENT DEVELOPMENT STATUS

Overall completion: 18%

Current milestone:
Vertical Slice — Mission M01

Current focus:
Vehicle + mission integration

Last completed:

- player controller
- basic NPC system
- vehicle controller
- basic combat

Currently broken:

- vehicle passenger exit
- mission checkpoint reload

Next:

1. fix passenger exit
2. implement mission checkpoint persistence
3. test M01 start-to-finish
```

Do not claim something is complete if it is not.

---

# 36. CONTEXT.MD — WORKING SYSTEMS

Use explicit status labels:

```text
[COMPLETE]
[PARTIAL]
[IN PROGRESS]
[BROKEN]
[NOT STARTED]
[BLOCKED]
```

Example:

```markdown
| System          | Status      |
| --------------- | ----------- |
| Player movement | COMPLETE    |
| Combat          | PARTIAL     |
| Vehicles        | COMPLETE    |
| Police          | IN PROGRESS |
| Save system     | PARTIAL     |
| Phone           | NOT STARTED |
```

---

# 37. CONTEXT.MD — RECENT CHANGES

Every meaningful development session should update:

```markdown
## RECENT CHANGES

### 2026-09-12

- Added vehicle enter/exit system.
- Added basic sedan physics.
- Added vehicle collision.
- Fixed player getting stuck after exiting vehicle.
- Added vehicle entity persistence.
```

Keep the most recent changes near the top.

---

# 38. CONTEXT.MD — IMPORTANT FILES

Maintain a map of the codebase.

Example:

```markdown
## IMPORTANT FILES

src/main.ts
→ application entry point

src/core/Game.ts
→ main game state and loop

src/player/Player.ts
→ player controller

src/vehicles/VehicleManager.ts
→ vehicle spawning and lifecycle

src/missions/MissionManager.ts
→ mission state machine

src/world/WorldStreamer.ts
→ world cell streaming

src/save/SaveManager.ts
→ save/load
```

When files move, update this section.

---

# 39. CONTEXT.MD — DESIGN DECISIONS

Record decisions that future AIs might otherwise accidentally reverse.

Example:

```markdown
## IMPORTANT DESIGN DECISIONS

- Game is desktop-browser-first.
- Three.js is used for rendering.
- World state is data-driven.
- Missions are data-driven.
- IndexedDB is used for persistence.
- No traditional RPG level system.
- UI must NOT use glassmorphism.
- Vespera City is fictional.
- NEON ASHES is original IP.
```

---

# 40. CONTEXT.MD — REJECTED APPROACHES

This section is extremely important.

Record approaches that were tried and intentionally abandoned.

Example:

```markdown
## REJECTED APPROACHES

### Giant monolithic world scene

Reason rejected:
Caused excessive memory usage and slow loading.

Replacement:
Cell-based world streaming.

### Hard-coded mission functions

Reason rejected:
Difficult to branch and maintain.

Replacement:
Data-driven mission system.
```

This prevents another AI from repeating the same mistakes.

---

# 41. CONTEXT.MD — TEMPORARY HACKS

Every temporary workaround must be documented.

Example:

```markdown
## TEMPORARY HACKS / TECH DEBT

- NPC navigation currently uses simplified pathing.
- Vehicle damage currently changes materials instead of deforming geometry.
- Placeholder dialogue audio is used for M04.
- World streaming currently unloads interiors manually.
```

Never hide hacks.

---

# 42. CONTEXT.MD — KNOWN BUGS

Use:

```markdown
## KNOWN BUGS

### BUG-001

Severity: P1
Area: Vehicles
Description:
Player occasionally falls through vehicle when exiting at high speed.

Status:
Investigating.

Last attempted fix:
Added exit-position validation.

Next attempt:
Add collision sweep before placing player.
```

---

# 43. CONTEXT.MD — HANDOFF NOTES

At the bottom:

```markdown
## HANDOFF NOTES

The next AI should:

1. Read MASTER_GAME_SPEC.md.
2. Read CONTEXT.md.
3. Read TECHNICAL_ARCHITECTURE.md.
4. Inspect the current source tree.
5. Verify the status claims in CONTEXT.md.
6. Continue from the current milestone.
7. Avoid rewriting working systems without reason.
8. Update CONTEXT.md after making changes.
```

---

# 44. CONTEXT.MD UPDATE FREQUENCY

Update `CONTEXT.md`:

### REQUIRED

After:

- implementing a major feature
- fixing a significant bug
- changing architecture
- adding/removing a system
- changing mission logic
- changing asset pipeline
- discovering an important limitation
- changing development priorities

### OPTIONAL

After tiny changes that do not affect project understanding.

---

# 45. AI MUST NEVER FABRICATE CONTEXT

The AI must distinguish:

```text
Known
Assumed
Planned
Unverified
```

Example:

```markdown
Vehicle physics:
Status: PARTIAL

Known:
Basic acceleration works.

Unverified:
High-speed collision behavior.

Planned:
Add vehicle damage model.
```

Never write:

> "Everything works."

unless it has actually been tested.

---

# 46. SESSION COMPLETION PROTOCOL

At the end of every substantial AI coding session:

```text
1. Run tests.
2. Inspect changed files.
3. Record what changed.
4. Record what remains.
5. Record new bugs.
6. Record decisions.
7. Update CONTEXT.md.
8. Update roadmap status if necessary.
9. Give a concise handoff summary.
```

---

# 47. AI HANDOFF FORMAT

When an AI reaches a context/token limit, it should leave a final handoff inside `CONTEXT.md`.

Example:

```markdown
## ACTIVE HANDOFF

Current task:
Implementing M03 — The Harbor.

Completed:

- mission trigger
- harbor environment
- dock NPCs
- vehicle objective

Remaining:

- combat encounter
- escape sequence
- mission completion
- checkpoint handling

Current blocker:
Police AI occasionally fails to enter vehicles.

Recommended next step:
Fix police vehicle pursuit before continuing M03.

Files currently being modified:

- src/missions/M03_TheHarbor.ts
- src/police/PoliceAI.ts
- src/vehicles/VehicleAI.ts
```

This means another AI can immediately continue.

---

# 48. MULTI-AI DEVELOPMENT RULE

Multiple AI systems may work on NEON ASHES.

Potential sequence:

```text
Gemini
↓
Claude
↓
GPT
↓
Gemini
↓
Claude
```

The identity of the AI does not matter.

The repository documentation is the source of truth.

Every AI must:

```text
READ
↓
UNDERSTAND
↓
VERIFY
↓
IMPLEMENT
↓
TEST
↓
DOCUMENT
```

---

# 49. SOURCE OF TRUTH HIERARCHY

When documents conflict, use this priority:

```text
1. Working tested code
2. CONTEXT.md current status
3. MASTER_GAME_SPEC.md
4. Specialized design documents
5. DEVELOPMENT_ROADMAP.md
6. AI assumptions
```

However, if working code violates a deliberate design requirement, document the discrepancy rather than silently accepting it.

---

# 50. NEVER RESET THE PROJECT

An AI must not:

- delete working systems to simplify implementation
- replace the entire architecture without justification
- rebuild everything from scratch
- discard existing assets
- remove features merely because they are difficult

unless explicitly instructed.

Prefer incremental modification.

---

# 51. NO FAKE COMPLETION

The AI must not claim:

```text
"implemented"
```

when it only created:

- placeholder UI
- mock data
- static screenshots
- fake buttons
- non-functional animations
- commented-out code
- hard-coded demonstrations

A feature is implemented only when it actually works in the running game.

---

# 52. NO DEMO-FIRST DEVELOPMENT

Do not optimize for screenshots.

The priority is:

```text
FUNCTIONALITY
>
SYSTEM INTEGRATION
>
CONTENT
>
POLISH
>
SCREENSHOT APPEAL
```

---

# 53. TEST AFTER EVERY MAJOR SYSTEM

After implementing a system:

```text
implement
↓
run
↓
test
↓
observe
↓
fix
↓
test again
↓
document
```

Do not stack ten untested systems and hope they work together.

---

# 54. SAFE CHANGE PRINCIPLE

Before modifying a major system:

1. inspect dependencies
2. understand current behavior
3. identify affected systems
4. make the smallest reasonable change
5. test dependent systems

---

# 55. CONTENT EXPANSION RULE

Do not expand content while the underlying system is unstable.

Example:

Do not create:

```text
20 police missions
```

until:

```text
police AI
wanted system
mission system
vehicle system
save system
```

are reliable.

---

# 56. FINAL PRODUCTION ORDER

The complete project should approximately follow:

```text
FOUNDATION
    ↓
PLAYER
    ↓
WORLD
    ↓
VEHICLES
    ↓
NPCs
    ↓
COMBAT
    ↓
POLICE
    ↓
MISSION ENGINE
    ↓
SAVE SYSTEM
    ↓
VERTICAL SLICE
    ↓
CORE SYSTEMS
    ↓
WORLD EXPANSION
    ↓
CAMPAIGN
    ↓
SIDE CONTENT
    ↓
WORLD SIMULATION
    ↓
ASSET POLISH
    ↓
AUDIO
    ↓
OPTIMIZATION
    ↓
QA
    ↓
RELEASE
```

---

# 57. DEFINITION OF DONE

NEON ASHES is not "done" because:

- the map exists
- the player can move
- a few cars drive around
- there are mission markers
- the UI looks polished

It is done when:

```text
The complete campaign is playable.
+
Missions work reliably.
+
The world is explorable.
+
Major systems interact correctly.
+
Save/load is reliable.
+
Characters have meaningful arcs.
+
Choices affect world state.
+
Side content works.
+
Performance is acceptable.
+
Critical bugs are resolved.
+
The game can be completed from beginning to end.
```

---

# 58. FINAL PRINCIPLE

The development roadmap exists to prevent the project from becoming:

> "A giant unfinished GTA-looking prototype."

The target is:

> **A smaller but genuinely playable open-world crime game with interconnected systems, a complete story, persistent world state, believable characters, and enough polish to feel like a real product.**

Build vertically.

Integrate systems.

Test constantly.

Document everything.

And keep `CONTEXT.md` accurate enough that another AI can take over the project **without needing the previous AI's memory.**

# GITHUB AUTO-SYNC REQUIREMENT

The AI must keep the GitHub repository synchronized with the local project throughout development. After every meaningful change — including feature implementations, bug fixes, asset additions/removals, documentation updates, configuration changes, and architectural changes — the AI should review the changed files, run appropriate tests or validation, update `CONTEXT.md`, and commit the resulting working state with a clear descriptive commit message. Push the commit to the configured GitHub repository after validation so GitHub remains an up-to-date backup and handoff point. Do not commit known broken or half-implemented work unless it is explicitly marked as `WIP` and documented in `CONTEXT.md`. Never overwrite or discard existing remote work blindly; pull/reconcile changes when necessary before pushing. The GitHub repository should always represent the latest verified state of the project so that if the current AI reaches its token/context limit, crashes, or is replaced by another AI, the next AI can clone/pull the repository and continue development from the latest `CONTEXT.md` and source code without losing progress.
