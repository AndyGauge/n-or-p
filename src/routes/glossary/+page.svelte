<script>
  import { base } from '$app/paths';
  import { md, slug } from 'sveltekitbook/md';
  import { GLOSSARY } from '$lib/glossary.js';
  import { TITLE } from '$lib/config.js';

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

  const entries = Object.entries(GLOSSARY)
    .map(([term, val]) => ({
      term,
      id: slug(term),
      definition: typeof val === 'string' ? val : val.definition,
      see: typeof val === 'string' ? [] : val.see ?? []
    }))
    .sort((a, b) => a.term.localeCompare(b.term));
</script>

<svelte:head><title>Glossary — {TITLE}</title></svelte:head>

<main class="page">
  <header class="top">
    <a class="mark" href="{base}/">{TITLE}</a>
    <nav class="top-nav"><a class="cover-link" href="{base}/">Cover ←</a></nav>
  </header>

  <div class="intro">
    <div class="kicker">Glossary</div>
    <h1>Terms used in this book</h1>
    <p class="sub">Any section's body can reference a term as <code>[[term]]</code> — it links here.</p>
  </div>

  <dl class="entries">
    {#each entries as e}
      <div class="entry" id={e.id}>
        <dt>{e.term}</dt>
        <dd>
          <p>{@html md(e.definition, { glossary: GLOSSARY, glossaryBase: base + '/glossary' })}</p>
          {#if e.see.length}
            <p class="see">
              See also:
              {#each e.see as s, i}
                <a href="{base}/glossary#{slug(s)}">{s}</a>{i < e.see.length - 1 ? ', ' : ''}
              {/each}
            </p>
          {/if}
        </dd>
      </div>
    {/each}
  </dl>
</main>

<style>
  .page { min-height: 100vh; min-height: 100dvh; padding: 4vw 7vw 6vw; display: flex; flex-direction: column; gap: 3vw; }
  .top { display: flex; justify-content: space-between; align-items: center; font-family: var(--sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.24em; color: var(--muted); }
  .mark { font-family: var(--serif); font-style: italic; font-size: 1rem; letter-spacing: 0; text-transform: none; color: var(--ink); }
  .cover-link { color: var(--muted); transition: color 160ms; }
  .cover-link:hover { color: var(--ink); }

  .intro { max-width: 1100px; }
  .kicker { font-family: var(--sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.28em; color: var(--muted); margin-bottom: 1.2rem; }
  h1 { font-family: var(--serif); font-weight: 300; font-style: italic; font-size: clamp(2.4rem, 6vw, 4.8rem); line-height: 0.98; letter-spacing: -0.025em; color: var(--ink); }
  .sub { font-family: var(--serif); font-style: italic; font-weight: 300; font-size: clamp(1rem, 1.3vw, 1.2rem); color: var(--muted); margin-top: 1.2rem; max-width: 52ch; }
  code { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 0.95em; background: rgba(20, 17, 13, 0.06); padding: 0 0.3em; border-radius: 3px; }

  .entries { margin-top: 2rem; border-top: 1px solid var(--rule); }
  .entry { padding: 1.2rem 0; border-bottom: 1px dotted var(--rule); }

  dt {
    font-family: var(--serif);
    font-style: italic;
    font-weight: 400;
    font-size: clamp(1.1rem, 1.5vw, 1.4rem);
    color: var(--ink);
  }

  dd {
    margin-left: 0;
    margin-top: 0.5rem;
    font-family: var(--serif);
    font-weight: 300;
    font-size: clamp(0.95rem, 1.05vw, 1.05rem);
    line-height: 1.55;
    color: var(--ink);
    max-width: 60ch;
  }

  .see {
    margin-top: 0.5rem;
    font-family: var(--sans);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .see a { color: var(--accent); border-bottom: 1px solid transparent; }
  .see a:hover { border-bottom-color: var(--accent); }

  .entry :global(a.hw-glossary-link) {
    color: var(--accent);
    border-bottom: 1px dotted var(--accent);
  }
</style>
