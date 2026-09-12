# NEON ASHES — TECHNICAL ARCHITECTURE

## 0. PURPOSE

This document defines the technical architecture for building **NEON ASHES** as a playable browser-based open-world action game.

The objective is not to create a visual mockup or a collection of fake buttons.

The objective is to create a functioning game with:

- A persistent open world
- Playable character movement
- Third-person camera
- Vehicles
- Driving
- Combat
- NPCs
- Police AI
- Missions
- Dialogue
- Interactions
- Economy
- Inventory
- Wanted system
- Day/night cycle
- Weather
- Save/load
- Phone
- Map
- Progression
- Branching mission states
- Persistent world state

The architecture must be designed so that the initial playable build can be expanded into the full game without requiring the entire codebase to be rewritten.

---

# 1. TECHNOLOGY TARGET

## 1.1 Primary Platform

Target:

> Desktop web browser

Primary browsers:

- Chrome
- Edge
- Firefox
- Safari where practical

Primary development target should be Chromium-based browsers first.

---

# 2. TECHNOLOGY STACK

Preferred stack:

```text
HTML5
CSS3
JavaScript / TypeScript
WebGL / WebGPU
Three.js or equivalent 3D rendering framework
IndexedDB
Web Audio API
Pointer Lock API
Gamepad API
```

If the environment supports TypeScript, use TypeScript.

If the environment only supports JavaScript, use modern ES modules.

---

# 3. CORE ARCHITECTURE

Use a modular architecture.

Do NOT place the entire game inside one massive JavaScript file.

Recommended structure:

```text
src/
├── main.ts
│
├── core/
│   ├── Game.ts
│   ├── GameLoop.ts
│   ├── GameState.ts
│   ├── EventBus.ts
│   ├── TimeSystem.ts
│   ├── SaveSystem.ts
│   ├── InputManager.ts
│   └── DebugSystem.ts
│
├── rendering/
│   ├── Renderer.ts
│   ├── Camera.ts
│   ├── Lighting.ts
│   ├── WorldRenderer.ts
│   └── PostProcessing.ts
│
├── player/
│   ├── Player.ts
│   ├── PlayerController.ts
│   ├── PlayerCombat.ts
│   ├── PlayerInventory.ts
│   └── PlayerStats.ts
│
├── vehicles/
│   ├── Vehicle.ts
│   ├── VehicleController.ts
│   ├── VehiclePhysics.ts
│   ├── VehicleManager.ts
│   └── TrafficSystem.ts
│
├── world/
│   ├── World.ts
│   ├── District.ts
│   ├── WorldState.ts
│   ├── InteriorManager.ts
│   ├── WeatherSystem.ts
│   └── StreamingSystem.ts
│
├── ai/
│   ├── NPC.ts
│   ├── NPCManager.ts
│   ├── NPCBrain.ts
│   ├── PoliceAI.ts
│   └── Navigation.ts
│
├── missions/
│   ├── MissionManager.ts
│   ├── Mission.ts
│   ├── Objective.ts
│   ├── MissionState.ts
│   └── MissionRegistry.ts
│
├── dialogue/
│   ├── DialogueManager.ts
│   ├── DialogueNode.ts
│   └── CharacterKnowledge.ts
│
├── economy/
│   ├── EconomySystem.ts
│   ├── ShopSystem.ts
│   └── PropertySystem.ts
│
├── police/
│   ├── WantedSystem.ts
│   ├── WitnessSystem.ts
│   └── SearchSystem.ts
│
├── phone/
│   ├── PhoneSystem.ts
│   ├── Contacts.ts
│   └── Messages.ts
│
├── ui/
│   ├── HUD.ts
│   ├── Map.ts
│   ├── PhoneUI.ts
│   ├── MissionUI.ts
│   └── MenuUI.ts
│
├── audio/
│   ├── AudioManager.ts
│   ├── MusicSystem.ts
│   └── SFXSystem.ts
│
└── data/
    ├── characters/
    ├── missions/
    ├── vehicles/
    ├── weapons/
    ├── districts/
    └── shops/
```

---

# 4. GAME BOOT SEQUENCE

The application should boot in this order:

```text
Browser
↓
HTML shell
↓
JavaScript entry point
↓
Asset manifest
↓
Renderer initialization
↓
Input initialization
↓
Audio initialization
↓
World initialization
↓
Save data initialization
↓
Game state initialization
↓
Player initialization
↓
Mission system initialization
↓
NPC/traffic systems
↓
HUD
↓
Gameplay
```

Do not block the browser with a giant synchronous loading operation.

Use asynchronous asset loading.

---

# 5. GAME LOOP

The game should use a centralized update loop.

Conceptual structure:

