// 사자성어 한 수 → "오늘의 네 글자" 제출 이미지 3장 생성
// 1. thumb-square (1000x1000)
// 2. thumb-landscape (1932x828)
// 3. screenshot-landscape (1504x741) — A안: 두루마리 위 3폰 플로우

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = path.join(__dirname);
const SUB = path.join(BASE, 'submission');
const LOGOS = path.join(__dirname, '..', 'app-logos');

const APP = {
  displayName: '오늘의 사자성어',
  color: '#B91C1C',
  desc: '하루 한 문제, 사자성어 도감',
};

const FONTS = `
<link href="https://cdn.jsdelivr.net/gh/webfontworld/gmarket/GmarketSans.css" rel="stylesheet">
<link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
`;

function getIconB64() {
  const p = path.join(LOGOS, 'daily-idiom.png');
  return fs.readFileSync(p).toString('base64');
}

function getScreenB64(n) {
  const p = path.join(BASE, 'raw', `screen-${n}.png`);
  return fs.readFileSync(p).toString('base64');
}

function phoneCSS(pw) {
  const fr = Math.round(pw * 0.135);
  const sr = Math.round(pw * 0.11);
  const pad = Math.round(pw * 0.032);
  const nw = Math.round(pw * 0.33);
  const nh = Math.round(pw * 0.075);
  return `
.phone {
  width:${pw}px; padding:${pad}px;
  background:#1a1a1a; border-radius:${fr}px;
  box-shadow: 0 ${Math.round(pw*0.06)}px ${Math.round(pw*0.15)}px rgba(0,0,0,0.35),
              inset 0 1px 0 rgba(255,255,255,0.1);
  position:relative; flex-shrink:0;
}
.phone::before {
  content:''; position:absolute;
  top:${pad}px; left:50%; transform:translateX(-50%);
  width:${nw}px; height:${nh}px;
  background:#1a1a1a; border-radius:0 0 ${Math.round(nh*0.6)}px ${Math.round(nh*0.6)}px;
  z-index:10;
}
.phone .screen { border-radius:${sr}px; overflow:hidden; background:#fff; }
.phone .screen img { display:block; width:100%; height:auto; }`;
}

// ============ 1. Thumb Square (1000x1000) ============
function thumbSquareHTML(iconB64) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:1000px; height:1000px; overflow:hidden;
  background: linear-gradient(135deg, #DC2626, #B91C1C, #7F1D1D);
  font-family: 'GmarketSans', 'Pretendard Variable', sans-serif;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  position:relative;
}
.icon {
  width:260px; height:260px; border-radius:58px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.25);
  margin-bottom:36px; object-fit:cover;
}
h1 { color:#fff; font-size:68px; font-weight:700; margin-bottom:14px; text-shadow:0 2px 8px rgba(0,0,0,0.15); }
p { color:rgba(255,255,255,0.85); font-size:30px; font-weight:500; }
.deco { position:absolute; border-radius:50%; opacity:0.08; background:#fff; }
.d1 { width:400px; height:400px; top:-100px; right:-80px; }
.d2 { width:250px; height:250px; bottom:-60px; left:-40px; }
</style></head><body>
<div class="deco d1"></div><div class="deco d2"></div>
<img class="icon" src="data:image/png;base64,${iconB64}" />
<h1>${APP.displayName}</h1>
<p>${APP.desc}</p>
</body></html>`;
}

// ============ 2. Thumb Landscape (1932x828) ============
function thumbLandscapeHTML(iconB64, screenB64) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:1932px; height:828px; overflow:hidden;
  background: linear-gradient(135deg, #DC2626, #B91C1C, #7F1D1D);
  font-family: 'GmarketSans', 'Pretendard Variable', sans-serif;
  display:flex; flex-direction:row; align-items:center; justify-content:space-between;
  padding:0 100px; position:relative;
}
.left { display:flex; flex-direction:column; justify-content:center; flex:1; max-width:800px; }
.icon { width:160px; height:160px; border-radius:36px; box-shadow:0 12px 36px rgba(0,0,0,0.2); margin-bottom:28px; object-fit:cover; }
h1 { color:#fff; font-size:64px; font-weight:700; margin-bottom:12px; text-shadow:0 2px 6px rgba(0,0,0,0.12); }
p { color:rgba(255,255,255,0.85); font-size:28px; font-weight:500; max-width:600px; line-height:1.4; }
.right { display:flex; align-items:center; justify-content:center; }
${phoneCSS(260)}
.deco { position:absolute; border-radius:50%; opacity:0.07; background:#fff; }
.d1 { width:500px; height:500px; top:-180px; right:200px; }
.d2 { width:300px; height:300px; bottom:-100px; left:300px; }
</style></head><body>
<div class="deco d1"></div><div class="deco d2"></div>
<div class="left">
  <img class="icon" src="data:image/png;base64,${iconB64}" />
  <h1>${APP.displayName}</h1>
  <p>${APP.desc}</p>
</div>
<div class="right">
  <div class="phone"><div class="screen"><img src="data:image/png;base64,${screenB64}" /></div></div>
</div>
</body></html>`;
}

// ============ 3. Screenshot Landscape — A안 (두루마리 3폰 플로우) ============
function screenshotLandscapeHTML(iconB64, s1B64, s2B64, s3B64) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:1504px; height:741px; overflow:hidden;
  background: linear-gradient(135deg, #DC2626, #B91C1C, #7F1D1D);
  font-family: 'GmarketSans', 'Pretendard Variable', sans-serif;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  position:relative;
}

/* 브랜드 상단 */
.brand {
  position:absolute; top:28px; left:50%; transform:translateX(-50%);
  display:flex; align-items:center; gap:14px; z-index:10;
}
.brand img { width:44px; height:44px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.15); }
.brand span { color:#fff; font-size:26px; font-weight:700; text-shadow:0 1px 4px rgba(0,0,0,0.12); }

/* 두루마리 배경 스트립 */
.scroll-strip {
  position:absolute;
  top:50%; left:50%; transform:translate(-50%,-50%);
  width:1380px; height:460px;
  background: linear-gradient(180deg, #FFFDF7 0%, #FEF3C7 30%, #FFFDF7 70%, #FEF3C7 100%);
  border-radius:20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6);
  border: 2px solid rgba(185,28,28,0.15);
}
/* 두루마리 끝단 롤 장식 */
.scroll-strip::before, .scroll-strip::after {
  content:'';
  position:absolute; top:10px; bottom:10px; width:28px;
  background: linear-gradient(90deg, #D4A574 0%, #C9956A 40%, #D4A574 100%);
  border-radius:14px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1);
}
.scroll-strip::before { left:-14px; }
.scroll-strip::after { right:-14px; }

/* 3폰 컨테이너 */
.phones-row {
  position:relative; z-index:5;
  display:flex; align-items:center; gap:24px;
}

${phoneCSS(195)}

/* 화살표 */
.arrow {
  display:flex; flex-direction:column; align-items:center; gap:4px;
  color:rgba(185,28,28,0.7); z-index:6;
}
.arrow svg { filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1)); }
.arrow span { font-size:11px; font-weight:700; letter-spacing:1px; }

