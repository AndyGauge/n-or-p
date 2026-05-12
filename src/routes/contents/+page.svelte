<script>
  import { base } from '$app/paths';
  import { flat } from '$lib/outline.js';
  import { TITLE } from '$lib/config.js';

  // Reset to a neutral palette + allow the contents page to scroll past the
  // viewport. Per-page palette/overflow lockdowns from reader pages would
  // otherwise follow the user here.
  $effect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute(
      'style',
      '--bg:#ffffff;--ink:#14110d;--muted:rgba(20,17,13,0.56);--rule:rgba(20,17,13,0.16);--accent:#6a6a6a;'
    );
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = prevOverflow; };
  });
</script>

<svelte:head><title>Contents — {TITLE}</title></svelte:head>

<main class="page">
  <header class="top">
    <a class="mark" href="{base}/">{TITLE}</a>
    <nav class="top-nav"><a class="cover-link" href="{base}/">Cover ←</a></nav>
  </header>

  <div class="intro">
    <div class="kicker">Contents</div>
    <h1>{flat.length} {flat.length === 1 ? 'section' : 'sections'}</h1>
  </div>

  <ul class="entries">
    {#each flat as e}
      <li>
        <a class="entry" href="{base}/{e.num}">
          <span class="entry-num">{e.num}</span>
          <span class="entry-title">{e.title}</span>
          {#if e.year !== undefined}<span class="entry-meta">{e.year}</span>{/if}
        </a>
      </li>
    {/each}
  </ul>
</main>

<style>
  .page {
    min-height: 100vh; min-height: 100dvh;
    padding: 4vw 7vw 6vw;
    display: flex; flex-direction: column; gap: 3vw;
  }

  .top { display: flex; justify-content: space-between; align-items: center; font-family: var(--sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.24em; color: var(--muted); }
  .mark { font-family: var(--serif); font-style: italic; font-size: 1rem; letter-spacing: 0; text-transform: none; color: var(--ink); }
  .cover-link { color: var(--muted); transition: color 160ms; }
  .cover-link:hover { color: var(--ink); }

  .intro { max-width: 1100px; }
  .kicker { font-family: var(--sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.28em; color: var(--muted); margin-bottom: 1.2rem; }
  h1 { font-family: var(--serif); font-weight: 300; font-style: italic; font-size: clamp(2.4rem, 6vw, 4.8rem); line-height: 0.98; letter-spacing: -0.025em; color: var(--ink); }

  .entries { list-style: none; margin-top: 2rem; padding: 0; border-top: 1px solid var(--rule); }

  .entry {
    display: grid;
    grid-template-columns: 3ch minmax(0, 1fr) auto;
    gap: 1.2rem;
    align-items: baseline;
    padding: 0.6rem 0;
    border-bottom: 1px dotted var(--rule);
    color: var(--ink);
  }
  .entry:hover { background: rgba(20, 17, 13, 0.03); }

  .entry-num { font-family: var(--sans); font-size: 0.68rem; letter-spacing: 0.18em; color: var(--muted); }
  .entry-title { font-family: var(--serif); font-style: italic; font-weight: 300; font-size: clamp(0.98rem, 1.15vw, 1.12rem); color: var(--ink); overflow-wrap: break-word; }
  .entry-meta { font-family: var(--sans); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }

  @media (max-width: 720px) {
    .entry { grid-template-columns: 2.4ch 1fr; row-gap: 0.2rem; }
    .entry-meta { grid-column: 2; }
  }
</style>
