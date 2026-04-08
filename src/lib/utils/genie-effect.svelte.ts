import { cubicInOut } from 'svelte/easing'

interface Props {
  duration: number
}

export function genie(node: Element, { duration }: Props) {
  return {
    duration,
    css: (t: number, u: number) => {
      const eased = cubicInOut(t)
      const ieased = cubicInOut(u)

      return `
          transform-origin: right bottom;
          opacity: ${eased};
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, ${ieased * 95}% 100%);
          transform: translate(
            calc(var(--offset-x, 0px) + ${ieased} * 150px),
            calc(var(--offset-y, 0px) + ${ieased} * 150px))
            scale(${eased});`
    }
  }
}
