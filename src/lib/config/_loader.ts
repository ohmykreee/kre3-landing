import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// Select available config file
const configs = import.meta.glob<Config>(
  ['/src/lib/config/example.ts', '/src/lib/config/default/default.ts'],
  {
    eager: true,
    import: 'default'
  }
)

export const siteconfig: Config =
  configs['/src/lib/config/default/default.ts'] || configs['/src/lib/config/example.ts']

// config types definitions
export interface Config {
  profile: ProfileConfig
  portfolio: ProtfolioCollectionConfig[]
  about: {
    title: string
    content: string
  }
  baseurl: string
  giscus?: GiscusConfig
}

export interface ProfileConfig {
  name: string
  avatar: string
  species: string
  email: string
  links: { icon: IconDefinition; name: string; url: string }[]
  props: string
  career: string
  bg: ArtworkInfo[]
}

export interface ProtfolioCollectionConfig {
  title: string
  description: string
  item: ArtworkInfo[]
}

export interface ArtworkInfo {
  title: string
  imgUrl: string
  width: number
  height: number
  description?: string
  date?: string
  theme?: string
}

export interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number'
  term?: string
  strict?: '1' | '0'
  reactionsEnabled?: '1' | '0'
  emitMetadata?: '0' | '1'
  inputPosition?: 'buttom' | 'top'
  theme?: string
  lang?: string
}
