/* LinkedIn banner: draws the page from config.js and icons.js.
 * 1. CSS variables   2. text   3. background icon pattern
 * 4. V-model stage arrows   5. V band and dashed links */
(function () {
  const C = window.BANNER_CONFIG, IC = window.BANNER_ICONS;
  const root = document.documentElement.style;

  /* 1. colours from the config */
  const col = C.colors;
  root.setProperty('--background', col.background);
  root.setProperty('--background-top', col.backgroundTop);
  root.setProperty('--background-bottom', col.backgroundBottom);
  root.setProperty('--glow', col.glow);
  root.setProperty('--headline', col.headline);
  root.setProperty('--subline', col.subline);
  root.setProperty('--keywords', col.keywords);
  root.setProperty('--keyword-dot', col.keywordDot);
  root.setProperty('--stage-text', col.stageText);
  root.setProperty('--icon-opacity', C.icons.opacity);

  /* 2. text and content block */
  const w = document.getElementById('w'), v = document.getElementById('v');
  w.style.left = C.content.left + 'px';
  w.style.width = C.content.width + 'px';
  v.setAttribute('width', C.content.width);
  document.getElementById('headline').textContent = C.text.headline;
  document.getElementById('subline').textContent = C.text.subline;
  const kw = document.getElementById('keywords');
  kw.innerHTML = C.text.keywords.join('<b>\u00b7</b>');
  kw.style.top = C.text.keywordsTop + 'px';

  /* 3. background icon pattern (deterministic: the same picture every time) */
  const keys = Object.keys(IC), I = C.icons;
  let g = '';
  for (let r = 0; r < I.rows; r++) {
    for (let c = 0; c < I.columns; c++) {
      const x = 18 + c * I.spacingX + (r % 2 ? I.spacingX / 2 : 0) + ((Math.sin(r * 12.9 + c * 78.2) * 43758.5) % 1) * 12;
      const y = 22 + r * I.spacingY + ((Math.sin(r * 39.3 + c * 11.1) * 24634.6) % 1) * 10;
      const b = I.clearBox;
      if (y > b.yMin && y < b.yMax && x > b.xMin && x < b.xMax) continue;
      const k = keys[(r * 7 + c * 5 + Math.floor(c / 3)) % keys.length];
      const rot = ((Math.sin(r * 5.1 + c * 3.7) * 9301.3) % 1) * 24;
      const s = 1.05 + Math.abs(((Math.sin(r * 2.3 + c * 1.9) * 4421.9) % 1)) * 0.35;
      g += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s.toFixed(2)}) translate(-24,-24)" fill="none" stroke="${I.stroke}" stroke-width="${I.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</g>`;
    }
  }
  document.getElementById('icons').innerHTML = g;

  /* 4. V-model stage arrows */
  const S = C.stages, n = S.length, P = C.shapes;
  const W = P.width, H = P.height, step = (C.content.width - W) / (n - 1);
  const level = S.map((_, i) => Math.min(i, n - 1 - i));          // 0,1,2,3,4,3,2,1,0

  const mix = (hex, f) => {                                        // f > 0 lightens, f < 0 darkens
    const k = parseInt(hex.slice(1), 16), ch = [(k >> 16) & 255, (k >> 8) & 255, k & 255];
    return 'rgb(' + ch.map(c => Math.round(f >= 0 ? c + (255 - c) * f : c * (1 + f))).join(',') + ')';
  };
  const rounded = (pts, r) => {                                    // polygon with rounded corners
    const m = pts.length; let d = '';
    for (let i = 0; i < m; i++) {
      const p0 = pts[(i + m - 1) % m], p1 = pts[i], p2 = pts[(i + 1) % m];
      const v1 = [p0[0] - p1[0], p0[1] - p1[1]], v2 = [p2[0] - p1[0], p2[1] - p1[1]];
      const l1 = Math.hypot(...v1), l2 = Math.hypot(...v2);
      const a = [p1[0] + v1[0] / l1 * r, p1[1] + v1[1] / l1 * r], b = [p1[0] + v2[0] / l2 * r, p1[1] + v2[1] / l2 * r];
      d += (i ? 'L' : 'M') + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'Q' + p1[0] + ' ' + p1[1] + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
    }
    return d + 'Z';
  };
  const path = rounded([[1, 1], [W - 1 - P.tip, 1], [W - 1, H / 2], [W - 1 - P.tip, H - 1], [1, H - 1]], P.radius);

  S.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'st';
    d.style.cssText = `left:${i * step}px;top:${P.top + level[i] * P.drop}px;width:${W}px;height:${H}px`;
    d.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
   <defs><linearGradient id="g${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(s.color, .38)}"/><stop offset=".5" stop-color="${s.color}"/><stop offset="1" stop-color="${mix(s.color, -.03)}"/></linearGradient>
   <clipPath id="c${i}"><rect x="0" y="0" width="${W}" height="${H * 0.46}"/></clipPath></defs>
   <path d="${path}" fill="url(#g${i})" fill-opacity=".92"/>
   <path d="${path}" fill="rgba(255,255,255,.22)" clip-path="url(#c${i})"/>
   <path d="${path}" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.2"/></svg><span>${s.name}</span>`;
    w.appendChild(d);
  });

  /* 5. faint V band and dashed links between matching levels */
  const rel = el => { const a = el.getBoundingClientRect(), b = w.getBoundingClientRect(); return { l: a.left - b.left, r: a.right - b.left, t: a.top - b.top, b: a.bottom - b.top }; };
  const h = rel(document.getElementById('headline')), sub = rel(document.getElementById('subline'));
  const cx = i => i * step + W / 2 - 8, cy = i => P.top + level[i] * P.drop + H / 2;
  let svg = `<polyline points="${S.map((_, i) => cx(i) + ',' + cy(i)).join(' ')}" fill="none" stroke="${col.vBand}" stroke-width="62" stroke-linejoin="miter"/>`;
  const dash = `stroke="${col.link}" stroke-width="2" stroke-dasharray="7 7" stroke-linecap="round"`;
  const seg = (x1, x2, y) => { if (x2 - x1 > 6) svg += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" ${dash}/>`; };
  const dot = (x, y) => { svg += `<circle cx="${x}" cy="${y}" r="3.5" fill="${col.linkDot}" fill-opacity=".85"/>`; };
  for (let L = 0; L < (n - 1) / 2; L++) {                           // pairs: left stage L <-> right stage n-1-L
    const a = L, b = n - 1 - L, y = P.top + L * P.drop + H / 2, x1 = a * step + W + 6, x2 = b * step - 6;
    let box = null;
    if (y > h.t - 4 && y < h.b + 4) box = h; else if (y > sub.t - 4 && y < sub.b + 4) box = sub;
    if (box) { seg(x1, box.l - 16, y); seg(box.r + 16, x2, y); } else seg(x1, x2, y);   // lines stop before the text
    dot(x1, y); dot(x2, y);
  }
  v.innerHTML = svg;
})();
