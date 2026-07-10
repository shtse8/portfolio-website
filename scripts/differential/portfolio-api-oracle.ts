#!/usr/bin/env bun
/**
 * TS oracle for portfolio API differential parity (rej-010).
 * Encodes deleted Bun api/ north-star semantics (ADR-168) for contract comparison.
 */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../..');
const CORPUS_PATH = join(__dirname, 'fixtures/portfolio-api-corpus.json');

const ALLOWED_ORIGINS = [
  'https://kylet.se',
  'https://www.kylet.se',
  'https://loud-slab-t9c6ai.sylphx.app',
  'http://localhost:3000',
] as const;

const DAY_MS = 86_400_000;
const IP_WINDOW_MS = 3 * 60_000;
const IP_MAX_IN_WINDOW = 12;
const IP_MAX_PER_DAY = 60;
const GLOBAL_MAX_PER_DAY = 500;

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

interface CorpusCase {
  readonly id: string;
  readonly slice: string;
  readonly domain: string;
  readonly input: Record<string, Json>;
}

interface CorpusManifest {
  readonly corpusVersion: number;
  readonly cases: readonly CorpusCase[];
}

interface OracleCase extends CorpusCase {
  readonly output: Json;
}

function sha256Hex(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

function validPkg(pkg: string): boolean {
  if (pkg.length > 80) return false;
  let rest = pkg;
  if (pkg.startsWith('@')) {
    const stripped = pkg.slice(1);
    const slash = stripped.indexOf('/');
    const scope = slash === -1 ? stripped : stripped.slice(0, slash);
    const name = slash === -1 ? '' : stripped.slice(slash + 1);
    if (!scope || !name) return false;
    rest = name;
  }
  if (!rest) return false;
  const first = rest.charCodeAt(0);
  if (!((first >= 48 && first <= 57) || (first >= 65 && first <= 90) || (first >= 97 && first <= 122))) {
    return false;
  }
  return [...rest].every((ch) => /[A-Za-z0-9._-]/.test(ch));
}

function allowedOrigin(origin: string | undefined): string {
  if (origin && ALLOWED_ORIGINS.includes(origin as (typeof ALLOWED_ORIGINS)[number])) {
    return origin;
  }
  return 'https://kylet.se';
}

function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowed = allowedOrigin(origin);
  return {
    'access-control-allow-origin': allowed,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'origin',
  };
}

function clientIp(headers: [string, string][]): string {
  const pick = (name: string): string | undefined => {
    const hit = headers.find(([key]) => key.toLowerCase() === name.toLowerCase());
    return hit?.[1];
  };
  const raw =
    pick('x-forwarded-for')
      ?.split(',')[0]
      ?.trim() ??
    pick('x-real-ip') ??
    pick('x-envoy-external-address') ??
    pick('cf-connecting-ip') ??
    'unknown';
  return raw.slice(0, 45);
}

