# NEON ASHES — E2E Test Infrastructure & Verification Specification

## 1. Overview & Architecture

The **NEON ASHES** End-to-End (E2E) Test Infrastructure provides automated, deterministic, headless verification of the complete 8-mission narrative campaign (M01 through M08), world interactions, combat mechanics, and story progression.

### 1.1 Technical Stack
- **Test Engine**: Node.js ES Modules (`scripts/*.js`) utilizing `puppeteer-core`.
- **Runtime Environment**: Headless Google Chrome with WebGL hardware/software acceleration via ANGLE:
  ```javascript
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--window-size=1280,720'
    ],
    defaultViewport: { width: 1280, height: 720 }
  });
  ```
- **Application Target**: Vite development server running on `http://localhost:3000/`.
- **Injection Surface**: The global `window.game` object exposed on the browser window:
  - `window.game.missionMgr`: Objective state container, proximity tracking, and stage jumping.
  - `window.game.player`: Player position, health, cash, weapons, and vehicle states.
  - `window.game.debugMenu`: Warp checkpoints and stage setup hooks (`warpToMission(id, stage)`).
  - `window.game.world`: 3D landmarks, district coordinates, and interior spaces.
  - `window.game.hud`: Evidence modals, prompts, dialog boxes, and minimap.
  - `window.game.eventBus`: Event listener inspection (`mission:start`, `mission:complete`).

---

## 2. 4-Tier Testing Methodology

The testing architecture is structured into four complementary validation tiers:

| Tier | Category | Focus | Target per Mission | Total Coverage |
|---|---|---|---|---|
| **Tier 1** | **Feature Coverage** | Happy-path stage validation, prompts, modals, combat, and rewards | >= 5 test cases | >= 40 test cases |
| **Tier 2** | **Boundary & Corner Cases** | Distance limits, timeouts, debt bounds, HP survival, stealth distances | >= 5 test cases | >= 40 test cases |
| **Tier 3** | **Cross-Feature Combinations** | Pairwise interactions: branching vs cash, combat vs tailing, modals vs HUD | Matrix pairs | Full system integration |
| **Tier 4** | **Real-World Scenarios** | Continuous sequential campaign execution (M01 -> M08) and recovery | Complete chain | End-to-end playthrough |

---

## 3. Mission Coverage Matrix

| Mission ID | Mission Title | Category | Primary Mechanics | Stage Count | Reward |
|---|---|---|---|---|---|
| **M01** | HOME AGAIN | Prologue | Driving, Dialogue, Interior Investigation, Photo Modal, Safehouse | 6 stages | +$500, Safehouse Unlocked |
| **M02** | OLD DEBTS | Act I | Driving, Workshop Shutter, Safe Cracking, Syndicate Combat, Vehicle Escape | 6 stages | +$800, Shotgun Unlocked |
| **M03** | THE HARBOR | Act I | Navigation, Container Stakeout, Covert Handoff, Vehicle Pursuit, Interception | 6 stages | +$1,200, Pier 19 Keycard |
| **M04** | COLD STORAGE | Act I Finale | Keycard Infiltration, Terminal Search, Military Drive Extraction, Heavy Combat | 6 stages | +$1,500, Encrypted Drive |
| **M05** | THE JOURNALIST | Act II | Contact Meeting, District Traversal, Office Infiltration, Document Photo, Debrief | 7 stages | +$1,800, Mara Contact |
| **M06** | BAD BUSINESS | Act II | Redevelopment Surveillance, Foot Tailing, Payoff Photo, Vehicle Tailing, Plaque | 6 stages | +$2,000, Shell Company Lead |
| **M07** | OLD FRIENDS | Act II | Crisis Meeting, 3-Way Branching (Pay Debt / Shootout / Drake Run), Debrief | 5 stages | +$2,500, Faction State Flags |
| **M08** | PAPER TRAIL | Act II Finale | Financial Review, Central Office Infiltration, Night Mode, Wire Dump, Escape | 6 stages | +$3,000, Act II Finale Complete |

---

## 4. Comprehensive Test Specifications

### 4.1 Tier 1: Feature Coverage (Happy Path & Stage Validation)

