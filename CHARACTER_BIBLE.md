# NEON ASHES — CHARACTER BIBLE

## 0. PURPOSE

This document defines the canonical characters, personalities, relationships, motivations, appearances, dialogue styles, secrets, arcs, and gameplay behaviors for **NEON ASHES**.

This file is authoritative for character implementation.

The game must not treat characters as interchangeable mission-givers. Every major character should have:

- A recognizable personality
- A consistent voice
- Personal motivations
- Strengths and flaws
- Relationships with other characters
- Secrets and information they do not reveal immediately
- Character-specific reactions to the player's choices
- A meaningful role in the story
- A visible emotional arc
- Distinct gameplay behavior
- Consequences when their relationship with Kaleb changes

Characters should feel like people living in Vespera City rather than scripted objects waiting for the player.

---

# 1. CHARACTER DESIGN PRINCIPLES

## 1.1 Core Principle

Every major character must answer five questions:

1. What do they want?
2. What are they afraid of?
3. What are they hiding?
4. What would make them betray someone?
5. What would they never do?

If these questions cannot be answered, the character is underdeveloped.

---

## 1.2 Characters Must Have Contradictions

Characters should not be defined by one personality trait.

Examples:

- A violent criminal can genuinely love his family.
- A police officer can believe in justice while participating in corruption.
- A journalist can want the truth while manipulating people to obtain it.
- A victim can make morally questionable decisions.
- A loyal friend can eventually betray Kaleb for understandable reasons.

Characters should have believable internal contradictions.

---

## 1.3 No Character Should Exist Solely To Explain Plot

Avoid characters whose only function is:

> "Go here and do this."

Characters should have their own lives, schedules, opinions, relationships and reactions.

Whenever technically practical, NPC schedules should continue even when Kaleb is not interacting with them.

---

# 2. PROTAGONIST — KALEB VOSS

## 2.1 Identity

**Full Name:** Kaleb Voss  
**Age:** 27  
**Occupation at Beginning:** Freelance mechanic / occasional courier  
**Origin:** Southside, Vespera City  
**Current Residence:** Small inherited garage/apartment  
**Family:** Adrian Voss (father, deceased), Lena Voss (younger sister, missing)  
**Role:** Player character

Kaleb is the central protagonist.

---

## 2.2 Physical Appearance

Kaleb should look like someone who has spent years working with vehicles rather than like a polished action hero.

### Build

- Athletic but not exaggerated
- Medium-tall
- Lean muscular frame
- Strong forearms
- Slightly rough hands
- Natural posture

### Face

- Dark brown hair
- Short-to-medium messy hairstyle
- Light stubble
- Tired eyes
- Defined jaw
- Small scar near the eyebrow
- Generally serious resting expression

### Clothing

Starting outfit:

- Dark work jacket
- Plain T-shirt
- Faded jeans
- Work boots
- Simple wristwatch

Clothing can change through gameplay.

Avoid making every outfit look luxurious.

---

# 3. KALEB — PERSONALITY

Kaleb is:

- Observant
- Quiet
- Intelligent
- Dryly humorous
- Protective
- Suspicious
- Persistent
- Emotionally guarded

He is not naturally charismatic.

His ability to manipulate situations develops through experience.

---

## 3.1 Strengths

- Mechanical knowledge
- Improvisation
- Driving
- Reading people
- Patience
- Physical endurance
- Ability to remain calm during dangerous situations

---

## 3.2 Flaws

- Distrustful
- Obsessive when pursuing answers
- Holds grudges
- Difficulty asking for help
- Can become reckless when Lena is involved
- Often assumes betrayal before evidence exists
- Can become increasingly morally compromised

---

## 3.3 Central Internal Conflict

Kaleb begins the game believing:

> "I just need to find my sister."

Over time the question becomes:

> "How much of myself am I willing to destroy to find her?"

By the final act, Kaleb must decide whether discovering the truth is worth becoming the kind of person his father warned him about.

---

# 4. KALEB — DIALOGUE STYLE

Kaleb does not constantly talk.

His dialogue should be concise.

### Example tone

NPC:
> "You always this friendly?"

Kaleb:
> "Only when I'm interested."

NPC:
> "You don't scare easy."

Kaleb:
> "I get scared. I just don't advertise it."

---

## 4.1 Dialogue Rules

Avoid:

- Constant jokes
- One-liners every five seconds
- Excessive profanity
- Cartoonish threats
- Overly dramatic speeches

Use:

- Short responses
- Pauses
- Sarcasm
- Subtle emotion
- Occasional anger
- Silence when words would be less effective

