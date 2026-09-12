# NEON ASHES — PROGRESSION & ECONOMY SPECIFICATION

## 0. PURPOSE

This document defines how player progression, money, equipment, vehicles, properties, relationships, reputation, unlocks, and long-term rewards function in NEON ASHES.

The progression system must make the player feel increasingly capable without turning the game into a traditional RPG.

NEON ASHES is primarily a narrative-driven open-world action game.

Progression should support:

- Story progression
- Player freedom
- Equipment improvement
- Vehicle ownership
- Financial growth
- Safehouse expansion
- Character relationships
- Access to new areas
- Optional activities
- Multiple approaches to missions

Progression should NOT become:

- A generic XP grind
- A loot treadmill
- A giant skill tree full of meaningless +5% upgrades
- A repetitive money farm
- A pay-to-win style economy
- A reason to replay the same activity hundreds of times

---

# 1. PROGRESSION PHILOSOPHY

The player's sense of progression should come from five major sources:

```text
STORY
+
MONEY
+
EQUIPMENT
+
RELATIONSHIPS
+
KNOWLEDGE / ACCESS
```

The most important progression is not numerical.

At the beginning:

> Kaleb knows very little and has very few resources.

By the end:

> Kaleb understands the city, knows who to trust, has access to better resources, and has the ability to influence major events.

---

# 2. PROGRESSION CATEGORIES

The game has six major progression systems:

1. Story progression
2. Financial progression
3. Equipment progression
4. Vehicle progression
5. Relationship progression
6. World/access progression

These systems should interact.

---

# 3. STORY PROGRESSION

The main campaign contains:

```text
PROLOGUE
+
ACT I
+
ACT II
+
ACT III
+
ACT IV
+
ACT V
+
EPILOGUE
```

There are approximately:

```text
30 MAIN MISSIONS
20+ SIDE MISSIONS
10+ RANDOM EVENTS
```

Main story progression is the primary progression path.

---

# 4. STORY UNLOCK STRUCTURE

Story missions unlock through:

```text
Previous mission completion
+
World state
+
Character availability
+
Required discoveries
```

Do not require arbitrary player levels.

Bad:

> "You need Level 12 to continue."

Good:

> "Mara needs the evidence from the warehouse before she can continue the investigation."

---

# 5. ACT PROGRESSION

## PROLOGUE

Player learns:

- Movement
- Driving
- Garage
- Basic interaction
- Kaleb's motivation
- Lena's disappearance

Starting resources should be intentionally limited.

---

## ACT I

Player gains:

- Access to Southside
- Basic weapons
- Basic vehicle ownership
- Mara contact
- Initial police interactions

---

## ACT II

Player gains:

- Wider city access
- Better vehicles
- More weapons
- Larger income opportunities
- More character relationships

---

## ACT III

Player gains:

- Advanced contacts
- Better equipment
- Larger missions
- Access to restricted areas
- Deeper understanding of the Black Ledger

---

## ACT IV

Player gains:

- High-risk opportunities
- Major resources
- Significant faction consequences
- Endgame preparation

---

## ACT V

Progression shifts away from material rewards.

The player's previous decisions become more important than money.

---

# 6. PLAYER LEVEL SYSTEM

## NO TRADITIONAL PLAYER LEVEL.

Do not use:

```text
Level 1
Level 2
Level 3
...
Level 50
```

The game should not require grinding.

Kaleb becomes more capable through:

- Better equipment
- New contacts
- New vehicles
- Story unlocks
- Player skill
- Optional upgrades

---

# 7. SKILLS

If a skill system is implemented, keep it small.

Recommended categories:

```text
DRIVING
COMBAT
STEALTH
MECHANICS
SOCIAL
```

These should not become traditional RPG stats.

---

# 8. SKILL IMPROVEMENT

Skills should primarily improve through use.

Example:

Repeated vehicle modification can unlock:

```text
ADVANCED VEHICLE TUNING
```

Repeated successful stealth missions can unlock:

```text
QUIETER MOVEMENT
```

Avoid:

> "Spend 3 skill points to get +7% stealth."

---

# 9. SKILL UNLOCKS

Example:

```text
Driving experience
↓
Improved vehicle control

Combat experience
↓
Faster reload

Stealth experience
↓
Improved detection recovery

Mechanics experience
↓
Cheaper repairs

Social experience
↓
Additional dialogue options
```

Bonuses should remain modest.

---

# 10. MONEY SYSTEM

Money is the primary conventional currency.

Variable:

```js
player.money
```

Money must be managed by the EconomySystem.

Never directly modify money from random UI code.

---

# 11. STARTING MONEY

Kaleb begins with a modest amount of cash.

Recommended:

```text
$1,200
```

This should be enough for basic necessities but not enough to remove financial pressure.

---

# 12. MONEY SOURCES

Player can earn money through:

### Main missions

Primary source during campaign.

### Side missions

Moderate rewards.

### Random events

Small to moderate rewards.

### Vehicle work

Mechanical jobs.

### Racing

Optional income.

### Property income

Late-game.

### Exploration

Small rewards.

---

# 13. MONEY SINKS

Money can be spent on:

- Weapons
- Ammunition
- Vehicle repairs
- Vehicle modifications
- Clothing
- Safehouse upgrades
- Property
- Consumables
- Services
- Optional activities

---

# 14. ECONOMY PRINCIPLE

Money should feel useful without becoming overwhelmingly important.

The player should generally experience:

```text
Early:
Money is meaningful.

Middle:
Money provides freedom.

Late:
Money provides convenience and optional luxury.
```

---

# 15. MISSION REWARDS

Main mission rewards should scale with story importance.

Example:

```text
Early missions:
$250–$1,000

Mid-game:
$1,000–$5,000

Late-game:
$5,000–$25,000
```

Do not inflate rewards so quickly that money becomes meaningless.

---

# 16. SIDE MISSION REWARDS

Typical:

```text
Small:
$100–$500

Medium:
$500–$2,000

Large:
$2,000–$10,000
```

Rewards can also include:

- Contacts
- Vehicles
- Equipment
- Safehouse access
- Information
- Discounts

---

# 17. RANDOM EVENT REWARDS

Random events should generally provide:

```text
$50–$1,000
```

depending on difficulty.

Not every random event needs a monetary reward.

Some should provide:

- Reputation
- Information
- Relationship improvement
- Items
- Future opportunities

---

# 18. MONEY DISPLAY

HUD:

```text
$12,450
```

Keep it small.

When money changes:

```text
+$500
MISSION REWARD
```

or:

```text
-$300
VEHICLE REPAIR
```

---

# 19. PRICE PHILOSOPHY

Prices should feel believable within the game's fictional economy.

Do not make:

```text
$10,000 sandwich
$50,000 haircut
```

unless deliberately comedic.

---

# 20. WEAPON ECONOMY

Weapons should have meaningful prices.

Example categories:

```text
Basic handgun:
$600–$1,200

Advanced handgun:
$1,500–$3,000

SMG:
$2,500–$5,000

Shotgun:
$2,000–$4,500

Rifle:
$4,000–$8,000
```

These are balancing targets, not real-world pricing.

---

# 21. AMMUNITION ECONOMY

Ammo should cost enough to matter but never become tedious.

Example:

```text
Pistol:
$20–$40 per box

SMG:
$40–$70

Shotgun:
$30–$60

Rifle:
$60–$100
```

---

# 22. WEAPON PROGRESSION

Weapons should progress through:

```text
Basic
↓
Reliable
↓
Advanced
```

Do not create hundreds of nearly identical weapons.

Each weapon should have a reason to exist.

---

# 23. WEAPON UPGRADES

Possible upgrades:

- Magazine
- Optics
- Suppressor where appropriate
- Grip
- Recoil modification
- Cosmetic finish

Do not turn upgrades into enormous stat spreadsheets.

---

# 24. VEHICLE PROGRESSION

Vehicle ownership is a major progression system.

Player can acquire:

- Cars
- Motorcycles
- Utility vehicles
- Performance vehicles