```js
function gameLoop(timestamp) {
    const deltaTime = calculateDeltaTime(timestamp);

    input.update();

    game.update(deltaTime);

    renderer.render(game);

    requestAnimationFrame(gameLoop);
}
```

---

# 6. FIXED VS VARIABLE TIMESTEP

Physics-sensitive systems should preferably use a fixed timestep.

Example:

```text
Physics:
60 Hz target

Gameplay:
variable timestep

Rendering:
browser refresh rate
```

If full fixed-step physics is too expensive for the browser:

Use:

```text
fixed physics accumulator
+
variable rendering
```

This prevents vehicle behavior from becoming wildly different at different frame rates.

---

# 7. TARGET PERFORMANCE

Target:

> 60 FPS on a reasonably modern desktop.

Acceptable fallback:

> 30 FPS on weaker hardware.

The game should never intentionally waste GPU resources to create visual effects that do not meaningfully improve gameplay.

---

# 8. PERFORMANCE PRIORITIES

Priority order:

```text
Gameplay responsiveness
>
Stable frame rate
>
World simulation
>
Visual effects
>
Decorative detail
```

A simple playable world at 60 FPS is preferable to a beautiful world running at 15 FPS.

---

# 9. RENDERING ARCHITECTURE

Use a 3D renderer capable of:

- Dynamic lighting
- Shadows
- Fog
- Instancing
- Frustum culling
- Texture loading
- Animation
- LOD
- Post-processing

Three.js is an acceptable implementation choice.

---

# 10. WEBGPU SUPPORT

If WebGPU is available:

```text
WebGPU → preferred rendering path
```

Otherwise:

```text
WebGL2 → fallback
```

Do not make the game completely unusable when WebGPU is unavailable.

---

# 11. WORLD REPRESENTATION

The city should not be one enormous high-detail scene loaded simultaneously.

Divide the city into streaming regions.

Example:

```text
Vespera City
├── Central Vesper
├── Old Harbor
├── Eastline
├── Redwater
├── Meridian
├── North Heights
├── Silver Coast
├── Southside
├── Industrial Belt
└── Outer County
```

Each district can contain multiple streaming cells.

---

# 12. WORLD CELL SYSTEM

Example:

```text
District
    ↓
Grid
    ↓
World Cell
    ↓
Buildings
Roads
NPCs
Vehicles
Props
Interiors
Mission locations
```

Only nearby cells should be fully simulated.

---

# 13. WORLD STREAMING

Use distance-based activation.

Example:

```text
0–150m:
Full simulation

150–400m:
Reduced simulation

400m+:
Minimal/no simulation
```

Exact distances should be configurable.

---

# 14. ENTITY LOD

Important entities:

```text
LOD 0
Full model + animation + AI

LOD 1
Simplified model + animation

LOD 2
Low-poly model

LOD 3
Impostor / simplified representation

LOD 4
Not rendered
```

Not every browser build needs every LOD level.

---

# 15. NPC SIMULATION LEVELS

NPCs should have simulation tiers.

## Tier 1

Near player:

- Full AI
- Animation
- Collision
- Navigation
- Reactions

## Tier 2

Moderately distant:

- Simplified movement
- Reduced AI
- Basic animation

## Tier 3

Far away:

- Statistical simulation
- No expensive pathfinding
- No detailed animation

---

# 16. ENTITY MANAGEMENT

Use an entity manager.

Conceptual:

```js
EntityManager
├── player
├── NPCs
├── vehicles
├── police
├── mission entities
├── interactables
└── world objects
```

Every entity should have:

```text
id
type
position
rotation
active
visible
update()
destroy()
```

---

# 17. EVENT BUS

Use an event-driven architecture for cross-system communication.

Example events:

```text
PLAYER_ENTERED_VEHICLE
PLAYER_EXITED_VEHICLE
WEAPON_FIRED
NPC_DIED
POLICE_ALERTED
MISSION_STARTED
MISSION_OBJECTIVE_COMPLETE
MISSION_FAILED
MISSION_COMPLETE
ITEM_PURCHASED
PLAYER_ARRESTED
PLAYER_DIED
WEATHER_CHANGED
TIME_CHANGED
DIALOGUE_STARTED
DIALOGUE_ENDED
```

Example:

```js
eventBus.emit("MISSION_COMPLETE", {
    missionId: "M05"
});
```

Systems can subscribe without tightly coupling everything together.

---

# 18. GAME STATE

Global game state should be explicit.

Example:

```js
const gameState = {
    currentMode: "gameplay",

    player: {},

    world: {},

    missions: {},

    characters: {},

    economy: {},

    police: {},

    time: {},

    weather: {},

    settings: {}
};
```

---

