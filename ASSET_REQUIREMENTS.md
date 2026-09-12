# NEON ASHES — ASSET REQUIREMENTS

## Document Purpose

This document defines the complete asset requirements for **NEON ASHES**, including:

- 3D models
- characters
- vehicles
- buildings
- environments
- props
- weapons
- textures
- materials
- animations
- VFX
- lighting
- UI assets
- audio
- music
- cinematics
- environmental effects
- asset optimization
- asset streaming
- naming conventions
- fallback assets
- procedural generation
- licensing/originality
- asset implementation priorities

The goal is to prevent the game from becoming a collection of primitive placeholders.

The game should feel like a **cohesive commercial-quality single-player open-world crime game**, within realistic browser limitations.

---

# 1. CORE ASSET PHILOSOPHY

Assets are not decoration.

Every asset should contribute to at least one of:

1. gameplay
2. atmosphere
3. navigation
4. storytelling
5. world believability
6. character identity
7. faction identity
8. player feedback
9. environmental storytelling

Do not generate assets merely to increase asset count.

A smaller number of highly reusable, coherent assets is preferable to hundreds of unrelated objects.

---

# 2. ASSET QUALITY TARGET

The target is:

> "Stylized-realistic premium browser game."

Not:

- Minecraft-like
- Roblox-like
- generic low-poly demo
- AI dashboard
- mobile game UI
- futuristic glass UI
- collection of primitive cubes
- GTA clone using copied assets

The game should use a coherent visual language.

Assets should share:

- scale
- proportions
- material response
- lighting response
- texture style
- color language
- polygon density
- detail level

---

# 3. ORIGINALITY AND IP RULES

NEON ASHES is an original IP.

Do NOT directly reproduce:

- GTA characters
- GTA logos
- GTA vehicles
- GTA map layouts
- GTA UI
- GTA mission names
- GTA music
- Rockstar assets
- copyrighted game models
- ripped game files
- recognizable copyrighted characters
- trademarked fictional brands

The game may take inspiration from the **genre**, but its assets must be original or legally usable.

Generic concepts such as:

- police cars
- sports cars
- warehouses
- pistols
- apartments
- gas stations
- traffic lights

are acceptable.

Specific recognizable designs copied from existing games are not.

---

# 4. ASSET SOURCES

Assets may come from:

### A. Original generated assets

Preferred.

Examples:

- procedural buildings
- procedural roads
- custom low-poly vehicles
- custom props
- generated textures
- original character models

### B. Procedural assets

Strongly encouraged for the browser version.

Examples:

- buildings
- windows
- roads
- sidewalks
- streetlights
- fences
- vegetation
- traffic props
- debris

### C. Licensed/open assets

Allowed only when licensing permits redistribution and commercial use where applicable.

Every externally sourced asset must have:

```text
source
license
author
modification_permission
redistribution_permission
attribution_requirement
```

recorded in the asset manifest.

### D. Placeholder assets

Allowed during development.

However:

> Placeholder assets must never be mistaken for finished assets.

---

# 5. ASSET DIRECTORY STRUCTURE

Recommended structure:

```text
assets/
│
├── characters/
│   ├── player/
│   ├── civilians/
│   ├── police/
│   ├── factions/
│   └── major_characters/
│
├── vehicles/
│   ├── civilian/
│   ├── police/
│   ├── faction/
│   ├── motorcycles/
│   └── special/
│
├── environment/
│   ├── buildings/
│   ├── roads/
│   ├── sidewalks/
│   ├── vegetation/
│   ├── industrial/
│   ├── harbor/
│   └── landmarks/
│
├── props/
│   ├── street/
│   ├── interior/
│   ├── industrial/
│   ├── residential/
│   ├── commercial/
│   └── interactive/
│
├── weapons/
│
├── animations/
│
├── textures/
│
├── materials/
│
├── vfx/
│
├── audio/
│   ├── music/
│   ├── ambience/
│   ├── vehicles/
│   ├── weapons/
│   ├── footsteps/
│   ├── ui/
│   └── dialogue/
│
├── ui/
│
├── cinematics/
│
└── manifests/
```

---

# 6. FILE FORMAT PREFERENCES

Preferred 3D format:

```text
.glb
```

or:

```text
.gltf + binary/textures
```

Preferred image formats:

```text
.webp
.jpg
.png
```

Use PNG when alpha/transparency is actually required.

Use WebP where browser compatibility and file size make it advantageous.

Audio:

```text
.ogg
.wav
.mp3
```

Prefer compressed formats for shipped runtime assets.

Avoid enormous uncompressed files unless necessary.

---

# 7. CHARACTER ASSETS

## 7.1 Player Character — Kaleb Voss

Kaleb requires a dedicated character asset.

Required:

- full body
- head
- face
- hair
- hands
- shoes
- clothing
- multiple clothing variants
- damage states if practical
- weapon-holding poses
- vehicle entry/exit compatibility

