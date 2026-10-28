<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { getTerminal } from '$lib/utils/get-page-state.svelte'

  // When the terminal closes the page collapses to just the artwork, so the
  // footer is re-anchored to the bottom edge by the layout in +layout.svelte.
  // That jump would be immediate and jarring, so measure the old position
  // before the DOM updates and FLIP it back into place afterwards.
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
    if (closed !== lastClosed || !flipFrom || !footerEl) return

    const from = flipFrom
    flipFrom = null

    // drop any in-flight flip first, so the measured target is the settled
    // layout rather than the previous animation's current transform
    flipAnim?.cancel()
    flipAnim = null

    const to = footerEl.getBoundingClientRect()
    const dx = from.left - to.left
    const dy = from.top - to.top

    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return

    flipAnim = footerEl.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
      {
        duration: 600,
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        fill: 'none'
      }
    )
  })
</script>

<footer class="footer" class:is-closed={getTerminal.isClosed} bind:this={footerEl}>
  <p>
    © 2021-{new Date().getFullYear()}
    {@html siteconfig.profile.name}. All rights reserved.
    <br />
    <a href="https://github.com/ohmykreee/kre3-landing" rel="noreferrer" target="_blank">
      Source Code
    </a>
  </p>
</footer>

<style>
  .footer {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 0 1rem;
    font-size: 0.75rem;
    text-align: center;
    color: var(--text-color);
  }

  /* translucent ink scrim, kept on its own layer so it can fade independently
     of the flip animation */
  .footer::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    backdrop-filter: brightness(0.8) blur(5px);
    -webkit-backdrop-filter: brightness(0.8) blur(5px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  .footer.is-closed {
    padding-block: 1rem;
  }

  .footer.is-closed::before {
    opacity: 1;
  }
</style>
