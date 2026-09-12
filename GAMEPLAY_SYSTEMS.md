# NEON ASHES — GAMEPLAY SYSTEMS

## 0. PURPOSE

This document defines the complete gameplay systems of **NEON ASHES**.

The goal is to create a playable open-world action game rather than a collection of visual demonstrations.

Every system described here should be implemented as a real gameplay system whenever technically feasible.

If a system cannot be implemented at full complexity because of browser or hardware limitations, implement a simplified but functional version.

Never replace functional gameplay with fake buttons, animations, or static demonstrations.

---

# 1. CORE GAMEPLAY LOOP

The primary gameplay loop is:

```text
EXPLORE
↓
DISCOVER
↓
INTERACT
↓
ACCEPT MISSION / ACTIVITY
↓
PREPARE
↓
EXECUTE
↓
RESPOND TO CONSEQUENCES
↓
EARN MONEY / INFORMATION / RELATIONSHIP PROGRESS
↓
UPGRADE / EXPLORE
↓
STORY PROGRESSES
```

The player should not be forced to follow this loop constantly.

They should be able to freely explore Vespera City.

---

# 2. CORE PLAYER EXPERIENCE

The player should constantly feel that they have agency.

At any given time the player may:

- walk
- run
- explore
- drive
- steal vehicles
- fight
- avoid conflict
- investigate
- follow NPCs
- enter businesses
- purchase items
- complete missions
- complete side activities
- escape police
- discover secrets
- interact with characters
- return to safehouses

The game should not constantly interrupt free exploration with mission prompts.

---

# 3. GAME STATES

The game should have explicit global states.

```text
MAIN_MENU
LOADING
FREE_ROAM
MISSION_ACTIVE
CUTSCENE
DIALOGUE
PAUSED
MAP
INVENTORY
PHONE
GAME_OVER
MISSION_COMPLETE
MISSION_FAILED
```

Systems should behave differently depending on the current state.

For example:

During a cutscene:

- player movement disabled
- combat disabled
- unnecessary NPC interactions disabled

During free roam:

- all normal world systems active

---

# 4. PLAYER CHARACTER SYSTEM

## Character

Kaleb Voss.

The player controls Kaleb in third person.

---

# 5. PLAYER MOVEMENT

Implement:

- idle
- walking
- jogging
- sprinting
- jumping
- crouching
- turning
- directional movement
- interaction

Movement must be responsive.

Avoid excessive acceleration delays.

The player should feel directly controlled.

---

# 6. MOVEMENT PARAMETERS

Use tunable configuration values.

Example:

```text
walkSpeed
runSpeed
sprintSpeed
jumpForce
gravity
acceleration
deceleration
rotationSpeed
crouchSpeed
```

Do not hard-code these throughout the project.

Keep gameplay parameters centralized.

---

# 7. STAMINA

Sprint should optionally use stamina.

Stamina:

- drains while sprinting
- regenerates while walking or standing
- regenerates more quickly when completely stationary

Do not make stamina excessively restrictive.

The player should be able to comfortably traverse the city.

---

# 8. PLAYER HEALTH

Player health is represented by a numeric value.

Example:

```text
maximumHealth = 100
currentHealth = 100
```

Damage can come from:

- firearms
- melee attacks
- explosions
- vehicle collisions
- environmental hazards

---

# 9. HEALTH REGENERATION

Do NOT use instant automatic full regeneration.

Instead:

If the player has avoided damage for several seconds:

Health may slowly regenerate to a limited threshold.

Example:

```text
regenerationDelay = 4 seconds
regenerationRate = 5 health / second
maximumRegeneration = 60%
```

Medical items or safehouses can restore full health.

---

# 10. ARMOR

Armor is optional but recommended.

Armor absorbs part of incoming damage.

Example:

```text
health = 100
armor = 50
```

Armor should be purchased or obtained through gameplay.

Armor does not regenerate automatically.

---

# 11. PLAYER DEATH

If health reaches zero:

1. player enters death state
2. current action stops
3. death animation/effect plays
4. game over interface appears
5. player can restart from checkpoint
6. player can quit to menu

Do not reset the entire game.

---

# 12. CHECKPOINT SYSTEM

Missions should automatically create checkpoints at important stages.

