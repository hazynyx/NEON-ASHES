# NEON ASHES — UI/UX SPECIFICATION

## 0. PURPOSE

This document defines the complete user interface and user experience direction for NEON ASHES.

The UI must feel like the interface of a polished premium single-player action game.

It must NOT feel like:

- A SaaS dashboard
- An AI-generated website
- A futuristic admin panel
- A mobile app stretched onto a game
- A glassmorphism template
- A collection of floating cards

The interface exists to support gameplay, not compete with it.

The player should spend most of their time looking at Vespera City rather than menus.

---

# 1. CORE UI PHILOSOPHY

The UI follows five principles:

1. Minimal during gameplay.
2. Information-rich when requested.
3. Fast to navigate.
4. Strong visual hierarchy.
5. Consistent with the game's grounded crime-thriller atmosphere.

The UI should communicate:

> "This is a real game."

Not:

> "This is a website pretending to be a game."

---

# 2. ABSOLUTE VISUAL RULE — NO GLASSMORPHISM

## NEVER USE GLASSMORPHISM.

Do not use:

- Frosted glass
- Excessive transparency
- Blur-heavy panels
- Huge translucent rectangles
- Floating glass cards
- Glowing glass borders
- Layered transparent dashboards
- Excessive gradients
- "AI interface" aesthetics

Avoid interfaces resembling:

- AI dashboards
- Crypto dashboards
- Modern SaaS landing pages
- Generic futuristic templates

---

# 3. PREFERRED VISUAL LANGUAGE

Use:

- Solid dark surfaces
- Near-black backgrounds
- Off-white text
- Muted secondary text
- Thin borders
- Small shadows
- Strong spacing
- Compact panels
- Sharp rectangular geometry
- Occasional subtle rounded corners
- High readability
- Restrained accent colors

UI should feel physical and grounded.

---

# 4. VISUAL REFERENCES

The overall design language should combine:

```text
Premium console/PC game HUD
+
Crime thriller atmosphere
+
Modern editorial typography
+
Functional navigation
+
Minimal cinematic presentation
```

Do not copy the interface of any existing game.

The design must remain original to NEON ASHES.

---

# 5. COLOR SYSTEM

Use a restrained palette.

Example:

```text
Primary background:
#0B0D0F

Secondary surface:
#15181B

Elevated surface:
#1C2024

Border:
#30353A

Primary text:
#F2F2F0

Secondary text:
#A6AAAD

Muted text:
#6F7478

Accent:
Warm amber / restrained orange

Danger:
Muted red

Success:
Muted green

Information:
Muted blue
```

Accent colors should be used sparingly.

Do not make the entire UI glow.

---

# 6. TYPOGRAPHY

Typography should be:

- Clean
- Strong
- Highly readable
- Compact

Recommended hierarchy:

```text
GAME TITLE
Large uppercase display font

SECTION TITLE
Bold uppercase

SUBTITLE
Medium weight

BODY
Regular

SECONDARY
Smaller muted text

SYSTEM LABEL
Small uppercase tracking
```

Avoid excessively futuristic fonts.

Avoid fonts that sacrifice readability for style.

---

# 7. TEXT STYLE

Use uppercase selectively.

Examples:

```text
MISSION COMPLETE
OLD HARBOR
POLICE SEARCH
PHONE
INVENTORY
```

Normal dialogue should use natural sentence case.

Do not make every piece of text uppercase.

---

# 8. UI GRID

Use a consistent spacing system.

Base unit:

```text
4px
```

Common spacing:

```text
4
8
12
16
24
32
48
64
```

Avoid random margins throughout the interface.

---

# 9. CORNER PHILOSOPHY

UI should generally live near screen edges.

Examples:

```text
Top-left:
Mission/objective

Top-right:
Money / wanted state

Bottom-left:
Mini-map

Bottom-right:
Weapon/ammo

Center:
Contextual interaction
```

Do not constantly place large UI elements in the center of the screen.

---