# 19. GAME MODES

Supported modes:

```text
BOOT
MAIN_MENU
LOADING
GAMEPLAY
PAUSED
DIALOGUE
MAP
PHONE
INVENTORY
SHOP
MISSION_COMPLETE
GAME_OVER
SAVE_MENU
SETTINGS
```

The game should never rely on random UI state to determine whether gameplay is active.

---

# 20. INPUT SYSTEM

Create one centralized input manager.

Supported:

- Keyboard
- Mouse
- Controller

Example bindings:

```text
WASD → movement
Mouse → camera
Left Mouse → fire
Right Mouse → aim
E → interact / enter vehicle
F → contextual action
Shift → sprint
Space → jump
R → reload
Esc → pause
M → map
Tab → phone
```

Bindings must be configurable.

---

# 21. CONTROLLER SUPPORT

Use the Gamepad API where available.

Support:

- Left stick movement
- Right stick camera
- Triggers
- Shoulder buttons
- Face buttons
- D-pad
- Start/menu

Do not hard-code controller-specific vendor names.

---

# 22. PLAYER CONTROLLER

Player movement states:

```text
IDLE
WALK
RUN
SPRINT
JUMP
FALL
CLIMB
INTERACT
AIM
SHOOT
RELOAD
MELEE
IN_VEHICLE
DEAD
```

Only valid transitions should be allowed.

---

# 23. PLAYER CONTROLLER ARCHITECTURE

Separate:

```text
Input
↓
Player Controller
↓
Movement State
↓
Physics
↓
Animation
```

Do not directly move the character from keyboard event handlers.

---

# 24. CAMERA

Third-person camera should support:

- Follow
- Collision avoidance
- Aim mode
- Vehicle camera
- Interior camera
- Mission cinematic camera
- Dialogue camera

Camera should smoothly interpolate rather than snap unless explicitly required.

---

# 25. CAMERA COLLISION

Camera raycast:

```text
Player
↓
Camera desired position
```

If an obstacle blocks the line:

```text
Move camera closer
```

Prevent the camera from entering walls.

---

# 26. VEHICLE ARCHITECTURE

Vehicle system consists of:

```text
VehicleManager
↓
Vehicle
├── Physics
├── Engine
├── Steering
├── Brakes
├── Damage
├── Fuel
├── Occupants
├── Audio
└── Visual state
```

---

# 27. VEHICLE DATA

Example:

```js
const vehicleData = {
    id: "sedan_01",

    class: "sedan",

    mass: 1450,

    acceleration: 7.2,

    maxSpeed: 48,

    braking: 8.5,

    steering: 0.65,

    traction: 0.82,

    durability: 100
};
```

Numbers should be tunable.

---

# 28. VEHICLE PHYSICS

Do not attempt to create an ultra-realistic simulator.

Target:

> believable arcade-style driving.

Important behaviors:

- Acceleration
- Braking
- Steering
- Weight transfer
- Traction
- Collision response
- Handbrake
- Reverse
- Surface friction

---

# 29. VEHICLE DAMAGE

Vehicle damage should include:

```text
Engine
Body
Windows
Tires
```

Damage affects:

- Performance
- Appearance
- Driving behavior

Do not require a complex deformation engine in the first prototype.

---

# 30. TRAFFIC SYSTEM

Traffic should use road nodes.

Concept:

```text
Road Graph
↓
Lane Nodes
↓
Traffic Agent
↓
Target Node
↓
Vehicle movement
```

Traffic agents should understand:

- Traffic lights
- Intersections
- Lane direction
- Basic avoidance
- Stops
- Turns

---

# 31. TRAFFIC SPAWNING

Do not randomly spawn cars directly beside the player.

Use spawn points outside the player's immediate view.

Despawn distant traffic.

Maintain configurable density:

```text
Low
Medium
High
```

---

# 32. NPC AI ARCHITECTURE

Each NPC should have:

```text
Perception
↓
Decision
↓
Action
```

Example:

```text
Perception:
heard gunshot

Decision:
flee

Action:
run toward safe location
```

---

# 33. NPC STATE MACHINE

Example:

```text
IDLE
↓
WALKING
↓
NOTICE_EVENT
↓
INVESTIGATE
↓
FLEE / CALL_POLICE
↓
SAFE
```

Other states:

```text
WORK
SHOP
TALK
DRIVE
PANIC
INJURED
DEAD
```

---

# 34. NPC PERCEPTION

NPC perception should consider:

- Distance
- Field of view
- Obstacles
- Noise
- Lighting where practical
- Known threat
- Police presence

Do not make NPCs magically aware of events behind walls.

---

# 35. POLICE AI

Police should use escalating behavior.

