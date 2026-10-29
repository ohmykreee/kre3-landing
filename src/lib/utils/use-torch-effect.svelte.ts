import type { Attachment } from 'svelte/attachments'

// Elements that host their own browsing context swallow pointer events, so
// moving into one loses the pointer just like leaving the window does.
const nestedContextTags = new Set(['IFRAME', 'FRAME', 'OBJECT', 'EMBED'])

function isNestedContext(target: EventTarget | null) {
  return target instanceof Element && nestedContextTags.has(target.tagName)
}

/**
 * Pointer position for the workbench's "torch" border.
 *
 * The position lives in `$state` (like `createDrag`) instead of inside the
 * attachment, so a keyed copy of the torch layer can be destroyed and recreated
 * without losing the beam. The returned attachment only feeds the state; the
 * component publishes it as CSS variables on the visual layer.
 */
export function createTorch() {
  // pointer position relative to the attached element, in CSS pixels
  let x = $state(0)
  let y = $state(0)
  // whether the pointer is currently tracked; drives the light's opacity
  let active = $state(false)

  const track: Attachment<HTMLElement> = (node) => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const controller = new AbortController()
    const { signal } = controller
    let frame = 0
    let pointerX = 0
    let pointerY = 0

    function paint() {
      frame = 0
      const { left, top } = node.getBoundingClientRect()
      x = pointerX - left
      y = pointerY - top
      active = true
    }

    function schedule() {
      frame ||= requestAnimationFrame(paint)
    }

    // A lost pointer must kill the light immediately: fading out would leave a
    // frozen torch glowing at the last known spot for a few frames.
    function hide() {
      active = false
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    function handlePointerMove(event: PointerEvent) {
      // touch pointers have no hover state, keep the border hidden there
      if (event.pointerType === 'touch') return
      // Chrome can still deliver the crossing move with the embedded element as
      // its target right after the pointerout that cut the light. Re-arming
      // here would make the torch disappear and immediately come back.
      if (isNestedContext(event.target)) {
        hide()
        return
      }
      pointerX = event.clientX
      pointerY = event.clientY
      schedule()
    }

    function handlePointerOver(event: PointerEvent) {
      if (isNestedContext(event.target)) hide()
    }

    // Mirrors the background parallax reset in +layout.svelte: a pointerout
    // without a relatedTarget means the pointer left the document. Entering an
    // embedded frame also has to cut the light, since its events stop there.
    function handlePointerOut(event: PointerEvent) {
      if (!event.relatedTarget || isNestedContext(event.relatedTarget)) hide()
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') hide()
    }

    // a stationary pointer still needs the beam to follow the workbench when
    // the page scrolls, resizes, or the workbench is dragged
    function handleViewportChange() {
      if (active) schedule()
    }

    window.addEventListener('pointermove', handlePointerMove, { signal, passive: true })
    window.addEventListener('pointerover', handlePointerOver, { signal, passive: true })
    window.addEventListener('pointerout', handlePointerOut, { signal })
    window.addEventListener('scroll', handleViewportChange, {
      signal,
      passive: true,
      capture: true
    })
    window.addEventListener('resize', handleViewportChange, { signal })
    window.addEventListener('blur', hide, { signal })
    document.addEventListener('visibilitychange', handleVisibilityChange, { signal })

    return () => {
      controller.abort()
      if (frame) cancelAnimationFrame(frame)
      active = false
    }
  }

  return {
    get x() {
      return x
    },
    get y() {
      return y
    },
    get active() {
      return active
    },
    track
  }
}