#### Mission M01: HOME AGAIN
| Test ID | Mission | Stage / Feature | Action / Input | Expected Output | Verification Assertion |
|---|---|---|---|---|---|
| `T1-M01-01` | M01 | `drive_to_apartment` | Teleport to `(30, 0, -11)` (distance <= 12m) | Stage advances to `talk_to_neighbor` | `missionMgr.getCurrentObjective().id === 'talk_to_neighbor'` |
| `T1-M01-02` | M01 | `talk_to_neighbor` | Stand within 3.5m of Mrs. Gable, press `[F]` | Dialogue modal opens, advances to `enter_apartment` | `missionMgr.getCurrentObjective().id === 'enter_apartment'` |
| `T1-M01-03` | M01 | `enter_apartment` | Stand within 4.0m of porch door, press `[E]` | Teleports to interior `(300, 0, -297)`, interior mode active | `game.isInApartmentInterior === true` |
| `T1-M01-04` | M01 | `search_room` | Stand within 3.8m of loose floorboard, press `[E]` | Floorboard beacon hidden, advances to `inspect_photo` | `missionMgr.getCurrentObjective().id === 'inspect_photo'` |
| `T1-M01-05` | M01 | `inspect_photo` | Click `#continue-mission-btn` on evidence modal | Modal closes, advances to `exit_apartment` | `document.getElementById('evidence-modal').classList.contains('hidden')` |
| `T1-M01-06` | M01 | `exit_apartment` | Stand within 2.5m of interior exit door, press `[E]` | Teleports to porch, awards +$500, sets completed | `missionMgr.completedMissions.has('M01') === true` |

#### Mission M02: OLD DEBTS
| Test ID | Mission | Stage / Feature | Action / Input | Expected Output | Verification Assertion |
|---|---|---|---|---|---|
| `T1-M02-01` | M02 | `drive_to_garage` | Teleport to `(-60, 0, 88)` (distance <= 16m) | Stage advances to `talk_to_jonah` | `missionMgr.getCurrentObjective().id === 'talk_to_jonah'` |
| `T1-M02-02` | M02 | `talk_to_jonah` | Stand within 4.0m of Jonah Reyes, press `[F]` | Dialogue completes, advances to `enter_garage` | `missionMgr.getCurrentObjective().id === 'enter_garage'` |
| `T1-M02-03` | M02 | `enter_garage` | Stand within 4.5m of shutter, press `[E]` | Shutter mesh opens, advances to `crack_safe` | `missionMgr.getCurrentObjective().id === 'crack_safe'` |
| `T1-M02-04` | M02 | `crack_safe` | Stand within 4.0m of safe, press `[E]` | Grants shotgun + 18 ammo, spawns 2 Syndicate enforcers | `player.hasShotgun === true && enemyMgr.enemies.length === 2` |
| `T1-M02-05` | M02 | `eliminate_syndicate` | Eliminate all Syndicate enforcers | Enforcers neutralized, advances to `escape_area` | `missionMgr.getCurrentObjective().id === 'escape_area'` |
| `T1-M02-06` | M02 | `escape_area` | Enter vehicle and drive >65m from garage | Awards +$800, sets M02 complete, chains M03 | `missionMgr.completedMissions.has('M02') === true` |

#### Mission M03: THE HARBOR
| Test ID | Mission | Stage / Feature | Action / Input | Expected Output | Verification Assertion |
|---|---|---|---|---|---|
| `T1-M03-01` | M03 | `drive_to_harbor` | Drive vehicle within 16m of `pier19Pos` | Stage advances to `vantage_point` | `missionMgr.getCurrentObjective().id === 'vantage_point'` |
| `T1-M03-02` | M03 | `vantage_point` | Move within 4.5m of container vantage summit | Stage advances to `observe_handoff` | `missionMgr.getCurrentObjective().id === 'observe_handoff'` |
| `T1-M03-03` | M03 | `observe_handoff` | Stand at vantage edge, press `[E]` | Stakeout dialogue plays, advances to `chase_courier` | `missionMgr.getCurrentObjective().id === 'chase_courier'` |
| `T1-M03-04` | M03 | `chase_courier` | Approach within 16m of fleeing courier coupe | Courier car disabled, advances to `retrieve_key` | `missionMgr.getCurrentObjective().id === 'retrieve_key'` |
| `T1-M03-05` | M03 | `retrieve_key` | Stand within 5.0m of courier car, press `[E]` | Keycard secured, advances to `escape_harbor` | `missionMgr.getCurrentObjective().id === 'escape_harbor'` |
| `T1-M03-06` | M03 | `escape_harbor` | Drive vehicle >85m away from Pier 19 | Awards +$1,200, sets M03 complete, chains M04 | `missionMgr.completedMissions.has('M03') === true` |