---

# 5. KALEB — GAMEPLAY REPRESENTATION

The player's choices influence Kaleb's personality presentation.

Possible hidden personality values:

```text
MORALITY
LOYALTY
AGGRESSION
TRUST
EMPATHY
GREED
```

These should influence certain dialogue variations and endings.

Do not turn this into a visible RPG morality meter unless specifically required.

The system should mostly operate invisibly.

---

# 6. LENA VOSS

## 6.1 Identity

**Full Name:** Lena Voss  
**Age:** 23  
**Occupation:** Investigative data analyst / freelance researcher  
**Relationship:** Kaleb's younger sister  
**Status:** Missing at beginning of game

Lena is the emotional center of the story.

Although she is absent for much of the campaign, she must remain present through:

- Messages
- Photos
- Voice recordings
- Documents
- Memories
- NPC dialogue
- Environmental clues
- Flashbacks
- Her unfinished work

---

# 7. LENA — PERSONALITY

Lena is:

- Intelligent
- Curious
- More socially confident than Kaleb
- Independent
- Stubborn
- Compassionate
- Reckless when pursuing information
- Occasionally secretive

She dislikes being protected.

Her relationship with Kaleb is loving but complicated.

---

## 7.1 Relationship With Kaleb

As children:

- Kaleb acted as protector.
- Lena admired him.
- They shared the garage as a personal refuge.
- They developed private jokes and routines.

As adults:

- Lena became more independent.
- Kaleb became increasingly protective.
- Lena felt Kaleb treated her like someone who needed saving.
- Kaleb believed Lena underestimated danger.

Their final major argument before her disappearance was partly about this.

---

# 8. LENA — SECRET

Lena discovered evidence connected to the Black Ledger.

She initially intended to expose the information.

However, she eventually discovered that simply releasing it would cause:

- Witnesses to disappear
- Evidence to be destroyed
- Innocent people to be exposed
- Multiple criminal factions to retaliate

She therefore created a hidden information trail.

Her disappearance was partly intentional.

She was trying to make herself difficult to locate while investigating who was actually controlling the network.

---

# 9. LENA — CHARACTER ARC

Lena's arc is revealed indirectly.

### Beginning

She appears to be a victim.

### Middle

Evidence suggests she knew more than Kaleb believed.

### Late Game

Kaleb discovers that Lena deliberately manipulated several people to continue her investigation.

### Final Reveal

Lena was neither helpless victim nor flawless hero.

She made dangerous choices.

The player must decide whether to accept her choices or condemn them.

---

# 10. ADRIAN VOSS

## 10.1 Identity

**Full Name:** Adrian Voss  
**Status:** Deceased  
**Occupation:** Mechanic  
**Former Role:** Confidential police informant

Adrian is Kaleb and Lena's father.

He appears primarily through:

- Flashbacks
- Old recordings
- Photographs
- Garage objects
- Police records
- Conversations with old acquaintances

---

# 11. ADRIAN — PERSONALITY

Adrian was:

- Practical
- Patient
- Protective
- Stubborn
- Honest in ordinary life
- Morally conflicted

He believed the world was rarely divided cleanly into good and evil.

---

## 11.1 Adrian's Secret

Adrian had worked as an informant for Detective Elias Ward.

His information helped expose parts of the Marrow Syndicate.

However, Adrian discovered that some information supplied to police was being redirected to people inside the corrupt network.

He tried to leave.

He was eventually killed in what was officially classified as an unrelated accident.

It was not an accident.

---

# 12. ADRIAN — LEGACY

Adrian's garage contains hidden evidence.

Important objects include:

- Old toolbox
- Damaged police radio
- Rusted motorcycle
- Mechanical notebook
- Old photographs
- Hidden compartment
- Encrypted storage device

The garage gradually becomes an important story location.

---

# 13. MARA VALE

## 13.1 Identity

**Full Name:** Mara Vale  
**Age:** 34  
**Occupation:** Investigative journalist  
**Role:** Major ally / information broker

Mara is one of the first people to recognize that Kaleb's search is connected to a much larger story.

---

# 14. MARA — PERSONALITY

Mara is:

- Sharp
- Confident
- Skeptical
- Ambitious
- Observant
- Sarcastic
- Emotionally controlled

She is difficult to intimidate.

---

## 14.1 Strengths

- Research
- Networking
- Reading people
- Information gathering
- Public communication
- Media manipulation

---

## 14.2 Flaws

