import puppeteer from 'puppeteer-core';
import path from 'path';

const screenshotDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\f675a66c-01e6-401d-95a5-8008160c3e0c';

async function run() {
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
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#start-game-btn', { timeout: 10000 });
  await page.click('#start-game-btn');
  await new Promise(r => setTimeout(r, 2200));

  await page.evaluate(() => {
    if (window.game.pauseMenu.isOpen()) window.game.pauseMenu.close();
    window.game.state.setState('FREE_ROAM');
    if (window.game.player.isInVehicle) {
      window.game.vehicleMgr.exitVehicle(window.game.player);
    }
  });

  // 1. Close View
  await page.evaluate(() => {
    window.game.camera.footViewIndex = 0; // CLOSE
    window.game.camera.isFirstPerson = false;
    window.game.hud.showViewModeBadge('VIEW // CLOSE');
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(screenshotDir, 'gta5_camera_close.png') });

  // 2. Far View
  await page.evaluate(() => {
    window.game.camera.footViewIndex = 2; // FAR
    window.game.camera.isFirstPerson = false;
    window.game.hud.showViewModeBadge('VIEW // FAR');
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(screenshotDir, 'gta5_camera_far.png') });

  // 3. First Person View
  await page.evaluate(() => {
    window.game.camera.footViewIndex = 3; // FIRST PERSON
    window.game.camera.isFirstPerson = true;
    window.game.hud.showViewModeBadge('VIEW // FIRST PERSON');
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(screenshotDir, 'gta5_camera_firstperson.png') });

  // 4. Vehicle Hood View
  await page.evaluate(() => {
    if (window.game.vehicleMgr.vehicles.length > 0) {
      window.game.vehicleMgr.enterVehicle(window.game.player, window.game.vehicleMgr.vehicles[0]);
      window.game.camera.isVehicleMode = true;
      window.game.camera.vehicleViewIndex = 2; // HOOD CAM
      window.game.hud.showViewModeBadge('VEHICLE // HOOD CAM');
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(screenshotDir, 'gta5_camera_vehicle_hood.png') });

  await browser.close();
  console.log('All GTA 5 camera views captured.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