---

# 25. STARTING VEHICLE

Kaleb begins with an older but reliable vehicle.

Recommended characteristics:

```text
Moderate acceleration
Moderate speed
Good durability
Poor aesthetics
Low maintenance cost
```

It should feel personal.

---

# 26. VEHICLE CLASSES

```text
COMPACT
SEDAN
COUPE
SPORT
MUSCLE
SUV
PICKUP
VAN
MOTORCYCLE
UTILITY
```

---

# 27. VEHICLE ATTRIBUTES

Each vehicle has:

```text
Top speed
Acceleration
Braking
Handling
Traction
Durability
Storage
```

Avoid exposing all numerical values to the player.

---

# 28. VEHICLE ACQUISITION

Vehicles can be obtained through:

- Purchase
- Missions
- Side missions
- Gifts
- Theft
- Discovery
- Racing rewards

---

# 29. VEHICLE THEFT

Stolen vehicles can be used temporarily.

Some can become permanent after:

```text
Garage registration
```

or specific story events.

Do not allow every random stolen car to automatically become permanently owned.

---

# 30. GARAGE SYSTEM

Garages provide:

- Vehicle storage
- Repair
- Modification
- Vehicle selection

Garage capacity should be limited initially.

---

# 31. GARAGE UPGRADES

Example:

```text
Small garage:
2 vehicles

Improved garage:
4 vehicles

Large garage:
6 vehicles
```

Upgrades cost money.

---

# 32. VEHICLE MODIFICATION

Categories:

```text
ENGINE
BRAKES
TIRES
SUSPENSION
TRANSMISSION
ARMOR
COSMETIC
```

Upgrades should have visible and/or functional effects.

---

# 33. VEHICLE COSMETICS

Possible:

- Paint
- Wheels
- Window tint
- Bumpers
- Spoilers
- Exhaust
- Interior details

Do not prioritize cosmetic complexity over core gameplay.

---

# 34. REPAIR SYSTEM

Vehicle damage should require:

```text
Repair cost
```

Repair cost scales with damage.

Example:

```text
Minor:
$50–$200

Moderate:
$200–$700

Severe:
$700–$2,000
```

---

# 35. SAFEHOUSE SYSTEM

Safehouses are important progression locations.

Each safehouse provides:

- Save
- Clothing
- Weapon storage
- Vehicle access
- Phone
- Rest
- Story conversations where applicable

---

# 36. SAFEHOUSE PROGRESSION

Safehouses can be upgraded.

Example:

```text
Level 1
Basic room

Level 2
Improved storage

Level 3
Workshop

Level 4
Advanced equipment
```

Do not make safehouse upgrades mandatory for story progression unless narratively justified.

---

# 37. PROPERTY SYSTEM

Properties are optional long-term investments.

Examples:

- Garage
- Workshop
- Small apartment
- Warehouse
- Business

---

# 38. PROPERTY PURPOSE

Properties should provide functionality.

Bad:

> Buy apartment for $100,000 → nothing changes.

Good:

> Buy workshop → vehicle repair cost reduced and advanced modifications unlocked.

---

# 39. PROPERTY INCOME

Certain properties can generate modest passive income.

Example:

```text
Workshop:
+$200/day

Small business:
+$350/day

Warehouse:
+$500/day
```

Income should not become an infinite money printer.

---

# 40. PASSIVE INCOME LIMITS

Use:

```text
Daily cap
+
Maximum stored income
```

Example:

```text
Maximum stored:
$5,000
```

This prevents players from accumulating absurd wealth while offline.

---

# 41. CLOTHING PROGRESSION

Clothing is primarily cosmetic.

Categories:

```text
JACKETS
SHIRTS
PANTS
SHOES
ACCESSORIES
```

---

# 42. CLOTHING FUNCTION

Most clothing should not provide stats.

Some mission-specific clothing can affect:

- Access
- Social perception
- Stealth context

These effects should be subtle.

---

# 43. DISGUISE SYSTEM

Certain missions can use clothing/disguises.

Example:

```text
Security uniform
↓
Access to restricted area
```

But disguises should not magically fool everyone.

Certain NPCs should still detect inconsistencies.

---

# 44. RELATIONSHIP PROGRESSION

Relationships are not traditional XP bars.

They are represented by:

```text
Trust
Respect
Loyalty
Suspicion
```

Each character may use different values.

---

# 45. RELATIONSHIP REWARDS

Higher trust can unlock:

- Additional dialogue
- Side missions
- Information
- Discounts
- Backup
- Safehouse access
- Alternate mission approaches

---

# 46. RELATIONSHIP CONSEQUENCES

Low trust can cause:

- Refused help
- Different dialogue
- Reduced information
- Mission complications
- Betrayal
- Character departure

---

# 47. RELATIONSHIP DESIGN RULE

Never make relationship progression feel like:

> "Give NPC 10 gifts → friendship level 5."

Relationships should grow from shared experiences.

---

# 48. FACTION REPUTATION

Optional hidden faction values:

```text
Marrow Syndicate
Police
Eastside Crew
VSS
Independent civilians
```

Each faction can track:

```text
-100 → hostile
0 → neutral
+100 → friendly
```

---

# 49. FACTION REPUTATION EFFECTS

Possible effects:

### Positive

- Information
- Discounts
- Safe passage
- Contacts
- Mission opportunities

### Negative

- Ambushes
- Higher prices
- Refused services
- Increased surveillance
- Hostile NPCs

---

# 50. REPUTATION SHOULD NOT BE A GRIND

Faction reputation should mostly change because of story choices and meaningful actions.

Do not force the player to repeat:

> "Deliver 20 packages"

to become friendly with a faction.

---

# 51. KNOWLEDGE AS PROGRESSION

One of the most important forms of progression is information.

Examples:

```text
Learn police patrol route
Learn warehouse access point
Discover hidden contact
Learn Drake's weakness
Discover Lena's trail
Understand Black Ledger structure
```

Knowledge can unlock new approaches.

---

# 52. INFORMATION UNLOCKS

Example:

```text
Without information:
Front entrance only

With security information:
Back entrance unlocked

With employee contact:
Social approach unlocked

With stolen credentials:
Restricted route unlocked
```

---

# 53. ACCESS PROGRESSION

Certain areas become accessible through:

- Story
- Credentials
- Relationships
- Vehicles
- Clothing
- Information
- Player exploration

Avoid arbitrary invisible walls wherever possible.

---

# 54. DISTRICT PROGRESSION

The city should not feel artificially locked.

Most districts should be accessible early.

However:

- Certain interiors
- Restricted facilities
- Security zones
- Story locations

can require progression.

---

# 55. COLLECTIBLES

Collectibles provide optional progression.

Types:

```text
Adrian's Notes
Lena's Evidence
Old Photographs
Black Ledger Fragments
Hidden Audio Recordings
City Memorabilia
```

---

# 56. COLLECTIBLE REWARDS

Rewards should include:

- Story information
- Small cash
- Cosmetic items
- Character dialogue
- Hidden locations

Avoid mandatory collectible grinding.

---

# 57. EXPLORATION REWARDS

Exploration can discover:

- Hidden garages
- Shortcuts
- Rare vehicles
- Documents
- Money
- Unique NPC encounters
- Environmental story moments

---

# 58. MISSION REWARD DESIGN

Every mission should provide one or more:

```text
Money
Information
Relationship change
Equipment
Vehicle
Location access
Story progression
Faction change
```

Not every mission needs cash.

---

# 59. REWARD SCALING

Do not make late-game rewards meaningless.

Late-game rewards can be more valuable because:

- They unlock optional content.
- They support expensive upgrades.
- They provide endgame freedom.

But the player should never need to grind money to finish the story.

---

# 60. PLAYER WEALTH STATES

Conceptual wealth tiers:

```text
BROKE
< $1,000

STRUGGLING
$1,000–$5,000

STABLE
$5,000–$25,000

COMFORTABLE
$25,000–$100,000

WEALTHY
$100,000+
```