# 10. GAMEPLAY HUD

The normal HUD should contain only information the player needs.

Default:

```text
TOP LEFT
Current objective

TOP RIGHT
Money
Wanted status

BOTTOM LEFT
Mini-map

BOTTOM RIGHT
Weapon
Ammo
Health/armor
```

---

# 11. HUD VISIBILITY

HUD should dynamically disappear when appropriate.

For example:

After several seconds without important events:

- Reduce objective visibility
- Hide unnecessary prompts
- Minimize ammo information
- Keep essential navigation

When combat begins:

- Restore relevant combat information

---

# 12. OBJECTIVE DISPLAY

Example:

```text
THE JOURNALIST

Meet Mara at the old newspaper office.
```

Optional objective:

```text
OPTIONAL
Find the missing file.
```

The objective should not occupy a huge percentage of the screen.

---

# 13. OBJECTIVE UPDATES

When an objective changes:

Use a short animation.

Example:

```text
OBJECTIVE UPDATED

Reach the harbor warehouse.
```

Duration:

Approximately 2–4 seconds.

Then reduce opacity or disappear.

---

# 14. MISSION START

Mission introduction:

```text
THE JOURNALIST

Mara Vale wants to meet.

OLD HARBOR
```

Animation:

```text
Fade in
+
Small upward movement
+
Hold
+
Fade out
```

No huge UI takeover.

---

# 15. MISSION COMPLETE

Mission completion should feel satisfying.

Example:

```text
MISSION COMPLETE

THE JOURNALIST

$500
```

Optional:

```text
NEW CONTACT
MARA VALE
```

Do not use giant glowing victory screens.

---

# 16. MISSION FAILURE

Example:

```text
MISSION FAILED

Mara was killed.

RETRY
LOAD CHECKPOINT
EXIT
```

Keep the interface clear.

---

# 17. INTERACTION PROMPTS

Contextual prompts should be small.

Examples:

```text
[E] ENTER VEHICLE
```

```text
[E] TALK
```

```text
[E] OPEN
```

```text
[E] INSPECT
```

Place them near the relevant object or at a consistent HUD position.

---

# 18. INTERACTION PRIORITY

If multiple objects are nearby:

Prioritize:

1. Mission-critical interaction
2. Character interaction
3. Vehicle entry
4. Important object
5. Generic interaction

Do not rapidly switch prompts every frame.

Use a small selection threshold.

---

# 19. MINIMAP

The minimap should be:

- Circular or subtly rounded
- Compact
- High contrast
- Semi-opaque rather than transparent glass
- Easy to read

It should show:

- Player
- Roads
- Mission target
- Waypoint
- Police/search indicators
- Nearby important locations

---

# 20. MINIMAP DESIGN

Avoid turning the minimap into a giant navigation system.

The world itself should remain the primary visual.

Use simplified map geometry.

---

# 21. PLAYER ICON

Player icon:

- Simple directional marker
- Clearly indicates facing direction
- High contrast

Do not use overly complicated 3D player models inside the minimap.

---

# 22. WAYPOINT

Custom waypoint:

```text
WAYPOINT
```

Should appear:

- On minimap
- In world direction indicator
- Optionally as distance text

Example:

```text
1.2 KM
```

---

# 23. GPS ROUTE

Use a restrained route line.

Avoid giant glowing paths covering the entire world.

The player should still be able to navigate naturally.

---

# 24. WANTED HUD

Wanted state should be visually obvious but not obnoxious.

Example:

```text
WANTED  ★★★
```

or:

```text
POLICE SEARCH
★★★
```

Use icons and animation rather than large text.

---

# 25. WANTED ESCALATION

At higher wanted levels:

- UI becomes more urgent
- Police indicators appear
- Search radius may appear
- Radio messages can play
- Music changes

Do not cover the entire screen.

---

# 26. HEALTH AND ARMOR

Health/armor should be compact.

Example:

```text
████████░░
HEALTH

██████░░░░
ARMOR
```