The model must support:

- walking
- running
- sprinting
- crouching
- aiming
- shooting
- melee
- climbing
- entering vehicles
- exiting vehicles
- falling
- getting hit
- dying
- interacting
- phone usage

---

# 8. MAJOR CHARACTER ASSETS

High-priority characters:

1. Kaleb Voss
2. Lena Voss
3. Mara Vale
4. Elias Ward
5. Mara Sloane
6. Vincent Drake
7. Nora Kess
8. Damien Cross
9. Jonah Reyes
10. Adrian Voss

Major characters should have recognizable silhouettes.

Do not make every NPC look identical.

Differences should include:

- height
- build
- hairstyle
- clothing
- skin/material variation
- accessories
- posture
- color palette

---

# 9. CHARACTER CLOTHING SYSTEM

Clothing should be modular where practical.

Example:

```text
character
├── head
├── hair
├── torso
├── legs
├── shoes
├── outerwear
└── accessories
```

Possible clothing:

- T-shirts
- shirts
- jackets
- hoodies
- jeans
- trousers
- sneakers
- boots
- coats
- gloves
- watches
- backpacks
- hats

Clothing should support color/material variants without requiring a completely new model.

---

# 10. NPC CHARACTER VARIANTS

Civilian NPCs should use a modular generation system.

Minimum target:

```text
10+ body variations
15+ hairstyles
20+ tops
15+ bottoms
10+ footwear variants
10+ accessory variants
```

These values are targets, not requirements for the first vertical slice.

The system should combine components to create many unique-looking NPCs.

Avoid visible cloning.

---

# 11. NPC LOD

Characters require distance-based detail.

### Close

Full model + animations.

### Medium

Reduced mesh complexity.

### Far

Simplified model.

### Very far

Billboard/impostor or extremely simplified representation where appropriate.

NPCs outside gameplay relevance should be dramatically cheaper than nearby characters.

---

# 12. CHARACTER ANIMATION REQUIREMENTS

Core animation set:

### Locomotion

- idle
- walk
- fast walk
- jog
- sprint
- backward movement
- strafing
- turning

### Combat

- aim
- fire
- reload
- weapon switch
- hit reaction
- stagger
- death
- cover
- crouch

### Interaction

- open door
- enter vehicle
- exit vehicle
- pick up
- inspect
- phone
- talk
- push
- climb

### Vehicle

- enter driver seat
- exit driver seat
- enter passenger seat
- exit passenger seat
- steering animation

### Social

- talk
- gesture
- point
- argue
- threaten
- laugh
- panic
- surrender

Animation blending should be preferred over hard animation cuts.

---

# 13. FACIAL ANIMATION

Major characters should have at least basic facial expression support.

Target expressions:

- neutral
- angry
- worried
- surprised
- sad
- happy
- suspicious
- determined

If full facial rigging is too expensive for the browser target, use:

- blendshapes
- texture-based facial states
- simplified facial rigs

instead.

---

# 14. VEHICLE ASSETS

The world needs a believable mixture of vehicles.

Minimum categories:

### Civilian

- compact
- sedan
- hatchback
- SUV
- pickup
- van
- luxury sedan
- sports car
- muscle car
- taxi
- delivery vehicle

### Motorcycles

- street bike
- cruiser
- scooter

### Emergency

- police cruiser
- police SUV
- ambulance
- fire vehicle

### Special

- armored vehicle
- faction vehicle
- utility truck

---

# 15. VEHICLE MODEL REQUIREMENTS

Each important vehicle should contain:

- exterior body
- wheels
- windows
- lights
- mirrors
- doors
- interior
- steering wheel
- dashboard
- seats

Gameplay-important vehicles should support:

- headlights
- brake lights
- indicators
- damaged state
- smoke
- tire effects
- doors
- entry points

---

# 16. VEHICLE LOD

Vehicles should have at least:

```text
LOD0 = close gameplay
LOD1 = medium distance
LOD2 = far traffic
LOD3 = extremely simplified
```

Traffic vehicles do not need the same geometric complexity as the player's current vehicle.

---

# 17. VEHICLE DAMAGE

Where practical, vehicles should have multiple visual states:

```text
normal
damaged
heavily_damaged
destroyed
```

Damage may be represented using:

- material changes
- dents
- broken glass
- missing panels
- smoke
- sparks
- deformation

Full physical deformation is optional.

---

# 18. ENVIRONMENT ASSETS

The environment is the largest asset category.

Vespera City requires modular environmental assets.

---

# 19. BUILDING KIT

Create reusable building modules.

Required:

- walls
- corners
- windows
- doors
- roofs
- balconies
- fire escapes
- awnings
- signs
- storefronts
- loading doors
- vents
- pipes
- air-conditioning units

Buildings should be assembled from modules where possible.

This dramatically reduces memory usage.

---