Examples:

After:

- reaching a mission location
- completing a major objective
- finishing a combat encounter
- completing a chase segment

If the player fails:

Load the latest checkpoint.

---

# 13. INTERACTION SYSTEM

Create a universal interaction system.

Objects can define:

```text
interactionType
interactionText
interactionDuration
interactionRequirement
interactionResult
```

Examples:

- enter vehicle
- open door
- talk
- pick up item
- inspect object
- use computer
- buy item
- start mission

The interaction prompt should only appear when an object is actually interactable.

---

# 14. INTERACTION PRIORITY

If multiple interactable objects are nearby:

Prioritize:

1. mission-critical object
2. character
3. vehicle
4. usable item
5. environmental interaction

Avoid showing multiple overlapping prompts.

---

# 15. CAMERA SYSTEM

Use a third-person camera.

Camera should support:

- follow
- orbit
- zoom
- collision avoidance
- aiming
- vehicle camera

Camera should not clip through walls whenever reasonably preventable.

---

# 16. CAMERA COLLISION

When the camera moves toward an obstacle:

Move the camera closer to the player rather than allowing it to pass through geometry.

When the obstacle is removed:

Smoothly restore the normal camera distance.

---

# 17. AIMING CAMERA

When aiming a weapon:

- camera moves closer
- field of view decreases slightly
- player rotates toward aim direction
- crosshair appears

The system should feel responsive rather than cinematic to the point of being slow.

---

# 18. COMBAT SYSTEM

Combat is third-person and real-time.

Supported combat categories:

- firearms
- melee
- environmental interaction

Combat should be functional but should not dominate the entire game.

---

# 19. WEAPON SYSTEM

Initial weapon categories:

### HANDGUN

Fast draw.

Moderate damage.

### SHOTGUN

High close-range damage.

Low magazine capacity.

### SMG

High fire rate.

Moderate accuracy.

### RIFLE

High accuracy.

Higher damage.

### MELEE

Close-range combat.

Weapons should have individual configuration data.

---

# 20. WEAPON DATA

Each weapon should define:

```text
name
category
damage
range
fireRate
magazineSize
reserveAmmo
reloadTime
recoil
accuracy
spread
criticalMultiplier
```

Keep weapon data separate from gameplay logic.

---

# 21. SHOOTING

Shooting should support:

- aiming
- firing
- hit detection
- damage
- ammunition consumption
- reload
- recoil
- muzzle flash
- impact effects

If advanced ballistic simulation is too expensive, use raycasting.

---

# 22. AMMUNITION

Ammo should be finite.

Example:

```text
Pistol:
12 magazine
72 reserve
```

The player cannot fire when the magazine is empty.

Reloading should consume reserve ammunition.

---

# 23. RELOAD

Reload must:

- interrupt firing
- play reload animation if available
- take a measurable amount of time
- fail if no reserve ammunition exists

The player should be vulnerable while reloading.

---

# 24. WEAPON SWITCHING

Weapon switching should be fast but not instantaneous.

Use:

- number keys
- controller buttons
- weapon wheel if supported

Only owned weapons should appear.

---

# 25. MELEE COMBAT

Basic melee system:

- light attack
- heavy attack
- block if feasible
- dodge if feasible
- hit detection
- stagger
- knockdown

Do not create an unnecessarily complicated fighting-game system.

Prioritize responsiveness.

---

# 26. DAMAGE MODEL

Different hit locations can optionally have different multipliers.

Example:

```text
body = 1.0x
limbs = 0.7x
head = 2.0x
```

Do not require complex hitboxes if performance becomes problematic.

---

# 27. ENEMY SYSTEM

Enemies should have basic states:

```text
IDLE
PATROL
SUSPICIOUS
ALERT
COMBAT
SEARCHING
FLEEING
DOWNED
DEAD
```

Enemies should not instantly detect the player through walls.

---

# 28. ENEMY PERCEPTION

Enemy perception should consider:

- distance
- line of sight
- noise
- lighting where feasible
- suspicious behavior
- nearby dead allies

Detection should have a short delay.

---

# 29. ENEMY COVER

Enemies should attempt to use nearby cover.

Possible cover:

- vehicles
- walls
- containers
- barriers
- furniture

