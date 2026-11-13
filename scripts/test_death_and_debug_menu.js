import puppeteer from 'puppeteer-core';
import path from 'path';

const screenshotDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\f675a66c-01e6-401d-95a5-8008160c3e0c';

async function run() {
  console.log('Launching Chrome...');
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
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

  console.log('Waiting for start menu button...');
  await page.waitForSelector('#start-game-btn', { timeout: 10000 });
  await page.click('#start-game-btn');
  console.log('Clicked start button. Waiting 2.5s for world load...');
  await new Promise(r => setTimeout(r, 2500));

  // Exit vehicle if seated and ensure unpaused
  await page.evaluate(() => {
    if (window.game.pauseMenu.isOpen()) window.game.pauseMenu.close();
    window.game.state.setState('FREE_ROAM');
    if (window.game.player.isInVehicle) {
      window.game.vehicleMgr.exitVehicle(window.game.player);
    }
  });

  // ==========================================
  // PART 1: F2 Debug Menu & Mutual Exclusivity
  // ==========================================
  console.log('\n==========================================');
  console.log('PART 1: Testing F2 Debug Menu & Mutual Exclusivity');
  console.log('==========================================');

  // Test opening debug menu via keypress
  console.log('Pressing F2 to open Debug Menu...');
  await page.keyboard.press('F2');
  await new Promise(r => setTimeout(r, 300));

  const debugOpenState = await page.evaluate(() => {
    const debugEl = document.getElementById('debug-menu');
    const pauseEl = document.getElementById('pause-menu');
    const startEl = document.getElementById('start-screen');
    return {
      debugMenuOpen: window.game.debugMenu.isOpen(),
      debugElVisible: debugEl && !debugEl.classList.contains('hidden'),
      pauseMenuOpen: window.game.pauseMenu.isOpen(),
      pauseElVisible: pauseEl && !pauseEl.classList.contains('hidden'),
      startElHidden: startEl ? startEl.classList.contains('hidden') : true
    };
  });
  console.log('F2 Open State:', debugOpenState);

  if (!debugOpenState.debugMenuOpen || !debugOpenState.debugElVisible) {
    throw new Error('FAIL: Debug menu did not open cleanly on F2 press!');
  }
  if (debugOpenState.pauseMenuOpen || debugOpenState.pauseElVisible) {
    throw new Error('FAIL: Pause menu opened concurrently with Debug Menu!');
  }

  await page.screenshot({ path: path.join(screenshotDir, 'debug_menu_clean_toggle.png') });
  console.log('Saved screenshot: debug_menu_clean_toggle.png');

  // Test closing debug menu via Escape
  console.log('Pressing Escape to close Debug Menu...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));

  const escapeCloseState = await page.evaluate(() => {
    const debugEl = document.getElementById('debug-menu');
    const pauseEl = document.getElementById('pause-menu');
    return {
      debugMenuOpen: window.game.debugMenu.isOpen(),
      debugElVisible: debugEl && !debugEl.classList.contains('hidden'),
      pauseMenuOpen: window.game.pauseMenu.isOpen(),
      pauseElVisible: pauseEl && !pauseEl.classList.contains('hidden')
    };
  });
  console.log('Escape Close State:', escapeCloseState);

  if (escapeCloseState.debugMenuOpen || escapeCloseState.debugElVisible) {
    throw new Error('FAIL: Debug menu did not close on Escape press!');
  }
  if (escapeCloseState.pauseMenuOpen || escapeCloseState.pauseElVisible) {
    throw new Error('FAIL: Escape while Debug Menu was open erroneously triggered Pause Menu!');
  }

  console.log('SUCCESS: Part 1 verified. Debug menu opens and closes with strict mutual exclusivity.');

  // ==========================================
  // PART 2: Mission 2 Death & Mission Failure
  // ==========================================
  console.log('\n==========================================');
  console.log('PART 2: Testing Mission 2 Shootout Death & Mission Failure');
  console.log('==========================================');

  // Warp directly to Mission 2 stage 4 (Shootout at Adrian's Garage)
  console.log('Warping to Mission 2 stage 4 (Shootout)...');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M02', 4);
  });
  await new Promise(r => setTimeout(r, 1000));

  const m02StateBeforeDeath = await page.evaluate(() => {
    const m = window.game.missionMgr.currentMission;
    const enemies = window.game.enemyMgr.enemies;
    return {
      isMissionActive: window.game.missionMgr.isMissionActive,
      missionId: m ? m.id : null,
      stageIndex: window.game.missionMgr.currentObjectiveIndex,
      playerHp: window.game.player.health,
      enemyCount: enemies ? enemies.length : 0
    };
  });
  console.log('M02 State Before Death:', m02StateBeforeDeath);

  if (!m02StateBeforeDeath.isMissionActive || m02StateBeforeDeath.missionId !== 'M02') {
    throw new Error('FAIL: Mission 2 was not activated!');
  }
  if (m02StateBeforeDeath.enemyCount === 0) {
    throw new Error('FAIL: Shootout enemies were not spawned in M02 stage 4!');
  }

  // Inflict lethal damage to player
  console.log('Inflicting lethal damage (150 HP) to player...');
  await page.evaluate(() => {
    window.game.player.takeDamage(150);
  });
  await new Promise(r => setTimeout(r, 600));

  const wastedState = await page.evaluate(() => {
    const wastedEl = document.getElementById('wasted-screen');
    return {
      isDead: window.game.player.isDead,
      playerHp: window.game.player.health,
      wastedVisible: wastedEl && !wastedEl.classList.contains('hidden'),
      isMissionActive: window.game.missionMgr.isMissionActive,
      lastFailedMission: window.game.missionMgr.lastFailedMission,
      remainingEnemies: window.game.enemyMgr.enemies ? window.game.enemyMgr.enemies.length : 0
    };
  });
  console.log('State Immediately After Lethal Damage:', wastedState);

  if (!wastedState.isDead || wastedState.playerHp !== 0) {
    throw new Error('FAIL: Player is not dead after 150 damage!');
  }
  if (wastedState.isMissionActive) {
    throw new Error('FAIL: Mission was not immediately terminated upon death!');
  }
  if (!wastedState.lastFailedMission || wastedState.lastFailedMission.id !== 'M02') {
    throw new Error('FAIL: lastFailedMission was not recorded as M02!');
  }
  if (wastedState.remainingEnemies > 0) {
    throw new Error('FAIL: Hostile enemies were not purged upon mission failure!');
  }

  // Wait 3.5s for clinic respawn and Mission Failed banner
  console.log('Waiting 3.5s for medical clinic respawn and Mission Failed banner...');
  await new Promise(r => setTimeout(r, 3500));

  const failureBannerState = await page.evaluate(() => {
    const banner = document.getElementById('mission-result-banner');
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');
    const retryBtn = document.getElementById('result-retry-btn');
    const abandonBtn = document.getElementById('result-continue-btn');
    return {
      bannerVisible: banner && !banner.classList.contains('hidden'),
      isFailedClass: banner && banner.classList.contains('failed'),
      titleText: title ? title.textContent : null,
      descText: desc ? desc.textContent : null,
      retryVisible: retryBtn && !retryBtn.classList.contains('hidden'),
      abandonText: abandonBtn ? abandonBtn.textContent : null,
      playerHealth: window.game.player.health,
      playerDead: window.game.player.isDead
    };
  });
  console.log('Failure Banner State:', failureBannerState);

  if (!failureBannerState.bannerVisible) {
    throw new Error('FAIL: Mission Failed banner did not appear after clinic respawn!');
  }
  if (!failureBannerState.isFailedClass) {
    throw new Error('FAIL: Mission Failed banner does not have the .failed CSS class!');
  }
  if (!failureBannerState.retryVisible) {
    throw new Error('FAIL: Retry Mission button is not visible on failure banner!');
  }

  await page.screenshot({ path: path.join(screenshotDir, 'm02_mission_failed_screen.png') });
  console.log('Saved screenshot: m02_mission_failed_screen.png');

  const btnInfo = await page.evaluate(() => {
    const btn = document.getElementById('result-retry-btn');
    if (!btn) return { exists: false };
    const rect = btn.getBoundingClientRect();
    const style = window.getComputedStyle(btn);
    const topEl = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return {
      exists: true,
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      display: style.display,
      visibility: style.visibility,
      pointerEvents: style.pointerEvents,
      topElId: topEl ? topEl.id : null,
      topElTag: topEl ? topEl.tagName : null,
      topElClass: topEl ? topEl.className : null
    };
  });
  console.log('Retry Button DOM Info:', btnInfo);

  // Test Retry button
  console.log('\nClicking RETRY MISSION button...');
  await page.evaluate(() => {
    const btn = document.getElementById('result-retry-btn');
    console.log('Triggering btn.click() directly in page...');
    btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const retriedState = await page.evaluate(() => {
    const banner = document.getElementById('mission-result-banner');
    const m = window.game.missionMgr.currentMission;
    return {
      bannerClosed: banner ? banner.classList.contains('hidden') : true,
      isMissionActive: window.game.missionMgr.isMissionActive,
      missionId: m ? m.id : null,
      stageIndex: window.game.missionMgr.currentObjectiveIndex
    };
  });
  console.log('Retried State:', retriedState);

  if (!retriedState.bannerClosed) {
    throw new Error('FAIL: Mission result banner did not close on retry!');
  }
  if (!retriedState.isMissionActive || retriedState.missionId !== 'M02' || retriedState.stageIndex !== 0) {
    throw new Error('FAIL: Mission 2 was not restarted at stage 0!');
  }

  await page.screenshot({ path: path.join(screenshotDir, 'm02_mission_retried.png') });
  console.log('Saved screenshot: m02_mission_retried.png');

  console.log('\n==========================================');
  console.log('ALL TESTS PASSED SUCCESSFULLY!');
  console.log('==========================================');

  await browser.close();
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