- Obsessive about stories
- Sometimes uses people
- Has difficulty trusting others
- Can prioritize the story over individual safety

---

# 15. MARA — RELATIONSHIP WITH KALEB

Initially:

> "You're a mechanic looking for a missing woman."

Eventually:

> "You're the only person stupid enough to keep pulling this thread."

Their relationship can become:

- Professional partnership
- Close friendship
- Deep trust
- Strained alliance

Romance is NOT required.

Do not force romance into the story.

---

# 16. MARA — SECRET

Mara previously investigated Vespera Strategic Security.

Her source disappeared.

She suspects the source was killed.

She never fully confirmed it.

This creates a personal reason for her involvement.

---

# 17. DETECTIVE ELIAS WARD

## 17.1 Identity

**Full Name:** Elias Ward  
**Age:** 52  
**Occupation:** Detective  
**Department:** Vespera City Police

Ward knew Adrian.

He is one of the most morally complicated characters in the game.

---

# 18. WARD — PERSONALITY

- Calm
- Experienced
- Cynical
- Intelligent
- Patient
- Protective toward civilians
- Suspicious of everyone

Ward rarely raises his voice.

When angry, he becomes quieter.

---

## 18.1 Belief

Ward believes:

> "The law is useful. Institutions are not always."

He still believes in justice.

However, years of corruption have compromised his methods.

---

# 19. WARD — SECRET

Ward knew Adrian was an informant.

He also knew Adrian was in danger.

Ward attempted to protect him but failed.

After Adrian's death, Ward became increasingly convinced that someone inside the police department was feeding information to the Marrow Syndicate.

He has spent years trying to identify the person.

---

# 20. WARD — RELATIONSHIP WITH KALEB

Initially suspicious.

Ward views Kaleb as:

> A civilian who is dangerously close to something he doesn't understand.

As the campaign progresses, Ward can become:

- Reluctant ally
- Mentor
- Distrusted authority
- Potential victim

Depending on player decisions, Ward can survive the campaign.

---

# 21. DETECTIVE MARA SLOANE

## 21.1 Identity

**Full Name:** Mara Sloane  
**Age:** 39  
**Occupation:** Detective / Organized Crime Division

Sloane is one of the main law-enforcement characters.

She is more pragmatic than Ward.

---

# 22. SLOANE — PERSONALITY

- Direct
- Intelligent
- Disciplined
- Impatient
- Highly observant
- Career-conscious
- Occasionally ruthless

She dislikes Kaleb's methods.

---

# 23. SLOANE — MOTIVATION

Sloane wants to dismantle the Marrow Syndicate.

But she also wants recognition for doing it.

Her ambition makes her vulnerable to manipulation.

---

# 24. SLOANE — CHARACTER ARC

At first she appears antagonistic.

Later the player learns she is genuinely trying to stop organized crime.

However, she becomes increasingly willing to bend procedure.

The player can either:

- Earn her trust
- Manipulate her
- Expose her mistakes
- Allow her to pursue her own investigation

---

# 25. VINCENT DRAKE

## 25.1 Identity

**Full Name:** Vincent Drake  
**Age:** 48  
**Occupation:** Businessman / Criminal power broker  
**Faction:** Marrow Syndicate

Vincent is the primary human antagonist for much of the campaign.

---

# 26. DRAKE — PERSONALITY

- Calm
- Polished
- Patient
- Intelligent
- Charismatic
- Ruthless
- Extremely strategic

He rarely behaves like a stereotypical gangster.

He prefers:

- Contracts
- Influence
- Debt
- Political relationships
- Information
- Legal businesses

Violence is a tool, not his identity.

---

# 27. DRAKE — BELIEF

Drake believes:

> "Everyone has a price. Most people just call theirs a principle."

He genuinely believes he brings stability to Vespera.

Without organizations like his, he argues, worse people would take control.

---

# 28. DRAKE — RELATIONSHIP WITH KALEB

Drake initially sees Kaleb as insignificant.

Later:

> curiosity → irritation → respect → threat

Drake should never immediately treat Kaleb as his greatest enemy.

The escalation must feel earned.

---

# 29. DRAKE — SECRET

Drake is not the creator of the Black Ledger.

He is one of its major beneficiaries.

This distinction becomes important.

The Black Ledger is larger than the Marrow Syndicate.

---

# 30. NORA KESS

## 30.1 Identity

**Full Name:** Nora Kess  
**Age:** 31  
**Occupation:** Corporate security specialist  
**Faction:** Vespera Strategic Security

Nora is a major ambiguous character.

---

# 31. NORA — PERSONALITY

