# NEON ASHES — MISSION DESIGN

## 0. PURPOSE

This document defines the mission structure, mission architecture, pacing, objectives, branching, rewards, checkpoints, mission scripting, and campaign progression for **NEON ASHES**.

The mission system must support a long-form single-player campaign with approximately:

- 30 main story missions
- 20+ side missions
- 10+ dynamic/random events
- optional investigation content
- character-specific mission chains
- branching outcomes
- multiple endings

The mission system must be data-driven and extensible.

A mission must be a genuine gameplay experience, not merely:

```text
Go to marker
↓
Press button
↓
Watch dialogue
↓
Mission complete
```

---

# 1. MISSION DESIGN PHILOSOPHY

Every major mission should ideally contain at least three of the following:

- exploration
- driving
- investigation
- dialogue
- stealth
- combat
- pursuit
- escape
- decision-making
- environmental interaction
- character development
- world discovery

Not every mission needs combat.

Not every mission needs driving.

Not every mission needs a dramatic set piece.

Variety is mandatory.

---

# 2. MISSION CATEGORIES

The game supports:

## MAIN STORY MISSIONS

Required for campaign progression.

## CHARACTER MISSIONS

Focused on individual characters.

## SIDE MISSIONS

Optional narrative or gameplay content.

## INVESTIGATION MISSIONS

Focused on discovering information.

## JOBS

Repeatable activities for money.

## RANDOM EVENTS

Dynamic events occurring during free roam.

## SET-PIECE MISSIONS

Large cinematic sequences.

---

# 3. MAIN CAMPAIGN

Target:

**30 main missions**

Structure:

```text
PROLOGUE
Mission 01
Mission 02

ACT I
Mission 03–07

ACT II
Mission 08–13

ACT III
Mission 14–19

ACT IV
Mission 20–25

ACT V
Mission 26–30
```

The campaign should gradually increase in:

- stakes
- complexity
- world awareness
- player freedom
- faction involvement
- emotional intensity

---

# 4. MISSION LENGTH

Target mission durations:

### Small mission

5–10 minutes.

### Standard mission

10–20 minutes.

### Major mission

20–30 minutes.

### Finale/set piece

25–40 minutes.

Not every mission should be long.

A short character-focused mission can be more effective than artificially stretching a mission.

---

# 5. MISSION STRUCTURE

A typical mission can use:

```text
MISSION START
↓
SETUP
↓
TRAVEL
↓
PRIMARY OBJECTIVE
↓
COMPLICATION
↓
SECONDARY OBJECTIVE
↓
ESCALATION
↓
CLIMAX
↓
AFTERMATH
↓
REWARD
```

However, missions should not all follow this exact formula.

---

# 6. MISSION START

Missions may begin through:

- character interaction
- phone call
- message
- location trigger
- safehouse
- discovered evidence
- previous mission completion
- random encounter

Avoid covering the map with giant mission markers.

---

# 7. MISSION INTRODUCTION

Before major missions, establish:

- why Kaleb is doing this
- what he wants
- what could go wrong
- who is involved

Do not dump all information into a single exposition scene.

---

