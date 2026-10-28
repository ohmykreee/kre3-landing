<script lang="ts">
  interface TocItem {
    id: string
    text: string
  }

  export interface Props {
    title: string
    html: string
    headings?: TocItem[]
  }

  let { title, html, headings = [] }: Props = $props()
</script>

<article class="article">
  <h1 class="title">{title}</h1>

  <div class="body">
    <div class="prose">
      {@html html}
    </div>

    {#if headings.length > 0}
      <nav class="toc" aria-label="On this page">
        <p class="toc-label">On this page</p>
        <ul class="toc-list">
          {#each headings as item (item.id)}
            <li>
              <a class="toc-link" href="#{item.id}">{item.text}</a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
  </div>
</article>

<style>
  .article {
    display: block;
    min-width: 0;
  }

  .title {
    margin: 0 0 clamp(1.25rem, 3vw, 1.875rem);
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 3.6vw, 3rem);
    font-weight: 650;
    line-height: 1.04;
    letter-spacing: -0.03em;
    color: var(--paper);
  }

  .body {
    display: block;
    min-width: 0;
  }

  .prose {
    max-width: 34rem;
    font-size: 1.05rem;
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
    scroll-margin-top: 1.5rem;
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

  /* Mobile first: the index is a desktop affordance only. */
  .toc {
    display: none;
  }

  .toc-label {
    margin: 0 0 0.625rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: 0.06em;
    color: var(--paper-mute);
    text-transform: uppercase;
  }

  .toc-list {
    display: grid;
    gap: 0.375rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .toc-link {
    display: block;
    font-size: 0.875rem;
    line-height: 1.45;
    color: var(--paper-dim);
    overflow-wrap: anywhere;
    transition: color 0.15s var(--ease);
  }

  .toc-link:hover,
  .toc-link:focus-visible {
    color: var(--accent);
  }

  @media (min-width: 801px) {
    .body {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 10rem;
      column-gap: 2rem;
      align-items: start;
    }

    .toc {
      position: sticky;
      top: 1.5rem;
      display: block;
      padding-left: 1rem;
      border-left: 1px solid var(--line);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .prose :global(a),
    .toc-link {
      transition: none;
    }
  }
</style>