# 20. BUILDING TYPES

At minimum:

### Downtown

- offices
- apartments
- hotels
- banks
- restaurants
- retail

### Old Harbor

- warehouses
- docks
- fish markets
- old apartments
- bars
- repair shops

### Eastline

- dense residential
- shops
- garages
- small businesses

### Redwater

- industrial
- warehouses
- factories
- freight yards

### Meridian

- corporate
- modern residential
- commercial

### North Heights

- wealthy homes
- villas
- gated properties

### Silver Coast

- hotels
- restaurants
- beaches
- apartments

### Southside

- low-income residential
- local shops
- workshops

### Industrial Belt

- factories
- logistics centers
- rail infrastructure
- storage facilities

### Outer County

- roads
- farms
- rural houses
- gas stations
- industrial outskirts

---

# 21. INTERIOR ASSETS

Important interiors must be visually distinct.

Required interior kits:

### Apartment

- sofa
- table
- kitchen
- bed
- wardrobe
- bathroom
- television
- shelves

### Office

- desks
- chairs
- computers
- filing cabinets
- meeting table
- lights

### Warehouse

- pallets
- crates
- forklifts
- shelving
- containers
- industrial lights

### Police

- desks
- evidence boards
- computers
- lockers
- interrogation rooms
- cells

### Garage

- lifts
- tools
- workbenches
- tires
- oil containers
- parts

---

# 22. STREET PROP LIBRARY

Create a reusable street-prop library.

Required:

- traffic lights
- streetlights
- signs
- benches
- trash cans
- dumpsters
- mailboxes
- parking meters
- fire hydrants
- utility poles
- electrical boxes
- newspaper boxes
- barriers
- cones
- bollards
- fences
- advertisements
- bus stops
- construction equipment

---

# 23. ENVIRONMENTAL STORYTELLING PROPS

Certain props should communicate story.

Examples:

- abandoned vehicles
- blood traces
- broken doors
- evidence bags
- missing-person posters
- police tape
- newspaper stacks
- surveillance cameras
- burned documents
- hidden weapons
- discarded phones
- photographs
- handwritten notes
- damaged machinery

These assets should be placed intentionally.

---

# 24. INTERACTIVE PROPS

Interactive assets should visually communicate interaction.

Examples:

- doors
- drawers
- computers
- phones
- switches
- vending machines
- cash registers
- safes
- vehicle trunks
- garage tools
- evidence objects

Interactive objects require:

```text
interaction_point
interaction_animation
interaction_sound
interaction_result
```

where appropriate.

---

# 25. WEAPON ASSETS

Required initial weapon categories:

- handgun
- compact SMG
- shotgun
- assault rifle
- precision rifle
- melee weapon

Each weapon requires:

- first/third-person model as appropriate
- magazine
- muzzle
- firing effect
- reload animation
- impact effect
- audio
- shell casing
- icon

Weapon designs must remain original.

---

# 26. PROP DETAIL LEVEL

Not every prop needs high geometry.

Use detail according to importance.

### Hero prop

High detail.

Examples:

- important evidence
- unique vehicle
- major story object

### Gameplay prop

Medium detail.

Examples:

- weapon pickup
- interactive computer
- safe

### Background prop

Low detail.

Examples:

- trash can
- distant AC unit
- distant crate

---

# 27. TEXTURE REQUIREMENTS

Use physically coherent materials.

Important material categories:

- concrete
- asphalt
- brick
- glass
- metal
- painted metal
- wood
- plastic
- rubber
- fabric
- dirt
- rust
- water
- sand
- vegetation

---

# 28. TEXTURE RESOLUTION

Suggested browser budgets:

### Hero assets

1024–2048 textures where genuinely necessary.

### Gameplay assets

512–1024.

### Background assets

256–512.

### Tiny props

128–256.

Do not automatically use 4K textures.

A browser game can become memory-bound very quickly.

---

# 29. TEXTURE ATLASES

Texture atlases should be heavily used.

Examples:

```text
city_props_atlas
street_signs_atlas
warehouse_atlas
interior_atlas
vehicle_details_atlas
npc_clothing_atlas
```

Benefits:

- fewer texture switches
- lower memory usage
- easier batching
- better performance

---

# 30. MATERIAL SYSTEM

Use a small reusable material library.

Example:

```text
MaterialLibrary
├── asphalt
├── concrete
├── paintedMetal
├── rustedMetal
├── glass
├── wood
├── fabric
├── plastic
├── skin
├── rubber
└── water
```

Avoid creating hundreds of nearly identical materials.

---

# 31. DECALS

Decals are important for environmental detail.

Examples:

- graffiti
- dirt
- oil
- cracks
- bullet impacts
- posters
- advertisements
- stains
- road markings

Use decals strategically rather than covering everything.

---

# 32. VEGETATION

Required:

- grass
- bushes
- palm trees
- street trees
- shrubs
- flowers
- weeds
- coastal vegetation

Use instancing aggressively.

Distant vegetation should be extremely cheap.

---

# 33. ROAD ASSETS

Required:

- straight road
- curved road
- intersection
- T intersection
- cross intersection
- highway
- bridge
- ramp
- sidewalk
- parking lot
- alley
- service road

Road markings:

- lane lines
- arrows
- crosswalks
- stop lines
- parking markings

Road systems should be modular.

---

# 34. WATER ASSETS

Vespera City contains a major coastal environment.

Required:

- ocean
- bay
- harbor water
- shoreline
- docks
- piers
- boats
- buoys
- waves
- reflections

Browser-friendly water should prioritize visual illusion over expensive simulation.

Use:

- shaders
- scrolling normals
- reflection approximation
- animated UVs

rather than expensive physical water simulation.

---

# 35. SKY AND WEATHER ASSETS

Required:

- clear sky
- cloudy sky
- sunset
- sunrise
- night
- storm
- rain
- fog
- haze

Weather should influence:

- lighting
- visibility
- reflections
- road appearance
- ambient audio
- NPC behavior
- traffic behavior

---

# 36. VFX ASSETS

Required effects:

### Weapons

- muzzle flash
- smoke
- shell casing
- impact sparks
- bullet impact
- dust

### Vehicles

- tire smoke
- brake smoke
- exhaust
- sparks
- collision effects
- fire

### Environment

- rain
- fog
- dust
- steam
- smoke
- leaves
- debris

### Gameplay

- blood effects where appropriate
- damage indicators
- interaction effects
- objective feedback
- phone notifications

Effects should be lightweight.

---

# 37. PARTICLE BUDGET

Avoid uncontrolled particle counts.

Particles must have:

- maximum count
- lifetime
- spawn rate
- distance cutoff

Example:

```text
muzzleFlash:
maxParticles = 20

vehicleSmoke:
maxParticles = 50

rain:
maxParticles = 1000
```

Actual values should be profiled.

---

# 38. LIGHTING ASSETS

Lighting should primarily come from reusable light systems.

Examples:

- streetlights
- building lights
- storefront lights
- vehicle headlights
- neon signs
- harbor lights
- emergency lights

Avoid hundreds of expensive real-time lights.

Prefer:

- baked/static lighting where practical
- emissive materials
- light probes
- clustered/limited dynamic lighting
- fake lighting for distant objects

---

# 39. NEON / NIGHT LIGHTING

Despite the name NEON ASHES, do not turn the entire city into a neon cyberpunk environment.

Neon should be concentrated in:

- nightlife districts
- signs
- bars
- clubs
- advertisements
- select storefronts

Most of the city should still feel like a believable modern coastal city.

---

# 40. UI ASSETS

UI must follow `UI_UX_SPEC.md`.

Absolute rule:

# NO GLASSMORPHISM

Do NOT create:

- glass cards
- blurred transparent panels
- floating translucent dashboards
- excessive transparency
- glowing glass rectangles
- SaaS-style UI
- AI dashboard aesthetics

Use:

- solid surfaces
- clear hierarchy
- strong typography
- restrained borders
- subtle shadows
- minimal animation
- contextual overlays

---

# 41. REQUIRED UI ICONS

Create icons for:

- pistol
- rifle
- ammunition
- health
- armor
- money
- vehicle
- garage
- safehouse
- mission
- objective
- phone
- map
- evidence
- police
- faction
- clothing
- interaction
- save
- settings

Icons should share one visual language.

---

# 42. MAP ASSETS

The map requires:

- roads
- district boundaries
- landmarks
- mission markers
- safehouses
- shops
- garages
- police stations
- discovered locations
- player marker
- waypoint
- route

Map representation should remain readable at multiple zoom levels.

---

# 43. AUDIO ASSETS

Audio is essential.

A visually simple game with excellent audio can feel significantly more convincing.

Required audio categories:

```text
audio/
├── ambience/
├── vehicles/
├── weapons/
├── footsteps/
├── environment/
├── dialogue/
├── phone/
├── ui/
├── music/
└── missions/
```

---

# 44. ENVIRONMENT AUDIO

Create ambient layers for:

### Downtown

- traffic
- pedestrians
- distant sirens
- HVAC
- construction

### Harbor

- waves
- ship horns
- machinery
- containers
- gulls
- workers

### Industrial

- machinery
- generators
- trucks
- metal impacts

### Residential

- distant conversations
- televisions
- dogs
- traffic
- air conditioners

### Beach

- waves
- wind
- distant crowds
- birds

---

# 45. VEHICLE AUDIO

Each vehicle class should have:

- idle
- acceleration
- high RPM
- braking
- tire squeal
- collision
- horn
- door
- ignition

Audio pitch should respond to speed/RPM where possible.

Do not use one identical engine sound for every vehicle.

---

