<script lang="ts">
  import '$lib/styles/_variable.css'
  import '@fontsource-variable/jetbrains-mono/wght'
  import '@fontsource-variable/space-grotesk/wght'

  import { siteconfig } from '$lib/config/_loader'
  import { fade } from 'svelte/transition'
  import { Tween } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { getBg, getTerminal } from '$lib/utils/get-page-state.svelte'

  import ogimage from '$lib/assets/cover.jpg'
  import PreloadMono from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url'
  import PreloadDisplay from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2?url'

  import Terminal from '$lib/components/Terminal.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import Controller from '$lib/components/Controller.svelte'

  let { children } = $props()
  let currBg = $derived(siteconfig.profile.bg[getBg.index])
  let currTheme = $derived(currBg.theme)

  const TweenConfig = {
    duration: 400,
    easing: cubicOut
  }
  let offsetX = new Tween(0, TweenConfig)
  let offsetY = new Tween(0, TweenConfig)

  const screenCenter = { x: 0, y: 0 }
  function updateScreenCenter() {
    screenCenter.x = window.innerWidth / 2
    screenCenter.y = window.innerHeight / 2
  }
  function calcOffsetByMouse(e: MouseEvent) {
    const x = (e.clientX - screenCenter.x) / screenCenter.x
    const y = (e.clientY - screenCenter.y) / screenCenter.y
    offsetX.target = Number(x.toFixed(3))
    offsetY.target = Number(y.toFixed(3))
  }
  function calcOffsetByOrientation(e: DeviceOrientationEvent) {
    // By calculate 3D vector projection to solve gimbal lock
    const rad = Math.PI / 180
    const beta = e.beta ?? 0
    const gamma = e.gamma ?? 0
    const tiltX = Math.cos(beta * rad) * Math.sin(gamma * rad)
    const tiltY = Math.sin(beta * rad)

    const x = Math.max(-1, Math.min(1, tiltX / 0.5)) * 3
    const y = Math.max(-1, Math.min(1, (tiltY - 0.16) / 0.66)) * 3

    offsetX.target = Number(x.toFixed(3))
    offsetY.target = Number(y.toFixed(3))
  }
  function resetOffset(e: MouseEvent) {
    if (!e.relatedTarget) {
      offsetX.target = 0
      offsetY.target = 0
    }
  }

  $effect(() => {
    const controller = new AbortController()
    const { signal } = controller

    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('resize', updateScreenCenter, { signal })
      updateScreenCenter()
      window.addEventListener('mousemove', calcOffsetByMouse, { signal })
      window.addEventListener('mouseout', resetOffset, { signal })
    } else {
      window.addEventListener('deviceorientation', calcOffsetByOrientation, { signal })
    }

    return () => {
      controller.abort()
    }
  })
</script>

<svelte:head>
  <link rel="preload" as="font" type="font/woff2" href={PreloadMono} crossorigin="anonymous" />
  <link rel="preload" as="font" type="font/woff2" href={PreloadDisplay} crossorigin="anonymous" />
  <meta
    name="description"
    content="Here is Kreee, a freelance artist and hobbyist frontend developer dedicated to merging artistic sensibility with technical rationality. Explore my latest works and get in touch."
  />
  <link rel="canonical" href={siteconfig.baseurl} />
  <meta property="og:title" content="TurboKre - Turbo Energy Canine" />
  <meta
    property="og:description"
    content="Discover a portfolio that blends creative soul with logical craft. View my latest artistic projects and creative coding works."
  />
  <meta property="og:image" content={ogimage} />
  <meta property="og:type" content="website" />
</svelte:head>

{#key currBg.title}
  <div
    class={['bg', getTerminal.isClosed ? 'nodim' : '']}
    style:--curr-bg-url="url({currBg.imgUrl})"
    transition:fade
    style:--offset-x="{offsetX.current}%"
    style:--offset-y="{offsetY.current}%"
  ></div>
{/key}

<main class="stage theme-scope" class:is-closed={getTerminal.isClosed} style:--theme={currTheme}>
  <Terminal {children} />
  <Controller />
</main>

<Footer />

<style>
  .bg {
    position: fixed;
    inset: -3%;
    z-index: -1;
    background-image: var(--curr-bg-url);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transform: translate(var(--offset-x, 0%), var(--offset-y, 0%));
  }

  /* The graphite workspace already holds the reading column, so the scrim can
     stay light and let the artwork live around it. */
  .bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        90deg,
        rgba(10, 9, 8, 0.52) 0%,
        rgba(10, 9, 8, 0.48) 38%,
        rgba(10, 9, 8, 0.36) 70%,
        rgba(10, 9, 8, 0.26) 100%
      ),
      linear-gradient(
        180deg,
        rgba(10, 9, 8, 0.48) 0%,
        rgba(10, 9, 8, 0.28) 18%,
        rgba(10, 9, 8, 0.32) 68%,
        rgba(10, 9, 8, 0.54) 100%
      ),
      rgba(10, 9, 8, 0.28);
    transition: opacity 0.5s var(--ease);
  }

  .bg.nodim::after {
    opacity: 0;
  }

  .stage {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1320px;
    margin-inline: auto;
    padding: clamp(16px, 2.8vh, 24px) var(--gutter) 0;
  }

  /* pure artwork mode: no dim, no page chrome — just the controller over the art.
     The grid geometry itself must not change here: the closing workbench is still
     in flow while its genie transition runs, so a layout swap would teleport it.
     A definite height (instead of min-height) keeps the footer anchored to the
     viewport even when the closing workbench is taller than the screen. */
  .stage.is-closed {
    height: calc(100lvh - 92px);
    min-height: 0;
  }

  /* compact main workspace + persistent "now showing" rail */
  @media (min-width: 1200px) {
    .stage {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 280px;
      column-gap: clamp(24px, 2.4vw, 32px);
      align-items: start;
      max-width: 1360px;
      padding-inline: clamp(24px, 3.4vw, 48px);
    }
  }
</style>
