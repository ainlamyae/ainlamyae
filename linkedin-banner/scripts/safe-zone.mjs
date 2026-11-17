// Preview how LinkedIn shows the banner on desktop: the top and bottom are cropped
// (about 64 px each on the 396 px canvas) and the profile photo covers the lower left.
//   npm run safe-zone     -> dist/safe-zone-preview.png
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(p => existsSync(p));
if (!executablePath) { console.error('Chrome not found. Set CHROME_PATH.'); process.exit(1); }

mkdirSync(join(root, 'dist'), { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1584, height: 396 });
await page.goto(pathToFileURL(join(root, 'src', 'banner.html')).href, { waitUntil: 'load' });
await page.evaluate(() => {
  const box = css => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;' + css; document.body.appendChild(d); };
  box('left:0;top:0;width:1584px;height:64px;background:rgba(0,0,0,.65)');            // cropped top
  box('left:0;top:332px;width:1584px;height:64px;background:rgba(0,0,0,.65)');        // cropped bottom
  box('left:34px;top:150px;width:224px;height:224px;border-radius:50%;background:rgba(255,255,255,.35);border:3px solid #fff'); // profile photo
});
await page.screenshot({ path: join(root, 'dist', 'safe-zone-preview.png') });
console.log('wrote dist/safe-zone-preview.png');
await browser.close();