#### Mission M04: COLD STORAGE
| Test ID | Mission | Stage / Feature | Action / Input | Expected Output | Verification Assertion |
|---|---|---|---|---|---|
| `T1-M04-01` | M04 | `goto_warehouse` | Move within 5.5m of warehouse security door | Stage advances to `unlock_gate` | `missionMgr.getCurrentObjective().id === 'unlock_gate'` |
| `T1-M04-02` | M04 | `unlock_gate` | Stand within 5.0m of gate console, press `[E]` | Warehouse shutter raises, advances to `search_manifest` | `missionMgr.getCurrentObjective().id === 'search_manifest'` |
| `T1-M04-03` | M04 | `search_manifest` | Stand within 4.2m of office desk, press `[E]` | Displays `manifest` evidence modal | `document.getElementById('evidence-modal') !== null` |
| `T1-M04-04` | M04 | `retrieve_drive` | Stand within 4.2m of Locker 4B, press `[E]` | Spawns 3 heavy guards, advances to `eliminate_guards` | `enemyMgr.enemies.length === 3` |
| `T1-M04-05` | M04 | `eliminate_guards` | Neutralize all 3 warehouse guards | Guard check passes, advances to `escape_perimeter` | `missionMgr.getCurrentObjective().id === 'escape_perimeter'` |
| `T1-M04-06` | M04 | `escape_perimeter` | Drive vehicle >95m away from Pier 19 | Awards +$1,500, completes Act I, chains M05 | `missionMgr.completedMissions.has('M04') === true` |

#### Mission M05: THE JOURNALIST
| Test ID | Mission | Stage / Feature | Action / Input | Expected Output | Verification Assertion |
|---|---|---|---|---|---|
| `T1-M05-01` | M05 | `goto_diner` | Move within 7.5m of Southside Diner patio | Stage advances to `talk_mara` | `missionMgr.getCurrentObjective().id === 'talk_mara'` |
| `T1-M05-02` | M05 | `talk_mara` | Stand within 4.0m of Mara Vale, press `[F]` | Briefing dialogue plays, advances to `goto_meridian` | `missionMgr.getCurrentObjective().id === 'goto_meridian'` |
| `T1-M05-03` | M05 | `goto_meridian` | Drive within 9.5m of Meridian Properties office | Stage advances to `infiltrate_office` | `missionMgr.getCurrentObjective().id === 'infiltrate_office'` |
| `T1-M05-04` | M05 | `infiltrate_office` | Stand within 4.2m of archive desk, press `[E]` | Accesses office archive, advances to `photograph_evidence` | `missionMgr.getCurrentObjective().id === 'photograph_evidence'` |
| `T1-M05-05` | M05 | `photograph_evidence`| Stand within 4.2m of desk, press `[E]` | Displays `meridian_zoning` evidence modal | `missionMgr.getCurrentObjective().id === 'return_to_mara'` |
| `T1-M05-06` | M05 | `debrief_mara` | Return to diner, press `[F]` near Mara | Concluding dialogue plays, awards +$1,800, chains M06 | `missionMgr.completedMissions.has('M05') === true` |

#### Mission M06: BAD BUSINESS
| Test ID | Mission | Stage / Feature | Action / Input | Expected Output | Verification Assertion |
|---|---|---|---|---|---|
| `T1-M06-01` | M06 | `observe_redevelopment`| Drive within 8.0m of redevelopment overlook | Kaleb monologue plays, advances to `follow_contractor` | `missionMgr.getCurrentObjective().id === 'follow_contractor'` |
| `T1-M06-02` | M06 | `follow_contractor`| Trail Alvarez on foot to `(72, 0, -118)` | Meeting scene triggers, advances to `photograph_meeting` | `missionMgr.getCurrentObjective().id === 'photograph_meeting'` |
| `T1-M06-03` | M06 | `photograph_meeting`| Stand within 4.5m of meeting point, press `[E]` | Opens `contractor_payoff` modal, advances to vehicle tail | `missionMgr.getCurrentObjective().id === 'follow_vehicle'` |
| `T1-M06-04` | M06 | `follow_vehicle` | Tail utility truck to shell office `(-25, 0, -140)` | Truck parks, advances to `identify_shell_company` | `missionMgr.getCurrentObjective().id === 'identify_shell_company'` |
| `T1-M06-05` | M06 | `identify_shell_company`| Stand within 3.5m of directory plaque, press `[E]` | Plaque reveals Apex Land Holdings, advances to escape | `missionMgr.getCurrentObjective().id === 'escape_surveillance'` |
| `T1-M06-06` | M06 | `escape_surveillance`| Clear commercial perimeter (>70m from shell office)| Awards +$2,000, sets M06 complete, chains M07 | `missionMgr.completedMissions.has('M06') === true` |