# 46. WEAPON AUDIO

Each weapon should have:

- shot
- distant shot
- suppressed shot where applicable
- reload
- magazine insertion
- magazine removal
- dry fire
- impact
- casing

Use variation to avoid repetitive loops.

---

# 47. FOOTSTEP AUDIO

Footsteps should vary by surface:

- concrete
- asphalt
- grass
- metal
- wood
- sand
- indoor flooring

Use randomized pitch/volume variation.

---

# 48. MUSIC

The game should use an original soundtrack or legally licensed music.

Music categories:

- exploration
- tension
- combat
- chase
- stealth
- emotional
- investigation
- mission climax
- ending themes

Music should react dynamically to gameplay.

---

# 49. RADIO SYSTEM

Optional but strongly recommended.

Radio stations can include:

- talk/news
- music
- local culture
- underground/faction content

Radio content should reinforce the world.

Avoid copyrighted commercial music unless legally licensed.

---

# 50. DIALOGUE AUDIO

Major characters should eventually receive voiced dialogue.

However, if voice generation is not available during development:

1. implement dialogue text first
2. support placeholder voice
3. keep dialogue data independent from audio
4. add final voice later

Never hard-code dialogue directly into gameplay logic.

---

# 51. DIALOGUE DATA

Example:

```json
{
  "speaker": "Mara Vale",
  "text": "You shouldn't have come back.",
  "voice": "mara_warning_01",
  "emotion": "concerned",
  "duration": 3.2
}
```

---

# 52. CINEMATIC ASSETS

Required cinematic support:

- camera paths
- character staging
- animation clips
- dialogue
- facial expressions
- lighting overrides
- music
- sound effects

Cutscenes should use the same world and character assets whenever practical.

Do not build completely separate cinematic models unless necessary.

---

# 53. LANDMARK ASSETS

Each major district needs memorable landmarks.

Examples:

### Central Vesper

- central tower
- civic plaza
- financial district

### Old Harbor

- old lighthouse
- container terminal
- historic waterfront

### Meridian

- corporate tower
- luxury complex

### Silver Coast

- beach promenade
- major hotel

### North Heights

- hilltop estate
- overlook

### Industrial Belt

- refinery/factory complex
- freight terminal

Landmarks should help players navigate without constantly checking the map.

---

# 54. FACTION VISUAL IDENTITY

Each faction needs recognizable visual language.

### Marrow Syndicate

Possible visual traits:

- dark luxury clothing
- expensive vehicles
- understated branding
- high-quality interiors

### Eastside Crew

Possible traits:

- practical streetwear
- modified vehicles
- neighborhood-specific graffiti
- improvised equipment

### Vespera Strategic Security

Possible traits:

- clean uniforms
- tactical equipment
- corporate vehicles
- surveillance technology

### Police

- standardized uniforms
- marked vehicles
- equipment consistency

Faction identity should be subtle enough to remain believable.

---

# 55. BRANDING ASSETS

Create fictional brands throughout the city.

Examples:

- restaurants
- convenience stores
- banks
- phone companies
- clothing stores
- gas stations
- car dealerships
- newspapers
- radio stations

This prevents the world from feeling like a collection of unnamed buildings.

---

# 56. PROCEDURAL ASSET GENERATION

Procedural generation should be used heavily for:

- buildings
- traffic
- vegetation
- clutter
- pedestrians
- roadside props
- interior variation

However:

> Procedural generation must produce authored-looking results.

Avoid obvious repetition.

---

# 57. MODULAR CITY KIT

The city should be constructed from reusable modules.

Example:

```text
BuildingWall_A
BuildingWall_B
BuildingCorner_A
WindowSet_A
Door_A
Balcony_A
Roof_A
ShopFront_A
```

A single kit should generate many buildings.

---

# 58. ASSET INSTANCING

Use instancing for repeated assets.

Ideal candidates:

- streetlights
- trees
- bushes
- traffic cones
- signs
- benches
- trash cans
- parked cars
- repeated windows
- fences

Do not create thousands of unique copies of identical geometry.

---

# 59. MEMORY BUDGET

The game must assume browser memory is limited.

Avoid:

- unnecessary 4K textures
- duplicate meshes
- duplicate materials
- uncompressed audio everywhere
- permanently loaded districts
- huge monolithic scenes

Assets must support streaming/unloading.

---

# 60. WORLD STREAMING

The city should be divided into cells.

Example:

```text
world/
├── cell_00_00
├── cell_00_01
├── cell_00_02
├── cell_01_00
└── ...
```

Load:

- nearby gameplay cells
- adjacent transition cells

Unload:

- distant inactive cells

Important persistent state must be stored separately from the rendered asset.

---

# 61. ASSET STREAMING RULE

Never destroy persistent world-state merely because an asset was unloaded.

Example:

If a player damages a vehicle and leaves the area:

```text
vehicle_state = damaged
```