If advanced cover AI is too expensive, implement a simplified system using predefined cover points.

---

# 30. ENEMY FLANKING

Higher-level enemies may attempt to:

- flank
- reposition
- suppress
- retreat
- call backup

Basic enemies can simply seek cover.

---

# 31. ENEMY DIFFICULTY

Enemy types:

### THUG

Low health.

Basic weapon.

Simple AI.

### ENFORCER

Higher health.

Aggressive.

### SECURITY

Better accuracy.

Uses cover.

### SPECIALIST

More tactical.

### BOSS

Unique encounter logic.

Avoid simply giving bosses huge health pools.

---

# 32. STEALTH SYSTEM

Stealth should be a viable option.

Implement:

- crouching
- line of sight
- detection meter
- noise
- suspicious state
- hiding
- takedown where feasible

The player should not be forced into stealth unless a mission specifically requires it.

---

# 33. DETECTION METER

When enemies detect suspicious activity:

```text
0% → unaware
25% → suspicious
50% → investigating
75% → searching
100% → combat
```

Detection should decrease if the player successfully hides.

---

# 34. NOISE SYSTEM

Actions generate noise.

Examples:

Walking:

Low.

Running:

Moderate.

Gunshot:

Very high.

Vehicle crash:

High.

Explosion:

Extreme.

NPCs can investigate noises.

---

# 35. VEHICLE SYSTEM

Vehicles are a major part of gameplay.

The player should be able to:

- enter
- exit
- drive
- reverse
- accelerate
- brake
- steer
- handbrake
- crash
- damage vehicles
- steal vehicles

---

# 36. VEHICLE TYPES

Minimum categories:

- compact
- sedan
- SUV
- sports car
- muscle car
- van
- truck
- motorcycle
- taxi
- police car

Each category should have different handling.

---

# 37. VEHICLE PHYSICS

Vehicle behavior should include:

- acceleration
- braking
- steering
- traction
- collision
- friction
- weight
- turning radius

Do not attempt physically perfect simulation if it harms performance.

Arcade-realistic handling is acceptable.

---

# 38. VEHICLE HEALTH

Vehicles have durability.

Damage can affect:

- engine
- body
- wheels
- windows

A vehicle may become disabled when heavily damaged.

---

# 39. VEHICLE ENTRY

When approaching a vehicle:

Show:

**ENTER VEHICLE**

If occupied:

Show:

**STEAL VEHICLE**

If the vehicle is locked:

Show:

**LOCKED**

Certain mission vehicles can require specific conditions.

---

# 40. VEHICLE THEFT

Stealing a vehicle may:

- create witnesses
- increase police attention
- trigger owner reaction
- affect wanted level

Not every vehicle theft must immediately generate a wanted level.

---

# 41. VEHICLE STORAGE

Players can store owned vehicles in garages.

Stored vehicles should persist through saves.

---

# 42. VEHICLE CUSTOMIZATION

Optional customization:

- paint
- wheels
- performance
- repair
- visual upgrades

Keep the first implementation simple.

---

# 43. TRAFFIC AI

Traffic vehicles should:

- follow roads
- stop at traffic lights
- avoid collisions
- react to obstacles
- change lanes where possible
- despawn intelligently

Traffic density should change with time.

---

# 44. TRAFFIC INCIDENTS

Traffic can react to:

- crashes
- gunfire
- police
- blocked roads
- explosions

NPC drivers may:

- stop
- flee
- reroute
- honk

---

# 45. MOTORCYCLES

Motorcycles should have:

- increased acceleration
- smaller collision footprint
- higher instability
- different turning behavior

---

# 46. POLICE SYSTEM

Police are a dynamic gameplay system rather than scripted enemies.

Police respond to:

- crimes
- gunfire
- vehicle theft
- attacks on officers
- explosions
- witnessed violence

---

# 47. WANTED LEVEL

Wanted levels:

## LEVEL 0

No police pursuit.

## LEVEL 1

Local investigation.

## LEVEL 2

Active pursuit.

## LEVEL 3

Multiple units.

## LEVEL 4

Heavy response.

## LEVEL 5

Maximum response.

---

# 48. WANTED SYSTEM RULES

Wanted level should depend on:

- crime severity
- witnesses
- police visibility
- player behavior
- location

A crime committed in an isolated alley should not necessarily produce the same response as shooting someone in front of a police station.

---

# 49. WITNESS SYSTEM

NPCs can witness crimes.

Witnesses can:

- flee
- call police
- hide
- report the player

If the player prevents the witness from reporting, police response may be reduced.

Do not make this system require killing witnesses.

The player should have non-lethal options:

- leave the area
- hide
- intimidate
- avoid detection

---

# 50. POLICE SEARCH

If police lose sight of the player:

They enter SEARCH state.

Police investigate the last known location.

They search nearby streets.

The player can escape by:

- hiding
- changing vehicle
- breaking line of sight
- entering suitable locations
- leaving the search area

---

# 51. POLICE AI

Police should:

- pursue
- communicate
- call backup
- block roads
- exit vehicles
- search
- return to patrol

Avoid spawning police directly beside the player.

---

# 52. ROADBLOCKS

At higher wanted levels, police can establish roadblocks.

Roadblocks should use:

- police vehicles
- officers
- cones/barriers if available

Players should be able to attempt alternate routes.

---

# 53. POLICE VEHICLES

Police vehicles should have:

- pursuit behavior
- sirens
- lights
- improved acceleration
- radio behavior

---

# 54. NPC SYSTEM

NPCs populate the world.

NPC categories:

- civilians
- workers
- tourists
- criminals
- police
- security
- mission characters

---

# 55. NPC ROUTINES

NPC routines may include:

```text
WAKE
COMMUTE
WORK
SHOP
EAT
SOCIALIZE
RETURN_HOME
SLEEP
```

Do not simulate every NPC continuously.

Use simplified behavior based on distance.

---

# 56. NPC REACTIONS

NPCs should react to:

- gunshots
- explosions
- fights
- crashes
- police
- weather
- time

Possible reactions:

- ignore
- investigate
- flee
- call police
- record with phone
- help injured NPC

---

# 57. NPC LIFECYCLE

NPCs should spawn based on:

- district
- time
- weather
- story state

When far away:

NPC simulation can be simplified or disabled.

---

# 58. MISSION SYSTEM

Missions are data-driven.

Each mission should contain:

```text
id
title
description
startingCharacter
startLocation
objectives
requiredItems
requiredProgress
failConditions
completionConditions
rewards
worldChanges
relationshipChanges
```

---

# 59. OBJECTIVE SYSTEM

Supported objective types:

```text
GO_TO
TALK_TO
FOLLOW
DRIVE_TO
ENTER
EXIT
COLLECT
INVESTIGATE
PHOTOGRAPH
STEAL
PROTECT
ESCAPE
DEFEAT
SURVIVE
DELIVER
WAIT
CALL
```

New objective types should be easy to add.

---

# 60. MULTI-STAGE MISSIONS

Missions should support multiple objectives.

Example:

```text
GO_TO garage
↓
TALK_TO Jonah
↓
DRIVE_TO harbor
↓
FOLLOW target
↓
PHOTOGRAPH exchange
↓
ESCAPE police
↓
RETURN_TO safehouse
```

Mission state must persist correctly.

---

# 61. MISSION FAILURE

Failure can occur because of:

- player death
- important NPC death
- vehicle destruction
- leaving mission area
- timer expiration
- losing target
- destroying required evidence

Not every mistake should instantly fail the mission.

---

# 62. OPTIONAL MISSION APPROACHES

Where appropriate, missions should support:

- stealth
- direct combat
- driving
- dialogue
- investigation

Different approaches may produce different consequences.

---

# 63. MISSION CHECKPOINTS

Checkpoints should be placed at meaningful stages.

Avoid restarting a 20-minute mission because of a mistake during the final minute.

---

# 64. DIALOGUE SYSTEM

Dialogue should support:

- character portraits if available
- speaker name
- dialogue text
- choice options
- relationship effects
- branching responses

Dialogue should not freeze the game longer than necessary.

---

# 65. DIALOGUE CHOICES

Choices may affect:

- relationship
- information gained
- mission difficulty
- later dialogue
- optional missions

Not every dialogue choice needs huge consequences.

---

# 66. PHONE SYSTEM

