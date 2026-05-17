// Local markdown wrapper that enables a rich glossary popover.
//
// Two responsibilities on top of sveltekitbook's base md / mdBlock:
//   1. Add a `data-term="..."` attribute to every glossary link so the
//      layout's hover handler can look up the entry.
//   2. Auto-link glossary terms that appear in plain prose (outside
//      <code>, <pre>, <a>), so the popover is reachable on every page
//      without manual [[term]] sprinkling.

import { md as baseMd, mdBlock as baseMdBlock, slug } from 'sveltekitbook/md';
import { GLOSSARY } from './glossary.js';

// ── Lookup tables ──────────────────────────────────────────────────────

const slugToCanonical = new Map();
for (const term of Object.keys(GLOSSARY)) {
  slugToCanonical.set(slug(term), term);
}

const termByLower = new Map();
for (const term of Object.keys(GLOSSARY)) {
  termByLower.set(term.toLowerCase(), term);
}

// Terms eligible for auto-linking: start with a letter so word boundaries
// work, and either ≥ 4 chars OR an all-caps acronym of 2-3 chars
// (RSA, NP, DFS, ...).  Filters out punctuation-heavy entries like '?'
// or '0/1 knapsack' that wouldn't match \b boundaries anyway.
const autoLinkTerms = Object.keys(GLOSSARY)
  .filter((t) => /^[A-Za-z]/.test(t))
  .filter((t) => t.length >= 4 || /^[A-Z]{2,3}$/.test(t))
  .sort((a, b) => b.length - a.length); // longest first → greedy

const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const autoLinkRegex = new RegExp(
  `\\b(${autoLinkTerms.map(reEscape).join('|')})\\b`,
  'g'
);
const autoLinkRegexI = new RegExp(
  `\\b(${autoLinkTerms.map(reEscape).join('|')})\\b`,
  'gi'
);

// ── Helpers ────────────────────────────────────────────────────────────

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildLink(canonical, label) {
  return `<a class="hw-glossary-link" href="/glossary#${slug(canonical)}" data-term="${escapeAttr(canonical)}">${label}</a>`;
}

// Add data-term to glossary links emitted by the base renderer ([[term]]).
function enhanceExistingLinks(html) {
  return html.replace(
    /<a class="hw-glossary-link" href="([^"]*)#([^"]+)">([^<]*)<\/a>/g,
    (match, base, termSlug, label) => {
      const canonical = slugToCanonical.get(termSlug);
      if (!canonical) return match;
      return `<a class="hw-glossary-link" href="${base}#${termSlug}" data-term="${escapeAttr(canonical)}">${label}</a>`;
    }
  );
}

// Auto-link glossary terms in plain prose.  Masks <a>, <code>, <pre>,
// <kbd>, and <tt> content so we never link inside an existing link or
// inside inline code.  Links the first occurrence of each term only,
// to keep visual noise down.
function autoLinkGlossary(html) {
  const masks = [];
  const masked = html.replace(
    /<(a|code|pre|kbd|tt)\b[^>]*>[\s\S]*?<\/\1>|<[^>]+>/gi,
    (m) => {
      masks.push(m);
      return `\x00MASK${masks.length - 1}\x00`;
    }
  );

  const linkedSoFar = new Set();

  // Pass 1 — exact-case match (preserves intended capitalisation of
  // acronyms like RSA, NP, BFS).
  let out = masked.replace(autoLinkRegex, (match) => {
    const canonical = termByLower.get(match.toLowerCase());
    if (!canonical) return match;
    if (canonical !== match) return match; // require exact case in pass 1
    if (linkedSoFar.has(canonical)) return match;
    linkedSoFar.add(canonical);
    return buildLink(canonical, match);
  });

  // Pass 2 — case-insensitive, for prose mentions of glossary terms
  // whose canonical form differs in case ("vec" → "Vec", "rust" → "Rust").
  out = out.replace(autoLinkRegexI, (match) => {
    const canonical = termByLower.get(match.toLowerCase());
    if (!canonical) return match;
    if (linkedSoFar.has(canonical)) return match;
    linkedSoFar.add(canonical);
    return buildLink(canonical, match);
  });

  return out.replace(/\x00MASK(\d+)\x00/g, (_, i) => masks[+i]);
}

function process(html) {
  return autoLinkGlossary(enhanceExistingLinks(html));
}

// ── Public API ─────────────────────────────────────────────────────────

export function md(text, opts) {
  return process(baseMd(text, opts));
}

export function mdBlock(text, opts) {
  return process(baseMdBlock(text, opts));
}

export { slug };