# 8. MISSION OBJECTIVES

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
HACK
STEAL
DELIVER
PROTECT
ESCORT
ESCAPE
CHASE
SURVIVE
DEFEAT
LOSE_POLICE
WAIT
CALL
DECIDE
```

The system must be extensible so new objective types can be added.

---

# 9. OBJECTIVE DESIGN

Objectives should be specific.

Bad:

> Find the evidence.

Better:

> Search the office for anything connecting Meridian Properties to Pier 19.

Best:

> Search the office, photograph the suspicious invoices, and identify the company appearing on both documents.

Objectives should communicate intent without telling the player every step.

---

# 10. OPTIONAL OBJECTIVES

Some missions should contain optional objectives.

Examples:

- don't kill anyone
- remain undetected
- save an NPC
- photograph additional evidence
- recover optional documents
- avoid civilian casualties
- finish within a time limit

Optional objectives can provide:

- extra money
- relationship improvements
- additional evidence
- alternate dialogue
- future advantages

---

# 11. MISSION APPROACHES

Certain missions should support multiple approaches.

Example:

## INFILTRATING A SECURITY FACILITY

Approach A:

Stealth.

Approach B:

Social disguise.

Approach C:

Hack security remotely.

Approach D:

Direct assault.

Not every approach must be available in every mission.

---

# 12. APPROACH CONSEQUENCES

Different approaches can affect:

- wanted level
- faction hostility
- relationships
- evidence obtained
- mission difficulty
- future dialogue

Example:

A stealth approach may leave no witnesses.

A violent approach may trigger a police investigation later.

---

# 13. MISSION CHECKPOINTS

Create checkpoints after meaningful progress.

Examples:

- entering mission location
- completing investigation
- escaping a building
- reaching vehicle
- finishing major combat section

If the player fails:

Resume from the latest checkpoint.

---

# 14. CHECKPOINT RULE

Do not place checkpoints so frequently that failure becomes meaningless.

Do not place them so rarely that the player must repeat large sections.

Ideal:

Every major gameplay phase.

---

# 15. MISSION FAILURE

Possible failure conditions:

- Kaleb dies
- required NPC dies
- required vehicle destroyed
- evidence destroyed
- target escapes
- player leaves mission area
- timer expires
- objective becomes impossible

Not every mistake should cause failure.

---

# 16. SOFT FAILURE

Some missions should support soft failure.

Example:

The player loses the target.

Instead of:

> MISSION FAILED

The mission changes:

> The target got away. Find another lead.

This makes the world feel less scripted.

---

# 17. MISSION BRANCHING

Branching should occur at several levels.

### Small branch

Different dialogue.

### Medium branch

Different mission approach.

### Major branch

Different mission outcome.

### Campaign branch

Different character relationships or ending conditions.

Do not create hundreds of completely separate storylines.

Use controlled branching.

---

# 18. BRANCH CONVERGENCE

Branches can eventually reconnect.

Example:

```text
STEALTH APPROACH
       ↓
Evidence obtained

VIOLENT APPROACH
       ↓
Evidence obtained + police attention
       ↓
      SAME NEXT MISSION
