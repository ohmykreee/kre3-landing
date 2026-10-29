<script module lang="ts">
  export interface TocHeading {
    id: string
    text: string
  }

  interface ParsedArticle {
    html: string
    headings: TocHeading[]
  }

  const H3_PATTERN = /<h3\b([^>]*)>([\s\S]*?)<\/h3>/gi

  const NAMED_ENTITIES: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: '\u00a0'
  }

  function decodeEntities(value: string) {
    return value.replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]+);/gi, (entity, body: string) => {
      if (body.startsWith('#')) {
        const hex = body[1]?.toLowerCase() === 'x'
        const code = Number.parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10)
        if (!Number.isFinite(code)) return entity
        try {
          return String.fromCodePoint(code)
        } catch {
          return entity
        }
      }
      return NAMED_ENTITIES[body.toLowerCase()] ?? entity
    })
  }

  function slugify(text: string) {
    return text
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  function readId(attrs: string) {
    const match = /\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(attrs)
    return (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim()
  }

  /**
   * Prerender-only helper. It lives in the component module so the TOC logic
   * stays with the markup, but it is imported exclusively by
   * `routes/about/+page.server.ts`. It therefore runs once at build time and
   * never executes in the browser: the processed HTML and headings are
   * serialized into the static page data.
   */
  export function parseArticleToc(html: string): ParsedArticle {
    const matches = Array.from(html.matchAll(H3_PATTERN))
    if (matches.length === 0) return { html, headings: [] }

    const used: Record<string, true> = {}
    for (const match of matches) {
      const id = readId(match[1])
      if (id) used[id] = true
    }

    const headings: TocHeading[] = []
    const withIds = html.replace(H3_PATTERN, (full, attrs: string, inner: string) => {
      const text = decodeEntities(inner.replace(/<[^>]*>/g, ''))
        .replace(/\s+/g, ' ')
        .trim()
      if (!text) return full

      let id = readId(attrs)
      if (!id) {
        const base = slugify(text) || 'section'
        let candidate = base
        let suffix = 2
        while (used[candidate]) candidate = `${base}-${suffix++}`
        used[candidate] = true
        id = candidate
        attrs = `${attrs} id="${id}"`
      }

      headings.push({ id, text })
      return `<h3${attrs}>${inner}</h3>`
    })

    return { html: withIds, headings }
  }
</script>

<script lang="ts">
  export interface Props {
    title: string
    html: string
    headings?: TocHeading[]
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
      <nav class="toc" aria-label="Table of Contents">
        <p class="toc-label">Table of Contents</p>
        <ul class="toc-list">
          {#each headings as item, i (item.id)}
            <li>
              <a class="toc-link" href="#{item.id}">
                <div class="toc-id">[{String(i + 1).padStart(2, '0')}]</div>
                {item.text}
              </a>
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

  .toc {
    display: none;
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

    .toc-id {
      display: inline-block;
      width: 2rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.4;
      letter-spacing: 0.06em;
      color: var(--paper-mute);
      text-align: left;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .prose :global(a),
    .toc-link {
      transition: none;
    }
  }
</style>