or a minimal icon/bar arrangement.

During normal exploration:

Keep it unobtrusive.

During combat:

Make it more visible.

---

# 27. AMMO DISPLAY

Example:

```text
PISTOL

12 / 84
```

Weapon name:

Small uppercase.

Ammo count:

Larger.

Do not display unnecessary weapon statistics during gameplay.

---

# 28. WEAPON SWITCHING

Weapon wheel or quick-selection interface should:

- Pause or slow gameplay where appropriate
- Clearly identify available weapons
- Show ammunition
- Be quickly navigable
- Disappear immediately after selection

Keep it functional.

---

# 29. DAMAGE FEEDBACK

When Kaleb takes damage:

Use:

- Subtle screen edge effect
- Character animation
- Sound
- Health reduction

Do not rely solely on a red full-screen overlay.

---

# 30. LOW HEALTH

At critical health:

- UI health indicator changes
- Character audio becomes strained
- Screen effects become slightly stronger
- Controller vibration can increase where supported

Avoid excessive flashing.

---

# 31. COMBAT UI

During combat:

Display only:

```text
Health
Armor
Ammo
Wanted state
Mission objective
```

Do not display a dozen statistics.

---

# 32. DIALOGUE UI

Dialogue should prioritize faces and environments.

Preferred:

```text
Character Name

Dialogue text...
```

Place dialogue near the bottom portion of the screen.

Use a solid dark background or subtle opaque panel.

No glass.

---

# 33. DIALOGUE CHOICES

Choices should appear clearly.

Example:

```text
What do you know about Lena?

> Ask about the warehouse
  Ask about Adrian
  Leave
```

Keyboard:

```text
↑ ↓
ENTER
```

Controller:

```text
D-pad
A
```

---

# 34. CHOICE DESIGN

Choices should not look like generic chatbot options.

Avoid:

```text
[OPTION A]
[OPTION B]
[OPTION C]
```

Instead make them natural dialogue.

Example:

```text
"Tell me where she went."

"I know more than I'm saying."

"Forget it."
```

---

# 35. DIALOGUE TIMING

Do not automatically rush through dialogue.

Allow:

- Natural pauses
- Player-controlled advancement where appropriate
- Skip option
- Subtitle speed control

---

# 36. SUBTITLES

Subtitles should support:

- Dialogue
- Important NPC speech
- Radio
- Phone calls

Include:

- Speaker name
- Dialogue
- Optional sound indicators

Example:

```text
MARA
I found something.
```

---

# 37. SUBTITLE ACCESSIBILITY

Settings:

```text
Subtitles:
ON / OFF

Speaker Names:
ON / OFF

Subtitle Size:
Small / Medium / Large

Background:
Off / Low / High

Color:
Default / High Contrast
```

Do not rely solely on character color.

---

# 38. PHONE UI

The phone is one of the major interfaces in the game.

It should feel like a believable device rather than a futuristic hologram.

---

# 39. PHONE OPENING

Phone opens with:

- Short animation
- Darkened world
- Device frame
- Clear application icons

Gameplay should pause or slow depending on context.

---

# 40. PHONE HOME SCREEN

Example:

```text
09:42 PM

MESSAGES
CONTACTS
MAP
CAMERA
PHOTOS
EVIDENCE
SETTINGS
```

Keep the interface compact.

---

# 41. PHONE MESSAGES

Messages should display:

```text
CONTACT NAME
Time

Message...
```

Unread indicator:

```text
●
```

No excessive bubbles or floating glass cards.

---

# 42. PHONE CONTACTS

Contacts should show:

```text
Mara Vale
Jonah Reyes
Elias Ward
Mara Sloane
Nora Kess
```

Each contact can have:

- Name
- Small portrait/icon
- Availability
- Recent interaction

---

# 43. PHONE CALLS

Incoming call:

```text
INCOMING CALL

MARA VALE

ANSWER
DECLINE
```

Use a simple solid overlay.