#### Mission M07: OLD FRIENDS
| Test ID | Mission | Stage / Feature | Action / Input | Expected Output | Verification Assertion |
|---|---|---|---|---|---|
| `T1-M07-01` | M07 | `drive_to_garage` | Move within 14.0m of Adrian's garage | Standoff initiates, advances to `talk_to_jonah` | `missionMgr.getCurrentObjective().id === 'talk_to_jonah'` |
| `T1-M07-02` | M07 | `talk_to_jonah` | Stand within 4.0m of Jonah, press `[F]` | Creditor confrontation dialogue displays 3 choices | `document.getElementById('dialogue-box') !== null` |
| `T1-M07-03` | M07 | `pay_debt` (Branch A) | Select Choice 1 with cash >= $2,000 | Cash -$2,000, `jonahTrustsKaleb = true`, advances to debrief | `player.cash === initialCash - 2000` |
| `T1-M07-04` | M07 | `threaten_creditor` (Branch B) | Select Choice 2, eliminate 3 Syndicate enforcers | Enforcers cleared, `marrowHostile = true`, advances to debrief | `enemyMgr.areAllDead() === true` |
| `T1-M07-05` | M07 | `perform_drake_job` (Branch C)| Select Choice 3, retrieve contraband cache at depot | Contraband secured, `drakeAlliance = true`, advances to debrief | `missionMgr.getCurrentObjective().id === 'debrief_jonah'` |
| `T1-M07-06` | M07 | `debrief_jonah` | Press `[F]` within 3.8m of Jonah | Concluding debrief plays, awards +$2,500, chains M08 | `missionMgr.completedMissions.has('M07') === true` |

#### Mission M08: PAPER TRAIL
| Test ID | Mission | Stage / Feature | Action / Input | Expected Output | Verification Assertion |
|---|---|---|---|---|---|
| `T1-M08-01` | M08 | `meet_mara` | Stand within 4.0m of Mara at diner, press `[F]` | Financial briefing dialogue plays, advances to drive | `missionMgr.getCurrentObjective().id === 'drive_to_finance_office'` |
| `T1-M08-02` | M08 | `drive_to_finance_office`| Drive within 8.0m of Vespera Municipal Trust | Proximity trigger advances to `infiltrate_office` | `missionMgr.getCurrentObjective().id === 'infiltrate_office'` |
| `T1-M08-03` | M08 | `infiltrate_office` | Stand within 4.0m of side door, press `[E]` | Infiltrates office, shifts to night mode lighting | `missionMgr.getCurrentObjective().id === 'inspect_documents'` |
| `T1-M08-04` | M08 | `inspect_documents` | Stand within 3.5m of archive cabinets, press `[E]` | Examines Black Ledger filings, advances to terminal | `missionMgr.getCurrentObjective().id === 'obtain_records'` |
| `T1-M08-05` | M08 | `obtain_records` | Stand within 3.2m of terminal desk, press `[E]` | Opens `black_ledger_wire` modal, triggers alarm | `missionMgr.getCurrentObjective().id === 'escape_perimeter'` |
| `T1-M08-06` | M08 | `escape_perimeter` | Evade security patrols, move >75m from office | Awards +$3,000, Act II finale fanfare, completes M08 | `missionMgr.completedMissions.has('M08') === true` |

---

### 4.2 Tier 2: Boundary & Corner Cases

