<script lang='ts'>
  import { siteconfig } from "$lib/config/_loader"
  import { getBg, getTerminal } from "$lib/utils/get-page-state.svelte"
  import { fly } from "svelte/transition"
  import useEmblaCarousel from 'embla-carousel-svelte'
  import Autoplay from 'embla-carousel-autoplay'
  import type { EmblaCarouselType  } from 'embla-carousel'
  import Icon from "$lib/components/Icon.svelte"
  import { faAngleLeft, faAngleRight, faL } from "@fortawesome/free-solid-svg-icons"
  import clickToOpen from '$lib/assets/click-to-open.png'

  let currBg = $derived(siteconfig.profile.bg[getBg.index])
  let emblaApi :EmblaCarouselType | undefined
  let offsetX :number = $state(0)
  let offsetY :number = $state(0)
  const dragState :{startX: number, startY: number, initialX :number, initialY :number, isDrag :boolean} = {
    startX: 0, // startX, startY is used to calculate mouse move distance
    startY: 0,
    initialX: 0, // initialX, initialY is used to store last window offset
    initialY: 0,
    isDrag: false
  }

  // do embla-carousel init
  const updateIndex = () => {
    if (!emblaApi) return
    getBg.index = emblaApi.selectedScrollSnap()
  }

  const onInit = (event: CustomEvent<EmblaCarouselType>) => {
    emblaApi = event.detail
    emblaApi.on('select', updateIndex)
    emblaApi.on('reInit', updateIndex)
    updateIndex()
    emblaApi.plugins().autoplay?.play()
  }
  const goToPrev = () => emblaApi?.scrollPrev()
  const goToNext = () => emblaApi?.scrollNext()

  // do drag init
  function handlePointerDown(e :PointerEvent) {
    if (window.innerWidth > 800) {
      dragState.isDrag = true
      dragState.startX = e.clientX
      dragState.startY = e.clientY
      const target = e.target as HTMLElement
      target.setPointerCapture(e.pointerId)
    }
  }

  function handlePointerMove(e :PointerEvent) {
    if (!dragState.isDrag) return
    const dx = e.clientX - dragState.startX
    const dy = e.clientY - dragState.startY
    offsetX = dragState.initialX + dx
    offsetY = dragState.initialY + dy
  }

  function handlePointerUp(e :PointerEvent) {
    if (!dragState.isDrag) return
    dragState.isDrag = false
    dragState.initialX = $state.snapshot(offsetX)
    dragState.initialY = $state.snapshot(offsetY)
    const target = e.target as HTMLElement
    target.releasePointerCapture(e.pointerId)
  }
</script>

<div class="controller_container" style:--offset-x="{offsetX}px" style:--offset-y="{offsetY}px">
  {#if getTerminal.isClosed === true}
    <img src={clickToOpen} role="none" alt="Click me to re-open Terminal" class="reopen_btn" onclick={() => getTerminal.isClosed = false} transition:fly={{ y: 10, duration: 300 }} />
  {/if}

  <div class="controller_wrapper">
    <div class="controller_title" role="none" onpointerdown={handlePointerDown} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerUp}>
      Project: <br /> {currBg.title}
    </div>

    <div class="embla__viewport" use:useEmblaCarousel={{options: {loop: true}, plugins: [Autoplay({ delay: 15000 })]}} onemblaInit={onInit}>
      <div class="embla__container">
        {#each siteconfig.profile.bg as bg (bg.title)}
        <div class="embla__slide"><img src={bg.imgUrl} alt={bg.title} class="slide_img" /></div>
        {/each}
      </div>
    </div>

    <button class="nav_btn nav_left" onclick={goToPrev}><Icon icon={faAngleLeft} /></button>
    <button class="nav_btn nav_right" onclick={goToNext}><Icon icon={faAngleRight} /></button>
  </div>
</div>


<style>
	@import '$lib/styles/_variable.css';

  .controller_container {
    position: relative;
  }

  .controller_wrapper {
    width: calc(100vw - 32px);
		height: 20rem;
		margin-bottom: 1rem;
    margin-left: auto;
		margin-right: auto;
    border-radius: 0.375rem;
    filter: drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08));
  }

  .controller_title {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    padding: 1rem 1.5rem;
    z-index: 10;
    font-size: 1rem;
    border-radius: 0.375rem 0.375rem 0 0;
    background: linear-gradient(to bottom, rgb(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  }

  .nav_btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: transparent;
    border: none;
    font-size: 2rem;
    color: var(--text-color);
    cursor: pointer;
    padding: 1rem;
  }

  .nav_left {
    left: 0;
  }

  .nav_right {
    right: 0;
  }

  .embla__viewport {
    overflow: hidden;
    width: 100%;
    border-radius: 0.375rem;
  }

  .embla__container {
    display: flex;
  }

  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
    height: 20rem;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
  }

  .slide_img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .reopen_btn {
    width: 18rem;
    z-index: -10;
    cursor: pointer;
    margin-bottom: -10px;
  }

  @media (min-width: 800px) {
    .controller_container {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      transform: translate(var(--offset-x, 0px), var(--offset-y, 0px));
      z-index: 100;
    }

		.controller_wrapper {
      width: 18rem;
      height: 12rem;
		}

    .embla__slide {
      height: 12rem;
    }

    .controller_title {
      cursor: grab;
      user-select: none;
      touch-action: none;
    }

    .controller_title:active {
      cursor: grabbing;
    }
	}
</style>