The player phone provides:

- contacts
- calls
- messages
- map
- camera
- mission information
- notifications

The phone is also a narrative tool.

---

# 67. CONTACT SYSTEM

Contacts unlock naturally.

Characters can:

- call Kaleb
- send messages
- invite him somewhere
- provide mission information

Do not spam the player with calls.

---

# 68. MESSAGE SYSTEM

Messages should persist.

Messages can contain:

- text
- mission invitations
- warnings
- jokes
- story information
- location hints

---

# 69. CAMERA SYSTEM

The phone camera can be used for missions.

Possible gameplay:

- photograph evidence
- photograph vehicles
- photograph locations
- document suspicious activity

Photos can optionally be stored in the save data.

---

# 70. MAP SYSTEM

The map should support:

- zoom
- pan
- player position
- mission markers
- discovered locations
- safehouses
- garages
- shops
- activities

Avoid filling the map with hundreds of icons.

---

# 71. MINIMAP

The HUD minimap should show:

- player
- roads
- nearby mission objective
- major navigation direction
- nearby police when appropriate

Keep it readable.

---

# 72. NAVIGATION

Mission navigation should provide:

- destination marker
- optional route
- distance

Do not force the player to follow GPS.

Players can choose their own routes.

---

# 73. ECONOMY

Money is persistent.

Player earns money through:

- missions
- jobs
- side activities
- optional criminal activities
- exploration rewards

---

# 74. SPENDING

Money can be spent on:

- vehicles
- weapons
- ammunition
- armor
- repairs
- customization
- clothing
- safehouses

---

# 75. INVENTORY

Inventory should contain:

- weapons
- ammunition
- armor
- mission items
- collectibles

Avoid excessive inventory management.

The game is not an inventory-management simulator.

---

# 76. CLOTHING

Clothing is primarily cosmetic.

Allow changing outfits at:

- safehouses
- clothing stores

Some missions may require certain outfits.

---

# 77. SAFEHOUSE SYSTEM

Safehouses provide:

- saving
- weapon access
- vehicle access
- clothing
- health recovery
- mission planning

---

# 78. SAVE SYSTEM

Save:

```text
storyProgress
completedMissions
currentMission
money
weapons
ammo
vehicles
vehicleLocations
safehouses
relationships
factionStates
choices
collectibles
discoveredLocations
worldState
settings
```

Use localStorage or IndexedDB if running in browser.

---

# 79. AUTOSAVE

Autosave after:

- mission completion
- major story decision
- purchasing major item
- unlocking safehouse
- major world-state change

Do not autosave constantly.

---

# 80. MANUAL SAVE

Allow manual saving at safehouses.

If browser storage permits, support multiple save slots.

---

# 81. DAY/NIGHT SYSTEM

Game time progresses continuously.

Time affects:

- lighting
- NPC population
- traffic
- shops
- missions
- police presence
- nightlife

---

# 82. TIME SCALE

Use a configurable time multiplier.

Example:

```text
1 real minute = 2–4 in-game minutes
```

Do not make days pass so quickly that the player cannot experience different times of day.

---

# 83. WEATHER SYSTEM

Weather states:

```text
CLEAR
CLOUDY
RAIN
HEAVY_RAIN
FOG
STORM
```

Weather transitions should be gradual.

Avoid instant random weather changes.

---

# 84. WEATHER GAMEPLAY

Weather affects:

- visibility
- vehicle handling
- pedestrian behavior
- ambience
- traffic

Effects should remain subtle unless specifically required by a mission.

---

# 85. INTERIOR / EXTERIOR SYSTEM

The game should support transitions between:

- street
- building interior
- garage
- safehouse
- mission locations

Transitions should be smooth.

If full streaming is unavailable, use short loading transitions.

---

# 86. WORLD INTERACTION

The player should be able to interact with selected world objects.

Examples:

- doors
- computers
- phones
- vending machines
- vehicles
- evidence
- shops
- benches
- elevators where implemented

Do not attempt to make every object interactive.

---

# 87. SHOP SYSTEM

Shops should have functional menus.

Categories:

- weapons
- ammunition
- clothing
- food
- vehicle services

Purchases should update inventory and money immediately.

---

# 88. VEHICLE REPAIR