| Test ID | Mission | Feature | Boundary Condition Tested | Input / Stimulus | Expected Observable Behavior |
|---|---|---|---|---|---|
| `T2-M01-01` | M01 | Apartment Proximity | External door distance limit (4.0m threshold) | Press `[E]` at 4.2m from porch door | Door does not open; prompt remains hidden; stage does not advance. |
| `T2-M01-02` | M01 | Frame-Debounce Guard | Rapid double-press `[E]` on interior transition | Press `[E]` twice within 50ms at entrance door | Player transitions into apartment interior; debounce consumes second key; player stays inside. |
| `T2-M01-03` | M01 | Safehouse Access Gate | Re-entering apartment prior to completing M01 | Attempt free-roam re-entry before completing M01 | Entrance permitted only as active objective step; free-roam safehouse gated on `completedMissions.has('M01')`. |
| `T2-M01-04` | M01 | Evidence Modal Focus | Input routing while evidence modal is displayed | Send `KeyW` / movement keys while modal is active | Player movement input suppressed; pointer lock released until `#continue-mission-btn` clicked. |
| `T2-M01-05` | M01 | Clinic Respawn on Death | Lethal player damage during M01 | Player health set to 0 (`takeDamage(100)`) | WASTED overlay appears; 3.4s timer fires; player respawns at clinic with cash deduction; M01 stage preserved. |
| `T2-M02-01` | M02 | Shutter Proximity Gate | Shutter button distance threshold (4.5m limit) | Press `[E]` at 4.8m from shutter console | Shutter remains closed; interaction rejected. |
| `T2-M02-02` | M02 | Safe Access Pre-Shutter | Interacting with wall safe through closed shutter mesh | Press `[E]` near safe coordinates while shutter is closed | Safe is non-interactive until shutter is raised. |
| `T2-M02-03` | M02 | Vehicle-Only Escape | Escaping garage perimeter on foot | Run on foot >65m away from garage during `escape_area` | Distance > 65m satisfied, but `isInVehicle === false`; mission does not complete. |
| `T2-M02-04` | M02 | Escape Boundary Exactness | Escape distance threshold (65.0m limit) | Vehicle parked at 64.8m from garage center | Mission remains active; moving vehicle to 65.2m immediately triggers completion fanfare. |
| `T2-M02-05` | M02 | Weapon Ammo Grant | Shotgun ammo inventory capping | Player picks up shotgun safe reward | `hasShotgun` set to `true`; exactly 18 shells added to `shotgunReserve`; weapon HUD updates. |
| `T2-M03-01` | M03 | Vantage Height Limit | Reaching vantage area from ground level below | Stand directly beneath container stack at `(65, 0, -125)` | 3D vertical distance check ensures vantage trigger only occurs on top of containers (`player.position.y >= 3.0`). |
| `T2-M03-02` | M03 | Stakeout Interaction Cone | Viewing handoff from reverse direction | Turn camera 180 degrees away from dock crane, press `[E]` | Stakeout prompt requires facing toward meeting coordinates (+/- 45 degrees); otherwise disabled. |
| `T2-M03-03` | M03 | Courier Collision Speed | Low-speed touch vs high-speed pursuit ramming | Touch courier vehicle at < 2 MPH | Courier vehicle does not disable; requires deceleration impact or proximity <= 16m at destination. |
| `T2-M03-04` | M03 | Courier Out-of-Bounds | Courier pursuit vehicle stuck in world collider | Collision with barrier during pursuit | Pathfinding recovery unsticks courier or snaps to forward waypoint to prevent permanent blockage. |
| `T2-M03-05` | M03 | Harbor Escape Boundary | Vehicle escape distance threshold (85.0m limit) | Vehicle at 84.5m from Pier 19 | Mission remains in escape stage; crossing 85.1m completes stage immediately. |
| `T2-M04-01` | M04 | Terminal Gate Lockout | Accessing terminal before gate unlock | Attempt terminal interaction while roll-up shutter closed | Objective state machine rejects interaction; requires `unlock_gate` stage complete. |
| `T2-M04-02` | M04 | Sequence Enforcement | Interacting with Locker 4B before manifest search | Press `[E]` at Locker 4B while objective is `search_manifest` | Locker interaction inert; terminal manifest inspection mandatory first. |
| `T2-M04-03` | M04 | Multi-Guard Hitscan DPS | Combat survival threshold under heavy fire | Stand motionless in doorway with 3 guards firing | Player health decays from 100 to 0 in ~2.8s; verifies damage registration and clinic fail recovery. |
| `T2-M04-04` | M04 | Guard Clearance Verification | Escape attempted with 1 guard still alive | Move to vehicle and drive away while 1 guard lives | Objective `escape_perimeter` remains locked until `enemyMgr.areAllDead() === true`. |
| `T2-M04-05` | M04 | Pier 19 Escape Threshold | Vehicle escape distance threshold (95.0m limit) | Drive vehicle to 94.2m vs 95.5m from pier | Stage completes precisely upon crossing the 95.0m radial perimeter in a vehicle. |
| `T2-M05-01` | M05 | Diner Proximity Radial | Southside Diner arrival radius (7.5m limit) | Vehicle arrives at 8.0m from patio | Waypoint marker active; stage transitions to `talk_mara` only when distance <= 7.5m. |
| `T2-M05-02` | M05 | Dialogue Range Break | Walking away during Mara Vale briefing | Walk >6.0m away while dialogue box is open | Dialogue cleanly aborts; resets objective prompt without locking player controls. |
| `T2-M05-03` | M05 | Meridian Infiltration Radial | Meridian office arrival threshold (9.5m limit) | Vehicle arrives at 10.2m vs 9.1m | Proximity triggers infiltration objective precisely upon entering <= 9.5m radius. |
| `T2-M05-04` | M05 | Document Photo Interaction | Photo prompt distance threshold (4.2m limit) | Stand at 4.5m from desk, press `[E]` | Interaction ignored; moving to 3.8m displays prompt and opens modal. |
| `T2-M05-05` | M05 | Safe Return Proximity | Returning to Southside Diner (7.5m limit) | Arrive at 7.2m from diner | Proximity trigger advances to `debrief_mara`; Mara NPC dialogue prompt activates. |
| `T2-M06-01` | M06 | Foot Tailing Under-Distance | Stalking Alvarez: minimum distance boundary (<4.0m) | Approach within 3.0m behind Alvarez | Alvarez halts, turns around, and shouts warning. Remaining <3m for 3s triggers cover blown fail. |
| `T2-M06-02` | M06 | Foot Tailing Over-Distance | Stalking Alvarez: maximum distance boundary (>20.0m) | Fall behind to 26.0m | "TARGET GETTING AWAY" warning displays; 10-second timer begins; closing distance resets timer. |
| `T2-M06-03` | M06 | Photo Line-of-Sight Check | Photographing meeting behind opaque barrier | Press `[E]` within 4.5m but behind concrete wall | Raycast test fails; HUD notifies: "Line of sight occluded"; photo not recorded. |
| `T2-M06-04` | M06 | Vehicle Tailing Envelope | Tailing utility truck: speed and distance limits | Tail truck at 8.0m (too close) vs 58.0m (too far) | At 8m, truck honks and accelerates; at 58m, lost signal timer initiates; nominal envelope is 12m–50m. |
| `T2-M06-05` | M06 | Commercial Escape Radial | Surveillance evasion threshold (>70.0m limit) | Player moves to 69.5m vs 70.8m from shell office | Escape objective completes strictly upon crossing 70.0m threshold. |
| `T2-M07-01` | M07 | Branch A Cash Insufficiency | Cash balance exactly $1,999 ($1 below $2,000) | Select Choice 1 with cash = $1,999 | System rejects payment; displays "Insufficient funds ($1,999 / $2,000)"; choices remain selectable. |
| `T2-M07-02` | M07 | Branch A Cash Exact Balance | Cash balance exactly $2,000 | Select Choice 1 with cash = $2,000 | Payment accepted; cash set to $0; debt cleared; `jonahTrustsKaleb = true`. |
| `T2-M07-03` | M07 | Branch B Story NPC Armor | Stray bullet trajectory hitting Jonah Reyes | Fire shotgun directly at Jonah during shootout | Jonah's `isStoryNPC` flag nullifies all damage; Jonah crouches behind cover. |
| `T2-M07-04` | M07 | Branch B Squad Clearance | Attempting debrief with 1 enforcer alive | Speak with Jonah while 1 Syndicate enforcer lives | Jonah remains in terror/duck state; debrief inactive until `enemyMgr.areAllDead() === true`. |
| `T2-M07-05` | M07 | Standoff Abandonment | Walking away from garage (>120m limit) | Move >120m away during active creditor standoff | Mission fails with game-over notification: "You abandoned Jonah to the Marrow Syndicate." |
| `T2-M08-01` | M08 | Dialogue Initiation Cone | Talking to Mara at diner patio (4.0m limit) | Stand at 4.4m vs 3.8m from Mara, press `[F]` | Dialogue only activates within 4.0m radial threshold. |
| `T2-M08-02` | M08 | Office Infiltration Radius | Side entrance door distance threshold (4.0m limit) | Press `[E]` at 4.3m from side door | Entry denied; moving to 3.7m successfully transitions into executive office night mode. |
| `T2-M08-03` | M08 | Linear Terminal Lockout | Downloading terminal before archive cabinet search | Press `[E]` at terminal while objective is `inspect_documents` | Terminal screen shows "LOCKED: CONSULT PHYSICAL ARCHIVES"; enforces document inspection first. |
| `T2-M08-04` | M08 | Modal Input Restoration | Dismissing Black Ledger evidence modal | Press `[E]` to download, then click modal Continue button | Modal hides cleanly; canvas pointer lock requested; game state returns to `FREE_ROAM`. |
| `T2-M08-05` | M08 | Financial Escape Boundary | Security cordon evasion threshold (>75.0m limit) | Move to 74.2m vs 75.8m from financial office | Mission Passed fanfare triggers strictly when 2D distance exceeds 75.0m. |