must survive unloading.

When the asset streams back in, the visual state should be reconstructed.

---

# 62. COLLISION ASSETS

Collision meshes should be simpler than render meshes.

Use:

```text
visual_mesh
collision_mesh
interaction_mesh
```

where appropriate.

Do not use highly detailed render geometry as collision geometry unless absolutely necessary.

---

# 63. NAVIGATION ASSETS

NPC navigation requires:

- walkable surfaces
- vehicle roads
- intersections
- crosswalks
- sidewalks
- entrances
- stairs
- ramps
- cover points

Navigation metadata should be separate from decorative meshes where practical.

---

# 64. COVER ASSETS

Combat locations should have meaningful cover.

Examples:

- cars
- walls
- crates
- concrete barriers
- counters
- pillars
- dumpsters

Cover objects need metadata such as:

```text
coverHeight
coverType
canVault
canShootOver
```

---

# 65. INTERACTION POINTS

Assets can expose interaction points.

Example:

```json
{
  "type": "door",
  "position": [0, 0, 0],
  "interactionRadius": 1.5,
  "animation": "door_open",
  "sound": "door_metal_open"
}
```

---

# 66. ASSET NAMING CONVENTION

Use predictable names.

Examples:

```text
CHR_KalebVoss
CHR_LenaVoss
CHR_Civilian_Male_01

VEH_Sedan_01
VEH_PoliceCruiser_01
VEH_Sports_02

BLD_Apartment_Modern_01
BLD_Warehouse_02

PROP_Streetlight_01
PROP_Dumpster_02

WPN_Pistol_01
WPN_Shotgun_01

VFX_MuzzleFlash_Pistol
VFX_TireSmoke_01

SFX_Door_Metal_Open_01
SFX_Gun_Pistol_01
```

Prefixes:

```text
CHR = Character
VEH = Vehicle
BLD = Building
PROP = Prop
WPN = Weapon
VFX = Visual Effect
SFX = Sound Effect
UI = User Interface
ANM = Animation
MAT = Material
TEX = Texture
```

---

# 67. ASSET METADATA

Every significant asset should have metadata.

Example:

```json
{
  "id": "VEH_Sedan_01",
  "category": "vehicle",
  "lods": 4,
  "collision": true,
  "interactive": true,
  "destructible": true,
  "streamable": true,
  "license": "original",
  "memoryClass": "medium"
}
```

---

# 68. ASSET MANIFEST

Maintain a central manifest:

```text
assets/manifests/assets.json
```

Track:

- asset ID
- path
- type
- size
- dependencies
- LODs
- collision
- streaming requirements
- license
- version
- usage count

This makes automated asset validation possible.

---

# 69. ASSET VALIDATION

The build system should detect:

- missing assets
- invalid paths
- broken references
- unsupported formats
- oversized textures
- missing LOD
- missing collision
- duplicate IDs
- missing audio
- invalid metadata

Do not allow silent asset failures.

---

# 70. FALLBACK ASSETS

Every major runtime asset should have a fallback where practical.

Example:

```text
Missing vehicle model
→ substitute generic sedan

Missing NPC clothing
→ use default clothing

Missing texture
→ use default material

Missing audio
→ use generic fallback sound
```

The game should not crash because one optional asset is missing.

---

# 71. PLACEHOLDER ASSET SYSTEM

During early development use standardized placeholders.

Examples:

```text
PLACEHOLDER_CAR
PLACEHOLDER_NPC
PLACEHOLDER_BUILDING
PLACEHOLDER_WEAPON
PLACEHOLDER_PROP
```

Placeholders should be intentionally ugly and obvious.

This prevents them from accidentally becoming permanent final assets.

---

# 72. FIRST PLAYABLE ASSET SET

The first vertical slice does NOT need the entire city.

It requires:

### Characters

- Kaleb
- 3–5 civilian types
- 2 police types
- 2 faction enemies
- at least 2 major story characters

### Vehicles

- 1 player sedan
- 3 civilian vehicles
- 1 motorcycle
- 1 police car
- 1 faction vehicle

### Environment

- one dense district section
- one warehouse
- one street block
- one interior
- one safehouse

### Weapons

- handgun
- shotgun
- melee weapon

### VFX

- muzzle flash
- bullet impact
- tire smoke
- rain
- sparks

### Audio

- footsteps
- basic ambience
- vehicle sounds
- weapon sounds
- UI sounds
- placeholder dialogue

---

# 73. ASSET PRIORITY LEVELS

## P0 — Required Immediately

Without these, gameplay cannot function.

- player model
- basic NPCs
- basic vehicles
- basic environment
- weapons
- collision
- animations
- UI icons
- basic audio

---

## P1 — Required For Vertical Slice

- major character models
- police variants
- faction variants
- better vehicles
- interiors
- environmental props
- weather
- VFX
- cinematic assets
- improved audio

