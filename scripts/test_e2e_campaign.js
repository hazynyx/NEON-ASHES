import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const screenshotDir = path.resolve('screenshots/e2e');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

let passedCount = 0;
let failedCount = 0;
const testResults = [];

function assert(condition, message) {
  if (!condition) {
    failedCount++;
    testResults.push({ status: 'FAIL', message });
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    passedCount++;
    testResults.push({ status: 'PASS', message });
    console.log(`  ✅ PASS: ${message}`);
  }
}

let browserInstance = null;
const cleanup = async () => {
  if (browserInstance) {
    try {
      await browserInstance.close();
    } catch (_) {}
    browserInstance = null;
  }
};
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(1);
});
process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(1);
});

async function dismissDialogue(page) {
  await page.evaluate(() => {
    const d = window.game?.dialogueMgr;
    let guard = 0;
    while (d && d.isActive && guard < 20) {
      d.advance();
      guard++;
    }
  });
  await new Promise(r => setTimeout(r, 200));
}

async function dismissEvidenceModal(page) {
  await page.evaluate(() => {
    const btn = document.getElementById('continue-mission-btn');
    if (btn) btn.click();
    if (window.game?.hud?.isEvidenceOpen) {
      window.game.hud.hideEvidence();
    }
  });
  await new Promise(r => setTimeout(r, 300));
}

async function clickResultContinue(page) {
  // Wait up to 5s for #mission-result-banner to be visible
  await page.waitForFunction(() => {
    const banner = document.getElementById('mission-result-banner');
    return banner && !banner.classList.contains('hidden');
  }, { timeout: 6000 });

  // Click continue button
  await page.evaluate(() => {
    const btn = document.getElementById('result-continue-btn');
    if (btn) btn.click();
  });

  // Wait for banner to hide
  await page.waitForFunction(() => {
    const banner = document.getElementById('mission-result-banner');
    return !banner || banner.classList.contains('hidden');
  }, { timeout: 6000 });
}

