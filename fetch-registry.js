#!/usr/bin/env node
// fetch-registry.js — query the UberSkills registry
//
// Security: this script only fetches and validates JSON from a fixed URL.
// It does not execute any code from the response. Any response that is not
// valid JSON matching the expected schema is rejected entirely.
//
// Usage:
//   node fetch-registry.js [query] [--limit N] [--sort score|stars|recency|name]
//
// Prints a JSON array of validated skill objects to stdout.

const REGISTRY_URL = process.env.REGISTRY_URL ?? 'https://uberskills.fly.dev/skills';
const MAX_BYTES    = 1_000_000; // 1 MB hard cap

// ── arg parsing ───────────────────────────────────────────────────────────────

const args  = process.argv.slice(2);
let query   = '';
let limit   = 20;
let sort    = 'score';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) {
    limit = Math.min(parseInt(args[++i], 10) || 20, 100);
  } else if (args[i] === '--sort' && args[i + 1]) {
    const v = args[++i];
    if (['score', 'stars', 'recency', 'name'].includes(v)) sort = v;
  } else if (!args[i].startsWith('--')) {
    query = args[i];
  }
}

// ── fetch + validate ──────────────────────────────────────────────────────────

async function fetchSkills(q, { limit = 20, sort = 'score' } = {}) {
  const url = new URL(REGISTRY_URL);
  if (q)     url.searchParams.set('q',     q);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('sort',  sort);

  let res;
  try {
    res = await fetch(url.toString());
  } catch (err) {
    throw new Error(`Network error: ${err.message}`);
  }

  if (!res.ok) {
    throw new Error(`Registry returned ${res.status}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('Response is not JSON');
  }

  const text = await res.text();
  if (text.length > MAX_BYTES) {
    throw new Error('Response too large (> 1 MB)');
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Response is not valid JSON');
  }

  if (data.version !== '1')        throw new Error('Unknown registry version');
  if (!Array.isArray(data.skills)) throw new Error('Missing skills array');

  // Field allowlist — only extract known fields, cast to expected primitive types
  return data.skills
    .map(s => ({
      id:               String(s.id               ?? ''),
      name:             String(s.name             ?? ''),
      description:      String(s.description      ?? ''),
      author:           String(s.author           ?? ''),
      install_command:  String(s.install_command  ?? ''),
      score:            Number(s.score            ?? 0),
      stars:            Number(s.stars            ?? 0),
      last_activity_at: String(s.last_activity_at ?? ''),
    }))
    .filter(s => s.id && s.name);
}

// ── main ─────────────────────────────────────────────────────────────────────

fetchSkills(query, { limit, sort })
  .then(results => {
    process.stdout.write(JSON.stringify(results, null, 2) + '\n');
    process.exit(0);
  })
  .catch(err => {
    process.stderr.write(`Error: ${err.message}\n`);
    process.exit(1);
  });
