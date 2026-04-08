import type { Attachment } from 'svelte/attachments'

export function createDrag() {
  let offsetX = $state(0)
  let offsetY = $state(0)

  const dragState = {
    startX: 0,
    startY: 0, // startX, startY is used to calculate mouse move distance
    initialX: 0,
    initialY: 0, // initialX, initialY is used to store last window offset
    isDrag: false
  }

  const doDrag: Attachment<HTMLElement> = (element) => {
    const controller = new AbortController()
    const { signal } = controller

    function handlePointerDown(e: PointerEvent) {
      if (window.innerWidth > 800) {
        dragState.isDrag = true
        dragState.startX = e.clientX
        dragState.startY = e.clientY
        const target = e.target as HTMLElement
        target.setPointerCapture(e.pointerId)
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!dragState.isDrag) return
      const dx = e.clientX - dragState.startX
      const dy = e.clientY - dragState.startY
      offsetX = dragState.initialX + dx
      offsetY = dragState.initialY + dy
    }

    function handlePointerUp(e: PointerEvent) {
      if (!dragState.isDrag) return
      dragState.isDrag = false
      dragState.initialX = $state.snapshot(offsetX)
      dragState.initialY = $state.snapshot(offsetY)
      const target = e.target as HTMLElement
      target.releasePointerCapture(e.pointerId)
    }

    element.addEventListener('pointerdown', handlePointerDown, { signal })
    element.addEventListener('pointermove', handlePointerMove, { signal })
    element.addEventListener('pointerup', handlePointerUp, { signal })
    element.addEventListener('pointercancel', handlePointerUp, { signal })

    return () => controller.abort()
  }

  return {
    get offsetX() {
      return offsetX
    },
    get offsetY() {
      return offsetY
    },
    doDrag
  }
}