async function runCampaignE2E() {
  console.log('================================================================');
  console.log('  NEON ASHES — End-to-End Campaign Verification Suite (M01-M08) ');
  console.log('================================================================\n');

  const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  console.log(`Launching headless Chrome at: ${chromePath}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
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
  browserInstance = browser;

  const pageLogs = [];

  try {
    const page = await browser.newPage();
    page.on('console', msg => {
      const text = msg.text();
      pageLogs.push(text);
      if (text.includes('[CRITICAL]') || text.includes('Error:')) {
        console.error('    [PAGE LOG]:', text);
      }
    });
    page.on('pageerror', err => {
      console.error('    [PAGE ERROR]:', err.message);
    });

    console.log('Navigating to http://localhost:3000/ (domcontentloaded)...');
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

    console.log('Waiting for engine initialization and start game button...');
    await page.waitForFunction(
      () => typeof window.game !== 'undefined' && !!document.getElementById('start-game-btn'),
      { timeout: 30000 }
    );

    console.log('Clicking start game button...');
    await page.evaluate(() => {
      const btn = document.getElementById('start-game-btn');
      if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Ensure game is unpaused, free roam, and player is on foot
    await page.evaluate(() => {
      if (window.game.pauseMenu.isOpen()) window.game.pauseMenu.close();
      window.game.state.setState('FREE_ROAM');
      if (window.game.player.isInVehicle) {
        window.game.vehicleMgr.exitVehicle(window.game.player);
      }
      // Attach E2E event listener spy
      window.__e2e_events = [];
      window.game.eventBus.on('mission:start', (e) => {
        window.__e2e_events.push({ type: 'start', id: e?.mission?.id, time: Date.now() });
      });
      window.game.eventBus.on('mission:complete', (e) => {
        window.__e2e_events.push({ type: 'complete', id: e?.mission?.id, time: Date.now() });
      });
    });

    // =========================================================================
    // SUITE 0: Verify Mission Registration in DebugMenu & DOM Dropdown
    // =========================================================================
    console.log('\n--- SUITE 0: Debug Menu & DOM Dropdown Registration ---');
    const registration = await page.evaluate(() => {
      const missions = window.game.debugMenu.missions;
      const expectedIds = ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08'];
      const debugDefChecks = {};
      const domOptionChecks = {};

      for (const id of expectedIds) {
        const def = missions[id];
        debugDefChecks[id] = {
          exists: !!def,
          stageCount: def?.stages?.length || 0,
          name: def?.name || ''
        };
        const opt = document.querySelector(`#debug-mission-select option[value="${id}"]`);
        domOptionChecks[id] = !!opt;
      }

      return { debugDefChecks, domOptionChecks };
    });

    for (const id of ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08']) {
      assert(registration.debugDefChecks[id].exists, `DebugMenu registers mission ${id}`);
      assert(registration.debugDefChecks[id].stageCount > 0, `Mission ${id} has stages defined (count=${registration.debugDefChecks[id].stageCount})`);
      assert(registration.domOptionChecks[id], `#debug-mission-select contains option for ${id}`);
    }

    // =========================================================================
    // SUITE 1: Full Sequential Campaign Chaining Pipeline (M01 -> M08)
    // =========================================================================
    console.log('\n--- SUITE 1: Full Sequential Campaign Chaining (M01 -> M08 -> Finale) ---');

    // Reset player state to pristine starting conditions
    await page.evaluate(() => {
      window.game.missionMgr.completedMissions.clear();
      window.game.debugMenu.warpToMission('M01', 0);
    });
    await new Promise(r => setTimeout(r, 600));

    const campaignChain = [
      { id: 'M01', nextId: 'M02', title: 'HOME AGAIN' },
      { id: 'M02', nextId: 'M03', title: 'OLD DEBTS' },
      { id: 'M03', nextId: 'M04', title: 'THE HARBOR' },
      { id: 'M04', nextId: 'M05', title: 'COLD STORAGE' },
      { id: 'M05', nextId: 'M06', title: 'THE JOURNALIST' },
      { id: 'M06', nextId: 'M07', title: 'BAD BUSINESS' },
      { id: 'M07', nextId: 'M08', title: 'OLD FRIENDS' },
      { id: 'M08', nextId: null,   title: 'PAPER TRAIL' }
    ];

    for (let i = 0; i < campaignChain.length; i++) {
      const step = campaignChain[i];
      console.log(`\n  [Chain Step ${i + 1}/8] Active Mission: ${step.id} (${step.title})`);

      // Verify mission is active
      const currentId = await page.evaluate(() => window.game.missionMgr.currentMission?.id);
      assert(currentId === step.id, `Current mission matches expected ${step.id} (got ${currentId})`);

      // Advance through all objectives in current mission to trigger completeMission()
      console.log(`    Advancing objectives for ${step.id}...`);
      await page.evaluate(() => {
        const m = window.game.missionMgr;
        let guard = 0;
        while (m.getCurrentObjective() && guard < 15) {
          m.advanceObjective();
          guard++;
        }
      });

      // Assert mission marked as completed in missionMgr
      const isComplete = await page.evaluate((id) => window.game.missionMgr.completedMissions.has(id), step.id);
      assert(isComplete, `Mission ${step.id} is marked as completed in completedMissions`);

      // Handle mission passed banner and click continue
      console.log(`    Clicking #result-continue-btn for ${step.id}...`);
      await clickResultContinue(page);

      if (step.nextId) {
        console.log(`    Awaiting canonical chain transition to ${step.nextId} (800ms timer)...`);
        await page.waitForFunction(
          (nextId) => window.game.missionMgr.currentMission?.id === nextId,
          { timeout: 5000 },
          step.nextId
        );
        const nextActiveId = await page.evaluate(() => window.game.missionMgr.currentMission?.id);
        assert(nextActiveId === step.nextId, `Chaining automatically started next canonical mission ${step.nextId}`);
      } else {
        console.log(`    M08 complete! Awaiting Act II Finale fanfare...`);
        await new Promise(r => setTimeout(r, 1500));
        const finalCheck = await page.evaluate(() => {
          const expected = ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08'];
          const completed = expected.every(id => window.game.missionMgr.completedMissions.has(id));
          return {
            allCompleted: completed,
            completedList: Array.from(window.game.missionMgr.completedMissions)
          };
        });
        assert(finalCheck.allCompleted, `All 8 missions (M01-M08) are present in completedMissions: [${finalCheck.completedList.join(', ')}]`);
      }
    }

    await page.screenshot({ path: path.join(screenshotDir, '01_campaign_chaining_complete.png') });
    console.log('Saved screenshot: 01_campaign_chaining_complete.png');

    // =========================================================================
    // SUITE 2: Milestone Stage Deep Progression Verification
    // =========================================================================
    console.log('\n--- SUITE 2: Milestone Stage Deep Progression Verification ---');

    // -------------------------------------------------------------------------
    // Milestone 1: M01 Safehouse Progression (Apartment Interior & Photo Modal)
    // -------------------------------------------------------------------------
    console.log('\n  [Milestone 1] M01 Safehouse: Door entry, interior, photo evidence modal, safehouse exit');
    await page.evaluate(() => {
      if (window.game.player.isInVehicle) {
        window.game.vehicleMgr.exitVehicle(window.game.player);
      }
      window.game.debugMenu.warpToMission('M01', 2); // enter_apartment
      window.game.player.teleport(new window.THREE.Vector3(30, 0, -28.0), Math.PI);
      window.game.camera.snap(window.game.player.position, 0, 0.15, window.game.world.colliders);
    });
    await new Promise(r => setTimeout(r, 600));

    // Verify interaction prompt for entering apartment
    const m01Prompt = await page.evaluate(() => {
      const p = document.getElementById('interaction-prompt');
      const label = document.getElementById('prompt-label');
      return {
        visible: p && !p.classList.contains('hidden'),
        label: label ? label.innerText : ''
      };
    });
    assert(m01Prompt.visible, 'M01 enter_apartment prompt is visible outside door');

    // Press [E] to enter apartment
    console.log('    Pressing [E] to enter apartment interior...');
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 600));

    const m01InteriorState = await page.evaluate(() => ({
      isInterior: window.game.isInApartmentInterior,
      objId: window.game.missionMgr.getCurrentObjective()?.id
    }));
    assert(m01InteriorState.isInterior, 'Player is inside apartment interior (isInApartmentInterior === true)');
    assert(m01InteriorState.objId === 'search_room', 'Objective advanced to search_room');

    // Teleport to desk within loose floorboard radius (297.2, 0, -302.2)
    console.log('    Inspecting loose floorboard at desk...');
    await page.evaluate(() => {
      window.game.player.teleport(new window.THREE.Vector3(297.2, 0, -302.0), 0);
    });
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 600));

    const m01PhotoModal = await page.evaluate(() => {
      const modal = document.getElementById('evidence-modal');
      const title = document.getElementById('evidence-title') || document.querySelector('.evidence-title');
      return {
        isOpen: window.game.hud.isEvidenceOpen,
        domVisible: modal && !modal.classList.contains('hidden'),
        title: title ? title.innerText : ''
      };
    });
    assert(m01PhotoModal.isOpen && m01PhotoModal.domVisible, 'M01 Harbor Photo evidence modal is displayed');
    assert(m01PhotoModal.title.includes('HARBOR PHOTOGRAPH'), `Evidence title matches HARBOR PHOTOGRAPH (got "${m01PhotoModal.title}")`);

    // Dismiss photo modal
    await dismissEvidenceModal(page);
    const m01PostModalObj = await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id);
    assert(m01PostModalObj === 'exit_apartment', 'Objective advanced to exit_apartment after modal dismissal');

    // Exit apartment interior
    await page.evaluate(() => {
      window.game.player.teleport(new window.THREE.Vector3(300, 0, -297), 0);
    });
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 600));

    const m01PostExit = await page.evaluate(() => window.game.isInApartmentInterior);
    assert(!m01PostExit, 'Player returned to city exterior (isInApartmentInterior === false)');
    await page.screenshot({ path: path.join(screenshotDir, '02_m01_safehouse_verified.png') });

    // -------------------------------------------------------------------------
    // Milestone 2: M05 Southside Diner & Meridian Office Infiltration
    // -------------------------------------------------------------------------
    console.log('\n  [Milestone 2] M05 Southside Diner: Mara talk, Meridian infiltration, zoning buyout photo');
    await page.evaluate(() => {
      window.game.debugMenu.warpToMission('M05', 0); // goto_diner
      window.game.player.teleport(new window.THREE.Vector3(48, 0, 35), 0);
    });
    await new Promise(r => setTimeout(r, 500));

    const m05S0Obj = await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id);
    assert(m05S0Obj === 'talk_mara' || m05S0Obj === 'goto_diner', `M05 diner arrival objective reached (got ${m05S0Obj})`);

    // Talk to Mara at patio [F]
    console.log('    Speaking with Mara Vale at diner patio...');
    await page.keyboard.press('KeyF');
    await new Promise(r => setTimeout(r, 400));
    await dismissDialogue(page);

    const m05S1Obj = await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id);
    assert(m05S1Obj === 'goto_meridian', `Dialogue advanced objective to goto_meridian (got ${m05S1Obj})`);

    // Warp to Meridian office archive desk
    console.log('    Infiltrating Meridian Properties office archive...');
    await page.evaluate(() => {
      window.game.debugMenu.warpToMission('M05', 3); // infiltrate_office
      window.game.player.teleport(new window.THREE.Vector3(0, 0, -163), 0);
    });
    await new Promise(r => setTimeout(r, 400));
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 400));

    // Photograph evidence [E]
    console.log('    Photographing Meridian zoning buyout contracts...');
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 600));

    const m05Modal = await page.evaluate(() => {
      const modal = document.getElementById('evidence-modal');
      const title = document.getElementById('evidence-title') || document.querySelector('.evidence-title');
      return {
        isOpen: window.game.hud.isEvidenceOpen,
        domVisible: modal && !modal.classList.contains('hidden'),
        title: title ? title.innerText : ''
      };
    });
    assert(m05Modal.isOpen && m05Modal.domVisible, 'M05 Meridian Zoning evidence modal is displayed');
    assert(m05Modal.title.includes('MERIDIAN ZONING BUYOUT AGREEMENT'), `Evidence title matches MERIDIAN ZONING (got "${m05Modal.title}")`);

    await dismissEvidenceModal(page);
    await page.screenshot({ path: path.join(screenshotDir, '03_m05_meridian_verified.png') });

    // -------------------------------------------------------------------------
    // Milestone 3: M06 Construction Yard Tailing, Payoff Photo, Directory Plaque
    // -------------------------------------------------------------------------
    console.log('\n  [Milestone 3] M06 Bad Business: Construction tailing, Alvarez payoff photo, shell plaque, escape');
    await page.evaluate(() => {
      window.game.debugMenu.warpToMission('M06', 2); // photograph_meeting
      window.game.player.teleport(new window.THREE.Vector3(72, 0, -116), 0);
    });
    await new Promise(r => setTimeout(r, 400));

    const m06PhotoPrompt = await page.evaluate(() => {
      const p = document.getElementById('interaction-prompt');
      const key = document.getElementById('prompt-key');
      return {
        visible: p && !p.classList.contains('hidden'),
        key: key ? key.innerText : ''
      };
    });
    assert(m06PhotoPrompt.visible, 'M06 photograph_meeting prompt is visible at meeting vantage');
    assert(m06PhotoPrompt.key === 'E', 'M06 interaction prompt key is [E]');

    // Press [E] to photograph bribe handoff
    console.log('    Pressing [E] to photograph Dominic Alvarez bribe handoff...');
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 600));

    const m06Modal = await page.evaluate(() => {
      const modal = document.getElementById('evidence-modal');
      const title = document.getElementById('evidence-title') || document.querySelector('.evidence-title');
      const caption = document.getElementById('evidence-caption') || document.querySelector('.evidence-caption');
      return {
        isOpen: window.game.hud.isEvidenceOpen,
        domVisible: modal && !modal.classList.contains('hidden'),
        title: title ? title.innerText : '',
        caption: caption ? caption.innerText : ''
      };
    });
    assert(m06Modal.isOpen && m06Modal.domVisible, 'M06 Contractor Payoff evidence modal is displayed');
    assert(m06Modal.title.includes('REDEVELOPMENT BRIBE HANDOFF'), `Evidence modal title matches REDEVELOPMENT BRIBE HANDOFF (got "${m06Modal.title}")`);
    assert(m06Modal.caption.includes('Dominic Alvarez') || m06Modal.caption.includes('APEX LAND HOLDINGS'),
      `Evidence caption details Alvarez / Apex Land Holdings (got "${m06Modal.caption}")`);

    await dismissEvidenceModal(page);
    await dismissDialogue(page);
    const m06PostPhotoObj = await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id);
    assert(m06PostPhotoObj === 'follow_vehicle', 'Objective advanced to follow_vehicle after bribe photograph');

    // Warp to shell company office plaque inspection
    console.log('    Inspecting corporate directory plaque discovering Apex Land Holdings...');
    await page.evaluate(() => {
      window.game.debugMenu.warpToMission('M06', 4); // identify_shell_company
      window.game.player.teleport(new window.THREE.Vector3(-24, 0, -139), 0);
    });
    await new Promise(r => setTimeout(r, 400));
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 400));
    await dismissDialogue(page);

    const m06PlaqueObj = await page.evaluate(() => ({
      objId: window.game.missionMgr.getCurrentObjective()?.id,
      shellCompanyExposed: window.game.shellCompanyExposed
    }));
    assert(m06PlaqueObj.objId === 'escape_surveillance', 'Objective advanced to escape_surveillance');

    // Escape perimeter (>70m from shell office)
    console.log('    Evading surveillance perimeter (>70m)...');
    await page.evaluate(() => {
      window.game.player.teleport(new window.THREE.Vector3(-25, 0, -220), 0);
    });
    await new Promise(r => setTimeout(r, 500));

    const m06Complete = await page.evaluate(() => window.game.missionMgr.completedMissions.has('M06'));
    assert(m06Complete, 'M06 successfully completed upon perimeter evacuation');
    await clickResultContinue(page);
    await page.screenshot({ path: path.join(screenshotDir, '04_m06_bad_business_verified.png') });

    // -------------------------------------------------------------------------
    // Milestone 4: M07 3-Way Choice Branching System
    // -------------------------------------------------------------------------
    console.log('\n  [Milestone 4] M07 Old Friends: Choice Branching (A: Debt Payoff, B: Shootout, C: Drake Contraband)');

    // Branch A: Cash Payment (-$2,000, Jonah loyalty secured)
    console.log('    Testing Branch A (Peaceful Debt Payoff)...');
    await page.evaluate(() => {
      window.game.debugMenu.warpToMission('M07', 2); // resolve_debt_choice
      window.game.player.cash = 3500;
      window.game.player.teleport(new window.THREE.Vector3(-56, 0, 68), 0);
    });
    await new Promise(r => setTimeout(r, 400));

    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Digit1', key: '1' }));
      window.game.update(0.016);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Digit1', key: '1' }));
    });
    await new Promise(r => setTimeout(r, 400));
    await dismissDialogue(page);

    const branchAState = await page.evaluate(() => ({
      cash: window.game.player.cash,
      jonahTrustsKaleb: window.game.jonahTrustsKaleb,
      m07Choice: window.game.m07Choice,
      objId: window.game.missionMgr.getCurrentObjective()?.id
    }));
    assert(branchAState.cash === 1500, `Branch A deducted exactly $2,000 debt (remaining cash: $${branchAState.cash})`);
    assert(branchAState.jonahTrustsKaleb === true, 'Branch A secured Jonah loyalty (jonahTrustsKaleb === true)');
    assert(branchAState.m07Choice === 'A', 'm07Choice registered as "A"');
    assert(branchAState.objId === 'debrief_jonah', 'Objective advanced to debrief_jonah');

    // Branch B: Creditor Shootout (Syndicate combat squad elimination)
    console.log('    Testing Branch B (Creditor Shootout Elimination)...');
    await page.evaluate(() => {
      window.game.debugMenu.warpToMission('M07', 3); // eliminate_enforcers
      window.game.player.teleport(new window.THREE.Vector3(-58, 0, 64), 0);
    });
    await new Promise(r => setTimeout(r, 400));

    const branchBInitial = await page.evaluate(() => ({
      enemyCount: window.game.enemyMgr.enemies.length,
      m07Choice: window.game.m07Choice
    }));
    assert(branchBInitial.enemyCount === 3, `Branch B spawned 3 Syndicate enforcers (found ${branchBInitial.enemyCount})`);

    // Neutralize squad
    await page.evaluate(() => {
      window.game.enemyMgr.enemies.forEach(e => e.takeDamage(999));
      // Tick Game update to trigger enemyMgr.areAllDead() check
      window.game.update(0.016);
    });
    await new Promise(r => setTimeout(r, 400));

    const branchBCleared = await page.evaluate(() => ({
      allDead: window.game.enemyMgr.areAllDead(),
      marrowHostile: window.game.marrowHostile,
      objId: window.game.missionMgr.getCurrentObjective()?.id
    }));
    assert(branchBCleared.allDead, 'All Syndicate enforcers neutralized');
    assert(branchBCleared.marrowHostile === true, 'Marrow Syndicate hostility flag set (marrowHostile === true)');
    assert(branchBCleared.objId === 'debrief_jonah', 'Objective advanced to debrief_jonah after combat clearance');

    // Branch C: Drake Contraband Package (Harbor Depot retrieval)
    console.log('    Testing Branch C (Drake Harbor Depot Contraband Cache)...');
    await page.evaluate(() => {
      window.game.debugMenu.warpToMission('M07', 4); // retrieve_drake_package
      window.game.player.teleport(new window.THREE.Vector3(30, 0, -143), 0);
    });
    await new Promise(r => setTimeout(r, 400));

    // Retrieve contraband package [E]
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 400));

    const branchCPackage = await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id);
    assert(branchCPackage === 'return_to_garage', 'Objective advanced to return_to_garage after package collection');

    // Deliver to garage (-60, 0, 55) within 15m of garage origin
    await page.evaluate(() => {
      window.game.player.teleport(new window.THREE.Vector3(-60, 0, 55), 0);
      window.game.update(0.016);
    });
    await new Promise(r => setTimeout(r, 400));

    const branchCDelivered = await page.evaluate(() => ({
      drakeAlliance: window.game.drakeAlliance,
      objId: window.game.missionMgr.getCurrentObjective()?.id
    }));
    assert(branchCDelivered.drakeAlliance === true, 'Drake Alliance alliance flag set (drakeAlliance === true)');
    assert(branchCDelivered.objId === 'debrief_jonah', 'Objective advanced to debrief_jonah');

    // Conclude M07 with Jonah Debrief inside workshop
    console.log('    Debriefing with Jonah inside workshop [E]...');
    await page.evaluate(() => {
      window.game.player.teleport(new window.THREE.Vector3(-58, 0, 52), 0);
    });
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 400));
    await dismissDialogue(page);

    const m07Complete = await page.evaluate(() => window.game.missionMgr.completedMissions.has('M07'));
    assert(m07Complete, 'M07 successfully completed after Jonah debrief');
    await clickResultContinue(page);
    await page.screenshot({ path: path.join(screenshotDir, '05_m07_choices_verified.png') });

    // -------------------------------------------------------------------------
    // Milestone 5: M08 Municipal Trust Infiltration & Black Ledger Wire Dump
    // -------------------------------------------------------------------------
    console.log('\n  [Milestone 5] M08 Paper Trail: Trust infiltration, night lighting, archives, Black Ledger wire download, escape');

    // Stage 0: Meet Mara at diner patio
    await page.evaluate(() => {
      window.game.debugMenu.warpToMission('M08', 0); // meet_mara
      window.game.player.teleport(new window.THREE.Vector3(48, 0, 35), 0);
    });
    await new Promise(r => setTimeout(r, 400));
    await page.keyboard.press('KeyF');
    await new Promise(r => setTimeout(r, 400));
    await dismissDialogue(page);

    const m08DriveObj = await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id);
    assert(m08DriveObj === 'drive_to_finance_office', 'Objective advanced to drive_to_finance_office');

    // Stage 1: Arrive within 8m of Municipal Trust entrance (-35, 0, -133)
    await page.evaluate(() => {
      window.game.player.teleport(new window.THREE.Vector3(-35, 0, -133), 0);
      window.game.update(0.016);
    });
    await new Promise(r => setTimeout(r, 400));

    const m08InfilObj = await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id);
    assert(m08InfilObj === 'infiltrate_office', 'Objective advanced to infiltrate_office at trust entrance');

    // Stage 2: Side service entrance infiltration [E] -> Night mode lighting
    console.log('    Infiltrating side service entrance [E]...');
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 500));

    const m08NightState = await page.evaluate(() => ({
      timeOfDay: window.game.lighting.timeOfDay,
      objId: window.game.missionMgr.getCurrentObjective()?.id
    }));
    assert(m08NightState.timeOfDay >= 23.0, `Lighting shifted to security night mode (timeOfDay=${m08NightState.timeOfDay})`);
    assert(m08NightState.objId === 'inspect_documents', 'Objective advanced to inspect_documents');

    // Stage 3: Search filing cabinets in archive [E]
    console.log('    Searching archive filing cabinets for shell company cross-references [E]...');
    await page.evaluate(() => {
      window.game.player.teleport(new window.THREE.Vector3(-38, 0, -138), 0);
    });
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 500));

    const m08RecordObj = await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id);
    assert(m08RecordObj === 'obtain_records', 'Objective advanced to obtain_records');

    // Stage 4: Access executive terminal and download wire transfer ledger [E]
    console.log('    Downloading wire transfer ledger from executive terminal [E]...');
    await page.evaluate(() => {
      window.game.player.teleport(new window.THREE.Vector3(-33, 0, -140), 0);
    });
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 600));

    const m08Modal = await page.evaluate(() => {
      const modal = document.getElementById('evidence-modal');
      const title = document.getElementById('evidence-title') || document.querySelector('.evidence-title');
      const caption = document.getElementById('evidence-caption') || document.querySelector('.evidence-caption');
      const enemyCount = window.game.enemyMgr.enemies.length;
      return {
        isOpen: window.game.hud.isEvidenceOpen,
        domVisible: modal && !modal.classList.contains('hidden'),
        title: title ? title.innerText : '',
        caption: caption ? caption.innerText : '',
        enemyCount
      };
    });
    assert(m08Modal.isOpen && m08Modal.domVisible, 'M08 Black Ledger Wire Transfers evidence modal is displayed');
    assert(m08Modal.title.includes('BLACK LEDGER WIRE TRANSFERS'), `Evidence modal title matches BLACK LEDGER (got "${m08Modal.title}")`);
    assert(m08Modal.caption.includes('$4,200,000') || m08Modal.caption.includes('Vance Albright'),
      `Evidence caption details $4.2M wire transfers / Albright (got "${m08Modal.caption}")`);
    assert(m08Modal.enemyCount >= 2, `Arriving Vespera Security Patrol spawned (enemies=${m08Modal.enemyCount})`);

    // Dismiss ledger evidence modal and alarm dialogue
    await dismissEvidenceModal(page);
    await dismissDialogue(page);

    const m08EscapeObj = await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id);
    assert(m08EscapeObj === 'escape_perimeter', 'Objective advanced to escape_perimeter');

    // Stage 5: High-alert security cordon escape (>75m from financial office)
    console.log('    Evading high-alert security patrols (>75m from office)...');
    await page.evaluate(() => {
      window.game.player.teleport(new window.THREE.Vector3(-35, 0, -220), 0);
      window.game.update(0.016);
    });
    await new Promise(r => setTimeout(r, 600));

    const m08Final = await page.evaluate(() => ({
      isCompleted: window.game.missionMgr.completedMissions.has('M08')
    }));
    assert(m08Final.isCompleted, 'M08 successfully completed upon clearing security perimeter');
    await clickResultContinue(page);
    await page.screenshot({ path: path.join(screenshotDir, '06_m08_black_ledger_verified.png') });

    // =========================================================================
    // FINAL CAMPAIGN REPORT & AUDIT
    // =========================================================================
    console.log('\n================================================================');
    console.log('  E2E CAMPAIGN VERIFICATION SUMMARY                             ');
    console.log('================================================================');
    console.log(`  Total Assertions Checked : ${passedCount + failedCount}`);
    console.log(`  Passed                   : ${passedCount}`);
    console.log(`  Failed                   : ${failedCount}`);
    console.log('================================================================\n');

    if (failedCount > 0) {
      console.error(`💥 E2E Test Suite FAILED with ${failedCount} errors.`);
      process.exit(1);
    } else {
      console.log('🎉 ALL E2E CAMPAIGN PROGRESSION & INTEGRATION TESTS PASSED (100%)!');
      process.exit(0);
    }
  } catch (err) {
    console.error('\n💥 UNHANDLED EXCEPTION IN E2E CAMPAIGN RUNNER:');
    console.error(err);

    try {
      const pages = await browser.pages();
      const page = pages.find(p => p.url().includes('3000')) || pages[pages.length - 1];
      if (page) {
        await page.screenshot({ path: path.join(screenshotDir, 'failure_diagnostic.png') });
        console.log('Saved failure diagnostic screenshot: failure_diagnostic.png');

        const diag = await page.evaluate(() => {
          return {
            missionId: window.game?.missionMgr?.currentMission?.id,
            objIndex: window.game?.missionMgr?.currentObjectiveIndex,
            objId: window.game?.missionMgr?.getCurrentObjective()?.id,
            playerPos: window.game?.player ? { x: window.game.player.position.x, z: window.game.player.position.z } : null,
            cash: window.game?.player?.cash,
            completed: window.game?.missionMgr ? Array.from(window.game.missionMgr.completedMissions) : []
          };
        });
        console.error('Diagnostic Game State:', JSON.stringify(diag, null, 2));
      }
    } catch (_) {}

    process.exit(1);
  } finally {
    console.log('Closing headless browser...');
    await cleanup();
  }
}

runCampaignE2E();
