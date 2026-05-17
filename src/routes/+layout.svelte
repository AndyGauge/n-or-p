<script>
  import { onMount } from 'svelte';
  import { onNavigate } from '$app/navigation';
  import { base } from '$app/paths';
  import { mdBlock } from 'sveltekitbook/md';
  import { GLOSSARY } from '$lib/glossary.js';
  import { slug } from '$lib/md.js';
  import '../app.css';

  let { children } = $props();

  // ──────────────── Glossary popover ────────────────
  let popover = $state(null);   // { canonical, body, see, x, y, slug }
  let popoverEl = $state();
  let showTimer;
  let hideTimer;

  onMount(() => {
    const onScroll = () => hideNow();
    document.addEventListener('scroll', onScroll, true);
    return () => document.removeEventListener('scroll', onScroll, true);
  });

  function placePopover(rect) {
    const POP_W = 360;
    const POP_H_EST = 200;
    const margin = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = rect.left;
    if (x + POP_W > vw - margin) x = vw - POP_W - margin;
    if (x < margin) x = margin;
    // prefer below; flip above if no room
    let y = rect.bottom + 8;
    if (y + POP_H_EST > vh - margin && rect.top > POP_H_EST + 12) {
      y = rect.top - POP_H_EST - 8;
    }
    return { x, y };
  }

  function showFor(link) {
    const term = link.dataset.term;
    if (!term) return;
    const entry = GLOSSARY[term];
    if (!entry) return;
    clearTimeout(hideTimer);
    clearTimeout(showTimer);

    const body = typeof entry === 'string' ? entry : entry.definition;
    const see = (typeof entry === 'object' && entry.see) || [];

    const update = () => {
      const { x, y } = placePopover(link.getBoundingClientRect());
      popover = {
        canonical: term,
        body,
        see,
        x,
        y,
        slug: slug(term)
      };
    };
    // Already showing? swap instantly. Cold start? small delay so quick
    // mouse-overs that don't linger don't trigger a popover.
    if (popover) update();
    else showTimer = setTimeout(update, 80);
  }

  function hide() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { popover = null; }, 120);
  }

  function hideNow() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    popover = null;
  }

  function onOver(e) {
    const link = e.target.closest?.('.hw-glossary-link');
    if (link) showFor(link);
  }

  function onOut(e) {
    const link = e.target.closest?.('.hw-glossary-link');
    if (!link) return;
    const next = e.relatedTarget;
    if (next instanceof Node) {
      if (next.closest?.('.hw-glossary-link')) return;   // moving to another link
      if (popoverEl && popoverEl.contains(next)) return;  // moving onto the popover
    }
    hide();
  }

  // Keyboard equivalents — focusin/focusout bubble (focus/blur don't).
  function onFocusIn(e) {
    const link = e.target.closest?.('.hw-glossary-link');
    if (link) showFor(link);
  }
  function onFocusOut(e) {
    const link = e.target.closest?.('.hw-glossary-link');
    if (!link) return;
    const next = e.relatedTarget;
    if (next instanceof Node) {
      if (next.closest?.('.hw-glossary-link')) return;
      if (popoverEl && popoverEl.contains(next)) return;
    }
    hide();
  }

  // Esc closes the popover.
  function onKeyDown(e) {
    if (e.key === 'Escape' && popover) hideNow();
  }

  function onPopoverEnter() { clearTimeout(hideTimer); }
  function onPopoverLeave() { hide(); }

  // ──────────────── View transitions (existing) ────────────────
  onNavigate((navigation) => {
    if (typeof document === 'undefined' || !document.startViewTransition) return;

    const fromIdx = orderFromUrl(navigation.from?.url?.pathname);
    const toIdx = orderFromUrl(navigation.to?.url?.pathname);
    const back = fromIdx !== null && toIdx !== null && toIdx < fromIdx;
    document.documentElement.dataset.direction = back ? 'back' : 'forward';

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  function orderFromUrl(path) {
    if (!path) return null;
    if (path === '/' || path === '') return -1;
    const m = path.match(/\/(\d{2,})/);
    return m ? parseInt(m[1], 10) : null;
  }
</script>

<svelte:window onkeydown={onKeyDown} />

<!--
  Mouse events delegated for the glossary-popover hover. Keyboard
  equivalents are covered by `focusin`/`focusout` (the bubbling cousins
  of focus/blur).
-->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
  class="root"
  onmouseover={onOver}
  onmouseout={onOut}
  onfocusin={onFocusIn}
  onfocusout={onFocusOut}
  role="presentation"
>
  {@render children()}
</div>

{#if popover}
  <div
    bind:this={popoverEl}
    class="glossary-popover"
    style:left="{popover.x}px"
    style:top="{popover.y}px"
    onmouseenter={onPopoverEnter}
    onmouseleave={onPopoverLeave}
    role="tooltip"
  >
    <div class="popover-head">
      <span class="popover-term">{popover.canonical}</span>
      {#if popover.see.length}
        <span class="popover-aliases">see: {popover.see.join(' · ')}</span>
      {/if}
    </div>
    <div class="popover-body">{@html mdBlock(popover.body)}</div>
    <a class="popover-link" href="{base}/glossary#{popover.slug}">
      Open in glossary →
    </a>
  </div>
{/if}

<style>
  .root { display: contents; }
  @supports not (display: contents) { .root { display: block; } }

  .glossary-popover {
    position: fixed;
    z-index: 1000;
    width: 360px;
    max-width: calc(100vw - 24px);
    background: var(--bg);
    border: 1px solid var(--rule);
    box-shadow: 0 6px 24px rgba(20, 17, 13, 0.18);
    padding: 0.9rem 1.1rem 0.8rem;
    font-family: var(--serif);
    color: var(--ink);
    pointer-events: auto;
    animation: pop-in 120ms cubic-bezier(0.2, 0.9, 0.3, 1) both;
  }
  @keyframes pop-in {
    from { opacity: 0; transform: translateY(-4px); }
  }

  .popover-head {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    border-bottom: 1px dotted var(--rule);
    padding-bottom: 0.5rem;
    margin-bottom: 0.55rem;
  }
  .popover-term {
    font-style: italic;
    font-weight: 400;
    font-size: 1.05rem;
    color: var(--ink);
  }
  .popover-aliases {
    font-family: var(--sans);
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted);
  }

  .popover-body {
    font-weight: 300;
    font-size: 0.92rem;
    line-height: 1.5;
  }
  .popover-body :global(p) { margin: 0 0 0.5em; }
  .popover-body :global(p:last-child) { margin-bottom: 0; }
  .popover-body :global(strong) { font-weight: 500; }
  .popover-body :global(code) {
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.86em;
    background: rgba(20, 17, 13, 0.06);
    padding: 0.05rem 0.3rem;
    border-radius: 2px;
  }

  .popover-link {
    display: inline-block;
    margin-top: 0.7rem;
    font-family: var(--sans);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: var(--accent);
    border-bottom: 1px solid transparent;
    transition: border-bottom-color 160ms ease;
  }
  .popover-link:hover { border-bottom-color: var(--accent); }

  /* hide on touch-only devices; pure-mouse + DevTools-mobile keeps it usable */
  @media (hover: none) and (pointer: coarse) {
    .glossary-popover { display: none; }
  }
</style>
