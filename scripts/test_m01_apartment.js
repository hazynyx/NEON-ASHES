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
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  console.log('Waiting for start menu button...');
  await page.waitForSelector('#start-game-btn', { timeout: 10000 });
  await page.click('#start-game-btn');
  console.log('Clicked start button. Waiting 2.5s for world load...');
  await new Promise(r => setTimeout(r, 2500));

  console.log('Setting up M01 apartment entry test...');
  await page.evaluate(() => {
    // If in vehicle, exit vehicle first
    if (window.game.player.isInVehicle) {
      window.game.vehicleMgr.exitVehicle(window.game.player);
    }

    // Advance M01 to enter_apartment objective
    const m = window.game.missionMgr;
    if (m.currentMission && m.currentMission.id === 'M01') {
      while (m.getCurrentObjective() && m.getCurrentObjective().id !== 'enter_apartment') {
        m.advanceObjective();
      }
    }
    // Teleport player right in front of Lena's apartment door outside
    // Front facade is at Z = -29.0, porch door pos is (30, 0, -28.0)
    window.game.player.teleport(new window.THREE.Vector3(30, 0, -28.0), Math.PI);
    window.game.camera.snap(window.game.player.position, 0, 0.15, window.game.world.colliders);
  });

  await new Promise(r => setTimeout(r, 500));
  
  // Verify outside door prompt
  const outsidePrompt = await page.evaluate(() => {
    const el = document.getElementById('interaction-prompt');
    return el ? el.innerText : '';
  });
  console.log('Outside door prompt:', outsidePrompt);

  console.log('Pressing E via page.keyboard.press to enter Lena\'s Apartment (Unit 102)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1500));

  // Screenshot 1: Immediately upon entering Unit 102
  const shot1Path = path.join(screenshotDir, 'm01_apartment_just_entered.png');
  await page.screenshot({ path: shot1Path });
  console.log('Saved screenshot 1:', shot1Path);

  // Check state inside apartment
  const stateInside = await page.evaluate(() => {
    return {
      playerPos: window.game.player.position,
      playerHeading: window.game.player.heading,
      cameraYaw: window.game.camera.yaw,
      cameraPitch: window.game.camera.pitch,
      cameraPos: window.game.camera.camera.position,
      isInApartment: window.game.isInApartmentInterior,
      isInteriorMode: window.game.camera.isInteriorMode,
      currentObj: window.game.missionMgr.getCurrentObjective()?.id
    };
  });
  console.log('State inside apartment:', JSON.stringify(stateInside, null, 2));

  // Step 2: Walk toward desk / loose floorboard
  console.log('Moving player to investigation desk & loose floorboard...');
  await page.evaluate(() => {
    // Desk is at (297.2, 0, -302.2), floorboard is at (297.2, 0, -302.2)
    window.game.player.teleport(new window.THREE.Vector3(297.6, 0, -301.2), Math.PI);
    window.game.camera.snap(window.game.player.position, 0, 0.12, window.game.world.colliders);
  });
  await new Promise(r => setTimeout(r, 800));

  const deskPrompt = await page.evaluate(() => {
    const el = document.getElementById('interaction-prompt');
    return el ? el.innerText : '';
  });
  console.log('Desk prompt:', deskPrompt);

  // Screenshot 2: Character at desk with search prompt
  const shot2Path = path.join(screenshotDir, 'm01_apartment_desk_search_prompt.png');
  await page.screenshot({ path: shot2Path });
  console.log('Saved screenshot 2:', shot2Path);

  // Step 3: Press E to search the loose floorboard
  console.log('Pressing E via page.keyboard.press to search loose floorboard...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 3: Evidence photograph modal
  const shot3Path = path.join(screenshotDir, 'm01_apartment_evidence_modal.png');
  await page.screenshot({ path: shot3Path });
  console.log('Saved screenshot 3:', shot3Path);

  // Step 4: Click Continue button on modal
  console.log('Closing evidence modal...');
  await page.click('#continue-mission-btn');
  await new Promise(r => setTimeout(r, 1000));

  // Step 5: Walk to exit door
  console.log('Moving to apartment exit door...');
  await page.evaluate(() => {
    window.game.player.teleport(new window.THREE.Vector3(300, 0, -297.2), 0);
    window.game.camera.snap(window.game.player.position, Math.PI, 0.12, window.game.world.colliders);
  });
  await new Promise(r => setTimeout(r, 800));

  const exitPrompt = await page.evaluate(() => {
    const el = document.getElementById('interaction-prompt');
    return el ? el.innerText : '';
  });
  console.log('Exit door prompt:', exitPrompt);

  // Screenshot 4: At exit door with Leave Unit 102 prompt
  const shot4Path = path.join(screenshotDir, 'm01_apartment_exit_door_prompt.png');
  await page.screenshot({ path: shot4Path });
  console.log('Saved screenshot 4:', shot4Path);

  // Step 6: Press E to exit back to Eastline outside
  console.log('Pressing E via page.keyboard.press to exit Unit 102...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 5: Mission completed banner outside
  const shot5Path = path.join(screenshotDir, 'm01_mission_passed_outside.png');
  await page.screenshot({ path: shot5Path });
  console.log('Saved screenshot 5:', shot5Path);

  const finalState = await page.evaluate(() => {
    return {
      playerPos: window.game.player.position,
      isInApartment: window.game.isInApartmentInterior,
      isInteriorMode: window.game.camera.isInteriorMode,
      completedMissions: Array.from(window.game.missionMgr.completedMissions),
      cash: window.game.player.cash
    };
  });
  console.log('Final state outside:', JSON.stringify(finalState, null, 2));

  await browser.close();
  console.log('Test completed successfully!');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