---

# 44. MAP UI

The map should be one of the most useful interfaces in the game.

Features:

- Districts
- Roads
- Player
- Mission markers
- Side activities
- Safehouses
- Garages
- Shops
- Custom waypoint
- Legend

---

# 45. MAP VISUAL STYLE

Use:

- Dark map background
- Light road lines
- Distinct district labels
- Simple icons
- Limited colors

Do not make the map look like a futuristic holographic interface.

---

# 46. MAP ZOOM

Support:

```text
Zoom in
Zoom out
Pan
Center on player
Set waypoint
Remove waypoint
```

Smooth zooming is preferred.

---

# 47. MAP LEGEND

Legend categories:

```text
MAIN MISSION
SIDE MISSION
SAFEHOUSE
GARAGE
SHOP
POLICE
IMPORTANT LOCATION
COLLECTIBLE
CUSTOM WAYPOINT
```

The player should be able to toggle categories.

---

# 48. PAUSE MENU

Pause menu:

```text
RESUME
MAP
PHONE
MISSIONS
INVENTORY
PROGRESS
SAVE
LOAD
SETTINGS
QUIT
```

Use a simple solid menu.

---

# 49. PAUSE MENU VISUAL

The world may remain visible behind the menu but should be darkened.

Avoid:

- Full glass overlay
- Excessive blur
- Giant cards

Use:

```text
darkened world
+
solid side panel
+
strong typography
```

---

# 50. INVENTORY

Inventory should be functional and fast.

Categories:

```text
WEAPONS
AMMO
ITEMS
MISSION
COLLECTIBLES
```

Each item:

```text
Icon
Name
Quantity
Short description
```

---

# 51. SHOP UI

Shop interface:

```text
SHOP NAME

ITEM
PRICE

PURCHASE
```

After purchase:

```text
PURCHASED

$500
```

Money updates immediately.

---

# 52. ECONOMY FEEDBACK

Money changes should use short notifications.

Example:

```text
+$500
MISSION REWARD
```

or:

```text
-$250
VEHICLE REPAIR
```

Do not constantly display the player's entire financial history.

---

# 53. GARAGE UI

Garage should feel physical.

Possible options:

```text
REPAIR
MODIFY
CHANGE VEHICLE
STORE VEHICLE
EXIT
```

The vehicle itself should remain visible.

---

# 54. SAFEHOUSE UI

Safehouse options:

```text
SAVE
CHANGE CLOTHES
STORE WEAPONS
CHECK PHONE
SLEEP
EXIT
```

Sleeping advances game time.

---

# 55. CHARACTER MENU

Progress screen can show:

```text
STORY
SIDE MISSIONS
COLLECTIBLES
RELATIONSHIPS
VEHICLES
WEAPONS
DISTRICTS
```

Do not turn this into a huge RPG statistics dashboard.

---

# 56. RELATIONSHIP UI

Relationships should preferably be shown through qualitative information rather than numeric bars.

Bad:

```text
MARA
87/100 FRIENDSHIP
```

Better:

```text
MARA VALE

Trusts you.
```

or:

```text
MARA VALE

Currently distant.
```

---

# 57. MISSION LOG

Mission log should organize:

```text
MAIN STORY
SIDE STORIES
COMPLETED
FAILED
```

Each mission:

```text
Title
Description
Status
Last known objective
```

---

# 58. PROGRESS SCREEN

Show meaningful progression:

```text
STORY
12 / 30

SIDE MISSIONS
8 / 20+

DISTRICTS DISCOVERED
7 / 10

SAFEHOUSES
2 / 4
```

Avoid turning everything into percentage completion.

---

# 59. SETTINGS MENU

Categories:

```text
GAMEPLAY
CONTROLS
GRAPHICS
AUDIO
DISPLAY
ACCESSIBILITY
LANGUAGE
SAVE DATA
```

---

# 60. GRAPHICS SETTINGS

Support where technically possible:

```text
Resolution
Render Scale
Texture Quality
Shadow Quality
NPC Density
Traffic Density
View Distance
Post Processing
Anti-Aliasing
VSync
FPS Limit
```

Presets:

```text
LOW
MEDIUM
HIGH
```

---

# 61. AUDIO SETTINGS

Separate:

```text
Master
Music
Dialogue
SFX
Ambient
Vehicle
UI
```

---

# 62. CONTROLS SETTINGS

Show actual bindings.

Example:

```text
MOVE
W A S D

AIM
RIGHT MOUSE

FIRE
LEFT MOUSE

INTERACT
E
```

Allow remapping.

---

# 63. ACCESSIBILITY

Include:

```text
Subtitles
Subtitle size
Subtitle background
High contrast
Camera shake
Screen effects
Aim assistance
Controller vibration
Hold/toggle options
```

---

# 64. NOTIFICATION SYSTEM

Use a centralized notification manager.

Examples:

```text
MISSION UPDATED
NEW MESSAGE
NEW WEAPON
NEW SAFEHOUSE
POLICE SEARCH ENDED
VEHICLE STORED
```

Notifications should stack intelligently.

---

# 65. NOTIFICATION PRIORITY

Priority:

```text
Critical
↓
Mission
↓
Gameplay
↓
Optional
```

Critical notifications can interrupt.

Optional notifications should not.

---

# 66. WORLD LOCATION UI

When entering a district:

```text
OLD HARBOR
VESPERA CITY
```

Small subtitle:

```text
Population: —
```

Avoid unnecessary statistics.

The location title fades away after a few seconds.

---

# 67. LANDMARK DISCOVERY

When discovering a major location:

```text
LOCATION DISCOVERED

OLD HARBOR TERMINAL
```

Then return to gameplay.

---

# 68. TUTORIAL UI

Tutorial prompts should appear only when necessary.

Example:

```text
DRIVING

W / S
Accelerate / Brake

A / D
Steer
```

After the mechanic is demonstrated:

Fade the tutorial away.

---

# 69. TUTORIAL PHILOSOPHY

Teach through gameplay.

Do not display massive instruction walls.

Bad:

```text
WELCOME TO NEON ASHES

HERE ARE 37 CONTROLS...
```

Good:

```text
[E] Enter vehicle
```

Then let the player discover the rest naturally.

---

# 70. CINEMATIC MODE

During important story moments:

Hide most HUD elements.

Possible:

```text
No minimap
No ammo display
No objective
Minimal interaction
```

Restore UI when gameplay resumes.

---

# 71. CINEMATIC LETTERBOX

Use sparingly.

Do not place black bars over every dialogue scene.

Only major cinematic sequences should use them.

---

# 72. UI ANIMATION

Animations should be:

- Fast
- Subtle
- Purposeful

Typical durations:

```text
Micro interaction:
100–150ms

Panel:
150–250ms

Major transition:
250–450ms
```

Avoid slow animations that make menus frustrating.

---

# 73. HOVER STATES

Desktop UI buttons should have:

- Clear hover state
- Slight brightness shift
- Small movement where appropriate

Avoid giant glowing effects.

---

# 74. BUTTON STATES

Every button needs:

```text
Normal
Hover
Focused
Pressed
Disabled
```

Controller navigation must show focus clearly.

---

# 75. FOCUS NAVIGATION

Keyboard/controller users must be able to navigate menus without a mouse.

Focus order must be logical.

Never trap focus inside an inaccessible menu.

---

# 76. INPUT FEEDBACK

Every action should provide feedback.

Examples:

Button press:

```text
visual state
+
small sound
```

Purchase:

```text
visual confirmation
+
sound
+
money update
```

Invalid action:

```text
subtle shake
+
error sound
```

---

# 77. AUDIO UI FEEDBACK

Use different sounds for:

```text
Menu open
Menu close
Selection
Confirm
Cancel
Mission update
Notification
Error
Purchase
Save
```

