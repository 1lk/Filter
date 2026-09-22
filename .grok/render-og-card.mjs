import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const still = readFileSync("/workspace/.grok/lab.jpg").toString("base64");
const serif = readFileSync("/workspace/.grok/fonts/instrument-serif.ttf").toString("base64");
const sans = readFileSync("/workspace/.grok/fonts/figtree-medium.ttf").toString("base64");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    @font-face {
      font-family: "Instrument Serif";
      src: url(data:font/ttf;base64,${serif}) format("truetype");
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: "Figtree";
      src: url(data:font/ttf;base64,${sans}) format("truetype");
      font-weight: 500;
      font-style: normal;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #08070a;
    }
    .card {
      position: relative;
      width: 1200px;
      height: 630px;
    }
    .still {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 62% 42%;
      filter: brightness(0.86) contrast(1.08) saturate(0.96);
    }
    .vignette {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 58% 46%, rgba(8,7,10,0) 16%, rgba(8,7,10,0.38) 52%, rgba(8,7,10,0.72) 100%),
        linear-gradient(to bottom, rgba(8,7,10,0.42) 0%, rgba(8,7,10,0.08) 22%, rgba(8,7,10,0.08) 78%, rgba(8,7,10,0.5) 100%);
    }
    .letterbox {
      position: absolute;
      left: 0;
      right: 0;
      height: 28px;
      background: #08070a;
      z-index: 3;
    }
    .letterbox.top { top: 0; }
    .letterbox.bottom { bottom: 0; }
    .lockup {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 2;
      color: #efe8dc;
      text-align: center;
    }
    .the {
      font-family: Figtree, sans-serif;
      font-weight: 500;
      font-size: 18px;
      letter-spacing: 0.72em;
      padding-left: 0.72em;
      text-transform: uppercase;
      color: #efe8dc;
      opacity: 0.94;
      text-shadow: 0 1px 2px rgba(8,7,10,0.85), 0 6px 24px rgba(8,7,10,0.55);
    }
    .rule {
      width: 56px;
      height: 1px;
      margin: 14px 0 16px;
      background: #c8915a;
      box-shadow: 0 0 12px rgba(200,145,90,0.45);
    }
    .filter {
      font-family: "Instrument Serif", serif;
      font-weight: 400;
      font-size: 112px;
      line-height: 0.88;
      letter-spacing: 0.05em;
      padding-left: 0.05em;
      color: #efe8dc;
      text-shadow:
        0 1px 1px rgba(8,7,10,0.9),
        0 10px 36px rgba(8,7,10,0.62),
        0 0 42px rgba(200,145,90,0.2);
    }
  </style>
</head>
<body>
  <div class="card">
    <img class="still" alt="" src="data:image/jpeg;base64,${still}" />
    <div class="vignette"></div>
    <div class="lockup">
      <div class="the">THE</div>
      <div class="rule"></div>
      <div class="filter">FILTER</div>
    </div>
    <div class="letterbox top"></div>
    <div class="letterbox bottom"></div>
  </div>
</body>
</html>`;

writeFileSync("/workspace/.grok/og-card.html", html);

const browser = await chromium.launch({
  args: ["--disable-web-security", "--allow-file-access-from-files"],
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(180);
await page.screenshot({
  path: "/workspace/.grok/og-card-raw.png",
  type: "png",
});
await browser.close();
console.log("wrote /workspace/.grok/og-card-raw.png");