These are internal balancing guidelines.

Do not display "WEALTH LEVEL" to the player.

---

# 61. ECONOMY BALANCING

The economy should follow:

```text
Early:
Meaningful choices

Middle:
Increasing freedom

Late:
Optional luxury
```

Avoid:

```text
Early:
$500

Mid:
$50,000

Late:
$50,000,000
```

unless the narrative explicitly supports extreme wealth.

---

# 62. MONEY INFLATION CONTROL

Prevent runaway wealth through:

- Limited property income
- Meaningful upgrade costs
- Vehicle repair costs
- Optional luxury purchases
- Non-repeatable major rewards

---

# 63. REPEATABLE ACTIVITIES

Repeatable activities may include:

- Racing
- Mechanical jobs
- Courier work
- Vehicle recovery
- Optional contracts

Rewards should diminish or have cooldowns.

---

# 64. REPEATABLE ACTIVITY COOLDOWNS

Example:

```text
Mission completed
↓
Activity unavailable for 10 in-game hours
```

This prevents mindless farming.

---

# 65. NO GRIND REQUIREMENT

Main story completion must be possible without repeating side content.

If a player only completes the main story:

They should have enough resources to finish the campaign.

---

# 66. ECONOMY TRANSPARENCY

Players should always understand:

- Current money
- Purchase price
- Repair cost
- Reward
- What an upgrade actually changes

Never hide important costs.

---

# 67. PURCHASE CONFIRMATION

For expensive purchases:

```text
PURCHASE VEHICLE

$45,000

Your balance:
$62,400

PURCHASE
CANCEL
```

---

# 68. EXPENSIVE PURCHASE WARNING

For purchases above a configurable threshold:

```text
This purchase cannot be refunded.
```

Only use this if the system genuinely does not refund.

---

# 69. REFUNDS

If practical:

- Cosmetic items can have limited refunds.
- Vehicles generally cannot.
- Consumables cannot.

Keep rules consistent.

---

# 70. INVENTORY CAPACITY

Avoid arbitrary inventory limits for basic items.

Use sensible limits for:

- Weapons
- Ammo
- Consumables

Mission items should never become impossible to carry.

---

# 71. WEAPON CARRY LIMIT

Recommended:

```text
1 handgun
1 long weapon
1 special/heavy slot
```

The exact system can be simplified for browser performance.

---

# 72. AMMO LIMIT

Ammo capacity can increase through equipment upgrades.

Do not make ammunition management painfully restrictive.

---

# 73. PROGRESSION THROUGH STORY CHOICES

Major choices can unlock different progression paths.

Example:

```text
Help Mara
↓
Journalist network
↓
Information-based mission approach

Help Drake
↓
Criminal contacts
↓
Access to illegal resources

Help Ward
↓
Police information
↓
Reduced law-enforcement pressure
```

---

# 74. MULTIPLE PROGRESSION PATHS

The player should not have to unlock every system.

Different players can reach the end with different advantages.

Example:

```text
Player A:
High Mara trust
Low Drake trust

Player B:
High Drake trust
Low Ward trust

Player C:
Balanced relationships
```

All can finish the story.

---

# 75. ENDGAME PROGRESSION

After the main story:

Keep the world playable.

Possible activities:

- Remaining side missions
- Racing
- Vehicle collecting
- Property management
- Exploration
- Collectibles
- Character interactions
- Random events

---

# 76. POST-STORY WORLD STATE

The final world should reflect the chosen ending.

Examples:

## REDEMPTION

More peaceful atmosphere.

## POWER

More criminal influence.

## REVENGE

Damaged infrastructure and unstable factions.

## EXPOSURE

Media frenzy, political fallout and increased public awareness.

---

# 77. NEW GAME+

Optional.

If implemented:

Carry over:

- Cosmetic items
- Some vehicles
- Certain upgrades

Do NOT automatically carry over:

- Story flags
- Character deaths
- Major narrative knowledge

unless explicitly designed for it.

---

# 78. SAVE COMPATIBILITY

Progression data must be included in save files.