```text
UNAWARE
↓
SUSPICIOUS
↓
SEARCHING
↓
PURSUIT
↓
COMBAT
↓
SEARCH
↓
CLEAR
```

---

# 36. WANTED SYSTEM

Use a configurable threat level.

Example:

```text
0 — Normal

1 — Suspicion

2 — Active pursuit

3 — Multiple police units

4 — Roadblocks / tactical response

5 — Major citywide response
```

Do not instantly reach maximum wanted level for every minor offense.

---

# 37. WITNESS SYSTEM

A crime becomes known through:

```text
NPC sees crime
OR
camera sees crime
OR
police sees crime
```

Then:

```text
Witness
↓
reports event
↓
police receives information
↓
search begins
```

This creates believable wanted behavior.

---

# 38. MISSION ENGINE

Missions must be data-driven.

Do not hard-code every mission into one giant conditional statement.

Example:

```js
{
    id: "M05",

    title: "The Journalist",

    prerequisites: [
        "M04_COMPLETE"
    ],

    objectives: [
        {
            type: "GO_TO",
            target: "mara_office"
        },
        {
            type: "TALK",
            target: "mara"
        },
        {
            type: "FOLLOW",
            target: "mara"
        }
    ],

    rewards: {
        money: 500
    }
}
```

---

# 39. OBJECTIVE TYPES

Support:

```text
GO_TO
TALK
FOLLOW
ESCORT
DRIVE_TO
STEAL
DELIVER
COLLECT
INVESTIGATE
PHOTOGRAPH
SURVIVE
ESCAPE
LOSE_POLICE
FIGHT
PROTECT
SEARCH
INTERACT
WAIT
DIALOGUE_CHOICE
```

---

# 40. MISSION BRANCHING

Missions can contain branches.

Example:

```text
Player enters building
        |
        ├── stealth
        |
        ├── social manipulation
        |
        └── force
```

Branches can converge afterward.

Do not require every branch to produce an entirely separate campaign.

---

# 41. WORLD STATE FLAGS

Use persistent flags.

Example:

```js
worldFlags = {
    lena_found_message: true,
    mara_trusted: true,
    ward_warned: false,
    jonah_saved: true,
    drake_alive: true
};
```

These flags affect later missions.

---

# 42. DIALOGUE SYSTEM

Dialogue should be data-driven.

Example:

```js
{
    speaker: "mara",

    lines: [
        {
            text: "You shouldn't have come here.",
            condition: "mara_trust < 20"
        }
    ]
}
```

Dialogue conditions can depend on:

- Mission progress
- Relationship
- World flags
- Previous choices
- Time
- Location

---

# 43. CHARACTER KNOWLEDGE

Characters must have their own knowledge state.

Never assume:

```text
if player knows X:
    every NPC knows X
```

Instead:

```text
Kaleb knows X
Mara suspects X
Ward knows Y
Jonah knows nothing
```

This prevents nonsensical conversations.

---

# 44. ECONOMY SYSTEM

Economy should be centralized.

Example:

```js
EconomySystem.buy(item, price)
EconomySystem.sell(item, value)
EconomySystem.addMoney(amount)
EconomySystem.removeMoney(amount)
```

Never modify player money randomly from unrelated systems.

---

# 45. INVENTORY

Inventory should support:

```text
Weapons
Ammo
Mission items
Collectibles
Consumables
Keys
Documents
```

Mission-critical items should be protected from accidental deletion.

---

# 46. WEAPON SYSTEM

Weapon architecture:

```text
WeaponManager
↓
Weapon
├── ammo
├── damage
├── fire rate
├── recoil
├── spread
├── reload
├── audio
└── animations
```

Weapon data should be configuration-driven.

---

# 47. SAVE SYSTEM

Browser saves should use:

> IndexedDB

Do not rely on localStorage for the complete game save.

Save data can become large.

---

# 48. SAVE DATA STRUCTURE

Example:

```js
{
    version: 1,

    timestamp: 0,

    player: {
        position: {},
        health: 100,
        money: 5000,
        inventory: {}
    },

    missions: {},

    worldFlags: {},

    relationships: {},

    vehicles: {},

    properties: {},

    settings: {}
}
```

---

# 49. SAVE VERSIONING

Save files must contain a version.

Example:

```text
version: 1
```

If the game changes its save schema:

```text
v1
↓
migration
↓
v2
```

Do not invalidate old saves unnecessarily.

---

# 50. AUTOSAVE

Autosave after:

- Mission completion
- Major story decisions
- Safehouse entry
- Purchase
- Major character outcome
- Important world-state change

Do not autosave every frame.

---

# 51. CHECKPOINTS

Mission checkpoints should be stored separately from full saves.

