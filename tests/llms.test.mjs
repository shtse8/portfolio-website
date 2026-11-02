import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { assertLlmsText, checkLlms } from "./llms.mjs";

const text = readFileSync(new URL("../site/assets/llms.txt", import.meta.url), "utf8");
const response = (method, body = text, type = "text/plain; charset=utf-8", status = 200) =>
  new Response(method === "HEAD" ? null : body, { status, headers: { "content-type": type } });

test("the shipped overview has the founder identity and only verified links", () => {
  assertLlmsText(text);
});

test("nginx maps the exact root route to the packed asset with UTF-8 plain text", () => {
  const nginx = readFileSync(new URL("../nginx.conf", import.meta.url), "utf8");
  assert.match(nginx, /charset utf-8;/);
  assert.match(nginx, /location = \/llms\.txt\s*\{\s*alias \/usr\/share\/nginx\/html\/assets\/llms\.txt;\s*default_type text\/plain;\s*\}/);
});

test("the public contract requests GET and HEAD without following redirects", async () => {
  const calls = [];
  await checkLlms("https://kylet.se", async (url, options) => {
    calls.push([url.href, options.method, options.redirect]);
    return response(options.method);
  });
  assert.deepEqual(calls, [
    ["https://kylet.se/llms.txt", "GET", "manual"],
    ["https://kylet.se/llms.txt", "HEAD", "manual"],
  ]);
});

test("redirects, HTML fallback and a missing charset fail the contract", async () => {
  for (const [type, status] of [["text/plain; charset=utf-8", 301], ["text/html; charset=utf-8", 200], ["text/plain", 200]]) {
    await assert.rejects(checkLlms("https://kylet.se", async (_, { method }) => response(method, text, type, status)));
  }
});

test("a missing route or wrong HEAD MIME fails even when GET passes", async () => {
  for (const [type, status] of [["text/plain; charset=utf-8", 404], ["text/html; charset=utf-8", 200]]) {
    await assert.rejects(checkLlms("https://kylet.se", async (_, { method }) =>
      method === "GET" ? response(method) : response(method, text, type, status)));
  }
});

test("wrong identity, HTML, foreign branding and unverified links fail", () => {
  for (const bad of [
    text.replace("# Kyle Tse", "# Someone else"),
    text + "\n<html>fallback</html>",
    text + "\nOzyrix",
    text.replace("https://github.com/shtse8", "https://www.linkedin.com/in/shtse8"),
    text.replace("https://spiron.ai", "https://unknown.example"),
  ]) assert.throws(() => assertLlmsText(bad));
});