/* 캡션 라벨 */
.caption-row {
  position:absolute; bottom:88px; left:50%; transform:translateX(-50%);
  display:flex; gap:170px; z-index:6;
}
.cap {
  font-size:13px; font-weight:700; color:rgba(127,29,29,0.8);
  text-align:center; letter-spacing:1px;
}

/* 하단 설명 */
.bottom-label {
  position:absolute; bottom:24px; left:50%; transform:translateX(-50%);
  color:rgba(255,255,255,0.8); font-size:20px; font-weight:600;
  text-shadow:0 1px 4px rgba(0,0,0,0.15); z-index:6;
}

/* 장식 원 */
.deco { position:absolute; border-radius:50%; opacity:0.06; background:#fff; }
.d1 { width:350px; height:350px; top:-100px; left:-60px; }
.d2 { width:250px; height:250px; bottom:-60px; right:-40px; }
</style></head><body>
<div class="deco d1"></div><div class="deco d2"></div>

<!-- 브랜드 -->
<div class="brand">
  <img src="data:image/png;base64,${iconB64}">
  <span>${APP.displayName}</span>
</div>

<!-- 두루마리 배경 -->
<div class="scroll-strip"></div>

<!-- 3폰 플로우 -->
<div class="phones-row">
  <div class="phone"><div class="screen"><img src="data:image/png;base64,${s1B64}" /></div></div>

  <div class="arrow">
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <path d="M2 12h24M20 4l8 8-8 8" stroke="rgba(185,28,28,0.7)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>풀기</span>
  </div>

  <div class="phone"><div class="screen"><img src="data:image/png;base64,${s2B64}" /></div></div>

  <div class="arrow">
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <path d="M2 12h24M20 4l8 8-8 8" stroke="rgba(185,28,28,0.7)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>수집</span>
  </div>

  <div class="phone"><div class="screen"><img src="data:image/png;base64,${s3B64}" /></div></div>
</div>

<!-- 캡션 -->
<div class="caption-row">
  <div class="cap">오늘의 두루마리</div>
  <div class="cap">뜻 · 예문 · 유래</div>
  <div class="cap">인장함 수집</div>
</div>

<!-- 하단 -->
<div class="bottom-label">${APP.desc}</div>

</body></html>`;
}

async function main() {
  fs.mkdirSync(SUB, { recursive: true });

  const iconB64 = getIconB64();
  const s1 = getScreenB64(1);
  const s2 = getScreenB64(2);
  const s3 = getScreenB64(3);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Thumb Square
  await page.setViewportSize({ width: 1000, height: 1000 });
  await page.setContent(thumbSquareHTML(iconB64));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SUB, 'thumb-square.png') });
  console.log('[OK] thumb-square.png (1000x1000)');

  // 2. Thumb Landscape
  await page.setViewportSize({ width: 1932, height: 828 });
  await page.setContent(thumbLandscapeHTML(iconB64, s1));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SUB, 'thumb-landscape.png') });
  console.log('[OK] thumb-landscape.png (1932x828)');

  // 3. Screenshot Landscape — A안
  await page.setViewportSize({ width: 1504, height: 741 });
  await page.setContent(screenshotLandscapeHTML(iconB64, s1, s2, s3));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SUB, 'screenshot-landscape.png') });
  console.log('[OK] screenshot-landscape.png (1504x741) — A안 두루마리 플로우');

  await page.close();
  await browser.close();

  console.log('\n=== Done! ===');
  console.log('Output:', SUB);
}

main().catch(e => { console.error(e); process.exit(1); });
