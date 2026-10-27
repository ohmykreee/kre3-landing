<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { getTerminal } from '$lib/utils/get-page-state.svelte'
</script>

<footer class="footer" class:is-closed={getTerminal.isClosed}>
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
    max-width: 1360px;
    margin-inline: auto;
    padding: 0 var(--gutter) clamp(20px, 3vw, 32px);
  }

  .inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0 24px;
    padding-top: 6px;
    border-top: 1px solid var(--line);
    transition:
      background-color 0.25s var(--ease),
      padding 0.25s var(--ease);
  }

  .copy {
    margin: 0;
    padding-block: 6px;
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
    min-height: 44px;
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
  .footer.is-closed .inner {
    padding: 6px 12px;
    border-top-color: transparent;
    background-color: color-mix(in srgb, var(--ink) 78%, transparent);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }

  @media (min-width: 1200px) {
    .footer {
      padding-inline: clamp(24px, 3.4vw, 48px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .source {
      transition: none;
    }
  }
</style>