---

## P2 — Required For Full Campaign

- full NPC variety
- district-specific buildings
- landmarks
- faction assets
- full interior kits
- clothing system
- complete weapon library
- full vehicle library
- extensive ambient audio

---

## P3 — Polish

- extra props
- rare vehicles
- extra clothing
- additional animations
- advanced destruction
- advanced VFX
- additional landmarks
- cosmetic details

---

# 74. ASSET REUSE

Reuse should be intentional.

One asset may appear in multiple locations with:

- different materials
- different colors
- different damage states
- different placement
- different lighting

Example:

One warehouse kit can produce:

```text
Old Harbor warehouse
Redwater warehouse
Industrial Belt warehouse
```

while still looking different.

---

# 75. ASSET VARIATION

Variation can be generated through:

- scale
- rotation
- color
- texture variant
- damage
- dirt
- placement
- accessories

Example:

Three identical dumpsters should not appear perfectly aligned everywhere.

---

# 76. DISTANCE-BASED QUALITY

Every asset should have a sensible visual degradation strategy.

```text
0–20m:
high detail

20–60m:
medium detail

60–150m:
low detail

150m+:
very low detail / impostor / unloaded
```

Actual distances must be tuned based on performance.

---

# 77. MOBILE SUPPORT

Desktop is the primary target.

If mobile is supported later:

- reduce texture resolution
- reduce NPC density
- reduce traffic
- disable expensive effects
- reduce shadow quality
- reduce draw distance
- simplify shaders
- reduce audio memory

Do not compromise the desktop version merely to support weak hardware.

---

# 78. GRAPHICS SETTINGS

Provide:

- resolution
- render scale
- quality preset
- shadows
- effects
- vegetation
- NPC density
- traffic density
- draw distance
- anti-aliasing
- reflections
- post-processing

Presets:

```text
Low
Medium
High
Ultra
```

The game should automatically choose a sensible default.

---

# 79. PERFORMANCE TARGETS

Primary target:

```text
1920x1080
60 FPS
```

Secondary:

```text
1280x720
60 FPS
```

High-end:

```text
2560x1440
60 FPS
```

4K is optional.

Stable frame pacing is more important than maximum graphical detail.

---

# 80. PERFORMANCE RULE

Do not add an asset merely because it looks good in isolation.

Measure:

- GPU cost
- CPU cost
- memory usage
- draw calls
- texture memory
- loading time
- streaming cost

A beautiful asset that destroys performance is not a successful asset.

---

# 81. AUDIO MEMORY OPTIMIZATION

Use:

- compressed streaming music
- short reusable SFX
- voice streaming where practical
- variation pools

Do not preload every audio file.

---

# 82. ASSET LOADING

Asset loading should be asynchronous.

Gameplay should not freeze while a distant asset loads.

Use:

```text
loading
queued
loading
ready
failed
fallback
```

states.

---

# 83. ASSET DEPENDENCIES

Example:

```text
CHR_KalebVoss
├── skeleton
├── body_texture
├── hair
├── clothing
├── animations
└── materials
```

Dependency systems should prevent duplicate loading.

---

# 84. VERSIONING

Assets should have versions.

Example:

```text
VEH_Sedan_01_v01
VEH_Sedan_01_v02
```

However, runtime references should preferably use stable IDs:

```text
VEH_Sedan_01
```

while versioning remains internal.

---

# 85. SAVE-GAME COMPATIBILITY

Save files should store asset IDs and gameplay state, not raw asset data.

Example:

```json
{
  "vehicleId": "VEH_Sedan_01",
  "damage": 0.42,
  "paintVariant": 2
}
```

This allows assets to be upgraded without destroying saves.

---

# 86. CINEMATIC ASSET PRIORITY

Major story scenes should receive higher asset quality.

Especially:

- Lena-related scenes
- Adrian flashbacks
- Black Ledger discoveries
- betrayals
- major confrontations
- endings

Important story moments deserve visual attention.

---

# 87. ENVIRONMENTAL STORY ASSET PRIORITY

The following deserve special attention:

- Lena's belongings
- Adrian's garage
- Black Ledger evidence
- police evidence
- faction hideouts
- hidden rooms
- abandoned locations
- important vehicles
- story-specific documents

Players should be able to understand pieces of the story through the environment without dialogue explaining everything.

---

# 88. WEATHER ASSET INTEGRATION

Weather should modify existing assets rather than requiring duplicate worlds.

Example:

Rain modifies:

```text
road material
car material
building material
particle system
lighting
audio
NPC behavior
```

Do not create an entirely separate "rain version" of every asset.

---

# 89. DAMAGE STATE REUSE

Where possible:

```text
normal asset
+
damage material
+
decal
+
VFX
=
damaged asset
```

rather than maintaining separate giant models.

---

# 90. ASSET TEST SCENE

Create an internal asset testing environment containing:

- neutral lighting
- daylight
- nighttime
- rain
- fog
- close camera
- medium camera
- distance camera
- collision test
- animation test
- material test

Every new important asset should be validated here.

---

# 91. ASSET DEBUG TOOLS

Development mode should support:

```text
Asset Inspector
LOD Viewer
Collision Viewer
Bounding Box Viewer
Material Inspector
Texture Memory Viewer
Draw Call Counter
Asset Loading Monitor
NPC Density Viewer
Vehicle Density Viewer
```

These tools are development-only.

---

# 92. AUTOMATED ASSET QA

Before release, automatically verify:

```text
[ ] no missing assets
[ ] no duplicate IDs
[ ] no broken dependencies
[ ] no unsupported formats
[ ] no oversized textures
[ ] all gameplay vehicles have collision
[ ] all weapons have required effects
[ ] all major characters have required animations
[ ] all mission assets exist
[ ] all UI icons exist
[ ] all critical audio references exist
```

---

# 93. ASSET QUALITY CHECKLIST

Every finished asset should answer:

### Visual

- Does it fit the game's art direction?
- Is its scale correct?
- Does it look believable?
- Does it match surrounding assets?

### Technical

- Is it optimized?
- Does it have appropriate LOD?
- Does it have proper collision?
- Are textures appropriately sized?
- Does it stream correctly?

### Gameplay

- Can the player interact with it where intended?
- Does it communicate its function?
- Does it work with AI/navigation?

### Audio

- Does it have required sounds?

### Story

- Does it support world-building where appropriate?

---

# 94. WHAT COUNTS AS A "FINISHED" ASSET

An asset is not finished simply because a model file exists.

A finished gameplay asset requires, where applicable:

```text
MODEL
+ MATERIAL
+ TEXTURE
+ COLLISION
+ LOD
+ ANIMATION
+ AUDIO
+ VFX
+ INTERACTION
+ METADATA
+ TESTING
```

Not every category applies to every asset.

---

# 95. AI-GENERATED ASSET RULES

If AI is generating assets:

### Good

- generate modular pieces
- generate variations
- generate textures
- generate concept references
- generate procedural geometry
- generate simple props

### Bad

- generate one giant city mesh
- generate thousands of unique high-poly objects
- generate assets with inconsistent scales
- generate assets with broken topology
- generate assets without collision
- generate huge textures unnecessarily
- generate assets that cannot be streamed

The AI must prioritize **usable game assets**, not impressive screenshots.

---

# 96. NO FAKE ASSETS

Do not simulate asset implementation by merely drawing:

```text
[CAR]
[BUILDING]
[NPC]
```

or using static screenshots.

If the player can interact with something, it must exist as an actual game entity.

Examples:

A vehicle must be:

- rendered
- collidable
- drivable where intended
- targetable
- enterable where intended
- integrated with traffic

A weapon must:

- render
- fire
- consume ammunition
- produce effects
- interact with combat systems

A building entrance must:

- actually lead somewhere
- or intentionally be inaccessible

---

# 97. ASSET PLACEHOLDER ESCALATION

Development should progressively replace placeholders.

### Phase 1

Primitive placeholders.

### Phase 2

Low-detail functional assets.

### Phase 3

Styled assets.

### Phase 4

Optimized production assets.

### Phase 5

Polished assets.

Do not attempt to create every final asset before the game systems work.

---

# 98. DEVELOPMENT ORDER

Recommended order:

```text
1. player
2. basic NPC
3. basic vehicle
4. basic environment
5. weapon
6. collision
7. animation
8. UI
9. audio
10. major characters
11. interiors
12. district kits
13. VFX
14. landmarks
15. polish
```

---

# 99. VERTICAL SLICE ASSET RULE

The first playable build should demonstrate:

> "This is actually a game."

It should contain enough finished assets to create a convincing 15–30 minute experience.

The player should be able to:

```text
spawn
↓
walk through a real street
↓
see civilians
↓
see traffic
↓
enter a vehicle
↓
drive
↓
reach a mission
↓
talk to a character
↓
fight or pursue an objective
↓
interact with the environment
↓
complete the mission
↓
return to the world
```

This is more important than having a gigantic unfinished map.

---

# 100. FINAL ASSET PRINCIPLE

The asset pipeline must support one fundamental goal:

> **Make Vespera City feel like a place that existed before the player arrived and will continue existing after the player leaves.**

Every street should contain believable variation.

Every district should have its own identity.

Every major character should be recognizable.

Every important vehicle should feel physical.

Every interior should communicate purpose.

Every interaction should have visual and audio feedback.

Every asset should be optimized for the browser.

And most importantly:

**Do not build an enormous collection of pretty placeholders. Build a smaller number of real, interconnected, reusable assets that actually function inside the game.**

The final result should feel like a **real open-world game constrained intelligently by browser technology**, not a technical demo pretending to be one.