---

### 4.3 Tier 3: Cross-Feature Combinations (Pairwise Subsystem Matrix)

| Interaction ID | System A | System B | Test Scenario & Verification Method | Expected Combined Behavior |
|---|---|---|---|---|
| `T3-COMB-01` | M07 Branching | Player Cash / Wallet | Player has $3,500; selects Choice A ($2,000 debt payoff). | Cash decrements to $1,500; `jonahTrustsKaleb` flag sets to `true`; creditor departs peacefully; future shop repairs discounted. |
| `T3-COMB-02` | M07 Branching | Weapon Combat Engine | Player has 0 ammo; selects Choice B (Shootout). | Syndicate enforcers draw pistols; player forced to fight with melee or scavenge garage weapon; tests combat fallback under zero ammo. |
| `T3-COMB-03` | M06 Surveillance | Pedestrian Traffic / Aggro | Player draws firearm or sprints into civilian while tailing Alvarez. | Nearby pedestrians scream and flee; Alvarez pauses in alarm; if player does not holster weapon within 4s, stealth is blown. |
| `T3-COMB-04` | Evidence Modals | UI HUD Minimap / GPS | Player triggers evidence modal (`contractor_payoff`, `black_ledger_wire`) while in motion. | Player velocity decelerates to 0; minimap remains visible beneath semi-transparent backdrop; pointer lock released. |
| `T3-COMB-05` | Vehicle System | Interior Transitions | Player attempts to drive vehicle directly into Lena's apartment or Vespera Trust door. | Vehicle collides with doorway mesh; pressing `[E]` while in vehicle auto-ejects player to foot before interior teleportation. |
| `T3-COMB-06` | Pause Menu | Active Evidence Modal | Player presses `ESC` while an evidence modal is displayed. | Evidence modal closes or pauses; game enters pause state cleanly without input focus trapping or canvas freeze. |
| `T3-COMB-07` | Combat Engine | Medical Clinic Respawn | Player killed during M04 warehouse ambush or M07 shootout. | Screen fades to WASTED; medical fee deducted; player respawns at clinic; active mission objective preserved at checkpoint. |
| `T3-COMB-08` | Save / Load System | Mission Progression | Game saved during stage 4 of M06/M07/M08; page reloaded. | Save payload restores exact mission ID, objective index, completed missions set, player cash, and weapon inventory. |
| `T3-COMB-09` | Debug Menu Warp | Interior Camera Modes | Debug menu warps player from outside directly into M01 apartment or M08 night office. | Setup hook executes `camera.isInteriorMode = true`; snaps camera behind player; clears external traffic audio. |
| `T3-COMB-10` | Campaign Chaining | Audio / Music System | Mission completes; fanfare audio plays; transition to next mission. | `playMissionPassed()` fanfare executes; 800ms timer fires; narrative voice lines queue; next mission starts without audio overlap. |

