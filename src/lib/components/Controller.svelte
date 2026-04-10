<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { getBg, getTerminal } from '$lib/utils/get-page-state.svelte'
  import { fly } from 'svelte/transition'
  import EmblaCarousel from 'embla-carousel'
  import Autoplay from 'embla-carousel-autoplay'
  import type { EmblaCarouselType } from 'embla-carousel'
  import type { Attachment } from 'svelte/attachments'
  import Icon from '$lib/components/Icon.svelte'
  import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
  import loop0 from '$lib/assets/click-to-open/loop0.webp'
  import loop1 from '$lib/assets/click-to-open/loop1.webp'
  import LoopImg from './LoopImg.svelte'
  import { createDrag } from '$lib/utils/use-drag.svelte'

  let currBg = $derived(siteconfig.profile.bg[getBg.index])
  let emblaApi: EmblaCarouselType | undefined

  // do embla-carousel init
  const updateIndex = () => {
    if (!emblaApi) return
    getBg.index = emblaApi.selectedScrollSnap()
  }

  const loadEmbla: Attachment<HTMLElement> = (element) => {
    emblaApi = EmblaCarousel(element, { loop: true }, [Autoplay({ delay: 15000 })])
    emblaApi.on('select', updateIndex)
    emblaApi.on('reInit', updateIndex)
    updateIndex()
    emblaApi.plugins().autoplay?.play()
    return () => {
      emblaApi?.destroy()
    }
  }

  const goToPrev = () => emblaApi?.scrollPrev()
  const goToNext = () => emblaApi?.scrollNext()

  const drag = createDrag()
</script>

<div
  class="controller_container"
  style:--offset-x="{drag.offsetX}px"
  style:--offset-y="{drag.offsetY}px"
>
  {#if getTerminal.isClosed === true}
    <div
      class="reopen_btn"
      role="none"
      onclick={() => (getTerminal.isClosed = false)}
      in:fly={{ y: 10, duration: 300 }}
    >
      <LoopImg
        imgs={[loop0, loop1]}
        alt="Click me to re-open main window"
        interval={1000}
        width="18rem"
        title="You found me!"
      />
    </div>
  {/if}

  <div class="controller_wrapper">
    <div class="controller_title" role="none" {@attach drag.doDrag}>
      Project: <br />
      {currBg.title}
    </div>

    <div class="embla__viewport" {@attach loadEmbla}>
      <div class="embla__container">
        {#each siteconfig.profile.bg as bg (bg.title)}
          <div class="embla__slide"><img src={bg.imgUrl} alt={bg.title} class="slide_img" /></div>
        {/each}
      </div>
    </div>

    <button class="nav_btn nav_left" onclick={goToPrev} aria-label="Previous Slide">
      <Icon icon={faAngleLeft} />
    </button>
    <button class="nav_btn nav_right" onclick={goToNext} aria-label="Next Slide">
      <Icon icon={faAngleRight} />
    </button>
  </div>
</div>

<style>
  .controller_wrapper {
    position: relative;
    width: calc(100lvw - 32px);
    height: 20rem;
    margin: 0 auto 1rem auto;
    border-radius: 0.375rem;
    z-index: 1;
    box-shadow:
      0 4px 8px -2px rgba(0, 0, 0, 0.4),
      0 15px 25px -5px rgba(0, 0, 0, 0.3),
      0 35px 50px -15px rgba(0, 0, 0, 0.2);
  }

  .controller_title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0.5rem 1.5rem;
    z-index: 10;
    font-size: 1rem;
    border-radius: 0.375rem 0.375rem 0 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.7) 50%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .nav_btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: transparent;
    border: none;
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
    position: relative;
    cursor: pointer;
    margin-bottom: -0.5rem;
    z-index: 2;
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