- Analytical
- Controlled
- Intelligent
- Professional
- Quiet
- Highly observant
- Emotionally guarded

She does not waste words.

---

# 32. NORA — MOTIVATION

Nora wants to understand who actually controls VSS.

She joined the organization believing it was legitimate.

Over time she discovered that parts of the company were involved in:

- Surveillance
- Data manipulation
- Illegal intimidation
- Political influence

She is trying to determine how deep the corruption goes.

---

# 33. NORA — RELATIONSHIP WITH KALEB

Their relationship should remain uncertain for a long time.

She can:

- Help him
- Mislead him
- Save him
- Betray him
- Provide critical information

Her behavior depends on what she believes Kaleb intends to do with the information.

---

# 34. DAMIEN CROSS

## 34.1 Identity

**Full Name:** Damien Cross  
**Age:** 42  
**Occupation:** Executive / Security Contractor  
**Faction:** VSS / Blackline connections

Damien is a major antagonist.

Unlike Drake, Damien is more directly violent.

---

# 35. CROSS — PERSONALITY

- Aggressive
- Intelligent
- Controlling
- Paranoid
- Efficient
- Intimidating

He dislikes uncertainty.

Kaleb becomes dangerous to him because Kaleb creates variables that Cross cannot control.

---

# 36. CROSS — METHODS

Cross prefers:

- Surveillance
- Threats
- Interrogation
- Blackmail
- Controlled violence
- Information denial

He should feel like a professional problem rather than a traditional street gangster.

---

# 37. CROSS — RELATIONSHIP WITH DRAKE

They cooperate but distrust one another.

Drake believes Cross is too aggressive.

Cross believes Drake is too cautious.

Their conflict becomes increasingly important during Acts IV and V.

---

# 38. JONAH REYES

## 38.1 Identity

**Full Name:** Jonah Reyes  
**Age:** 29  
**Occupation:** Mechanic / Street racer / Courier  
**Role:** Friend and optional companion

Jonah is one of the game's primary lighter characters.

---

# 39. JONAH — PERSONALITY

- Funny
- Energetic
- Loyal
- Impulsive
- Social
- Mechanically talented
- Sometimes irresponsible

Jonah provides emotional contrast to the darker story.

---

## 39.1 Relationship With Kaleb

They knew each other before the main story.

Jonah sees Kaleb as:

> "The guy who always fixes everyone else's problems and never fixes his own."

Their friendship should feel natural.

They can:

- Work on vehicles
- Race
- Talk
- Drink non-alcoholic/social drinks
- Explore the city
- Complete side missions

---

# 40. JONAH — CHARACTER ARC

Jonah begins as comic relief.

Later he becomes more serious when he realizes how dangerous Kaleb's investigation has become.

Eventually he must choose whether to:

- Stay with Kaleb
- Leave Vespera
- Help indirectly
- Take a major personal risk

His outcome depends on player choices.

---

# 41. BLACKLINE REPRESENTATIVE

## 41.1 Identity

**Codename:** Blackline  
**Public Identity:** Unknown initially

Blackline is not a traditional gang.

It is an interconnected network of:

- Contractors
- Intelligence specialists
- Data brokers
- Corrupt officials
- Corporate operatives
- Criminal intermediaries

---

# 42. BLACKLINE — CHARACTER DESIGN

Blackline should NOT be portrayed as one cartoonishly evil mastermind.

The player should gradually discover that:

> The Black Ledger survives because many ordinary people benefit from keeping it alive.

This makes the conspiracy more believable.

---

# 43. BLACKLINE'S PUBLIC FACE

Blackline should rarely appear openly.

Use:

- Anonymous messages
- Security footage
- Unknown callers
- Paid intermediaries
- Altered documents
- Unmarked vehicles
- Corporate meetings
- Disappearing evidence

The player's understanding of Blackline should evolve over time.

---

# 44. SUPPORTING CHARACTER — SERGEANT RILEY

**Age:** 44  
**Occupation:** Police Sergeant

Riley is a recurring police NPC.

Personality:

- Practical
- Tired
- Slightly sarcastic
- Mostly decent
- Bureaucratically constrained

Riley represents ordinary police officers who are trying to do their jobs inside a compromised system.

---

# 45. SUPPORTING CHARACTER — ELI TURNER

**Age:** 36  
**Occupation:** Harbor worker

Eli knew Adrian.

He provides early information about:

- Old Harbor
- Cargo movements
- Adrian's past
- Missing containers

He should feel like a normal working person rather than an exposition machine.