Repair restores vehicle durability.

Cost depends on damage.

Example:

```text
minor damage = cheap
major damage = expensive
destroyed vehicle = unavailable unless recovered
```

---

# 89. VEHICLE RECOVERY

If an owned vehicle is lost:

Allow recovery through:

- garage
- impound
- recovery service

Do not permanently delete important player-owned vehicles.

---

# 90. SIDE ACTIVITY FRAMEWORK

Side activities should use the same objective framework as missions.

Examples:

- races
- deliveries
- taxi work
- photography
- investigation
- vehicle recovery
- underground fighting

This reduces duplicated code.

---

# 91. RANDOM EVENT SYSTEM

Random events should use weighted probabilities.

Example:

```text
carCrash = 15
robbery = 10
policeChase = 10
streetFight = 15
race = 10
suspiciousDeal = 10
helpRequest = 20
nothing = 100
```

Actual values should be tuned during testing.

Do not spawn random events constantly.

---

# 92. EVENT COOLDOWNS

After a random event occurs:

Create a cooldown.

Prevent the exact same event from spawning immediately again.

---

# 93. FACTION SYSTEM

Each major faction should have:

```text
name
territory
influence
hostility
resources
relationships
storyState
```

Faction state can change throughout the campaign.

---

# 94. FACTION RELATIONSHIPS

Possible relationships:

```text
ALLY
NEUTRAL
TENSE
HOSTILE
WAR
```

These states can affect random events and missions.

---

# 95. PLAYER REPUTATION

Optional reputation system.

Different groups may have different opinions of Kaleb.

Example:

```text
Marrow reputation
Police reputation
Civilian reputation
Security reputation
```

Reputation can affect:

- dialogue
- prices
- mission availability
- enemy behavior

---

# 96. CONSEQUENCE SYSTEM

Important actions should be recorded.

Examples:

```text
helpedJonah
betrayedDrake
protectedMara
trustedWard
releasedEvidence
killedCross
savedCharacter
```

These flags can be referenced later.

---

# 97. QUEST / MISSION AVAILABILITY

Mission availability should depend on:

- story progression
- character relationships
- previous choices
- time
- location

Avoid exposing every mission from the beginning.

---

# 98. PROGRESSION

Progression should primarily come from:

- story
- money
- equipment
- relationships
- world access

Do not create an enormous RPG skill tree unless technically justified.

---

# 99. OPTIONAL SKILLS

If a skill system is implemented, keep it simple.

Possible skills:

### DRIVING

Improves vehicle control.

### COMBAT

Improves recoil/control.

### STEALTH

Reduces detection speed.

### TECH

Improves hacking/investigation interactions.

Skills should provide small advantages rather than turning Kaleb into an overpowered character.

---

# 100. INTERACTION WITH THE ENVIRONMENT

Environmental interactions can include:

- pushing objects
- opening doors
- climbing low obstacles
- entering vehicles
- using elevators
- interacting with mission objects

Prioritize interactions that contribute to gameplay.

---

# 101. PHYSICS

Use physics selectively.

Physics objects should include:

- vehicles
- selected props
- doors
- mission objects

Do not simulate every object physically.

---

# 102. DESTRUCTION

Use limited environmental destruction.

Examples:

- breakable glass
- destructible props
- vehicle damage
- mission-specific destruction

Do not attempt fully destructible buildings.

---

# 103. EXPLOSIONS

Explosions should include:

- damage radius
- impulse
- visual effect
- sound
- NPC reactions
- vehicle damage

Explosion effects should be optimized.

---

# 104. FIRE

Fire can exist as a visual/gameplay effect.

Possible behavior:

- spreads to nearby selected objects
- damages vehicles/NPCs
- triggers panic
- attracts police

Keep fire simulation limited.

---

# 105. NPC CROWD SYSTEM

Crowd density depends on:

- district
- time
- weather
- story state

Central Vesper and Silver Coast should have higher pedestrian density.

Outer County should have much lower density.

---

# 106. PERFORMANCE-AWARE AI

NPCs close to the player:

Full AI.

NPCs at medium distance:

Simplified AI.

NPCs far away:

Visual simulation or despawn.

Never run expensive AI calculations for every NPC every frame.

