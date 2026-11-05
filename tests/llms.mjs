import assert from "node:assert/strict";

export const llmsLinks = [
  "https://kylet.se/",
  "https://sylphx.com",
  "https://spiron.ai",
  "https://keelengine.dev",
  "https://github.com/shtse8",
];

export function assertLlmsText(text) {
  assert.match(text, /^# Kyle Tse\n/);
  assert.match(text, /^> Kyle Tse is the founder of Sylphx\b/m);
  assert.match(text, /^## Personal site and profile$/m);
  assert.match(text, /^## Sylphx and products$/m);
  assert.doesNotMatch(text, /<!doctype|<html|<script|Ozyrix|linkedin\.com/i);
  const links = [...text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
  assert.deepEqual(links.sort(), [...llmsLinks].sort(), "only verified public links");
}

export async function checkLlms(base, request = fetch) {
  for (const method of ["GET", "HEAD"]) {
    const response = await request(new URL("/llms.txt", base), { method, redirect: "manual" });
    assert.equal(response.status, 200, `/llms.txt ${method} status`);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8", `/llms.txt ${method} MIME`);
    const text = await response.text();
    if (method === "GET") assertLlmsText(text);
    else assert.equal(text, "", "/llms.txt HEAD has no body");
  }
  console.log("llms.txt GET and HEAD contract passed");
}
