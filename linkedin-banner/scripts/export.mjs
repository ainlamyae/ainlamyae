// Export the banner to PNG at 1x (1584 x 396) and 2x (3168 x 792).
//   npm run export                         (Chrome is found automatically)
//   CHROME_PATH="C:/path/chrome.exe" npm run export
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);
const executablePath = candidates.find(p => existsSync(p));
if (!executablePath) { console.error('Chrome not found. Set CHROME_PATH.'); process.exit(1); }

mkdirSync(join(root, 'dist'), { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: 'new', args: ['--no-sandbox'] });
for (const [scale, name] of [[1, 'linkedin-banner-1584x396.png'], [2, 'linkedin-banner-3168x792.png']]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: scale });
  await page.goto(pathToFileURL(join(root, 'src', 'banner.html')).href, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 500));                    // let layout and shadows settle
  await page.screenshot({ path: join(root, 'dist', name) });
  console.log('wrote dist/' + name);
}
await browser.close();
