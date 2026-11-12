// Exercise the browser clipboard, then controlled denial, pending and missing
// API cases. Can also run directly against a built or deployed site.
import assert from "node:assert/strict";

export async function checkContactCopy(browser, base) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewport({ width: 320, height: 844 });
  await browser.defaultBrowserContext().overridePermissions(new URL(base).origin, ["clipboard-read", "clipboard-sanitized-write"]);
  await page.goto(base + "/", { waitUntil: "networkidle0" });
  await page.$eval("#email-copy", (element) => element.scrollIntoView({ block: "center" }));
  await page.waitForFunction(() => window.__keel_hydrated === true);
  const status = (value) => page.waitForFunction((value) => document.querySelector("#email-status")?.textContent === value, {}, value);
  const click = () => page.click("#email-copy");
  try {
    await page.evaluate(() => { window.originalClipboard = navigator.clipboard; window.originalWrite = navigator.clipboard.writeText; });
    await click();
    await status("Copied");
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "hi@kylet.se", "Copy must write the visible email address");

    await page.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new DOMException("Denied by fixture", "NotAllowedError")); });
    await click();
    await status("Copy failed");
    assert.equal(await page.$eval("#email-address", (element) => element.getAttribute("href")), "mailto:hi@kylet.se");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, "failure feedback must fit on a small phone");

    await page.evaluate(() => {
      window.copyCalls = 0;
      navigator.clipboard.writeText = () => { window.copyCalls++; return new Promise((resolve) => { window.finishCopy = resolve; }); };
    });
    await click();
    await status("Copying…");
    await click();
    assert.equal(await page.evaluate(() => window.copyCalls), 1, "a pending copy must not start overlapping requests");
    await page.evaluate(() => window.finishCopy());
    await status("Copied");

    await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }); });
    await click();
    await status("Copy failed");
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: window.originalClipboard });
      navigator.clipboard.writeText = window.originalWrite;
    });
    await click();
    await status("Copied");
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "hi@kylet.se", "Copy must recover after a failed attempt");
    assert.deepEqual(errors, [], "clipboard failures must be handled without script errors");
    console.log("contact copy checks passed (real clipboard, denied, pending, missing API, retry)");
  } finally {
    await browser.defaultBrowserContext().clearPermissionOverrides();
    await page.close();
  }
}

if (import.meta.main) {
  const { default: puppeteer } = await import("puppeteer-core");
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "/usr/bin/chromium", args: ["--no-sandbox"] });
  try { await checkContactCopy(browser, process.env.BASE ?? "http://127.0.0.1:4173"); }
  finally { await browser.close(); }
}
