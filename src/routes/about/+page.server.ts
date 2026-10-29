import { siteconfig } from '$lib/config/_loader'
import { parseArticleToc } from '$lib/components/Article.svelte'
import type { PageServerLoad } from './$types'

// Runs during prerender (see src/routes/+layout.ts). The parser is exported from
// Article.svelte itself; this server-only load is the only place that calls it,
// so heading ids and the table of contents are baked into the static HTML.
export const load: PageServerLoad = () => {
  const article = parseArticleToc(siteconfig.about.content)

  return {
    title: siteconfig.about.title,
    html: article.html,
    headings: article.headings,
    giscus: siteconfig.giscus
  }
}
