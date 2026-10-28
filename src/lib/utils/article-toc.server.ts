export interface TocHeading {
  id: string
  text: string
}

export interface ParsedArticle {
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
 * Build-time helper: bake stable ids into every h3 and return a flat index.
 * Runs inside +page.server.ts, so it executes once during prerender and never
 * ships to the browser.
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
