import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const screenshotDir = path.resolve('screenshots/m08');
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
  console.log('=== [M08 PAPER TRAIL] End-to-End Playtest Verification ===\n');
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
  // TEST 0: Verify Mission M08 Registration in DebugMenu & DOM Select
  // =========================================================================
  console.log('\n--- TEST 0: M08 Registration in DebugMenu & DOM Select ---');
  const m08Registration = await page.evaluate(() => {
    const debugM08 = window.game.debugMenu.missions['M08'];
    const selectOpt = document.querySelector('#debug-mission-select option[value="M08"]');
    return {
      hasDebugDef: !!debugM08,
      missionId: debugM08?.id,
      title: debugM08?.name,
      stageCount: debugM08?.stages?.length,
      stageIds: debugM08?.stages?.map(s => s.id),
      hasDomOption: !!selectOpt
    };
  });

  assert(m08Registration.hasDebugDef, 'M08 definition exists in DebugMenu');
  assert(m08Registration.missionId === 'M08', 'M08 id matches "M08"');
  assert(m08Registration.stageCount === 6, `M08 has exactly 6 stages (found ${m08Registration.stageCount})`);
  assert(m08Registration.hasDomOption, 'M08 option is present in #debug-mission-select');
  console.log('M08 Stages registered:', m08Registration.stageIds.join(', '));

  // =========================================================================
  // TEST 1: Stage 0 (meet_mara) & Interaction Prompt
  // =========================================================================
  console.log('\n--- TEST 1: Stage 0 (meet_mara) ---');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M08', 0);
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

  assert(s0State.missionId === 'M08', `Current mission is M08 (got ${s0State.missionId})`);
  assert(s0State.objIndex === 0, `Objective index is 0 (got ${s0State.objIndex})`);
  assert(s0State.objId === 'meet_mara', `Objective is meet_mara (got ${s0State.objId})`);

  // Teleport player within interaction distance of Southside Diner patio (50, 0, 34.8)
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(48, 0, 35), 0);
  });
  await new Promise(r => setTimeout(r, 300));

  const maraPrompt = await page.evaluate(() => {
    const promptEl = document.getElementById('interaction-prompt');
    const promptLabel = document.getElementById('prompt-label');
    const promptKey = document.getElementById('prompt-key');
    return {
      visible: promptEl && !promptEl.classList.contains('hidden'),
      label: promptLabel ? promptLabel.innerText : '',
      key: promptKey ? promptKey.innerText : ''
    };
  });

  console.log('Mara prompt:', maraPrompt);
  assert(maraPrompt.visible, 'Interaction prompt is visible on patio');
  assert(maraPrompt.key === 'F', 'Interaction prompt key is [F]');
  assert(maraPrompt.label.includes('Mara Vale') || maraPrompt.label.includes('Speak'), `Prompt label mentions Mara (got "${maraPrompt.label}")`);

  // Press [F] to talk to Mara
  console.log('Pressing [F] to speak with Mara Vale...');
  await page.keyboard.press('KeyF');
  await new Promise(r => setTimeout(r, 400));

  // Advance dialogue
  for (let i = 0; i < 5; i++) {
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
  await new Promise(r => setTimeout(r, 400));

  let s1State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id
    };
  });

  assert(s1State.objIndex === 1, `Objective advanced to stage 1 (got index ${s1State.objIndex})`);
  assert(s1State.objId === 'drive_to_finance_office', `Objective is drive_to_finance_office (got ${s1State.objId})`);

  await page.screenshot({ path: path.join(screenshotDir, '01_stage0_mara_spoken.png') });
  console.log('Saved screenshot: 01_stage0_mara_spoken.png');

  // =========================================================================
  // TEST 2: Stage 1 (drive_to_finance_office Proximity Advance)
  // =========================================================================
  console.log('\n--- TEST 2: Stage 1 (drive_to_finance_office) ---');
  // Teleport to Vespera Municipal Trust within 8.0m (-35, 0, -135)
  console.log('Teleporting player inside Vespera Municipal Trust trigger (<= 8.0m)...');
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(-35, 0, -133), 0);
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
  assert(s2State.objId === 'infiltrate_office', `Objective is infiltrate_office (got ${s2State.objId})`);

  await page.screenshot({ path: path.join(screenshotDir, '02_stage1_arrived_office.png') });
  console.log('Saved screenshot: 02_stage1_arrived_office.png');

  // =========================================================================
  // TEST 3: Stage 2 (infiltrate_office & Night Lighting Shift)
  // =========================================================================
  console.log('\n--- TEST 3: Stage 2 (infiltrate_office) ---');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M08', 2);
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(-35, 0, -133.5), 0);
  });
  await new Promise(r => setTimeout(r, 300));

  const infiltratePrompt = await page.evaluate(() => {
    const promptEl = document.getElementById('interaction-prompt');
    const promptLabel = document.getElementById('prompt-label');
    const promptKey = document.getElementById('prompt-key');
    return {
      visible: promptEl && !promptEl.classList.contains('hidden'),
      label: promptLabel ? promptLabel.innerText : '',
      key: promptKey ? promptKey.innerText : ''
    };
  });

  console.log('Infiltrate prompt:', infiltratePrompt);
  assert(infiltratePrompt.visible, 'Infiltrate prompt is visible at service entrance');
  assert(infiltratePrompt.key === 'E', 'Infiltrate prompt key is [E]');

  // Press [E] to infiltrate
  console.log('Pressing [E] to infiltrate office suite...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 500));

  let s3State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id,
      timeOfDay: window.game.lighting.timeOfDay
    };
  });

  assert(s3State.objIndex === 3, `Objective advanced to stage 3 (got index ${s3State.objIndex})`);
  assert(s3State.objId === 'inspect_documents', `Objective is inspect_documents (got ${s3State.objId})`);
  assert(s3State.timeOfDay >= 23.0, `Lighting shifted to security night mode (timeOfDay: ${s3State.timeOfDay})`);

  await page.screenshot({ path: path.join(screenshotDir, '03_stage2_office_infiltrated.png') });
  console.log('Saved screenshot: 03_stage2_office_infiltrated.png');

  // =========================================================================
  // TEST 4: Stage 3 (inspect_documents)
  // =========================================================================
  console.log('\n--- TEST 4: Stage 3 (inspect_documents) ---');
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(-38, 0, -139), 0);
  });
  await new Promise(r => setTimeout(r, 300));

  const inspectPrompt = await page.evaluate(() => {
    const promptEl = document.getElementById('interaction-prompt');
    const promptLabel = document.getElementById('prompt-label');
    const promptKey = document.getElementById('prompt-key');
    return {
      visible: promptEl && !promptEl.classList.contains('hidden'),
      label: promptLabel ? promptLabel.innerText : '',
      key: promptKey ? promptKey.innerText : ''
    };
  });

  console.log('Inspect prompt:', inspectPrompt);
  assert(inspectPrompt.visible, 'Inspect documents prompt is visible near filing cabinets');
  assert(inspectPrompt.key === 'E', 'Inspect prompt key is [E]');

  // Press [E] to search filing cabinets
  console.log('Pressing [E] to search filing cabinets...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 500));

  let s4State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id
    };
  });

  assert(s4State.objIndex === 4, `Objective advanced to stage 4 (got index ${s4State.objIndex})`);
  assert(s4State.objId === 'obtain_records', `Objective is obtain_records (got ${s4State.objId})`);

  await page.screenshot({ path: path.join(screenshotDir, '04_stage3_documents_inspected.png') });
  console.log('Saved screenshot: 04_stage3_documents_inspected.png');

  // =========================================================================
  // TEST 5: Stage 4 (obtain_records & Evidence Modal)
  // =========================================================================
  console.log('\n--- TEST 5: Stage 4 (obtain_records & Black Ledger Modal) ---');
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(-33, 0, -141), 0);
  });
  await new Promise(r => setTimeout(r, 300));

  const terminalPrompt = await page.evaluate(() => {
    const promptEl = document.getElementById('interaction-prompt');
    const promptLabel = document.getElementById('prompt-label');
    const promptKey = document.getElementById('prompt-key');
    return {
      visible: promptEl && !promptEl.classList.contains('hidden'),
      label: promptLabel ? promptLabel.innerText : '',
      key: promptKey ? promptKey.innerText : ''
    };
  });

  console.log('Terminal prompt:', terminalPrompt);
  assert(terminalPrompt.visible, 'Terminal download prompt is visible near workstation');
  assert(terminalPrompt.key === 'E', 'Terminal prompt key is [E]');

  // Press [E] to download ledger
  console.log('Pressing [E] to download wire transfer ledger...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 600));

  const modalInfo = await page.evaluate(() => {
    const modalEl = document.getElementById('evidence-modal');
    const titleEl = document.querySelector('.evidence-title');
    const captionEl = document.querySelector('.evidence-caption');
    const btnEl = document.getElementById('continue-mission-btn');
    return {
      visible: modalEl && !modalEl.classList.contains('hidden'),
      title: titleEl ? titleEl.innerText : '',
      caption: captionEl ? captionEl.innerText : '',
      btnText: btnEl ? btnEl.innerText : ''
    };
  });

  console.log('Evidence modal info:', modalInfo);
  assert(modalInfo.visible, 'Evidence modal is visible after downloading records');
  assert(modalInfo.title.includes('BLACK LEDGER'), `Modal title mentions BLACK LEDGER (got "${modalInfo.title}")`);
  assert(modalInfo.caption.includes('4,200,000'), 'Modal caption mentions $4,200,000 traced');

  await page.screenshot({ path: path.join(screenshotDir, '05_stage4_black_ledger_modal.png') });
  console.log('Saved screenshot: 05_stage4_black_ledger_modal.png');

  // Dismiss modal
  console.log('Clicking continue button on evidence modal...');
  await page.evaluate(() => {
    const btn = document.getElementById('continue-mission-btn');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Advance alert dialogue
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
  await new Promise(r => setTimeout(r, 400));

  let s5State = await page.evaluate(() => {
    const curObj = window.game.missionMgr.getCurrentObjective();
    return {
      objIndex: window.game.missionMgr.currentObjectiveIndex,
      objId: curObj?.id,
      enemyCount: window.game.enemyMgr.enemies.length
    };
  });

  assert(s5State.objIndex === 5, `Objective advanced to stage 5 (got index ${s5State.objIndex})`);
  assert(s5State.objId === 'escape_perimeter', `Objective is escape_perimeter (got ${s5State.objId})`);
  assert(s5State.enemyCount >= 2, `Security guards spawned (count: ${s5State.enemyCount})`);

  // =========================================================================
  // TEST 6: Stage 5 (escape_perimeter & Mission Complete)
  // =========================================================================
  console.log('\n--- TEST 6: Stage 5 (escape_perimeter & Mission Completion) ---');
  const initialCash = await page.evaluate(() => window.game.player.cash);

  // Teleport player > 75m away from financeOfficePos (-35, 0, -135)
  // Target: (55, 0, -135) -> distance is 90m > 75m
  console.log('Escaping perimeter: Teleporting player > 75m away from finance office...');
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(55, 0, -135), 0);
  });
  await new Promise(r => setTimeout(r, 800));

  const completionState = await page.evaluate(() => {
    return {
      isCompleted: window.game.missionMgr.completedMissions.has('M08'),
      currentMission: window.game.missionMgr.currentMission?.id,
      finalCash: window.game.player.cash
    };
  });

  console.log('M08 Completion State:', completionState);
  assert(completionState.isCompleted, 'Mission M08 marked completed in MissionManager');
  assert(completionState.finalCash === initialCash + 3000,
    `Player awarded $3,000 cash (was $${initialCash}, now $${completionState.finalCash})`);

  await page.screenshot({ path: path.join(screenshotDir, '06_stage5_mission_passed.png') });
  console.log('Saved screenshot: 06_stage5_mission_passed.png');

  // =========================================================================
  // TEST SUMMARY
  // =========================================================================
  console.log('\n======================================================');
  console.log(`M08 PLAYTEST SUITE COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
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
