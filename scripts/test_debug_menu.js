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
  // TEST 1: Open Developer Debug Menu
  // ==========================================
  console.log('\n--- TEST 1: Opening Debug Menu ---');
  await page.evaluate(() => {
    window.game.debugMenu.open();
  });
  await new Promise(r => setTimeout(r, 400));

  const isDebugVisible = await page.evaluate(() => {
    const el = document.getElementById('debug-menu');
    return el && !el.classList.contains('hidden');
  });
  console.log(`Debug Menu visible: ${isDebugVisible}`);

  await page.screenshot({ path: path.join(screenshotDir, 'debug_menu_missions_tab.png') });
  console.log('Saved screenshot: debug_menu_missions_tab.png');

  // ==========================================
  // TEST 2: Tab 2 (Fast Travel)
  // ==========================================
  console.log('\n--- TEST 2: Fast Travel Tab ---');
  await page.evaluate(() => {
    const tabBtn = document.querySelector('[data-tab="teleport"]');
    if (tabBtn) tabBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  await page.screenshot({ path: path.join(screenshotDir, 'debug_menu_fast_travel_tab.png') });
  console.log('Saved screenshot: debug_menu_fast_travel_tab.png');

  // ==========================================
  // TEST 3: Tab 3 (Player Cheats)
  // ==========================================
  console.log('\n--- TEST 3: Player Cheats Tab ---');
  await page.evaluate(() => {
    const tabBtn = document.querySelector('[data-tab="player"]');
    if (tabBtn) tabBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // Give +$10,000 cash and toggle God Mode
  const cheatStatus = await page.evaluate(() => {
    const cashBtn = document.getElementById('debug-cash-10k-btn');
    if (cashBtn) cashBtn.click();
    const godBtn = document.getElementById('debug-godmode-btn');
    if (godBtn) godBtn.click();
    const weaponBtn = document.getElementById('debug-weapons-btn');
    if (weaponBtn) weaponBtn.click();

    return {
      cash: window.game.player.cash,
      isGodMode: window.game.player.isGodMode,
      hasShotgun: window.game.player.hasShotgun,
      ammoReserve: window.game.player.ammoReserve
    };
  });
  console.log('Cheat status:', cheatStatus);

  await page.screenshot({ path: path.join(screenshotDir, 'debug_menu_player_cheats_tab.png') });
  console.log('Saved screenshot: debug_menu_player_cheats_tab.png');

  // ==========================================
  // TEST 4: Tab 4 (World & Spawner)
  // ==========================================
  console.log('\n--- TEST 4: World & Spawner Tab ---');
  await page.evaluate(() => {
    const tabBtn = document.querySelector('[data-tab="world"]');
    if (tabBtn) tabBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  await page.screenshot({ path: path.join(screenshotDir, 'debug_menu_world_spawner_tab.png') });
  console.log('Saved screenshot: debug_menu_world_spawner_tab.png');

  // ==========================================
  // TEST 5: Mission Warp to M03 (The Harbor)
  // ==========================================
  console.log('\n--- TEST 5: Warping to Mission M03 (The Harbor) ---');
  await page.evaluate(() => {
    window.game.debugMenu.warpToMission('M03', 1); // Jump to stage 1: vantage_point
  });
  await new Promise(r => setTimeout(r, 600));

  const m03State = await page.evaluate(() => {
    return {
      missionId: window.game.missionMgr.currentMission?.id,
      missionTitle: window.game.missionMgr.currentMission?.title,
      objId: window.game.missionMgr.getCurrentObjective()?.id,
      playerPos: { x: window.game.player.position.x, z: window.game.player.position.z }
    };
  });
  console.log('Warped M03 State:', m03State);

  await page.screenshot({ path: path.join(screenshotDir, 'debug_warp_m03_pier19.png') });
  console.log('Saved screenshot: debug_warp_m03_pier19.png');

  // ==========================================
  // TEST 6: Mission Warp to M05 (The Journalist)
  // ==========================================
  console.log('\n--- TEST 6: Warping to Mission M05 (The Journalist) ---');
  await page.evaluate(() => {
    window.game.debugMenu.open();
    window.game.debugMenu.warpToMission('M05', 1); // Jump to stage 1: talk_to_mara
  });
  await new Promise(r => setTimeout(r, 600));

  const m05State = await page.evaluate(() => {
    return {
      missionId: window.game.missionMgr.currentMission?.id,
      missionTitle: window.game.missionMgr.currentMission?.title,
      objId: window.game.missionMgr.getCurrentObjective()?.id,
      playerPos: { x: window.game.player.position.x, z: window.game.player.position.z }
    };
  });
  console.log('Warped M05 State:', m05State);

  await page.screenshot({ path: path.join(screenshotDir, 'debug_warp_m05_diner.png') });
  console.log('Saved screenshot: debug_warp_m05_diner.png');

  await browser.close();
  console.log('\nDEBUG MENU & MISSION WARP TESTS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Debug test run failed:', err);
  process.exit(1);
});
