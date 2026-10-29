<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { getTerminal } from '$lib/utils/get-page-state.svelte'
  import { flip } from 'svelte/animate'
  import { cubicOut } from 'svelte/easing'

  // The footer changes between an in-flow strip and the artwork bottom bar. The
  // layout jump is unavoidable, so measure both positions and let the footer
  // glide while its padding/background morph via CSS.
  let footerEl = $state<HTMLElement>()
  let flipFrom: DOMRect | null = null
  let lastClosed = getTerminal.isClosed
  let flipAnim: Animation | null = null

  $effect.pre(() => {
    const closed = getTerminal.isClosed
    if (closed === lastClosed) return
    lastClosed = closed
    flipFrom = footerEl?.getBoundingClientRect() ?? null
  })

  $effect(() => {
    const closed = getTerminal.isClosed
    if (!flipFrom || !footerEl) return
    if (closed !== footerEl.classList.contains('is-closed')) {
      flipFrom = null
      return
    }
    const from = flipFrom
    flipFrom = null
    flipAnim?.cancel()
    const to = footerEl.getBoundingClientRect()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const dx = from.left - to.left
    const dy = from.top - to.top
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return

    const config = flip(footerEl, { from, to }, { duration: 600, easing: cubicOut })
    const fromTransform =
      /transform:\s*([^;]+)/.exec(config.css?.(0, 1) ?? '')?.[1]?.trim() ?? 'none'
    const toTransform = /transform:\s*([^;]+)/.exec(config.css?.(1, 0) ?? '')?.[1]?.trim() ?? 'none'

    flipAnim = footerEl.animate([{ transform: fromTransform }, { transform: toTransform }], {
      duration: config.duration ?? 600,
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      fill: 'none'
    })
  })
</script>

<footer class="footer" class:is-closed={getTerminal.isClosed} bind:this={footerEl}>
  <div class="inner">
    <p class="copy">
      © 2021-{new Date().getFullYear()}
      {@html siteconfig.profile.name}. All rights reserved.
    </p>
    <a
      class="source"
      href="https://github.com/ohmykreee/kre3-landing"
      rel="noreferrer"
      target="_blank"
    >
      Source Code
    </a>
  </div>
</footer>

<style>
  .footer {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 85rem;
    margin-inline: auto;
    padding: 0 var(--gutter) clamp(1.25rem, 3vw, 2rem);
    padding-top: clamp(1.5rem, 4vh, 2.25rem);
    transition: padding-top 0.6s var(--ease);
  }

  .inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0 1.5rem;
    padding-top: 0.375rem;
    border-top: 1px solid var(--line);
    transition:
      background-color 0.6s var(--ease),
      border-color 0.6s var(--ease),
      border-radius 0.6s var(--ease),
      padding 0.6s var(--ease),
      -webkit-backdrop-filter 0.6s var(--ease),
      backdrop-filter 0.6s var(--ease);
  }

  .copy {
    margin: 0;
    padding-block: 0.375rem;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.55;
    color: var(--paper-dim);
    text-shadow: 0 1px 9px rgba(10, 9, 8, 0.65);
  }

  .copy :global(sup) {
    font-size: 0.75em;
    vertical-align: super;
    color: var(--paper-dim);
  }

  .source {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.55;
    color: var(--paper);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-decoration-color: var(--line-strong);
    text-underline-offset: 3px;
    text-shadow: 0 1px 9px rgba(10, 9, 8, 0.65);
    transition:
      color 0.15s var(--ease),
      text-decoration-color 0.15s var(--ease);
  }

  .source:hover,
  .source:focus-visible {
    color: var(--paper);
    text-decoration-color: var(--accent);
  }

  /* pure artwork mode: keep the footer small, but give it a local ink strip
     instead of dimming the whole artwork again */
  .footer.is-closed {
    padding-top: 0;
  }

  .footer.is-closed .inner {
    padding: 0.375rem 0.75rem;
    border-top-color: transparent;
    border-radius: 0.125rem;
    background-color: color-mix(in srgb, var(--ink) 78%, transparent);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }

  @media (min-width: 801px) {
    .footer {
      padding-inline: clamp(1.5rem, 3.4vw, 3rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .source {
      transition: none;
    }
  }
</style>