---

# 107. PERFORMANCE BUDGET

Maintain reasonable targets.

Prioritize stable frame rate over graphical complexity.

Avoid:

- unnecessary per-frame loops
- excessive raycasts
- thousands of active physics objects
- excessive particle systems
- unbounded NPC spawning

---

# 108. INPUT SYSTEM

Support keyboard/mouse first.

Suggested controls:

```text
WASD = movement
SHIFT = sprint
SPACE = jump
CTRL = crouch
E = interact
F = enter/exit vehicle
LMB = fire
RMB = aim
R = reload
1–5 = weapon selection
TAB = phone/map depending on context
ESC = pause
```

Controls should be configurable if practical.

---

# 109. CONTROLLER SUPPORT

If feasible, support:

- left stick movement
- right stick camera
- triggers for aiming/firing
- face buttons for jumping/interacting
- shoulder buttons for weapon selection

Do not compromise keyboard controls to add controller support.

---

# 110. ACCESSIBILITY

Support where feasible:

- subtitles
- adjustable subtitle size
- volume controls
- sensitivity controls
- invert camera
- motion reduction
- aim assistance
- controller vibration toggle

---

# 111. PAUSE SYSTEM

Pause menu:

```text
RESUME
MAP
MISSIONS
INVENTORY
PHONE
SETTINGS
SAVE
QUIT
```

Some online-style systems are unnecessary because this is a single-player game.

---

# 112. GAME OVER

Game-over screen:

```text
MISSION FAILED
RESTART CHECKPOINT
RESTART MISSION
LOAD SAVE
QUIT
```

Avoid forcing the player back to the main menu.

---

# 113. MISSION REWARDS

Rewards can include:

- money
- weapons
- vehicles
- safehouses
- contacts
- faction reputation
- story progression
- new locations

---

# 114. COLLECTIBLE SYSTEM

Collectibles should be tracked persistently.

Categories:

- Adrian's Records
- Black Ledger Evidence
- Vespera Memories

Collectibles should unlock lore.

---

# 115. EVIDENCE SYSTEM

Evidence is a narrative gameplay system.

Evidence can be:

- photographs
- documents
- recordings
- financial records
- messages

Evidence can be viewed at the safehouse.

Some evidence unlocks additional dialogue or missions.

---

# 116. INVESTIGATION SYSTEM

Investigation missions should allow the player to:

- inspect objects
- photograph evidence
- follow leads
- question characters
- connect clues

Do not reduce investigation to simply following a glowing waypoint.

---

# 117. CLUE SYSTEM

Clues can have:

```text
id
type
source
description
relatedCharacter
relatedFaction
relatedLocation
importance
```

Collected clues can appear on an investigation board.

---

# 118. INVESTIGATION BOARD

At certain safehouses, the player can access a visual evidence board.

It can display:

- photographs
- names
- locations
- documents
- connections

This should reinforce the central mystery.

---

# 119. RELATIONSHIP SYSTEM

Relationships are tracked numerically or through states.

Example:

```text
hostility = -100
neutral = 0
trust = 50
loyalty = 100
```

Do not display exact relationship numbers unless useful.

The player should generally understand relationships through dialogue and behavior.

---

# 120. COMPANION SYSTEM

Certain missions may allow temporary companions.

Companions can:

- follow
- fight
- drive
- provide dialogue
- react to events

Do not require a permanent companion system.

---

# 121. COMPANION AI

Companions should avoid:

- blocking doorways
- standing in front of the player
- driving directly into obstacles
- teleporting unnecessarily

If they become stuck, use recovery logic.

---

# 122. MISSION VEHICLES

Some missions require specific vehicles.

Mission vehicles should be marked internally as protected from accidental despawn.

---

# 123. SCRIPTED EVENTS

The game can temporarily override normal world AI during major story sequences.

Examples:

- police lockdown
- faction ambush
- road closure
- chase
- explosion

After the event:

Restore normal world simulation.

---

# 124. WORLD STATE MANAGER

Create a centralized system responsible for major world changes.

Example:

```text
worldState.chapter
worldState.factionStates
worldState.completedEvents
worldState.permanentChanges
```

Do not scatter world-state flags across unrelated scripts.

---

