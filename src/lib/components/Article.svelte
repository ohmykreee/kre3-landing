<script lang="ts">
  export interface Props {
    title: string
    html: string
  }

  let { title, html }: Props = $props()
</script>

<article class="article">
  <h1 class="title">{title}</h1>
  <div class="prose">
    {@html html}
  </div>
</article>

<style>
  .article {
    display: block;
    min-width: 0;
  }

  .title {
    margin: 0 0 clamp(20px, 3vw, 30px);
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 3.6vw, 3rem);
    font-weight: 650;
    line-height: 1.04;
    letter-spacing: -0.03em;
    color: var(--paper);
  }

  .prose {
    max-width: 34rem;
    font-size: 1.0625rem;
    line-height: 1.72;
    color: var(--paper);
  }

  .prose :global(p) {
    margin: 0 0 1.05em;
    text-wrap: pretty;
  }

  .prose :global(p:last-child) {
    margin-bottom: 0;
  }

  .prose :global(b),
  .prose :global(strong) {
    font-weight: 600;
    color: var(--paper);
  }

  .prose :global(h3) {
    margin: 2em 0 0.6em;
    font-family: var(--font-sans);
    font-size: 1.15rem;
    font-weight: 650;
    line-height: 1.3;
    letter-spacing: -0.02em;
    color: var(--paper);
  }

  .prose :global(h3:first-child) {
    margin-top: 0;
  }

  .prose :global(h3::before) {
    content: '>';
    margin-right: 0.55ch;
    font-family: var(--font-mono);
    font-size: 0.82em;
    font-weight: 400;
    color: var(--accent);
  }

  .prose :global(h4) {
    margin: 1.8em 0 0.45em;
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.45;
    color: var(--paper);
  }

  .prose :global(a) {
    color: var(--accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    transition: color 0.15s var(--ease);
  }

  .prose :global(a:hover),
  .prose :global(a:focus-visible) {
    color: var(--paper);
  }

  @media (prefers-reduced-motion: reduce) {
    .prose :global(a) {
      transition: none;
    }
  }
</style>