---

# 46. SUPPORTING CHARACTER — MAYA TORRES

**Age:** 26  
**Occupation:** Bartender / local business employee

Maya is a recurring civilian character.

She knows many people in Southside.

She can provide:

- Rumors
- Local information
- Small favors
- Character interactions

She is not secretly connected to the conspiracy.

Important:

Not every character should secretly be part of the plot.

---

# 47. SUPPORTING CHARACTER — RONAN PIKE

**Age:** 33  
**Occupation:** Vehicle thief / underground racer

Ronan is a rival of Jonah.

He provides:

- Racing missions
- Vehicle-related side missions
- Underground contacts

He is morally questionable but not a major villain.

---

# 48. SUPPORTING NPC ARCHETYPES

The game should contain reusable but varied NPC archetypes.

## Civilians

- Office worker
- Student
- Construction worker
- Tourist
- Delivery driver
- Mechanic
- Shop owner
- Security guard
- Nurse
- Street vendor
- Taxi driver
- Fisherman
- Dock worker
- Retired resident
- Wealthy resident

---

# 49. NPC PERSONALITY VARIATION

Do not spawn identical NPCs repeatedly.

NPCs should vary in:

- Age
- Clothing
- Walking speed
- Voice
- Mood
- Confidence
- Reaction to crime
- Reaction to police
- Reaction to Kaleb

---

# 50. NPC MEMORY

Important NPCs can remember certain player interactions.

Example:

If Kaleb helps a shop owner:

```text
shop_owner.trust += 1
```

Later:

> "Hey, Kaleb. Heard you were asking around."

If Kaleb threatens them:

```text
shop_owner.fear += 1
```

Later:

> "I already told you everything."

---

# 51. CHARACTER RELATIONSHIP SYSTEM

Important relationships should use hidden variables.

Example:

```js
relationships = {
    lena: {
        trust: 0,
        understanding: 0
    },

    mara: {
        trust: 0,
        respect: 0
    },

    ward: {
        trust: 0,
        suspicion: 0
    },

    jonah: {
        friendship: 0,
        loyalty: 0
    },

    nora: {
        trust: 0,
        suspicion: 0
    }
}
```

Values should change based on:

- Dialogue
- Mission choices
- Betrayals
- Assistance
- Violence
- Information sharing
- Player decisions

---

# 52. CHARACTER STATES

Major characters should have explicit states.

Example:

```text
ACTIVE
ALLY
SUSPICIOUS
HOSTILE
MISSING
INJURED
DEAD
BETRAYED
TRUSTING
UNAVAILABLE
```

Character state changes should persist through saves.

---

# 53. CHARACTER DEATH RULES

Do not randomly kill major characters.

A major character death must:

1. Be narratively justified.
2. Have foreshadowing.
3. Affect other characters.
4. Affect future missions.
5. Affect dialogue.
6. Persist in the world.

If a character dies:

- Their phone may stop responding.
- Their safehouse may become empty.
- Other characters may mention them.
- Their missions disappear or transform.
- Their belongings can remain.

---

# 54. CHARACTER BONDS

The strongest relationships should develop through shared experiences.

Do not use artificial:

> +10 friendship

messages.

Instead:

- Characters remember events.
- Characters change dialogue.
- Characters call Kaleb differently.
- Characters become more willing to help.
- Characters become more emotionally open.

---

# 55. CHARACTER DIALOGUE RULES

Every major character needs a distinct linguistic fingerprint.

## Kaleb

Short, restrained.

## Lena

Fast-thinking, curious, occasionally sarcastic.

## Mara

Sharp and analytical.

## Ward

Slow, deliberate, experienced.

## Sloane

Direct and procedural.

## Drake

Polished and philosophical.

## Cross

Cold and threatening.

## Nora

Minimal and analytical.

## Jonah

Fast, casual, humorous.

---

# 56. DIALOGUE ANTI-PATTERNS

Do NOT make everyone sound like Kaleb.

Avoid:

> "We need to do this."

> "Let's go."

> "This isn't over."

> "You have no idea who you're dealing with."

These phrases may exist occasionally but must not become the entire dialogue vocabulary.

---

# 57. CHARACTER EMOTIONAL STATES

Characters can have temporary emotional states:

```text
CALM
HAPPY
NERVOUS
ANGRY
AFRAID
SUSPICIOUS
EXHAUSTED
GRIEVING
CONFIDENT
DESPERATE
```

Emotional state can influence:

- Facial animation
- Body language
- Voice delivery
- Dialogue
- Mission behavior