---

### 4.4 Tier 4: Real-World Application Scenarios (End-to-End Campaign Progression)

#### Scenario 1: Continuous Full Campaign Playthrough (M01 -> M08)
- **Goal**: Execute the complete narrative arc from initial Eastline arrival to Act II Black Ledger exposure without reloading or manual state manipulation.
- **Workflow**:
  1. `M01_HomeAgain`: Arrive in Eastline -> Speak with Mrs. Gable -> Enter Unit 102 -> Find hidden harbor photo -> Exit safehouse. (Reward: +$500).
  2. *Auto-Chain to M02*: Kaleb monologue queues -> Drive to Southside -> Talk with Jonah -> Raise workshop shutter -> Crack safe -> Defeat Syndicate ambush -> Escape in vehicle. (Reward: +$800, Shotgun).
  3. *Auto-Chain to M03*: Travel to Pier 19 -> Climb container vantage -> Stake out handoff -> Pursue fleeing courier coupe -> Retrieve cold storage key -> Escape harbor. (Reward: +$1,200).
  4. *Auto-Chain to M04*: Infiltrate Warehouse 19 -> Unlock gate -> Photograph shipping manifest -> Extract encrypted military drive -> Eliminate heavy hit squad -> Evade harbor cordon. (Reward: +$1,500).
  5. *Auto-Chain to M05*: Meet Mara Vale at Southside Diner -> Infiltrate Meridian Properties office -> Photograph zoning buyout contracts -> Return to diner -> Decrypt Lena's audio journal. (Reward: +$1,800).
  6. *Auto-Chain to M06*: Stake out Eastline Redevelopment Zone -> Trail contractor Alvarez on foot through yard -> Photograph payoff -> Tail utility truck across city -> Inspect Apex Land Holdings directory -> Escape surveillance. (Reward: +$2,000).
  7. *Auto-Chain to M07*: Rush to Adrian's garage -> Confront creditor -> Choose resolution (e.g. Branch A: pay debt) -> Settle debt -> Debrief with Jonah. (Reward: +$2,500).
  8. *Auto-Chain to M08*: Review financial intel with Mara -> Travel to Vespera Municipal Trust -> Infiltrate executive suite in night mode -> Cross-reference physical archive filings -> Download wire ledger from terminal -> Evade high-alert security cordon (>75m). (Reward: +$3,000, Act II finale fanfare).
