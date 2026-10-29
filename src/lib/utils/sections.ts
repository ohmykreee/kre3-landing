import type { Pathname } from '$app/types'

export interface Section {
  name: string
  route: Pathname
}

/** Single source of truth for the four workbench sections. */
export const sections: Section[] = [
  { name: 'Home', route: '/' },
  { name: 'Folio', route: '/folio' },
  { name: 'About', route: '/about' },
  { name: 'Pals', route: '/pals' }
]

export interface SectionMeta {
  index: number
  name: string
  route: Pathname
}

/** Resolve the section metadata for a pathname; unknown paths fall back to 404. */
export function sectionMeta(pathname: string): SectionMeta {
  const index = sections.findIndex((section) => section.route === pathname)
  if (index === -1) {
    return { index: -1, name: '404', route: pathname as Pathname }
  }
  return { index, ...sections[index] }
}
