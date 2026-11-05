import themeTemplateUrl from '$lib/styles/giscus-theme.css?url'

const TOKEN_PROPERTIES = {
  INK: '--ink',
  PANEL: '--panel',
  PAPER: '--paper',
  PAPER_MUTE: '--paper-mute',
  LINE: '--line',
  ACCENT: '--paper-dim',
  EASE: '--ease'
} as const

type TokenName = keyof typeof TOKEN_PROPERTIES

// Values from giscus' built-in GitHub Dark theme, used when a page token is
// unavailable (for example when the component is mounted outside the site).
const TOKEN_FALLBACKS: Record<TokenName, string> = {
  INK: '#0d1117',
  PANEL: '#161b22',
  PAPER: '#e6edf3',
  PAPER_MUTE: '#7d8590',
  LINE: 'rgba(240, 246, 252, 0.1)',
  ACCENT: '#c9d1d9',
  EASE: 'cubic-bezier(0.22, 0.61, 0.36, 1)'
}

function toBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  }

  return btoa(binary)
}

function compactToken(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',')
    .trim()
}

/**
 * Builds the giscus custom theme from the page's CSS custom properties.
 *
 * giscus renders in a cross-origin iframe, so a plain `?url` stylesheet cannot
 * see the parent page's variables (and giscus requests theme links in CORS
 * mode). The stylesheet URL is still used as the single source of truth: it is
 * fetched, the live token values are substituted, and the result is passed as
 * a `data:` URL via `data-theme`.
 */
export async function buildGiscusThemeUrl(fallback: string): Promise<string> {
  if (typeof window === 'undefined') return fallback

  try {
    // `?direct` keeps Vite from returning the JS-wrapped CSS module in dev;
    // static hosts simply ignore the query string for the built asset.
    const response = await fetch(`${themeTemplateUrl}?direct`)
    if (!response.ok) return fallback

    // The `?url` import still goes through Vite's CSS pipeline, so this is
    // already minified by cssnano in the production build.
    const template = (await response.text()).trim()
    if (!template.includes('__INK__')) return fallback

    // Only read the fixed root tokens. `--theme` and variables derived from it
    // (such as the old --accent) change with the artwork carousel.
    const computed = getComputedStyle(document.documentElement)
    const tokens = {} as Record<TokenName, string>

    for (const [token, property] of Object.entries(TOKEN_PROPERTIES) as [TokenName, string][]) {
      tokens[token] = compactToken(computed.getPropertyValue(property)) || TOKEN_FALLBACKS[token]
    }

    const css = template.replace(/__([A-Z_]+)__/g, (placeholder, token: TokenName) => {
      return tokens[token] ?? placeholder
    })

    return `data:text/css;charset=utf-8;base64,${toBase64(css)}`
  } catch {
    return fallback
  }
}