Avoid excessively loud UI sounds.

---

# 78. SCREEN EFFECTS

Possible effects:

- Damage vignette
- Rain
- Water droplets
- Motion blur
- Camera shake
- Vehicle impact
- Police search tension

All should be restrained.

---

# 79. SCREEN EFFECT SETTINGS

Allow players to reduce:

```text
Camera shake
Motion blur
Flashing
Chromatic effects
Screen distortion
```

---

# 80. MOBILE

Mobile is NOT the primary target.

Do not compromise desktop UI to support mobile.

If mobile support is eventually added:

Create a dedicated touch interface.

Do not simply scale desktop controls down.

---

# 81. ULTRAWIDE

HUD should remain readable at 21:9 and wider.

Avoid placing essential UI so far toward the edges that it becomes uncomfortable.

Use configurable safe zones.

---

# 82. SAFE ZONE

Allow UI to remain inside a configurable screen-safe region.

Example:

```text
5% margin
```

for standard displays.

---

# 83. UI SCALING

Support:

```text
80%
100%
120%
140%
```

where practical.

Text must remain readable at different resolutions.

---

# 84. PERFORMANCE

UI should not become a performance bottleneck.

Avoid:

- Hundreds of DOM elements updating every frame
- Excessive CSS blur
- Continuous expensive animations
- Massive canvas redraws when unnecessary

Use efficient updates.

---

# 85. DOM VS CANVAS

Recommended:

```text
3D world:
WebGL/WebGPU

HUD:
HTML/CSS or lightweight canvas

Complex map:
Canvas/WebGL

Menus:
HTML/CSS
```

Use the appropriate technology for each interface.

---

# 86. UI STATE ARCHITECTURE

UI should reflect game state.

Example:

```text
Game State
↓
UI State
↓
Render
```

Do not make UI the owner of game logic.

---

# 87. UI COMPONENT ARCHITECTURE

Recommended components:

```text
HUD
├── ObjectiveDisplay
├── MoneyDisplay
├── WantedDisplay
├── Minimap
├── WeaponDisplay
├── HealthDisplay
└── NotificationStack

Menus
├── PauseMenu
├── MapMenu
├── InventoryMenu
├── MissionMenu
├── SettingsMenu
└── ProgressMenu

Phone
├── Home
├── Contacts
├── Messages
├── Map
├── Evidence
└── Settings
```

---

# 88. UI DATA FLOW

Example:

```text
Player fires weapon
↓
WeaponSystem
↓
Ammo decreases
↓
EventBus emits AMMO_CHANGED
↓
HUD receives event
↓
AmmoDisplay updates
```

Do not constantly poll every value every frame unless necessary.

---

# 89. UI ERROR HANDLING

If a UI action fails:

Display a clear explanation.

Example:

```text
CANNOT PURCHASE

Insufficient funds.
```

Not:

```text
ERROR 0x48AF
```

Technical details belong in debug mode.

---

# 90. SAVE UI

Save menu:

```text
SAVE GAME

AUTOSAVE
2:43 PM
Mission: The Journalist

SAVE SLOT 1
SAVE SLOT 2
SAVE SLOT 3
```

Display:

- Time
- Mission
- Location
- Playtime where available

---

# 91. LOAD UI

Load menu should show:

```text
MISSION
LOCATION
DATE/TIME
PLAYTIME
```

Use recognizable screenshots/thumbnails only if technically practical.

---

# 92. DELETE SAVE

Require confirmation.

Example:

```text
DELETE SAVE?

This cannot be undone.

CANCEL
DELETE
```

Do not make destructive actions one-click.

---

# 93. FIRST BOOT

First launch:

```text
NEON ASHES
```

Then:

```text
NEW GAME
SETTINGS
```

If no save exists, do not show confusing empty load slots.

---

# 94. MAIN MENU

Recommended:

```text
NEON ASHES

NEW GAME
CONTINUE
LOAD GAME
SETTINGS
CREDITS
QUIT
```

