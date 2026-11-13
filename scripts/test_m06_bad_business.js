import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const screenshotDir = path.resolve('screenshots/m06');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (!condition) {
    failedCount++;
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    passedCount++;
    console.log(`✅ PASS: ${message}`);
  }
}

async function run() {
  console.log('=== [M06 BAD BUSINESS] End-to-End Playtest Verification ===\n');
  console.log('Launching headless Chrome...');

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

  const page = await browser.newPage();
  page.on('console', msg => console.log('   [PAGE LOG]:', msg.text()));
  page.on('pageerror', err => console.error('   [PAGE ERROR]:', err.message));

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Clicking start menu button via evaluate...');
  await page.evaluate(() => {
    const btn = document.getElementById('start-game-btn');
    if (btn) btn.click();
  });
  console.log('Clicked start button. Waiting for window.game initialization...');
  await page.waitForFunction(() => !!window.game && !!window.game.pauseMenu && !!window.game.missionMgr, { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  // Ensure game is unpaused, free roam, and player is on foot
  await page.evaluate(() => {
    if (window.game.pauseMenu.isOpen()) window.game.pauseMenu.close();
    window.game.state.setState('FREE_ROAM');
    if (window.game.player.isInVehicle) {
      window.game.vehicleMgr.exitVehicle(window.game.player);
    }
  });

  // =========================================================================
  // TEST 0: Verify Mission M06 Registration in DebugMenu & DOM Select
  // =========================================================================
  console.log('\n--- TEST 0: Verify Mission M06 Registration ---');
  const m06Registration = await page.evaluate(() => {
    const debugM06 = window.game.debugMenu.missions['M06'];
    const selectOpt = document.querySelector('#debug-mission-select option[value="M06"]');
    return {
      hasDebugDef: !!debugM06,
      missionId: debugM06?.id,
      title: debugM06?.name,
      stageCount: debugM06?.stages?.length,
      stageIds: debugM06?.stages?.map(s => s.id),
      hasDomOption: !!selectOpt
    };
  });

  assert(m06Registration.hasDebugDef, 'M06 definition exists in DebugMenu');
  assert(m06Registration.missionId === 'M06', 'M06 id matches "M06"');
  assert(m06Registration.stageCount === 6, `M06 has exactly 6 stages (found ${m06Registration.stageCount})`);
  assert(m06Registration.hasDomOption, 'M06 option is present in #debug-mission-select');
  console.log('M06 Stages registered:', m06Registration.stageIds.join(', '));

  // =========================================================================
  // TEST 1: Stage 0 (observe_redevelopment)
  // =========================================================================
  console.log('\n--- TEST 1: Stage 0 (observe_redevelopment) ---');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M06', 0);
    // Position player on approach road (20m away from overlook) to test approach trigger
    window.game.player.teleport(new window.THREE.Vector3(45, 0, -80), 0);
  });
  await new Promise(r => setTimeout(r, 400));

  let s0State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      missionId: window.game.missionMgr.currentMission?.id,
      missionTitle: window.game.missionMgr.currentMission?.title,
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id,
      objDesc: curObj?.description,
      playerPos: { x: window.game.player.position.x, z: window.game.player.position.z }
    };
  });

  assert(s0State.missionId === 'M06', `Current mission is M06 (got ${s0State.missionId})`);
  assert(s0State.objIndex === 0, `Objective index is 0 (got ${s0State.objIndex})`);
  assert(s0State.objId === 'observe_redevelopment', `Objective is observe_redevelopment (got ${s0State.objId})`);

  // Move player into proximity trigger (<8.0m of redevelopmentSitePos at 45, 0, -100)
  console.log('Teleporting player inside redevelopment overlook trigger (< 8.0m)...');
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(45, 0, -98), 0);
  });
  await new Promise(r => setTimeout(r, 500));

  let s1State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id
    };
  });

  assert(s1State.objIndex === 1, `Objective advanced to stage 1 (got index ${s1State.objIndex})`);
  assert(s1State.objId === 'follow_contractor', `Objective is follow_contractor (got ${s1State.objId})`);

  await page.screenshot({ path: path.join(screenshotDir, '01_stage0_overlook_triggered.png') });
  console.log('Saved screenshot: 01_stage0_overlook_triggered.png');

  // =========================================================================
  // TEST 2: Stage 1 (follow_contractor)
  // =========================================================================
  console.log('\n--- TEST 2: Stage 1 (follow_contractor) ---');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M06', 1);
  });
  await new Promise(r => setTimeout(r, 400));

  let s1WarpState = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id
    };
  });
  assert(s1WarpState.objId === 'follow_contractor', 'Warped directly to follow_contractor');

  // Teleport player into meeting spot proximity (< 5.0m of contractorMeetingPos at 72, 0, -118)
  console.log('Teleporting player to contractor meeting spot (< 5.0m)...');
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(72, 0, -117), 0);
  });
  await new Promise(r => setTimeout(r, 500));

  let s2State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id
    };
  });

  assert(s2State.objIndex === 2, `Objective advanced to stage 2 (got index ${s2State.objIndex})`);
  assert(s2State.objId === 'photograph_meeting', `Objective is photograph_meeting (got ${s2State.objId})`);

  await page.screenshot({ path: path.join(screenshotDir, '02_stage1_contractor_followed.png') });
  console.log('Saved screenshot: 02_stage1_contractor_followed.png');

  // =========================================================================
  // TEST 3: Stage 2 (photograph_meeting & Evidence Modal)
  // =========================================================================
  console.log('\n--- TEST 3: Stage 2 (photograph_meeting & Evidence Modal) ---');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M06', 2);
  });
  await new Promise(r => setTimeout(r, 400));

  // Place player within 4.5m of contractorMeetingPos
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(72, 0, -116), 0);
  });
  await new Promise(r => setTimeout(r, 300));

  const photoPrompt = await page.evaluate(() => {
    const promptEl = document.getElementById('interaction-prompt');
    const promptDesc = document.getElementById('prompt-desc');
    const promptKey = document.getElementById('prompt-key');
    return {
      visible: promptEl && !promptEl.classList.contains('hidden'),
      desc: promptDesc ? promptDesc.innerText : '',
      key: promptKey ? promptKey.innerText : ''
    };
  });

  console.log('Photo prompt:', photoPrompt);
  assert(photoPrompt.visible, 'Interaction prompt is visible within 4.5m of meeting spot');
  assert(photoPrompt.key === 'E', 'Interaction prompt key is [E]');
  assert(photoPrompt.desc.toLowerCase().includes('photo') || photoPrompt.desc.toLowerCase().includes('payoff'),
    `Prompt mentions photo/payoff (got "${photoPrompt.desc}")`);

  // Press [E] to take photo and open evidence modal
  console.log('Pressing [E] to photograph meeting...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 600));

  const modalState = await page.evaluate(() => {
    const modalEl = document.getElementById('evidence-modal');
    const titleEl = document.getElementById('evidence-title');
    const captionEl = document.getElementById('evidence-caption');
    const btnEl = document.getElementById('continue-mission-btn');
    return {
      isOpen: window.game.hud.isEvidenceOpen,
      domVisible: modalEl && !modalEl.classList.contains('hidden'),
      title: titleEl ? titleEl.innerText : '',
      caption: captionEl ? captionEl.innerText : '',
      btnText: btnEl ? btnEl.innerText : ''
    };
  });

  console.log('Evidence modal state:', modalState);
  assert(modalState.isOpen, 'HUD isEvidenceOpen is true');
  assert(modalState.domVisible, 'DOM #evidence-modal is visible');
  assert(modalState.title.includes('REDEVELOPMENT BRIBE HANDOFF') || modalState.title.includes('EVIDENCE COLLECTED'),
    `Evidence modal title is correct (got "${modalState.title}")`);
  assert(modalState.caption.includes('Dominic Alvarez') || modalState.caption.includes('APEX LAND HOLDINGS'),
    `Evidence caption details Alvarez or Apex Land Holdings (got "${modalState.caption}")`);

  await page.screenshot({ path: path.join(screenshotDir, '03_stage2_evidence_modal.png') });
  console.log('Saved screenshot: 03_stage2_evidence_modal.png');

  // Close evidence modal via continue button
  console.log('Clicking continue button on evidence modal...');
  await page.evaluate(() => {
    document.getElementById('continue-mission-btn')?.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const modalClosed = await page.evaluate(() => {
    const modalEl = document.getElementById('evidence-modal');
    return !window.game.hud.isEvidenceOpen && modalEl?.classList.contains('hidden');
  });
  assert(modalClosed, 'Evidence modal cleanly closed after click');

  // Handle post-photo dialogue between Alvarez and Syndicate Operative
  console.log('Advancing dialogue lines...');
  for (let i = 0; i < 4; i++) {
    const isDialogueActive = await page.evaluate(() => {
      const d = window.game.dialogueMgr;
      return typeof d.isActive === 'function' ? d.isActive() : !!d.isActive;
    });
    if (isDialogueActive) {
      await page.evaluate(() => {
        const box = document.getElementById('dialogue-box');
        if (box) box.click();
      });
      await new Promise(r => setTimeout(r, 200));
    }
  }

  await new Promise(r => setTimeout(r, 500));

  let s3State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id
    };
  });

  assert(s3State.objIndex === 3, `Objective advanced to stage 3 (got index ${s3State.objIndex})`);
  assert(s3State.objId === 'follow_vehicle', `Objective is follow_vehicle (got ${s3State.objId})`);

  // =========================================================================
  // TEST 4: Stage 3 (follow_vehicle)
  // =========================================================================
  console.log('\n--- TEST 4: Stage 3 (follow_vehicle) ---');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M06', 3);
  });
  await new Promise(r => setTimeout(r, 400));

  let s3WarpState = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id
    };
  });
  assert(s3WarpState.objId === 'follow_vehicle', 'Warped directly to follow_vehicle');

  // Teleport player near shell company office (<14.0m of shellOfficePos at -25, 0, -140)
  console.log('Teleporting player to shell office arrival zone (< 14.0m)...');
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(-25, 0, -135), Math.PI);
  });
  await new Promise(r => setTimeout(r, 500));

  let s4State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id
    };
  });

  assert(s4State.objIndex === 4, `Objective advanced to stage 4 (got index ${s4State.objIndex})`);
  assert(s4State.objId === 'identify_shell_company', `Objective is identify_shell_company (got ${s4State.objId})`);

  await page.screenshot({ path: path.join(screenshotDir, '04_stage3_vehicle_tailed.png') });
  console.log('Saved screenshot: 04_stage3_vehicle_tailed.png');

  // =========================================================================
  // TEST 5: Stage 4 (identify_shell_company)
  // =========================================================================
  console.log('\n--- TEST 5: Stage 4 (identify_shell_company) ---');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M06', 4);
  });
  await new Promise(r => setTimeout(r, 400));

  // Teleport right next to directory plaque (< 3.5m of shellOfficePos)
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(-25, 0, -139), 0);
  });
  await new Promise(r => setTimeout(r, 300));

  const plaquePrompt = await page.evaluate(() => {
    const promptEl = document.getElementById('interaction-prompt');
    const promptDesc = document.getElementById('prompt-desc');
    const promptKey = document.getElementById('prompt-key');
    return {
      visible: promptEl && !promptEl.classList.contains('hidden'),
      desc: promptDesc ? promptDesc.innerText : '',
      key: promptKey ? promptKey.innerText : ''
    };
  });

  console.log('Plaque prompt:', plaquePrompt);
  assert(plaquePrompt.visible, 'Plaque interaction prompt visible within 3.5m');
  assert(plaquePrompt.key === 'E', 'Interaction prompt key is [E]');
  assert(plaquePrompt.desc.toLowerCase().includes('plaque') || plaquePrompt.desc.toLowerCase().includes('directory'),
    `Prompt mentions plaque/directory (got "${plaquePrompt.desc}")`);

  // Press [E] to inspect plaque
  console.log('Pressing [E] to inspect directory plaque...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 500));

  // Advance dialogue triggered by inspecting plaque
  console.log('Advancing plaque inspection dialogue lines...');
  for (let i = 0; i < 4; i++) {
    const isDialogueActive = await page.evaluate(() => {
      const d = window.game.dialogueMgr;
      return typeof d.isActive === 'function' ? d.isActive() : !!d.isActive;
    });
    if (isDialogueActive) {
      await page.evaluate(() => {
        const box = document.getElementById('dialogue-box');
        if (box) box.click();
      });
      await new Promise(r => setTimeout(r, 200));
    }
  }

  await new Promise(r => setTimeout(r, 500));

  let s5State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id
    };
  });

  assert(s5State.objIndex === 5, `Objective advanced to stage 5 (got index ${s5State.objIndex})`);
  assert(s5State.objId === 'escape_surveillance', `Objective is escape_surveillance (got ${s5State.objId})`);

  await page.screenshot({ path: path.join(screenshotDir, '05_stage4_shell_identified.png') });
  console.log('Saved screenshot: 05_stage4_shell_identified.png');

  // =========================================================================
  // TEST 6: Stage 5 (escape_surveillance & Mission Completion)
  // =========================================================================
  console.log('\n--- TEST 6: Stage 5 (escape_surveillance & Mission Completion) ---');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M06', 5);
  });
  await new Promise(r => setTimeout(r, 400));

  let s5WarpState = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id,
      cash: window.game.player.cash,
      shellCompanyExposed: window.game.shellCompanyExposed,
      alvarezIdentified: window.game.alvarezIdentified
    };
  });

  assert(s5WarpState.objId === 'escape_surveillance', 'Warped directly to escape_surveillance');
  const initialCash = s5WarpState.cash;

  // Escape: Teleport player > 70m away from shellOfficePos (-25, 0, -140)
  // Target pos (60, 0, -140) -> distance is 85m > 70m
  console.log('Escaping surveillance: Teleporting player > 70m away from shell office...');
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(60, 0, -140), 0);
  });
  await new Promise(r => setTimeout(r, 800));

  const completionState = await page.evaluate(() => {
    return {
      isCompleted: window.game.missionMgr.completedMissions.has('M06'),
      currentMission: window.game.missionMgr.currentMission?.id,
      finalCash: window.game.player.cash,
      shellCompanyExposed: window.game.shellCompanyExposed,
      alvarezIdentified: window.game.alvarezIdentified
    };
  });

  console.log('M06 Completion State:', completionState);
  assert(completionState.isCompleted, 'Mission M06 marked completed in MissionManager');
  assert(completionState.finalCash === initialCash + 2000,
    `Player awarded $2,000 cash (was $${initialCash}, now $${completionState.finalCash})`);
  assert(completionState.shellCompanyExposed === true, 'World-state flag shellCompanyExposed is true');
  assert(completionState.alvarezIdentified === true, 'World-state flag alvarezIdentified is true');

  await page.screenshot({ path: path.join(screenshotDir, '06_stage5_mission_passed.png') });
  console.log('Saved screenshot: 06_stage5_mission_passed.png');

  // =========================================================================
  // TEST SUMMARY
  // =========================================================================
  console.log('\n======================================================');
  console.log(`M06 PLAYTEST SUITE COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('======================================================\n');

  await browser.close();

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch(err => {
  console.error('\n❌ FATAL TEST ERROR:', err);
  process.exit(1);
});