```

The difference is preserved through world-state variables.

---

# 19. WORLD-STATE FLAGS

Mission outcomes should set persistent flags.

Examples:

```text
jonahTrustsKaleb
maraKnowsTruth
wardTrustLevel
drakeAlliance
crossExposed
crossAlive
ledgerIntegrity
lenaTrust
civilianCasualties
```

These flags can affect later missions.

---

# 20. MISSION PREREQUISITES

Missions can require:

- previous mission completed
- character relationship
- evidence collected
- faction state
- player location
- specific item
- story flag

Do not require arbitrary grinding.

---

# 21. MISSION REWARDS

Possible rewards:

- money
- weapons
- ammunition
- vehicles
- safehouses
- contacts
- evidence
- faction reputation
- relationship progress
- story progression
- new activities

---

# 22. MISSION REWARDS SHOULD MATTER

Do not reward the player with meaningless quantities.

A mission should provide something relevant to progression.

Example:

Early game:

$2,000

Later:

$10,000+

Major missions:

Unique vehicles, safehouses, access, evidence, relationships.

---

# 23. MAIN MISSION LIST

The following is the canonical main campaign.

---

# PROLOGUE

## M01 — HOME AGAIN

### Purpose

Introduce Kaleb and Vespera City.

### Start

Outer County.

### Objectives

1. Drive into Vespera.
2. Meet Jonah.
3. Visit Lena's apartment.
4. Search the apartment.
5. Discover missing laptop.
6. Talk to neighbor.
7. Inspect photograph.
8. Discover harbor connection.

### Gameplay

- driving
- exploration
- dialogue
- investigation

### Combat

None.

### Ending

Kaleb decides to investigate the harbor.

---

# M02 — OLD DEBTS

### Purpose

Introduce Jonah, Adrian's history and the Marrow Syndicate.

### Objectives

1. Meet Jonah.
2. Travel to Adrian's old garage.
3. Search garage.
4. Discover hidden documents.
5. Investigate noise.
6. Survive an ambush.
7. Escape.
8. Return to Jonah.

### Gameplay

- driving
- exploration
- investigation
- first combat encounter

### Consequence

Kaleb realizes someone knows he is searching for Lena.

---

# ACT I — THE RETURN

## M03 — THE HARBOR

### Type

Investigation / pursuit.

### Objectives

1. Travel to Old Harbor.
2. Locate the person from Lena's photograph.
3. Observe the meeting.
4. Photograph the exchange.
5. Follow the target.
6. Avoid detection.
7. Retrieve a storage key.
8. Escape the harbor.

### Optional

Photograph additional evidence.

### Failure

Target escapes.

---

# M04 — COLD STORAGE

### Type

Infiltration.

### Objectives

1. Enter abandoned warehouse.
2. Search storage area.
3. Locate shipping records.
4. Photograph documents.
5. Retrieve encrypted drive.
6. Escape when criminals arrive.

### Approaches

- stealth
- direct combat

### Reward

Encrypted drive.

---

# M05 — THE JOURNALIST

### Type

Character/investigation.

### Objectives

1. Meet Mara.
2. Discuss Lena.
3. Travel to property office.
4. Investigate records.
5. Photograph suspicious documents.
6. Return to Mara.

### Combat

None.

### Purpose

Establish Mara as an ally.

---

# M06 — BAD BUSINESS

### Type

Investigation / surveillance.

### Objectives

1. Observe redevelopment area.
2. Follow suspicious contractor.
3. Photograph meeting.
4. Follow vehicle.
5. Identify shell company.
6. Escape surveillance.

### Discovery

The same company appears in multiple suspicious transactions.

---

# M07 — OLD FRIENDS

### Type

Choice mission.

### Setup

Kaleb discovers Jonah owes money to the Marrow Syndicate.

### Choices

A:

Pay Jonah's debt.

B:

Threaten the creditor.

C:

Perform a job for Drake.

### Consequences

Different dialogue and faction relationships.

---

# ACT II — THE MONEY TRAIL

## M08 — PAPER TRAIL

### Type

Investigation.

### Gameplay

Connect financial records.

### Objectives

- inspect documents
- identify shell companies
- visit office
- obtain records
- escape

---

# M09 — NIGHT SHIFT

### Type

Stealth.

### Location

Vespera Strategic Security facility.

### Objectives

- enter facility
- avoid guards
- access terminal
- download records
- photograph security footage
- escape

---

# M10 — WARD

### Type

Dialogue / investigation.

Kaleb gets arrested.

Ward interrogates him.

The player can:

- cooperate
- lie
- remain silent
- accuse someone

Ward reveals that Adrian was once an informant.

---

# M11 — THE BROKER

### Type

Character mission.

Kaleb meets Nora.

The player helps Nora recover equipment.

In return she decrypts Lena's data.

### Major reveal

The words:

**BLACK LEDGER**

appear.

---

# M12 — PROPERTY LINE

### Type

Investigation / protection.

### Objectives

1. Investigate neighborhood.
2. Speak with residents.
3. Discover intimidation campaign.
4. Protect a witness.
5. Escape attackers.

### Purpose

Show the human consequences of redevelopment.

---

# M13 — THE FIRST BETRAYAL

### Type

Defense / escape.

The safehouse is attacked.

### Objectives

1. Detect intruders.
2. Protect evidence.
3. Defend safehouse.
4. Escape.
5. Locate backup vehicle.
6. Reach temporary shelter.

### Major reveal

Jonah admits someone forced him to provide information.

---

# ACT III — THE LEDGER

## M14 — BLACK LEDGER

### Type

Investigation.

Nora decrypts additional information.

The player discovers connections between:

- Marrow Syndicate
- Vespera Strategic Security
- property developers
- corrupt officials

---

# M15 — THE OTHER SIDE

### Type

Police cooperation.

Ward asks Kaleb to obtain evidence against Cross.

The mission involves:

- surveillance
- driving
- infiltration

---

# M16 — SECURITY BREACH

### Type

Major stealth mission.

Kaleb enters a Vespera Strategic Security building.

### Final discovery

Security footage shows Lena alive.

---

# M17 — THE MESSAGE

### Type

Character / investigation.

Kaleb receives:

> "Stop looking for me."

He investigates the origin of the message.

He discovers that Lena was forced to send it.

---

# M18 — FATHER'S FILE

### Type

Emotional investigation.

Kaleb accesses Adrian's old police file.

### Reveal

Adrian was an informant.

He had criminal connections.

He was investigating the Black Ledger.

---

# M19 — BURN NOTICE

### Type

Major escape mission.

Cross realizes Kaleb is dangerous.

### Gameplay

- driving
- combat
- police pursuit
- escaping multiple locations

### World effect

Security presence increases throughout several districts.

---

# ACT IV — COLLISION

## M20 — THE MEETING

### Type

Character mission.

Kaleb finally meets Lena.

No combat.

No chase.

The mission is dialogue-focused.

They discuss:

- why she disappeared
- Adrian
- the Black Ledger
- Kaleb's actions

---

# M21 — FAMILY BUSINESS

Lena explains Adrian's final investigation.

Kaleb learns his father tried to expose the network.

---

# M22 — THE CLEANUP

Cross begins eliminating people connected to the investigation.

The player must protect an ally.

Possible protected characters:

- Mara
- Ward
- Nora
- Jonah

The available target depends on earlier choices.

---

# M23 — BROKEN ALLIANCES

Drake offers Kaleb a deal.

### Choice

Help Drake access the Black Ledger.

Or:

Refuse.

Or:

Pretend to cooperate and betray him.

---

# M24 — THE FALL

A major operation fails.

Someone betrays the group.

The traitor depends on previous choices.

Lena disappears.

The group is fractured.

---

# M25 — ASHES

Kaleb returns to Adrian's garage.

He discovers Adrian's hidden recording.

This is a major emotional turning point.

The message warns Kaleb:

**Do not become me.**

---

# ACT V — THE CHOICE

## M26 — THE ARCHIVE

Kaleb, Lena, Mara and Nora plan to obtain the complete archive.

The player prepares:

- equipment
- vehicle
- weapons
- contacts

Preparation choices can affect the mission.

---

# M27 — CITY OF SECRETS

The player gathers final evidence.

Possible approaches:

- stealth
- hacking
- bribery
- faction assistance
- direct assault

---

# M28 — CROSSING THE LINE

Kaleb confronts Damien Cross.

Cross attempts to justify the system.

The player chooses:

- kill Cross
- expose Cross
- use Cross as leverage

---

# M29 — THE LEDGER

The complete archive is obtained.

The player decides what to do.

Options:

1. Release everything.
2. Release selected evidence.
3. Give evidence to authorities.
4. Sell the information.
5. Destroy the archive.

This decision strongly affects the ending.

---

# M30 — LAST LIGHT

Final mission.

Objectives depend on previous decisions.

Possible gameplay:

- escape
- confrontation
- evidence delivery
- police pursuit
- final character interactions

End with one of the major endings.

---

# 24. SIDE MISSION DESIGN

Side missions should have narrative value.

Minimum:

**20 side missions.**

Divide them into character arcs.

---

# 25. JONAH SIDE ARC

Target:

4 missions.

Themes:

- debt
- friendship
- responsibility

Possible missions:

### J01 — RUNNING ON EMPTY

Help Jonah recover a stolen vehicle.

### J02 — THE DEBT

Deal with his creditor.

### J03 — BAD CUSTOMERS

Protect the garage.

### J04 — FAMILY

Jonah must choose whether to leave the city.

His ending depends on Kaleb's behavior.

---

# 26. MARA SIDE ARC

Target:

4 missions.

Themes:

- journalism
- truth
- responsibility

Missions involve:

- gathering evidence
- protecting sources
- investigating corruption
- publishing information

---

# 27. NORA SIDE ARC

Target:

4 missions.

Themes:

- technology
- guilt
- identity

Missions involve:

- retrieving hardware
- breaking into systems
- escaping security
- destroying old data

---

# 28. WARD SIDE ARC

Target:

4 missions.

Themes:

- police corruption
- loyalty
- justice

Missions involve:

- surveillance
- evidence
- protecting informants
- internal investigations

---

# 29. OPTIONAL CITY STORIES

Additional side missions can involve ordinary citizens.

Examples:

- missing vehicle
- neighborhood dispute
- struggling business
- runaway teenager
- corrupt landlord
- illegal racing group
- suspicious construction project

These missions make the city feel inhabited.

---

# 30. RANDOM EVENTS

Random events should appear naturally during free roam.

Examples:

### ROBBERY

Player witnesses a robbery.

### CARJACKING

NPC attempts to steal another vehicle.

### POLICE CHASE

Police pursue a criminal.

### STREET FIGHT

Two groups fight.

### SUSPICIOUS EXCHANGE

Possible faction activity.

### CRASH

NPC vehicle crashes.

### HELP REQUEST

NPC asks Kaleb for assistance.

Random events can have multiple outcomes.

---

# 31. RANDOM EVENT FREQUENCY

Random events should NOT occur constantly.

Allow cooldowns.

Avoid spawning another event immediately after completing one.

The world should feel organic.

---

# 32. MISSION DIALOGUE

Dialogue should be contextual.

Characters should reference:

- previous missions
- choices
- relationships
- current world state

Example:

If Kaleb betrayed Drake:

Drake should acknowledge it later.

If Kaleb saved Jonah:

Jonah should remember it.

If Kaleb ignored Mara:

Mara should react.

---

# 33. MISSION PHONE CALLS

Phone calls can happen:

- before missions
- during missions
- after missions
- during free roam

Do not interrupt important gameplay unnecessarily.

---

# 34. PHONE MESSAGE MISSION STARTS

Some missions can begin through text messages.

Example:

```text
Mara:
I found something.
Come to the old courthouse.
Don't bring anyone.
```

The player can then choose to go.

---

# 35. MISSION MARKERS

Use different marker types.

Main story:

Strong but restrained.

Side mission:

Distinct but less prominent.

Optional activity:

Small icon.

Do not cover the screen with giant glowing symbols.

---

# 36. MISSION AREA DESIGN

Mission areas should feel integrated into the world.

Avoid spawning the player inside artificial arenas.

Whenever possible:

Start from the actual city.

Travel to the destination.

Enter the location naturally.

---

# 37. MISSION TRAVEL

Travel should not always be skipped.

Driving to missions can provide:

- dialogue
- radio
- environmental storytelling
- random events

However, do not force excessively long drives.

---

# 38. OPTIONAL SKIP

If a mission has already been completed once:

Certain repeated travel segments can optionally be shortened during replay.

Do not skip first-time narrative sequences automatically.

---

# 39. MISSION REPLAY

Optional mission replay system.

Players can replay completed missions from a menu.

Replay should not overwrite current campaign state.

Use a separate temporary mission state.

---

# 40. MISSION RATING

Optional mission rating:

- completion time
- optional objectives
- casualties
- stealth
- accuracy

Do NOT make the rating system mandatory.

The campaign should not require perfect scores.

---

# 41. MISSION CONSEQUENCES

Consequences should sometimes appear several missions later.

Example:

Mission 07:

Kaleb helps Drake.

Mission 13:

Drake provides information.

Mission 23:

Drake demands repayment.

This creates narrative continuity.

---

# 42. CONSEQUENCE DELAY

Not every decision needs immediate feedback.

Some consequences should remain hidden until later.

This makes decisions feel more meaningful.

---

# 43. MISSION DIFFICULTY

Difficulty should increase gradually.

Early game:

Simple objectives.

Mid game:

Multiple systems interacting.

Late game:

Complex missions with multiple factions.

Final missions:

Highest stakes.

---

# 44. ENEMY ESCALATION

Early:

Small criminal groups.

Middle:

Organized criminals and security.

Late:

Elite security and coordinated faction attacks.

Do not simply increase enemy health.

Increase:

- tactics
- numbers
- equipment
- positioning
- coordination

---

# 45. MISSION ENVIRONMENT REACTIVITY

Missions should interact with the open world.

Examples:

A chase can continue through traffic.

Police can become involved.

NPCs can flee.

Vehicles can crash.

Other factions can intervene.

---

# 46. MISSION SCRIPTING

Mission scripts should be event-driven.

Example:

```text
ON_ENTER_AREA
    spawnTarget()