---

# 58. BODY LANGUAGE

Do not rely solely on dialogue to communicate emotion.

Examples:

### Kaleb angry

- Tight jaw
- Minimal movement
- Short responses

### Jonah nervous

- Faster speech
- Looking around
- Repeated hand movement

### Ward suspicious

- Long pauses
- Direct eye contact
- Controlled posture

### Mara worried

- Talks faster
- Avoids eye contact
- Checks phone repeatedly

---

# 59. CHARACTER LOCATIONS

Major characters should have believable locations.

Example:

| Character | Common Locations |
|---|---|
| Kaleb | Garage, missions, city |
| Lena | Flashbacks, recordings, hidden locations |
| Mara | News office, cafés, safe locations |
| Ward | Police station, crime scenes, private meetings |
| Sloane | Police HQ, investigation locations |
| Drake | Corporate offices, private clubs, warehouses |
| Nora | VSS facilities, parking structures, safe locations |
| Cross | Security facilities, corporate sites |
| Jonah | Garage, race locations, mechanic shops |

Characters should not simply teleport between mission markers.

---

# 60. CHARACTER DAILY ROUTINES

When technically practical, implement schedules.

Example Jonah:

```text
08:00 → garage
12:00 → parts supplier
15:00 → street racing location
19:00 → local hangout
01:00 → home
```

Schedules can simplify during early development.

Important characters should at minimum have believable idle locations.

---

# 61. CHARACTER PHONE SYSTEM

Major characters can contact Kaleb.

Possible communication types:

- Call
- Text
- Voice message
- Photo
- Location
- Mission notification
- Warning
- Personal conversation

Communication should be context-aware.

Example:

If Kaleb ignored Jonah's previous request:

> "You gonna answer this time?"

instead of generic:

> "Hey, I need help."

---

# 62. CHARACTER REACTIONS TO PLAYER BEHAVIOR

Characters should react differently depending on what Kaleb does.

Examples:

### Kaleb kills civilians frequently

Mara:

> "You're getting harder to recognize."

### Kaleb avoids unnecessary violence

Ward:

> "You still have some sense left."

### Kaleb betrays Jonah

Jonah becomes distant.

### Kaleb protects Jonah

Jonah becomes more loyal.

These changes should be subtle.

---

# 63. CHARACTER INFORMATION HIERARCHY

Characters should not know everything.

Each character has:

```text
KNOWN
SUSPECTED
UNKNOWN
FALSE BELIEF
SECRET
```

Example:

## Ward

Known:
- Adrian was an informant.
- Adrian died suspiciously.

Suspected:
- Police corruption.

Unknown:
- Lena's exact location.

False belief:
- Adrian may have voluntarily disappeared.

Secret:
- Ward withheld evidence.

This prevents impossible dialogue.

---

# 64. INFORMATION CONSISTENCY

Before generating character dialogue, the system should determine:

```text
What does this character know?
What has Kaleb told them?
What have they discovered?
What do they believe?
What are they hiding?
```

Never allow characters to reference information they logically cannot know.

---

# 65. CHARACTER ARC STRUCTURE

Each major character should progress through:

```text
INTRODUCTION
↓
INITIAL RELATIONSHIP
↓
COMPLICATION
↓
REVELATION
↓
CRISIS
↓
CHOICE
↓
RESOLUTION
```

This should apply to:

- Kaleb
- Lena
- Mara
- Ward
- Sloane
- Drake
- Nora
- Cross
- Jonah

---

# 66. MAJOR CHARACTER ARC SUMMARY

| Character | Beginning | Middle | End |
|---|---|---|---|
| Kaleb | Searching for Lena | Uncovers conspiracy | Chooses what truth costs |
| Lena | Missing victim | Hidden investigator | Revealed as complicated survivor |
| Mara | Journalist | Investigative ally | Decides what truth deserves |
| Ward | Suspicious detective | Reluctant ally | Faces his past |
| Sloane | Police antagonist | Investigator | Chooses law vs results |
| Drake | Powerful businessman | Threatened power broker | Falls, survives, or escapes |
| Nora | Corporate operative | Double-sided ally | Chooses loyalty |
| Cross | Security enforcer | Main active threat | Confronted by consequences |
| Jonah | Friend/comic relief | Loyal companion | Chooses whether to stay |

---

# 67. ENDING DEPENDENCY

Character outcomes must connect to the four major ending paths.

## REDEMPTION

Kaleb prioritizes people over power.

Likely outcomes:

- Strong relationships survive.
- Some characters leave Vespera.
- Black Ledger is damaged.
- Kaleb rejects control.

---

## POWER

Kaleb takes control of the network.

Possible outcomes:

- Drake removed.
- Blackline weakened.
- Kaleb becomes an influential figure.
- Some allies become afraid of him.

---

## REVENGE

Kaleb prioritizes destruction.

Possible outcomes:

- Major characters die.
- Infrastructure is destroyed.
- The truth is released incompletely.
- Kaleb loses much of what he was trying to protect.

---

## EXPOSURE

Kaleb releases the Black Ledger publicly.

Possible outcomes:

- Massive political scandal.
- Criminal organizations destabilized.
- Police corruption exposed.
- Corporate corruption exposed.
- Vespera enters a period of instability.

This ending should feel powerful but not magically perfect.

---

# 68. CHARACTER SURVIVAL MATRIX

The implementation should support conditional outcomes.

Example:

```text
Jonah:
    survive if loyalty >= threshold
    leave if loyalty low
    die if specific mission branch fails

Mara:
    survive if evidence mission completed
    disappear if betrayed
    remain active if trust high

Ward:
    survive if player warns him
    injured if warning arrives late
    dead if player ignores evidence
```

Exact conditions should be implemented in `MISSION_DESIGN.md`.

---

# 69. CHARACTER PRESENTATION

Major characters should receive distinct visual treatment.

Each should have:

- Unique silhouette
- Unique clothing palette
- Unique hairstyle
- Unique accessories
- Unique posture
- Unique animation tendencies
- Distinct voice
- Distinct facial expression patterns

Avoid generic interchangeable models.

---

# 70. CLOTHING EVOLUTION

Major characters should occasionally change clothes.

Example:

Mara:

- Casual investigative clothing
- Raincoat during field investigations
- Formal clothing during corporate events
- More worn clothing during late-game pressure

Jonah:

- Garage work clothes
- Racing outfit
- Casual street clothes
- Damaged clothing after major events

This makes time progression visible.

---

# 71. CHARACTER ENVIRONMENTAL STORYTELLING

Character locations should contain objects that reveal personality.

## Jonah's workspace

- Modified engines
- Old race trophies
- Tools
- Cheap food containers
- Posters
- Spare parts

## Mara's workspace

- Newspaper clippings
- Multiple monitors
- Notes
- Cameras
- Recorded interviews
- Coffee cups
- Printed evidence

## Ward's office

- Old case files
- Family photograph
- Evidence boxes
- Police awards
- Adrian-related material hidden away

## Drake's office

- Minimal decoration
- Expensive but restrained furniture
- City photographs
- Legal documents
- Art
- No obvious criminal memorabilia

---

# 72. CHARACTER VOICE PERFORMANCE

If voice acting is generated or synthesized:

Each character needs:

- Different pitch
- Different speech rhythm
- Different vocabulary
- Different emotional delivery

Do not make every character sound like the same narrator.

---

# 73. VOICE DIRECTION

## Kaleb

Low-energy, restrained, natural.

## Lena

Energetic but intelligent.

## Mara

Confident and articulate.

## Ward

Deep, tired, deliberate.

## Sloane

Firm, controlled.

## Drake

Smooth, calm, authoritative.

## Cross

Cold, clipped, intimidating.

## Nora

Quiet, precise.

## Jonah

Energetic, informal, expressive.

---

# 74. CHARACTER HUMOR

Humor should primarily come from personality and situations.

Jonah can provide more humor.

Kaleb should use dry humor.

Mara can use sarcasm.

Drake can use subtle dark humor.

Ward can use occasional deadpan remarks.

Cross should rarely joke.

---

# 75. CHARACTER CONFLICT

Major characters should disagree with each other.

Examples:

### Kaleb vs Ward

Methods.

### Kaleb vs Mara

How information should be released.

### Ward vs Sloane

Procedure vs results.

### Drake vs Cross

Control vs aggression.

### Nora vs Cross

Corporate strategy vs coercion.

### Jonah vs Kaleb

How much danger is acceptable.

These conflicts make scenes feel alive.

---

# 76. CHARACTER RELATIONSHIP WEB

```text
                 BLACKLINE
                  /     \
                 /       \
             DRAKE ---- CROSS
               |           |
               |           |
             NORA -------- VSS
               |
               |
KALEB -------- MARA
  | \           |
  |  \          |
  |   \         |
LENA  WARD ---- SLOANE
  |
ADRIAN

KALEB -------- JONAH
```

This is conceptual.

Do not treat the relationships as static.

