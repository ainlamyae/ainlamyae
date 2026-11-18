# LinkedIn banner

Source for my LinkedIn banner. The banner shows the software-engineering **V model**: requirements analysis, system design, architecture design and module design go down the left arm, coding is the bottom, and unit, integration, system and acceptance testing climb the right arm. Dashed lines link each design phase to the test phase that checks it. A faint pattern of line icons fills the background.

Output size: **1584 × 396 px** (4:1), plus a 2x copy at 3168 × 792 px.

## Edit the banner

Everything you will want to change is in [`src/config.js`](src/config.js):

| What | Where in `config.js` |
|---|---|
| Headline, subline, keyword line | `text` |
| The 9 stages: names and colours | `stages` |
| Arrow size, rounding, vertical spacing | `shapes` |
| Background, text and link colours | `colors` |
| Icon pattern: opacity, density, colour | `icons` |

The icon drawings are in [`src/icons.js`](src/icons.js). The layout code is in [`src/banner.js`](src/banner.js) and the look (shadows, glass effect, fonts) is in [`src/styles.css`](src/styles.css).

To preview, open `src/banner.html` in a browser.

## Export the PNG

Requires Node.js 18 or later and Google Chrome.

```bash
npm install
npm run export        # writes dist/linkedin-banner-1584x396.png and dist/linkedin-banner-3168x792.png
npm run safe-zone     # writes dist/safe-zone-preview.png
```

If Chrome is not found automatically, set `CHROME_PATH` to the Chrome executable.

`dist/` is generated and is not committed.

## Check before uploading

`npm run safe-zone` shows how LinkedIn displays the banner on desktop: the top and bottom edges are cropped and the profile photo covers the lower left. Keep text and key shapes inside the visible middle band and to the right of the photo. See [`docs/design-notes.md`](docs/design-notes.md).

## Structure

```
linkedin-banner/
├── src/
│   ├── banner.html     page shell
│   ├── config.js       all editable content and colours
│   ├── icons.js        icon set for the background pattern
│   ├── banner.js       layout: V shape, dashed links, icon pattern
│   └── styles.css      fonts, shadows, glass effect
├── scripts/
│   ├── export.mjs      PNG export at 1x and 2x
│   └── safe-zone.mjs   LinkedIn crop and profile-photo preview
├── docs/
│   └── design-notes.md
└── package.json
```
