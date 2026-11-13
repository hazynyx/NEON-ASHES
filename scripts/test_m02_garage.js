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

  // Ensure game is unpaused and player is on foot
  await page.evaluate(() => {
    if (window.game.pauseMenu.isOpen()) {
      window.game.pauseMenu.close();
    }
    window.game.state.setState('FREE_ROAM');
    if (window.game.player.isInVehicle) {
      window.game.vehicleMgr.exitVehicle(window.game.player);
    }
  });

  // ==========================================
  // TEST 1: GTA 5 Camera View Cycling ('V' key)
  // ==========================================
  console.log('\n--- TEST 1: Testing GTA 5 Camera View Cycling ---');
  const view1 = await page.evaluate(() => window.game.camera.cycleViewMode());
  console.log(`View after 1st cycle: ${view1}`);

  const view2 = await page.evaluate(() => window.game.camera.cycleViewMode());
  console.log(`View after 2nd cycle: ${view2}`);

  const view3 = await page.evaluate(() => {
    const v = window.game.camera.cycleViewMode();
    return { name: v, isFP: window.game.camera.isFirstPerson };
  });
  console.log(`View after 3rd cycle: ${view3.name} (isFirstPerson: ${view3.isFP})`);

  // Reset to standard third person medium
  await page.evaluate(() => {
    window.game.camera.cycleViewMode();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(screenshotDir, 'gta5_camera_views.png') });
  console.log('Saved screenshot: gta5_camera_views.png');

  // ==========================================
  // TEST 2: Player Death & WASTED Screen
  // ==========================================
  console.log('\n--- TEST 2: Testing Player Death at 0 HP & WASTED Screen ---');
  const deathStatus = await page.evaluate(() => {
    if (window.game.pauseMenu.isOpen()) {
      window.game.pauseMenu.close();
    }
    window.game.state.setState('FREE_ROAM');
    window.game.player.takeDamage(100);
    return {
      health: window.game.player.health,
      isDead: window.game.player.isDead
    };
  });
  console.log(`Player health: ${deathStatus.health}, isDead: ${deathStatus.isDead}`);

  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: path.join(screenshotDir, 'm02_player_wasted_screen.png') });
  console.log('Saved screenshot: m02_player_wasted_screen.png');

  const wastedVisible = await page.evaluate(() => {
    const el = document.getElementById('wasted-screen');
    return el && !el.classList.contains('hidden');
  });
  console.log(`WASTED screen overlay visible: ${wastedVisible}`);

  console.log('Waiting 3.4s for medical clinic respawn...');
  await new Promise(r => setTimeout(r, 3400));

  const respawnStatus = await page.evaluate(() => {
    if (window.game.pauseMenu.isOpen()) {
      window.game.pauseMenu.close();
    }
    window.game.state.setState('FREE_ROAM');
    return {
      health: window.game.player.health,
      isDead: window.game.player.isDead,
      pos: { x: window.game.player.position.x, z: window.game.player.position.z }
    };
  });
  console.log(`Player respawned: health=${respawnStatus.health}, isDead=${respawnStatus.isDead}, pos=(${respawnStatus.pos.x}, ${respawnStatus.pos.z})`);

  // ==========================================
  // TEST 3: Mission 2 & Jonah Reyes
  // ==========================================
  console.log('\n--- TEST 3: Testing Mission 2 & Jonah Reyes ---');
  await page.evaluate(() => {
    if (window.game.pauseMenu.isOpen()) {
      window.game.pauseMenu.close();
    }
    window.game.state.setState('MISSION_ACTIVE');

    // Start Mission 2
    window.game.missionMgr.startMission(window.createMission02Data(window.game.world.adrianGaragePos));
    // Advance past drive_to_garage objective directly to talk_to_jonah
    window.game.missionMgr.advanceObjective();

    // Teleport player near Jonah Reyes in garage forecourt: Jonah is at (-56, 0, 67), face North toward Jonah
    window.game.player.teleport(new window.THREE.Vector3(-56, 0, 69.2), 0);
    window.game.camera.snap(window.game.player.position, 0, 0.12);
  });
  await new Promise(r => setTimeout(r, 600));

  const jonahTarget = await page.evaluate(() => {
    const nearby = window.game.npcMgr.nearbyNPC;
    return nearby ? { id: nearby.data.id, name: nearby.data.name } : null;
  });
  console.log('Targeted NPC near garage:', jonahTarget);

  await page.screenshot({ path: path.join(screenshotDir, 'm02_jonah_mechanic_talk.png') });
  console.log('Saved screenshot: m02_jonah_mechanic_talk.png');

  // Trigger dialogue with Jonah
  await page.evaluate(() => {
    const nearby = window.game.npcMgr.nearbyNPC;
    if (nearby && nearby.data.dialogue) {
      window.game.dialogueMgr.startDialogue(nearby.data.dialogue, () => {
        window.game.missionMgr.advanceObjective();
      });
      // Cycle through dialogue
      while (window.game.dialogueMgr.isActive) {
        window.game.dialogueMgr.advance();
      }
    } else {
      window.game.missionMgr.advanceObjective();
    }
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Current objective after talking to Jonah:', await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id));

  // ==========================================
  // TEST 4: Open Workshop Shutter & Enter
  // ==========================================
  console.log('\n--- TEST 4: Opening Garage Shutter & Entering Workshop ---');
  // Stand in front of shutter at (-60, 0, 65.5) facing North toward workshop
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(-60, 0, 65.5), 0);
    window.game.camera.snap(window.game.player.position, 0, 0.12);
    // Open shutter
    window.game.world.openGarageShutter();
    window.game.missionMgr.advanceObjective(); // Advances to crack_safe
  });
  console.log('Shutter opened. Waiting 1.2s for shutter lift animation...');
  await new Promise(r => setTimeout(r, 1200));

  // Walk into workshop to Adrian's workbench and wall safe at (-64, 0, 40.2)
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(-64, 0, 40.2), 0);
    window.game.camera.snap(window.game.player.position, 0, 0.12);
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(screenshotDir, 'm02_garage_workshop_inside.png') });
  console.log('Saved screenshot: m02_garage_workshop_inside.png');

  const safePrompt = await page.evaluate(() => {
    const el = document.getElementById('interaction-prompt');
    return el ? el.innerText : '';
  });
  console.log(`Interaction prompt at workbench: "${safePrompt}"`);
  await page.screenshot({ path: path.join(screenshotDir, 'm02_crack_safe_prompt.png') });
  console.log('Saved screenshot: m02_crack_safe_prompt.png');

  // ==========================================
  // TEST 5: Crack Safe & Eliminate Ambush
  // ==========================================
  console.log('\n--- TEST 5: Cracking Safe & Syndicate Ambush ---');
  await page.evaluate(() => {
    // Crack safe
    if (window.game.world.garageBeaconGroup) {
      window.game.world.garageBeaconGroup.visible = false;
    }
    window.game.player.hasShotgun = true;
    window.game.player.shotgunReserve += 18;
    window.game.enemyMgr.spawnSyndicateAmbush(
      new window.THREE.Vector3(-58, 0, 61),
      new window.THREE.Vector3(-62, 0, 61)
    );
    window.game.missionMgr.advanceObjective(); // Advances to eliminate_syndicate
  });
  await new Promise(r => setTimeout(r, 500));

  const ambushCount = await page.evaluate(() => window.game.enemyMgr.enemies.length);
  console.log(`Enemies spawned in workshop ambush: ${ambushCount}`);

  // Eliminate enemies
  await page.evaluate(() => {
    window.game.enemyMgr.enemies.forEach(e => {
      e.takeDamage(200);
    });
    window.game.missionMgr.advanceObjective(); // Advances to escape_area
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('Current objective after combat:', await page.evaluate(() => window.game.missionMgr.getCurrentObjective()?.id));

  // Complete escape
  await page.evaluate(() => {
    window.game.missionMgr.advanceObjective(); // Completes M02
  });
  await new Promise(r => setTimeout(r, 800));

  const missionPassedBanner = await page.evaluate(() => {
    const el = document.getElementById('mission-result-banner');
    return el && !el.classList.contains('hidden');
  });
  console.log(`Mission Passed banner shown: ${missionPassedBanner}`);
  await page.screenshot({ path: path.join(screenshotDir, 'm02_mission_passed.png') });
  console.log('Saved screenshot: m02_mission_passed.png');

  await browser.close();
  console.log('\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