If a player dies during a mission:

```text
Restore mission checkpoint
```

rather than forcing the player to replay the entire mission.

---

# 52. TIME SYSTEM

Use an accelerated in-game clock.

Example:

```text
Real time:
1 minute

Game time:
5–10 minutes
```

Exact scale should be configurable.

The system must expose:

```js
gameTime.hour
gameTime.minute
gameTime.day
```

---

# 53. DAY/NIGHT SYSTEM

Lighting should change based on game time.

States:

```text
DAWN
DAY
DUSK
NIGHT
```

Different NPC routines should respond to time.

---

# 54. WEATHER SYSTEM

Weather states:

```text
CLEAR
CLOUDY
OVERCAST
LIGHT_RAIN
HEAVY_RAIN
STORM
FOG
```

Weather affects:

- Lighting
- Reflections
- Traffic behavior
- NPC behavior
- Audio
- Road traction where practical

---

# 55. AUDIO ARCHITECTURE

Use a centralized audio manager.

Categories:

```text
Music
SFX
Dialogue
Ambient
Vehicle
UI
Weather
Police
Weapons
```

Every category should have independent volume settings.

---

# 56. MUSIC SYSTEM

Music should respond to gameplay state.

Examples:

```text
Exploration
Combat
Police chase
Mission tension
Major story event
```

Transitions should be smooth.

---

# 57. PHONE SYSTEM

The phone should be implemented as a real game subsystem.

Features:

- Contacts
- Messages
- Calls
- Map
- Mission notifications
- Photos
- Evidence
- Settings

Do not implement the phone as a static screenshot.

---

# 58. MAP SYSTEM

Map must use actual world coordinates.

Features:

- Player location
- Mission markers
- Safehouses
- Shops
- Garages
- Important locations
- Custom waypoint

Waypoint system:

```text
Map target
↓
world coordinates
↓
navigation route
↓
HUD guidance
```

---

# 59. NAVIGATION

For initial implementation:

Use road-node navigation.

Later:

Implement:

- Pedestrian paths
- Vehicle routes
- Interior navigation
- Dynamic route recalculation

---

# 60. INTERIOR SYSTEM

Interiors should be modular.

Example:

```text
Building
├── Exterior
├── Entrance
├── Interior scene
├── Interaction points
└── Exit
```

Not every building needs a unique interior.

Prioritize:

- Mission locations
- Shops
- Safehouses
- Police stations
- Important character locations

---

# 61. UI ARCHITECTURE

UI must be separate from gameplay logic.

Bad:

```js
if (buttonClicked) {
    player.money -= 500;
}
```

Better:

```text
UI
↓
Game command
↓
EconomySystem
↓
Game state
↓
UI update
```

---

# 62. UI VISUAL DIRECTION

## ABSOLUTE REQUIREMENT

**NO GLASSMORPHISM.**

Do not use:

- Giant translucent cards
- Blurred glass panels
- Floating glass rectangles
- Excessive transparency
- "AI dashboard" aesthetics
- Frosted-glass HUD
- Excessive gradient cards

The game should look like a premium actual game.

Preferred:

- Solid dark surfaces
- Strong typography
- Thin borders
- Subtle shadows
- Compact panels
- Clear icons
- Restrained animation
- Strong contrast
- Contextual UI

---

# 63. HUD

HUD should remain minimal during normal exploration.

Possible elements:

```text
Health
Armor
Ammo
Wanted level
Mini-map
Current objective
```

Hide unnecessary elements automatically.

---

# 64. DEBUG SYSTEM

Development builds must have a debug overlay.

Toggle:

```text
F3
```

Show:

```text
FPS
Frame time
Draw calls
Triangles
Active NPCs
Active vehicles
Memory estimates where available
Current district
Current world cell
Mission ID
Player coordinates
Wanted level
Game time
Weather
```

---

# 65. DEBUG TELEPORT

Developer-only command:

```text
teleport district
teleport mission location
teleport coordinates
```

Never expose this in the normal player build.

---

# 66. DEBUG MISSION CONTROLS

Developer mode should support:

```text
Start mission
Restart mission
Complete objective
Skip objective
Reset mission
Set world flag
Set relationship value
Set wanted level
Give money
Spawn vehicle
Spawn NPC
```

This dramatically improves development speed.

---

# 67. ERROR HANDLING

The game should fail gracefully.

Examples:

If an asset fails:

```text
Log error
Use fallback asset
Continue where possible
```

If an NPC fails:

```text
Remove invalid NPC
Do not crash entire game
```

If a mission reference is missing:

```text
Log mission error
Prevent impossible progression
Provide debug warning
```

---

# 68. LOGGING

Use development logging categories.