Save:

```text
Money
Vehicles
Weapons
Upgrades
Properties
Relationships
Faction reputation
Mission progress
Collectibles
World flags
```

---

# 79. PROGRESSION DATA MODEL

Example:

```js
const progression = {
    money: 1200,

    skills: {
        driving: 0,
        combat: 0,
        stealth: 0,
        mechanics: 0,
        social: 0
    },

    weapons: [],

    vehicles: [],

    properties: [],

    upgrades: [],

    relationships: {},

    factionReputation: {},

    collectibles: [],

    unlocks: []
};
```

---

# 80. ECONOMY DATA MODEL

Example:

```js
const economy = {
    money: 1200,

    incomeToday: 0,

    expensesToday: 0,

    properties: {},

    transactionHistory: []
};
```

Transaction history is optional and should not be displayed unless useful.

---

# 81. TRANSACTION SYSTEM

All money changes should pass through one system.

Example:

```js
economy.addMoney(500, "mission_reward");

economy.removeMoney(300, "vehicle_repair");
```

This provides:

- Debugging
- Analytics
- Save consistency
- Easier balancing

---

# 82. ECONOMY EVENTS

Emit events:

```text
MONEY_CHANGED
ITEM_PURCHASED
VEHICLE_PURCHASED
PROPERTY_PURCHASED
REPAIR_PAID
MISSION_REWARD
```

UI can subscribe to these.

---

# 83. DEBUG ECONOMY TOOLS

Developer mode:

```text
Give money
Remove money
Unlock weapon
Unlock vehicle
Unlock property
Set relationship
Set faction reputation
```

This is essential for balancing.

---

# 84. ECONOMY DEBUGGING

Show:

```text
Current money
Last transaction
Income today
Expenses today
Property income
```

in developer mode only.

---

# 85. PROGRESSION ANTI-PATTERNS

Never:

- Require grinding to continue the story.
- Give meaningless +1% upgrades.
- Make money infinitely exploitable.
- Make every mission pay cash.
- Lock half the city behind arbitrary levels.
- Make relationships numerical gift meters.
- Make every vehicle better than the previous one.
- Make expensive items mandatory.
- Make collectibles mandatory.
- Make late-game money completely useless.

---

# 86. PROGRESSION FEEL

The player should notice progression through gameplay.

Early:

> "I barely have enough money to repair this car."

Middle:

> "I can afford better equipment and choose how I approach missions."

Late:

> "I have resources, contacts and influence. Now the question is what I do with them."

This is the intended progression curve.

---

# 87. ECONOMY FEEL

Money should create decisions, not chores.

Good:

> "Do I repair my current vehicle or save for the new one?"

Bad:

> "I need to repeat this mission 14 times because the next weapon costs $30,000."

---

# 88. FINAL PROGRESSION LOOP

```text
MISSION
↓
MONEY / INFORMATION / RELATIONSHIP
↓
NEW OPTIONS
↓
BETTER EQUIPMENT / ACCESS
↓
MORE APPROACHES
↓
HARDER / MORE COMPLEX MISSIONS
↓
MAJOR CHOICES
↓
WORLD CHANGES
↓
NEW OPPORTUNITIES
```

---

# 89. FINAL ECONOMIC LOOP

```text
EARN
↓
CHOOSE
↓
SPEND
↓
GAIN CAPABILITY
↓
ACCESS NEW OPPORTUNITIES
↓
EARN MORE
```

But the game must always provide a non-grind path through the main campaign.

---

# 90. FINAL PRINCIPLE

Progression in NEON ASHES is not about making a number go from 1 to 100.

It is about making the player feel that Kaleb has changed.

At the beginning:

```text
Few resources
Few contacts
Little information
Limited equipment
No influence
```

At the end:

```text
Strong relationships or enemies
Major resources
Deep knowledge of the city
Powerful equipment
Vehicle collection
Influence
A permanent impact on Vespera City
```

The most important progression reward is:

> **Agency.**

The player should increasingly feel that they have more ways to solve problems—not simply larger numbers.
