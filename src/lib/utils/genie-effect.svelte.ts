import { cubicInOut } from 'svelte/easing'

interface Props {
  duration: number
  length?: number
}

export function genie(node: Element, { duration, length = 150 }: Props) {
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
            calc(var(--offset-x, 0px) + ${ieased} * ${length}px),
            calc(var(--offset-y, 0px) + ${ieased} * ${length}px))
            scale(${eased});`
    }
  }
}

// If you want to let Terminal fly to the corner of the window:
// transform: translate(calc(var(--offset-x, 0px) + ${ieased} * (50dvw - var(--offset-x, 0px) + 392px)), calc(var(--offset-y, 0px) + ${ieased}*( 75dvh - var(--offset-y, 0px) ))) scale(${eased});