# 125. AUDIO GAMEPLAY

Audio should respond to gameplay.

Examples:

Wanted level increases:

Police music/intensity increases.

Entering combat:

Combat audio begins.

Escaping:

Music transitions down.

Rain:

Ambient audio changes.

Vehicle:

Engine audio changes with speed.

---

# 126. MUSIC INTENSITY

Use layered music where feasible.

States:

```text
EXPLORATION
SUSPICION
CHASE
COMBAT
MISSION_COMPLETE
```

Transitions should be smooth.

---

# 127. HAPTICS

If controller vibration is supported:

- vehicle collision
- weapon fire
- explosions
- heavy impacts

should produce appropriate vibration.

---

# 128. UI FEEDBACK

Every important action should have feedback.

Examples:

Purchase:

Money decreases.

Weapon pickup:

Inventory updates.

Mission completion:

Clear success notification.

Wanted level:

Visible change.

Do not rely only on console logs.

---

# 129. ERROR HANDLING

Gameplay systems should fail gracefully.

If an asset fails:

Use fallback asset.

If an NPC fails to spawn:

Continue gameplay.

If a vehicle fails:

Respawn safely.

If save fails:

Notify player.

Do not crash the entire game because one optional object failed.

---

# 130. DEBUG MODE

Create an optional developer/debug mode.

Possible controls:

- teleport
- spawn vehicle
- spawn NPC
- give money
- give weapon
- start mission
- change weather
- change time
- set wanted level

Debug tools should be disabled in normal player builds.

---

# 131. TESTING REQUIREMENTS

Before considering the gameplay systems complete, test:

### PLAYER

Movement.

Jumping.

Crouching.

Health.

Death.

### COMBAT

Aim.

Fire.

Reload.

Weapon switching.

Damage.

Enemy death.

### VEHICLES

Enter.

Exit.

Drive.

Crash.

Damage.

Store.

Recover.

### POLICE

Crime detection.

Wanted level.

Pursuit.

Search.

Escape.

### NPCS

Spawn.

Movement.

Reaction.

Despawning.

### MISSIONS

Start.

Objective progression.

Checkpoint.

Failure.

Completion.

Rewards.

### SAVE

Save.

Load.

Autosave.

Persistence.

---

# 132. SYSTEM PRIORITY

If development time is limited, prioritize systems in this order:

## TIER 1 — ESSENTIAL

- player movement
- camera
- vehicles
- missions
- NPCs
- combat
- police
- save/load
- UI
- world navigation

## TIER 2 — IMPORTANT

- dialogue
- phone
- economy
- safehouses
- day/night
- weather
- faction system

## TIER 3 — ADVANCED

- stealth
- investigation board
- reputation
- advanced NPC routines
- environmental destruction

## TIER 4 — OPTIONAL POLISH

- advanced physics
- complex traffic
- advanced animation
- sophisticated audio transitions
- advanced companion AI

---

# 133. ANTI-FEATURE RULE

Never implement a feature purely because it sounds impressive.

A simple working system is better than a complicated broken system.

For example:

A working basic police pursuit is better than an elaborate police simulation that constantly breaks.

A working vehicle is better than twenty vehicle classes that cannot be driven.

A functional mission system is better than fifty missions represented only by buttons.

---

# 134. NO FAKE GAMEPLAY

The following are explicitly prohibited:

- fake minimaps
- fake missions
- fake weapon buttons
- fake vehicle buttons
- static NPCs pretending to be AI
- scripted animations pretending to be gameplay
- fake save buttons
- decorative inventory
- non-functional shops
- placeholder mission completion

If something is displayed as interactive, it must actually perform the corresponding action.

---

# 135. FINAL GAMEPLAY PRINCIPLE

The player should always feel:

**"I am controlling a character inside a functioning world."**

Not:

**"I am clicking through an AI-generated demo."**

Gameplay systems should interact with each other.

Examples:

A stolen vehicle can create witnesses.

Witnesses can call police.

Police can pursue the player.

The player can escape.

The stolen vehicle can be stored.

The vehicle can later appear in another mission.

A mission decision can change faction hostility.

Faction hostility can affect random events.

Random events can create new opportunities.

This interconnectedness is what makes NEON ASHES feel like a real open-world game.