Example:

```text
[GAME]
[WORLD]
[MISSION]
[AI]
[PLAYER]
[VEHICLE]
[AUDIO]
[SAVE]
[UI]
[ERROR]
```

Disable excessive logs in production.

---

# 69. ASSET MANAGEMENT

Use an asset manifest.

Example:

```js
{
    models: {},
    textures: {},
    audio: {},
    animations: {}
}
```

Assets should load asynchronously.

---

# 70. ASSET FALLBACKS

Every critical asset should have a fallback.

Example:

```text
Missing character model
↓
Generic humanoid placeholder
```

This prevents the game from completely breaking because of one missing file.

---

# 71. PROCEDURAL CONTENT

Procedural generation may be used for:

- Traffic
- Pedestrians
- Props
- Minor buildings
- Random events
- Ambient dialogue

Do not procedurally generate critical story scenes without deterministic seeds.

---

# 72. RANDOM EVENTS

Random events should be deterministic enough to avoid absurd repetition.

Use:

```text
Event cooldown
+
District weighting
+
Time weighting
+
Mission state
```

Example:

```text
Harbor robbery
More likely:
18:00–02:00
Old Harbor
```

---

# 73. RESOURCE MANAGEMENT

Browser memory is limited.

Unload:

- Distant textures
- Distant models
- Inactive audio
- Unused interiors
- Distant NPC entities

Do not keep every asset permanently in memory.

---

# 74. TEXTURE MANAGEMENT

Prefer compressed/optimized textures.

Use appropriate resolutions:

```text
Hero assets:
2048–4096 where justified

Normal assets:
1024–2048

Minor props:
256–1024
```

Do not use 4K textures for trash cans.

---

# 75. MODEL OPTIMIZATION

Use:

- Instancing
- Shared materials
- LOD
- Merged static geometry
- Occlusion where practical

Avoid thousands of unique draw calls for identical objects.

---

# 76. COLLISION ARCHITECTURE

Use simplified collision meshes.

Do not use detailed visual meshes for physics collision.

Example:

```text
Building visual mesh
+
Building collision box
```

---

# 77. PHYSICS PRIORITY

Physics should prioritize:

1. Player
2. Current vehicle
3. Nearby NPCs
4. Nearby vehicles
5. Mission objects

Distant entities can use simplified movement.

---

# 78. INTERACTION SYSTEM

Use contextual interaction prompts.

Example:

```text
[E] Enter vehicle
[E] Talk
[E] Open door
[E] Inspect
[E] Pick up
```

The interaction system should detect the nearest valid interaction.

---

# 79. INTERACTION DATA

Example:

```js
{
    type: "vehicle_entry",

    prompt: "Enter",

    distance: 2.2,

    action: () => {
        vehicle.enter(player);
    }
}
```

---

# 80. QUEST/MISSION PERSISTENCE

Mission state must survive:

- Save
- Load
- Death
- Reload
- Browser refresh

Example:

```text
NOT_STARTED
ACTIVE
CHECKPOINT
FAILED
COMPLETED
ABANDONED
```

---

# 81. GLOBAL WORLD FLAGS

Use a centralized world-state manager.

Example:

```js
worldState.set("warehouse_burned", true);

worldState.get("warehouse_burned");
```

Avoid scattering global booleans across unrelated scripts.

---

# 82. DATA-DRIVEN DESIGN

Whenever possible, content should be data rather than code.

Prefer:

```text
mission.json
character.json
vehicle.json
weapon.json
district.json
dialogue.json
```

over:

```text
mission01.js
mission02.js
mission03.js
```

Code should define systems.

Data should define content.

---

# 83. CONTENT PIPELINE

Recommended flow:

```text
Story Bible
↓
Character Bible
↓
Mission Design
↓
Structured JSON/TS data
↓
Mission Manager
↓
Gameplay
```

This keeps narrative design separate from implementation.

---

# 84. TESTING ARCHITECTURE

Testing should include:

## Unit tests

For:

- Economy
- Save/load
- Mission state
- Relationship calculations
- Wanted system
- Inventory

## Integration tests

For:

- Mission + NPC
- Mission + police
- Mission + vehicles
- Save + world state

## Gameplay tests

Manual testing of:

- Driving
- Shooting
- Mission progression
- Death
- Save/load
- UI
- Map
- Phone

---

# 85. SAVE/LOAD TEST

Mandatory test:

```text
Start game
↓
Complete mission
↓
Change relationship
↓
Buy vehicle
↓
Change world state
↓
Save
↓
Reload browser
↓
Load
↓
Verify everything
```

No critical progression may disappear.

---

# 86. MISSION FAILURE TEST

Every mission must be tested for:

