import { siteconfig } from '$lib/config/_loader'
import { parseArticleToc } from '$lib/utils/article-toc.server'
import type { PageServerLoad } from './$types'

// Runs during prerender (see src/routes/+layout.ts), so the heading ids and the
// table of contents are baked into the static HTML at build time.
export const load: PageServerLoad = () => {
  const article = parseArticleToc(siteconfig.about.content)

  return {
    title: siteconfig.about.title,
    html: article.html,
    headings: article.headings,
    giscus: siteconfig.giscus
  }
}