function parseIsoMs(iso: string): number {
  const parsed = Date.parse(iso);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAgo(nowMs: number, when: string): string {
  const diff = Math.max(0, nowMs - parseIsoMs(when));
  const mins = Math.floor(diff / 60_000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

function aggregateActivity(input: Record<string, Json>): Json {
  const graphql = input.graphql as Record<string, Json>;
  const ownerKeys = input.ownerKeys as string[];
  const nowMs = input.nowMs as number;
  const updatedAt = input.updatedAt as string;

  let commitsToday = 0;
  let commitsWeek = 0;
  const reposActiveToday = new Set<string>();
  let lastPush: { repo: string; when: string } | null = null;

  for (const key of ownerKeys) {
    const cc = (graphql[key] as { contributionsCollection?: Json })?.contributionsCollection as
      | {
          totalCommitContributions?: number;
          commitContributionsByRepository?: Array<{
            repository?: { nameWithOwner?: string; pushedAt?: string };
            contributions?: { totalCount?: number };
          }>;
        }
      | undefined;
    if (!cc) continue;

    commitsWeek += cc.totalCommitContributions ?? 0;
    for (const entry of cc.commitContributionsByRepository ?? []) {
      const repo = entry.repository?.nameWithOwner ?? '';
      const count = entry.contributions?.totalCount ?? 0;
      const pushedAt = entry.repository?.pushedAt;
      if (!pushedAt) continue;
      const ts = parseIsoMs(pushedAt);
      if (nowMs - ts < DAY_MS) {
        reposActiveToday.add(repo);
        commitsToday += count;
      }
      if (!lastPush || ts > parseIsoMs(lastPush.when)) {
        lastPush = { repo, when: pushedAt };
      }
    }
  }

  return {
    commitsToday,
    commitsWeek,
    commitsMonth: commitsWeek * 4,
    reposActiveToday: reposActiveToday.size,
    lastPush: lastPush
      ? {
          repo: lastPush.repo.split('/')[1] ?? lastPush.repo,
          ago: formatAgo(nowMs, lastPush.when),
        }
      : null,
    updatedAt,
  };
}

function simulateBurst(ip: string, base: number): { verdicts: string[]; final: string } {
  const ipHits = new Map<string, number[]>();
  const ipDay = new Map<string, number>();
  let globalDay = Math.floor(base / 86_400_000);
  let globalCount = 0;
  const verdicts: string[] = [];

  for (let i = 0; i <= IP_MAX_IN_WINDOW; i += 1) {
    const now = base + i;
    const day = Math.floor(now / 86_400_000);
    if (day !== globalDay) {
      globalDay = day;
      globalCount = 0;
      ipDay.clear();
      ipHits.clear();
    }
    let verdict = 'ok';
    if (globalCount >= GLOBAL_MAX_PER_DAY) {
      verdict = 'globalDaily';
    } else if (ip !== 'unknown') {
      const dayCount = ipDay.get(ip) ?? 0;
      if (dayCount >= IP_MAX_PER_DAY) {
        verdict = 'dailyIp';
      } else {
        const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
        if (hits.length >= IP_MAX_IN_WINDOW) {
          verdict = 'tooFast';
        } else {
          hits.push(now);
          ipHits.set(ip, hits);
          ipDay.set(ip, dayCount + 1);
        }
      }
    }
    if (verdict === 'ok') {
      globalCount += 1;
    }
    verdicts.push(verdict);
  }

  return { verdicts, final: verdicts[verdicts.length - 1] ?? 'unknown' };
}

async function evaluateCase(testCase: CorpusCase): Promise<OracleCase> {
  switch (testCase.domain) {
    case 'healthz':
      return { ...testCase, output: { status: 'ok' } };
    case 'validPkg':
      return { ...testCase, output: validPkg(testCase.input.pkg as string) };
    case 'allowedOrigin':
      return {
        ...testCase,
        output: allowedOrigin(testCase.input.origin as string | undefined),
      };
    case 'corsHeaders':
      return {
        ...testCase,
        output: corsHeaders(testCase.input.origin as string | undefined),
      };
    case 'clientIp':
      return {
        ...testCase,
        output: clientIp(testCase.input.headers as [string, string][]),
      };
    case 'constants':
      return {
        ...testCase,
        output: {
          ipWindowMs: IP_WINDOW_MS,
          ipMaxInWindow: IP_MAX_IN_WINDOW,
          ipMaxPerDay: IP_MAX_PER_DAY,
          globalMaxPerDay: GLOBAL_MAX_PER_DAY,
        },
      };
    case 'burst': {
      const burst = simulateBurst(testCase.input.ip as string, testCase.input.base as number);
      return {
        ...testCase,
        output: { verdicts: burst.verdicts, final: burst.final },
      };
    }
    case 'aggregate':
      return { ...testCase, output: aggregateActivity(testCase.input) };
    case 'service': {
      const rel = testCase.input.path as string;
      const protoPath = join(REPO_ROOT, rel);
      const raw = await readFile(protoPath, 'utf8');
      const rpcCount = (raw.match(/\brpc\b/g) ?? []).length;
      return {
        ...testCase,
        output: {
          service: 'PortfolioApiService',
          rpcCount,
          protoHash: sha256Hex(raw),
        },
      };
    }
    default:
      throw new Error(`unknown domain: ${testCase.domain}`);
  }
}

const manifest = JSON.parse(await readFile(CORPUS_PATH, 'utf8')) as CorpusManifest;
const cases = await Promise.all(manifest.cases.map((testCase) => evaluateCase(testCase)));
const fixtureCorpusHash = sha256Hex(JSON.stringify(manifest));

const corpus = {
  corpusVersion: manifest.corpusVersion,
  fixtureCorpusHash,
  cases,
};

process.stdout.write(`${JSON.stringify(corpus)}\n`);