```text
Player death
Vehicle destroyed
Target dies
Player leaves mission area
Player waits too long
Player reloads
Player changes vehicle
Player triggers wanted level
```

The mission must either recover or fail cleanly.

---

# 87. PERFORMANCE TESTING

Test at:

```text
Low-end desktop
Mid-range desktop
High-end desktop
```

Measure:

- FPS
- Frame time
- Memory
- Initial load
- World streaming
- Mission transitions

---

# 88. NETWORK REQUIREMENT

The core game should NOT require a server.

Primary gameplay should be:

> Local single-player.

This means:

- No mandatory account
- No multiplayer backend
- No server-dependent save
- No network requirement after assets are loaded where deployment permits

---

# 89. SECURITY

Do not treat browser storage as secure.

Game save data is client-side.

Do not store:

- Passwords
- API secrets
- Private credentials

inside the game.

---

# 90. CHEAT RESISTANCE

This is a single-player browser game.

Client-side manipulation is acceptable from a security perspective.

Do not waste development time attempting to make the game impossible to modify.

Focus on gameplay.

---

# 91. ACCESSIBILITY

Support:

- Adjustable text size where practical
- Remappable controls
- Subtitle toggle
- Subtitle background
- Volume controls
- Reduced camera shake
- Reduced flashing effects
- Color-independent UI indicators

Important gameplay information must not depend solely on color.

---

# 92. RESPONSIVE UI

Primary target:

> 16:9 desktop monitor.

Also support:

- 16:10
- Ultrawide
- Windowed mode

HUD should adapt rather than overlap.

---

# 93. LOADING SCREENS

Loading screens should show:

- Current district
- Brief gameplay tips
- Story hints
- Controls

Do not create a fake loading bar that does not represent actual loading.

If progress is unknown, use an indeterminate loading animation instead.

---

# 94. BOOT ERROR SCREEN

If the game cannot initialize:

Display:

```text
NEON ASHES

Unable to initialize the game.

Possible causes:
- WebGL unavailable
- Browser limitation
- Asset loading failure
- Storage failure

Technical details:
[error]

Retry
```

Do not leave the user staring at a blank screen.

---

# 95. DEVELOPMENT PHASES

## PHASE 1 — TECHNICAL PROTOTYPE

Build:

- Renderer
- Player
- Camera
- One district
- Basic NPC
- One vehicle
- Basic driving
- Basic interaction
- Basic HUD

Goal:

> Walk and drive around a functional 3D environment.

---

# 96. PHASE 2 — GAMEPLAY VERTICAL SLICE

Add:

- Combat
- Police
- Wanted system
- One complete mission
- Dialogue
- Mission objectives
- Save/load
- Basic phone
- Basic map

Goal:

> Produce one genuinely playable 15–30 minute experience.

---

# 97. PHASE 3 — WORLD FOUNDATION

Expand:

- Multiple districts
- Traffic
- Pedestrian AI
- Shops
- Interiors
- Safehouse
- Weather
- Day/night

Goal:

> Make the city feel alive.

---

# 98. PHASE 4 — CAMPAIGN

Implement:

- 30 main missions
- Character arcs
- Branching
- Side missions
- Random events
- Relationship states
- Multiple endings

---

# 99. PHASE 5 — POLISH

Add:

- Better animations
- Better lighting
- Improved audio
- Better UI
- More environmental detail
- More NPC variation
- Optimization

---

# 100. FEATURE PRIORITY

If development time becomes limited:

### Tier 1 — Mandatory

```text
Player
Camera
World
Vehicle
Driving
NPC
Combat
Mission system
Save/load
UI
```

### Tier 2

```text
Police
Traffic
Phone
Map
Economy
Interiors
Weather
```

### Tier 3

```text
Advanced NPC schedules
Complex faction simulation
Advanced vehicle damage
Large number of activities
Advanced procedural events
```

---

# 101. ANTI-PROTOTYPE RULE

The game must not pretend that a feature exists.

Bad:

```text
Phone app button
→ opens static fake screen
```

Good:

```text
Phone
→ contacts
→ select contact
→ call/message
→ state changes
→ character reacts
```

Bad:

```text
Mission marker
→ cinematic
→ "MISSION COMPLETE"
```

Good:

```text
Mission
→ actual objectives
→ player performs gameplay
→ world reacts
→ mission state updates
→ rewards
→ persistent consequences
```

---

# 102. ANTI-MOCKUP RULE

Do not implement fake systems solely to make screenshots impressive.

Every visible button should either:

1. Work, or
2. Clearly be unavailable/not implemented.

Never create dozens of dead UI elements just to make the game look feature-rich.

---

# 103. NO FAKE OPEN WORLD