Background:

- Slow cinematic city scene
- Rain or traffic
- Distant lights
- Ambient audio

The menu should already communicate the game's tone.

---

# 95. MAIN MENU PERFORMANCE

Do not render a massive city simulation behind the menu.

Use:

- Small scene
- Pre-rendered background where appropriate
- Limited NPCs
- Limited traffic

---

# 96. CREDITS

Credits should be simple and readable.

Do not make them interactive unless needed.

---

# 97. UI ACCESSIBILITY PRINCIPLE

The interface should communicate through multiple channels:

```text
Text
+
Icon
+
Position
+
Sound
+
Animation
```

Do not rely only on:

```text
red = danger
green = success
```

---

# 98. UI CONSISTENCY

The same action should look the same everywhere.

If:

```text
[E] = interact
```

then every interaction uses E.

If:

```text
ESC = back
```

then ESC consistently backs out of menus.

---

# 99. CONTEXTUAL UI

The interface should adapt to the player's situation.

Example:

Walking:

```text
Interact
Weapon
Map
```

Driving:

```text
Speed
Vehicle condition
Waypoint
```

Combat:

```text
Ammo
Health
Armor
Wanted
```

Phone:

```text
Phone navigation
```

Do not show irrelevant controls.

---

# 100. NO UI CLUTTER

If an element does not help the player:

Remove it.

If an element is only useful occasionally:

Hide it until needed.

If a feature can be understood visually:

Do not add unnecessary explanatory text.

---

# 101. UI SOUND DESIGN

UI sounds should match the physical world.

Examples:

- Mechanical clicks
- Soft button presses
- Phone taps
- Radio interference
- Camera shutter
- Paper/document sounds

Avoid generic sci-fi beeps for everything.

---

# 102. PHONE SOUND DESIGN

Phone interaction should have distinct sounds:

- Unlock
- Notification
- Message received
- Call ringing
- Camera shutter
- Map interaction

Phone audio should feel like an actual device.

---

# 103. MAP SOUND DESIGN

Map:

- Open: short transition
- Cursor move: subtle click
- Zoom: restrained sound
- Waypoint: distinctive confirmation

---

# 104. MISSION UI SOUND

Mission start:

Low, restrained confirmation.

Mission update:

Short notification.

Mission complete:

Distinctive but understated completion sound.

Mission failure:

Low negative tone.

---

# 105. UI TRANSITIONS

World-to-menu transition:

```text
Gameplay
↓
darken
↓
menu
```

Menu-to-gameplay:

```text
menu
↓
fade
↓
world
```

Avoid excessive loading animations when no loading is happening.

---

# 106. UI PRIORITY DURING EMERGENCIES

When multiple notifications appear:

Priority order:

```text
Player death
Mission failure
Critical objective
Police alert
Character call
Normal notification
Optional notification
```

Critical information must never be hidden behind low-priority notifications.

---

# 107. PLAYER DEATH SCREEN

Example:

```text
YOU DIED

RESTART CHECKPOINT
LOAD SAVE
QUIT
```

Optional:

```text
Cause:
Police pursuit
```

Keep it simple.

---

# 108. ARREST SCREEN

Example:

```text
ARRESTED

Evidence lost:
$500 fine
Some ammunition confiscated
```

Then:

```text
CONTINUE
```

Do not force excessive downtime.

---

# 109. VEHICLE UI

When driving:

```text
Vehicle condition
Speed
Waypoint
```

Optional:

```text
Radio station
```

Do not display a giant dashboard overlay.

---

# 110. VEHICLE DAMAGE UI

When damaged:

```text
Vehicle condition:
██████░░░░
```

Only show when relevant.

---

# 111. RADIO UI

When switching stations:

```text
RADIO

VESPERA FM
```

Display briefly, then disappear.

---

# 112. PHONE CALL UI DURING DRIVING

If allowed:

Display a compact call indicator.

Example:

```text
MARA VALE
CALLING...
```