ON_TARGET_SPOTTED
    beginChase()

ON_TARGET_ESCAPES
    updateObjective()

ON_POLICE_ALERT
    increaseWantedLevel()

ON_PLAYER_ESCAPES
    completeObjective()
```

Avoid hard-coding every mission into one giant conditional function.

---

# 47. MISSION DATA FORMAT

Use structured mission data.

Example:

```text
mission:
    id
    title
    act
    type
    start
    prerequisites
    objectives
    optionalObjectives
    dialogue
    checkpoints
    failConditions
    rewards
    consequences
    nextMissions
```

The exact implementation format can be JSON, JavaScript objects, TypeScript interfaces, or another appropriate structure.

---

# 48. MISSION STATE

Every active mission should track:

```text
NOT_STARTED
AVAILABLE
ACTIVE
PAUSED
CHECKPOINT
COMPLETED
FAILED
LOCKED
```

Mission state must persist when appropriate.

---

# 49. OBJECTIVE STATE

Each objective should support:

```text
LOCKED
AVAILABLE
ACTIVE
COMPLETED
FAILED
OPTIONAL
```

Only relevant objectives should appear in the HUD.

---

# 50. MISSION EVENT SYSTEM

Mission events may trigger:

- dialogue
- NPC spawning
- vehicle spawning
- police response
- world-state changes
- objective changes
- music changes
- cutscenes

---

# 51. CUTSCENES

Use cutscenes selectively.

Best uses:

- major reveals
- emotional moments
- major character meetings
- final confrontations

Do not turn every mission into a cutscene.

Gameplay should remain the primary experience.

---

# 52. IN-GAME DIALOGUE

Whenever possible, let characters talk during:

- driving
- walking
- investigation
- preparation

This reduces excessive static exposition scenes.

---

# 53. MISSION VEHICLES

Mission vehicles should be selected intentionally.

Examples:

Fast vehicle:

Escape mission.

Unmarked vehicle:

Surveillance.

Van:

Equipment transport.

Motorcycle:

Narrow-city pursuit.

---

# 54. MISSION NPCS

Mission NPCs must have:

- role
- behavior
- objective
- survival importance
- relationship
- dialogue

Important NPCs should have protected mission states where necessary.

---

# 55. NPC FOLLOWING

Escort missions should be used sparingly.

If used:

NPC should:

- maintain reasonable distance
- avoid getting stuck
- react to threats
- use cover
- enter/exit vehicles
- recover from pathfinding problems

---

# 56. ESCORT MISSION RULE

Do not create frustrating escort missions.

The NPC should not move extremely slowly.

The player should have meaningful ways to protect them.

---

# 57. CHASE MISSIONS

Chases should include:

- target behavior
- traffic interaction
- alternate routes
- obstacles
- police interaction
- possible target escape

Do not make targets follow a perfectly scripted invisible rail.

---

# 58. INVESTIGATION MISSIONS

Investigation missions should involve actual discovery.

Player may:

- inspect objects
- photograph evidence
- search locations
- question NPCs
- connect clues

Do not simply place an arrow over the answer.

---

# 59. STEALTH MISSIONS

Stealth should support:

- line of sight
- noise
- hiding
- distraction
- detection
- alarms

A failed stealth attempt should not always instantly fail the mission.

---

# 60. COMBAT MISSIONS

Combat missions should have environmental variety.

Examples:

- warehouse
- street
- parking garage
- office
- harbor
- construction site

Avoid repeated identical combat arenas.

---

# 61. HEIST-STYLE MISSIONS

At least one major mission should function as a multi-stage operation.

Structure:

```text
Planning
↓
Preparation
↓
Approach
↓
Infiltration
↓
Objective
↓
Unexpected complication
↓
Escape
↓
Aftermath
```

This should be a major campaign highlight.

---

# 62. FINAL MISSION VARIATION

M30 should dynamically reflect the player's previous decisions.

Examples:

If police trust Kaleb:

Police may assist.

If Drake is hostile:

Criminal enemies may appear.

If Mara is trusted:

She may help distribute evidence.

If Nora is loyal:

She assists with the archive.

If Jonah is loyal:

He provides a vehicle.

---

# 63. MISSION MUSIC

Mission music should respond to intensity.

States:

```text
CALM
SUSPICION
TENSION
CHASE
COMBAT
CLIMAX
AFTERMATH
```

Transitions should be smooth.

---

# 64. MISSION COMPLETION

When completing a mission:

1. finish final objective
2. resolve dialogue
3. update world state
4. award rewards
5. update relationships
6. update mission state
7. save progress
8. unlock appropriate content

Do not trigger completion before important state changes have been recorded.

---

# 65. MISSION FAILURE RECOVERY

When a mission fails:

1. stop mission-specific AI
2. remove temporary entities
3. restore world state
4. reset mission state
5. load checkpoint or failure screen
6. preserve unrelated player progress

---

# 66. MISSION CLEANUP

Temporary mission entities must be cleaned up.

Examples:

- enemies
- mission vehicles
- temporary markers
- scripted NPCs
- mission effects

Do not allow them to accumulate in memory.

---

# 67. SIDE CONTENT PRIORITY

If development resources are limited:

Prioritize:

1. main campaign
2. character side arcs
3. investigation content
4. random events
5. repeatable jobs
6. collectibles

---

# 68. NO REPETITIVE MISSION SPAM

Avoid:

```text
Drive here.
Kill three people.
Drive back.
Repeat.
```

If an activity repeats, introduce variation through:

- locations
- targets
- conditions
- rewards
- enemies
- objectives

---

# 69. MISSION QUALITY CHECKLIST

Every major mission should answer:

### WHY?

Why is Kaleb doing this?

### WHO?

Who is involved?

### WHERE?

Why does this location matter?

### WHAT?

What does the player actually do?

### WHAT CHANGES?

What happens because the player completed it?

### WHAT DO I LEARN?

What new information does the player gain?

### WHY SHOULD I CARE?

What emotional or narrative significance does the mission have?

---

# 70. CAMPAIGN PACING

Use a rhythm of:

```text
ACTION
↓
CHARACTER
↓
INVESTIGATION
↓
ACTION
↓
QUIET
↓
REVELATION
↓
ESCALATION
```

Avoid making the entire campaign one continuous gunfight.

---

# 71. ACT PACING

## PROLOGUE

Mystery.

## ACT I

Discovery.

## ACT II

Investigation.

## ACT III

Revelation.

## ACT IV

Collapse.

## ACT V

Choice.

---

# 72. MAJOR REVEALS

Major revelations should occur at meaningful points.

### Reveal 1

Lena may be alive.

### Reveal 2

Lena was investigating the Black Ledger.

### Reveal 3

Adrian was involved.

### Reveal 4

Cross is connected.

### Reveal 5

The system is larger than one person.

### Reveal 6

Lena intentionally disappeared.

### Reveal 7

Kaleb must decide what happens to the evidence.

---

# 73. REVEAL RULE

Do not reveal major information solely through a character saying:

> "Here is everything you need to know."

Whenever possible, let the player discover it through gameplay.

---

# 74. MISSION FORESHADOWING

Mission objectives can contain subtle clues.

Environmental objects can reappear.

Names can appear across documents.

Vehicles can appear in multiple investigations.

Characters can make seemingly unimportant comments that become important later.

---

# 75. MISSION CALLBACKS

Later missions should reference earlier events.

Example:

If Kaleb crashed Jonah's favorite vehicle:

Jonah can complain about it later.

If Kaleb saved someone:

That character may return.

If Kaleb stole a particular vehicle:

It can reappear in the world.

---

# 76. PLAYER FAILURE AS STORY

Failure should sometimes generate alternate dialogue.

Example:

If the player fails a stealth sequence:

A character may later say:

> "So much for staying quiet."

Do not punish the player narratively for every failure, but use failures where practical.

---

# 77. MISSION IMMERSION

Avoid unnecessary:

> "MISSION STARTED"

screens.

Prefer natural transitions.

Character:

> "You ready?"

Player:

Gameplay begins.

Mission title can still appear subtly.

---

# 78. MISSION HUD

During missions display:

- current objective
- optional objective
- waypoint
- relevant timer
- wanted level
- health
- ammunition

Do not display unnecessary information.

---

# 79. OBJECTIVE TEXT

Keep objective text short.

Good:

> Reach the harbor.

Good:

> Photograph the meeting.

Good:

> Lose the police.

Avoid paragraphs in the HUD.

Detailed information belongs in mission menus or dialogue.

---

# 80. MISSION LOG

The phone or pause menu should contain a mission log.

For completed missions show:

- title
- summary
- outcome
- rewards

Do not reveal spoilers unnecessarily.

---

# 81. STORY TIMELINE

Maintain an internal timeline.

Each mission should define approximately when it occurs relative to other missions.

This prevents impossible chronology.

---

# 82. TIME OF DAY

Missions can specify:

- morning
- afternoon
- evening
- night
- dynamic

Do not force every mission to happen at night simply because it looks cinematic.

---

# 83. WEATHER

Some missions can have fixed weather for narrative purposes.

Others should use dynamic weather.

Major missions can deliberately use:

- rain
- storm
- fog
- clear night

when thematically appropriate.

---

# 84. OPEN-WORLD INTEGRATION

After missions:

The player should return naturally to free roam.

Do not constantly teleport the player back to a safehouse.

---

# 85. MISSION REWARD FEEDBACK

After completion:

Show a concise summary:

```text
MISSION COMPLETE