A large map with nothing to do is not an open world.

Every accessible region should contain some combination of:

- NPC activity
- Traffic
- Buildings
- Shops
- Mission locations
- Random events
- Collectibles
- Environmental storytelling
- Exploration rewards

---

# 104. NO FAKE AI

NPCs should actually:

- Move
- React
- Flee
- Fight
- Drive
- Call police
- Follow routines
- Respond to events

Do not animate NPCs randomly and call it AI.

---

# 105. NO FAKE PHYSICS

Vehicles must actually respond to:

- Acceleration
- Steering
- Braking
- Collisions

Do not move a vehicle along a canned animation while pretending it is physically driven.

---

# 106. NO FAKE POLICE

Police must:

- Detect crimes
- Pursue players
- Lose sight
- Search
- React to witnesses
- Escalate appropriately

Do not simply spawn enemies endlessly around the player.

---

# 107. NO FAKE CHOICES

If the game presents:

```text
HELP MARA
IGNORE MARA
```

the choices must affect something.

Even a small consequence is better than a fake branching dialogue tree.

---

# 108. ARCHITECTURAL RULE — SINGLE SOURCE OF TRUTH

Each system owns its own state.

Examples:

```text
Money → EconomySystem
Mission state → MissionManager
Wanted level → WantedSystem
Character relationship → RelationshipSystem
World flags → WorldState
Save data → SaveSystem
```

Do not duplicate the same value across multiple systems.

---

# 109. ARCHITECTURAL RULE — LOOSE COUPLING

Systems should communicate through:

- Interfaces
- Events
- Commands
- Shared state managers

Avoid direct circular dependencies.

Bad:

```text
Mission → UI → Player → Mission → UI
```

Better:

```text
Mission
↓
EventBus
↓
UI

Mission
↓
EventBus
↓
Player
```

---

# 110. ARCHITECTURAL RULE — DETERMINISM

Story-critical outcomes must be deterministic.

Random systems may use randomness for:

- Traffic
- Ambient NPCs
- Weather
- Random events

But:

```text
Mission outcome
Character death
Major reveal
Ending
```

must depend on explicit game state.

---

# 111. ARCHITECTURAL RULE — RECOVERABILITY

Systems must recover from unexpected player behavior.

The player can:

- Drive away
- Steal another vehicle
- Start fights
- Wander
- Ignore calls
- Leave mission areas
- Return hours later

The game should not permanently break because the player behaved unpredictably.

---

# 112. ARCHITECTURAL RULE — PLAYER FREEDOM

The player should generally be allowed to explore outside missions.

Mission systems should isolate their required state without freezing the entire world.

---

# 113. ARCHITECTURAL RULE — GRACEFUL DEGRADATION

If hardware is weak:

Reduce:

```text
Shadow quality
NPC density
Traffic density
Draw distance
Post-processing
Texture quality
```

before reducing:

```text
Input responsiveness
Mission logic
Save reliability
Core gameplay
```

---

# 114. FINAL SYSTEM ARCHITECTURE

The complete conceptual architecture:

```text
                         ┌──────────────────┐
                         │       GAME       │
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
        INPUT SYSTEM         GAME STATE           EVENT BUS
             │                    │                    │
             ▼                    │                    │
       PLAYER SYSTEM              │                    │
             │                    │                    │
       ┌─────┴─────┐              │                    │
       ▼           ▼              ▼                    ▼
   COMBAT       VEHICLES      MISSIONS             UI
                   │             │
                   ▼             ▼
                TRAFFIC      DIALOGUE
                   │             │
                   └──────┬──────┘
                          ▼
                       WORLD
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
            NPC          POLICE      WEATHER
             │            │
             └──────┬─────┘
                    ▼
                WORLD STATE
                    │
                    ▼
                SAVE SYSTEM
```

---

# 115. FINAL IMPLEMENTATION PRINCIPLE

The architecture should make the following loop possible:

```text
PLAYER ACTION
      ↓
GAME SYSTEM
      ↓
WORLD REACTION
      ↓
CHARACTER REACTION
      ↓
MISSION STATE CHANGE
      ↓
PERSISTENT WORLD STATE
      ↓
FUTURE GAMEPLAY
```

Example:

```text
Kaleb steals a vehicle
↓
Witness sees him
↓
Police are alerted
↓
Wanted level increases
↓
Kaleb escapes
↓
Vehicle remains damaged
↓
Police continue searching
↓
Mission continues
↓
Character learns about incident
↓
Later dialogue changes
↓
Save preserves the consequences
```

That interconnected behavior is the foundation of NEON ASHES.

The game should feel like a simulation of a functioning city wrapped around a carefully authored crime story—not a sequence of disconnected demos.