Do not cover the road.

---

# 113. UI DURING CUTSCENES

Default:

```text
HUD hidden
```

Exceptions:

- Dialogue subtitles
- Cinematic objective if required
- Accessibility indicators

---

# 114. WORLD MARKERS

Mission markers should be:

- Clear
- Small
- Contextual

Avoid enormous floating icons.

Distance may appear when useful.

---

# 115. MARKER DEPTH

Markers should respect world geometry.

Do not render mission markers through every wall at full brightness.

Possible behavior:

```text
Visible:
normal marker

Behind obstacle:
dimmed marker

Far away:
direction indicator
```

---

# 116. OFF-SCREEN OBJECTIVES

If the objective is behind the player:

Use a subtle directional indicator.

Do not force a giant arrow in the middle of the screen.

---

# 117. NPC INTERACTION INDICATORS

Important NPC:

```text
[E] TALK
```

Mission NPC:

Use a distinct but restrained marker.

Avoid making every NPC glow.

---

# 118. UI FOR ENVIRONMENTAL CLUES

Important clues can use contextual interaction.

Example:

```text
[E] EXAMINE
```

After interaction:

```text
Kaleb:
"Someone moved this recently."
```

No huge detective-mode overlay is required.

---

# 119. EVIDENCE UI

Phone → Evidence.

Each item:

```text
Evidence #04

Photo
Harbor container

Added:
October 14
```

Player can:

- Inspect
- Zoom
- Read notes
- Connect evidence where relevant

---

# 120. EVIDENCE BOARD

If implemented:

Use a physical-board-inspired layout.

Elements:

```text
Photos
Documents
Names
Locations
Connections
```

Do not make it look like a futuristic holographic conspiracy board.

---

# 121. STORY REVEAL UI

Major discoveries should be mostly cinematic.

Example:

```text
NEW INFORMATION

ADRIAN VOSS
Police informant
```

Then store the information in the relevant journal/evidence system.

---

# 122. CODE REQUIREMENTS

UI code should be modular.

Avoid:

```text
one massive UI.js
```

Use separate components.

Each component should:

- Render
- Update
- Hide/show
- Handle input
- Clean up

---

# 123. UI EVENT HANDLING

Centralize UI events.

Example:

```js
ui.open("map");
ui.close("map");
ui.notify("MISSION_UPDATED", data);
```

Gameplay systems should not manipulate raw DOM elements directly.

---

# 124. RESPONSIVENESS

UI must remain functional at:

```text
1280×720
1366×768
1920×1080
2560×1440
3840×2160
```

Primary target:

```text
1920×1080
```

---

# 125. DEVELOPMENT UI TEST MODE

Debug mode should allow:

```text
Toggle HUD
Show all markers
Show interaction ranges
Show UI bounding boxes
Show safe zone
Show FPS
Force notifications
Force mission updates
Force dialogue
```

This is important for debugging UI overlap.

---

# 126. UI QA CHECKLIST

Test:

- Keyboard
- Mouse
- Controller
- Different resolutions
- Window resizing
- Ultrawide
- Low FPS
- Pause during combat
- Pause during dialogue
- Phone during missions
- Map during wanted state
- Death while menu is open
- Save/load
- Mission completion
- Mission failure

---

# 127. FINAL UX PRINCIPLE

The best UI is often the UI the player barely notices.

The player should always understand:

```text
Where am I?
What am I doing?
What can I interact with?
What is happening?
What changed?
```

without feeling buried underneath interface elements.

---

# 128. FINAL VISUAL PRINCIPLE

NEON ASHES should have an interface that feels:

```text
DARK
PREMIUM
GROUNDED
CINEMATIC
FUNCTIONAL
MINIMAL
RESPONSIVE
ORIGINAL
```

and absolutely NOT:

```text
GLASSY
FLOATING
OVERDESIGNED
SAAS-LIKE
AI-DASHBOARD-LIKE
```

The world is the star.

The UI exists to make the world playable.
