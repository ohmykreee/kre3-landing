<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { fade } from 'svelte/transition'
  import { Tween } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { getBg, getTerminal } from '$lib/utils/get-page-state.svelte'

  import ogimage from '$lib/assets/cover.jpg'
  // import '@fontsource-variable/ubuntu-sans-mono/wght'
  // import PreloadWoff2 from '@fontsource-variable/ubuntu-sans-mono/files/ubuntu-sans-mono-latin-wght-normal.woff2?url'
  import '@fontsource-variable/jetbrains-mono/wght'
  import PreloadWoff2 from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url'

  import Terminal from '$lib/components/Terminal.svelte'
  import Footer from '$lib/components/Footer.svelte'

  let { children } = $props()
  let currBg = $derived(siteconfig.profile.bg[getBg.index])

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
  <link rel="preload" as="font" type="font/woff2" href={PreloadWoff2} crossorigin="anonymous" />
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
<Terminal {children} />
<Footer />

<style>
  @import '$lib/styles/_variable.css';

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    display: flow-root;
    font-family: 'JetBrains Mono Variable', sans-serif;
    color: var(--text-color);
    overflow-x: hidden;
    padding: 0;
    margin: 0;
    background-color: var(--bg-color);
    min-height: 100lvh;
    scroll-behavior: smooth;
  }

  :global(a) {
    color: inherit;
    text-decoration: underline;
  }

  :global(input, select, textarea, button) {
    font-family: inherit;
    color: inherit;
  }

  .bg {
    position: fixed;
    inset: -3%;
    background-image: var(--curr-bg-url);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    z-index: -100;
    filter: brightness(0.5) blur(5px);
    transform: translate(var(--offset-x, 0), var(--offset-y, 0));
    transition: filter 0.3s ease;
  }

  .bg.nodim {
    filter: brightness(1) blur(0);
  }
</style>
