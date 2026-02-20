<script lang="ts">
  interface Props {
    imgs: string[]
    alt: string
    interval?: number
    width?: string
    height?: string
  }

  let { imgs, alt, interval = 1000, width, height }: Props = $props()
  let index: number = $state(0)
  let img: string = $derived(imgs[index])

  $effect(() => {
    let id: number
    let lastTimestamp: number | undefined

    const animate = (timestamp: number) => {
      if (lastTimestamp === undefined) {
        lastTimestamp = timestamp
      }

      if (timestamp - lastTimestamp >= interval) {
        index = (index + 1) % imgs.length
        lastTimestamp = timestamp - ((timestamp - lastTimestamp) % interval)
      }
      id = requestAnimationFrame(animate)
    }
    id = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(id)
    }
  })
</script>

<img src={img} {alt} style:width style:height />
