import { error } from '@sveltejs/kit'
import { siteconfig } from '$lib/config/_loader'
import type { EntryGenerator, PageServerLoad } from './$types'

// Every collection is a real, prerendered page: the archive links between them
// without relying on client-side state, so switching collections works with
// JavaScript disabled. This load only runs at build time (plus data requests
// for client-side navigation), never to construct the page in the browser.
export const entries: EntryGenerator = () => [
  {},
  ...siteconfig.portfolio.map((_, index) => ({ collection: String(index + 1) }))
]

export const load: PageServerLoad = ({ params }) => {
  if (params.collection === undefined) {
    return { activeIndex: 0 }
  }

  const collectionNumber = Number(params.collection)
  const activeIndex = collectionNumber - 1

  if (
    !Number.isInteger(collectionNumber) ||
    collectionNumber < 1 ||
    activeIndex >= siteconfig.portfolio.length
  ) {
    error(404, 'Collection not found')
  }

  return { activeIndex }
}
