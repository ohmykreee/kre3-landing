import { siteconfig } from '$lib/config/_loader'

export interface getBg {
  index: number
  readonly maxIndex: number
}

export const getBg: getBg = $state({
  index: 0,
  maxIndex: siteconfig.profile.bg.length - 1
})

export interface getTerminal {
  isClosed: boolean
}

export const getTerminal: getTerminal = $state({
  isClosed: false
})