They evolve throughout the campaign.

---

# 77. CHARACTER REVEALS

Major reveals should change the player's understanding of earlier scenes.

Examples:

### Adrian

Early:
> Dead mechanic.

Later:
> Former informant.

Later:
> He knew about the Ledger.

Final:
> He was trying to protect his children from it.

---

### Lena

Early:
> Missing sister.

Middle:
> Investigator.

Late:
> She intentionally disappeared.

Final:
> She manipulated events to expose the system.

---

### Drake

Early:
> Main criminal boss.

Middle:
> Major beneficiary.

Late:
> Not the ultimate architect.

---

### Ward

Early:
> Corrupt-looking detective.

Middle:
> Compromised but genuinely trying to help.

Late:
> His failure to protect Adrian haunts him.

---

# 78. DO NOT OVERUSE SECRET IDENTITIES

Not every character should have a shocking secret.

The following characters should remain mostly ordinary:

- Maya Torres
- Eli Turner
- Ronan Pike
- Many civilian NPCs
- Most mechanics
- Shop owners
- Random witnesses

The world becomes more believable when not everyone is secretly important.

---

# 79. CHARACTER DEATH EMOTIONAL RULE

A death should never exist purely to make the story "darker."

If a major character dies:

The game must show:

1. Immediate reaction.
2. Short-term consequences.
3. Long-term consequences.
4. Changed dialogue.
5. Changed missions.
6. Changed world behavior where appropriate.

Death must matter.

---

# 80. CHARACTER ANTI-PATTERNS

Never create:

- Perfect heroes
- Evil-for-no-reason villains
- Characters who know everything
- Characters who forgive instantly
- Characters who forget major betrayals
- Characters who teleport everywhere
- Characters who only appear for missions
- Characters who constantly explain the plot
- Characters who all speak identically
- Characters whose personalities change randomly

---

# 81. AI IMPLEMENTATION REQUIREMENT

Every important NPC should have a structured character definition.

Example:

```js
const character = {
    id: "jonah_reyes",

    name: "Jonah Reyes",

    age: 29,

    faction: "independent",

    personality: [
        "loyal",
        "energetic",
        "impulsive",
        "humorous"
    ],

    motivations: [
        "protect friends",
        "build successful garage",
        "escape financial instability"
    ],

    fears: [
        "losing friends",
        "being powerless"
    ],

    relationships: {
        kaleb: 0,
        mara: 0,
        lena: 0
    },

    state: "active",

    knowledge: [],

    secrets: [],

    current_location: "jonah_garage",

    available: true
};
```

---

# 82. CHARACTER KNOWLEDGE SYSTEM

Every story-critical character should maintain knowledge flags.

Example:

```js
knowledge: {
    knows_about_ledger: true,
    knows_lena_is_alive: false,
    knows_adrian_was_informant: true,
    knows_kaleb_killed_target: false
}
```

Dialogue should reference these flags.

---

# 83. CHARACTER RELATIONSHIP IMPLEMENTATION

Use continuous or discrete values internally.

Example:

```text
-100 = hatred
-50  = hostile
-20  = distrust
0    = neutral
20   = positive
50   = trusted
80   = close
100  = absolute loyalty
```

Do not display this number to the player.

---

# 84. CHARACTER INTERACTION PRIORITY

When multiple systems compete for character behavior:

```text
CRITICAL STORY EVENT
>
ACTIVE MISSION
>
EMERGENCY
>
COMBAT
>
PLAYER INTERACTION
>
PERSONAL ROUTINE
>
AMBIENT BEHAVIOR
```

Characters should interrupt normal routines when important events occur.

---

# 85. CHARACTER SPAWNING

Major characters should not simply spawn directly beside the player.

Use:

- Existing locations
- Vehicles
- Entrances
- Streets
- Interiors
- Mission staging areas

Whenever practical, characters should visibly arrive.

---

# 86. CHARACTER PERSISTENCE

If Kaleb leaves a major character after a conversation:

- Their state remains.
- Their relationship state remains.
- Their location may update.
- Their knowledge remains.
- Their previous decisions remain.

Save/load must preserve these values.

---

# 87. FINAL CHARACTER DESIGN PRINCIPLE

The player should eventually feel:

> "I know what this person would do."

That is the test of a successful character.

If a player can predict how Jonah, Mara, Ward, Drake, Lena, Nora or Cross would react to a situation without the game explicitly explaining it, the character has been successfully established.

The ultimate goal is not to create characters that merely advance missions.

The goal is to create characters whose choices make the city feel alive.