- **Cumulative Verifications**:
  - `missionMgr.completedMissions` contains `'M01'`, `'M02'`, `'M03'`, `'M04'`, `'M05'`, `'M06'`, `'M07'`, `'M08'`.
  - Player cash equals starting cash + $12,300 (-$2,000 if Branch A selected = net +$10,300).
  - Player inventory contains Pistol, Tactical Shotgun, and reserve ammunition.
  - World flags include `jonahTrustsKaleb: true`, `shellCompanyExposed: true`, `blackLedgerWireDecrypted: true`.

#### Scenario 2: Resilient Mid-Campaign Death & Recovery
- **Goal**: Verify that player death during high-stakes combat (e.g. M04 warehouse or M07 shootout) does not corrupt mission progression or break campaign chaining.
- **Workflow**:
  1. Advance to M04 `eliminate_guards` or M07 `eliminate_enforcers`.
  2. Force lethal damage (`player.takeDamage(100)`).
  3. Verify WASTED screen displays and input lock holds.
  4. Await 3.4s medical clinic respawn at Metro Clinic.
  5. Verify player spawned at clinic coordinates with health restored to 100.
  6. Verify `missionMgr.currentMission` is intact and objective remains at combat checkpoint.
  7. Return to combat zone, eliminate enemies, and proceed to completion and campaign chain.

---

## 5. Execution Guide & Test Commands

### 5.1 Environment Prerequisites
- Node.js >= 18.0.0
- Google Chrome installed at `C:\Program Files\Google\Chrome\Application\chrome.exe`
- Vite development server running on port 3000

### 5.2 Launching the Test Server
```powershell
# Terminal 1: Launch game dev server
npm run dev
# Server listening on http://localhost:3000/
```

### 5.3 Executing Dedicated Mission Playtests
```powershell
# Run baseline camera and debug menu suites
node scripts/test_camera_views.js
node scripts/test_debug_menu.js

# Run individual mission verification scripts
node scripts/test_m01_apartment.js
node scripts/test_m02_garage.js
node scripts/test_m06_bad_business.js
node scripts/test_m07_old_friends.js
node scripts/test_m08_paper_trail.js
```

### 5.4 Executing Full E2E Campaign Suite
```powershell
# Run complete 8-mission continuous campaign test
node scripts/test_e2e_campaign.js
```

### 5.5 Pass / Fail Exit Code Guarantee
All automated verification scripts must exit with:
- Exit Code `0`: All stages completed successfully; all assertions passed; screenshots recorded.
- Exit Code `1`: Assertion failure, timeout (>30s per stage), or unhandled browser exception.

---

## 6. Debug Hooks & Testability Architecture

### 6.1 Browser Console & Debug Menu Hooks
Automated scripts can manipulate game state directly via `page.evaluate()`:

```javascript
// 1. Warp directly to a mission stage
window.game.debugMenu.warpToMission('M06', 2); // Warps to M06 stage 3 (photograph_meeting)

// 2. Query objective and distance
const currentObj = window.game.missionMgr.getCurrentObjective();
const dist = window.game.missionMgr.getDistanceToObjective(window.game.player.position);

// 3. Advance objective manually
window.game.missionMgr.advanceObjective();

// 4. Inspect player state
const { health, cash, isInVehicle } = window.game.player;

// 5. Query active enemy squad
const enemyCount = window.game.enemyMgr.enemies.length;
const allDead = window.game.enemyMgr.areAllDead();
```

### 6.2 Key DOM Selectors for Test Automation
| Element ID / Selector | Purpose | Verification Trigger |
|---|---|---|
| `#start-game-btn` | Title screen launch button | Click to enter world |
| `#interaction-prompt` | Contextual prompt (`[E]`, `[F]`) | `.innerText` checks action text |
| `#evidence-modal` | Full-screen evidence viewer | Check visibility / canvas rendering |
| `#continue-mission-btn` | Evidence modal dismissal button | Click to close modal & proceed |
| `#dialogue-box` | Story conversation overlay | Check text content and speaker |
| `#mission-banner` | Mission passed fanfare overlay | Displays mission title & cash reward |
| `#wasted-screen` | Death overlay banner | Displays "WASTED" on 0 HP |
| `#debug-menu` | Developer cheat & warp panel | Direct stage teleportation |