Reward
+$8,500

Evidence Found
+1

Relationship
Mara +++

New Activity
Investigation Board
```

Use clean game UI.

Do NOT use giant floating glass cards or excessive animated gradients.

---

# 86. MISSION DESIGN ANTI-PATTERNS

NEVER rely excessively on:

- waypoint driving
- enemy waves
- forced walking
- escorting
- instant mission failure
- exposition dumps
- repeated shootouts
- repetitive fetch quests
- artificial invisible walls
- scripted enemy teleportation

---

# 87. TECHNICAL MISSION REQUIREMENTS

The mission system must be independent from individual mission content.

A new mission should ideally be addable by defining data rather than rewriting core systems.

Example:

```text
missionData = {
    id: "M31",
    title: "NEW MISSION",
    objectives: [...],
    rewards: {...},
    consequences: [...]
}
```

---

# 88. MISSION DEBUGGING

Developer mode should allow:

- start any mission
- skip objective
- restart checkpoint
- complete objective
- fail mission
- inspect mission state
- inspect active flags
- inspect relationships

This is essential for debugging a 30+ mission campaign.

---

# 89. MISSION TESTING

Every mission must be tested for:

- start conditions
- objective progression
- dialogue
- NPC spawning
- vehicle spawning
- combat
- checkpoint
- failure
- completion
- rewards
- world state
- save/load
- replay

---

# 90. CAMPAIGN COMPLETION REQUIREMENT

The player must be able to progress from:

```text
M01
↓
M02
↓
M03
...
↓
M30
↓
ENDING
```

without manually modifying code or developer state.

---

# 91. FINAL MISSION DESIGN PRINCIPLE

The player should remember missions because of what happened in them, not because of how many enemies they killed.

A good mission should create at least one of these feelings:

- curiosity
- tension
- excitement
- surprise
- relief
- anger
- sadness
- satisfaction
- uncertainty

The ideal reaction after a major mission is:

> **"Holy shit, what happens now?"**

Not:

> **"Okay, another mission completed."**

NEON ASHES should use missions to tell its story, develop its characters, and make Vespera City feel alive—not merely as a mechanism for moving the player from one waypoint to another.