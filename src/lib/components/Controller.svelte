<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { getBg, getTerminal } from '$lib/utils/get-page-state.svelte'
  import { flip } from 'svelte/animate'
  import { cubicOut } from 'svelte/easing'
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

  let currBg = $derived(siteconfig.profile.bg[getBg.index])
  const total = siteconfig.profile.bg.length
  let emblaApi: EmblaCarouselType | undefined

  const pad = (value: number) => String(value).padStart(2, '0')

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
      emblaApi = undefined
    }
  }

  const goToPrev = () => emblaApi?.scrollPrev()
  const goToNext = () => emblaApi?.scrollNext()
  const goToSlide = (index: number) => {
    emblaApi?.scrollTo(index)
    emblaApi?.plugins().autoplay?.reset()
  }

  const reopen = () => (getTerminal.isClosed = false)

  // The controller changes from the desktop rail to a corner card when the
  // workbench closes. Measure both layout states and slide between them instead
  // of letting the card teleport.
  let dockEl = $state<HTMLElement>()
  let flipFrom: DOMRect | null = null
  let lastClosed = getTerminal.isClosed
  let flipAnim: Animation | null = null

  $effect.pre(() => {
    const closed = getTerminal.isClosed
    if (closed === lastClosed) return
    lastClosed = closed
    flipFrom = dockEl?.getBoundingClientRect() ?? null
  })

  $effect(() => {
    const closed = getTerminal.isClosed
    if (!flipFrom || !dockEl) return
    // this runs after the DOM update; bail out if the class has not caught up
    if (closed !== dockEl.classList.contains('is-closed')) {
      flipFrom = null
      return
    }
    const from = flipFrom
    flipFrom = null
    flipAnim?.cancel()
    const to = dockEl.getBoundingClientRect()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const dx = from.left - to.left
    const dy = from.top - to.top
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return

    const config = flip(dockEl, { from, to }, { duration: 600, easing: cubicOut })
    const fromTransform =
      /transform:\s*([^;]+)/.exec(config.css?.(0, 1) ?? '')?.[1]?.trim() ?? 'none'
    const toTransform = /transform:\s*([^;]+)/.exec(config.css?.(1, 0) ?? '')?.[1]?.trim() ?? 'none'

    flipAnim = dockEl.animate([{ transform: fromTransform }, { transform: toTransform }], {
      duration: config.duration ?? 600,
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      fill: 'none'
    })
  })
</script>

<div class="dock" class:is-closed={getTerminal.isClosed} bind:this={dockEl}>
  {#if getTerminal.isClosed}
    <div class="recall" in:fly={{ y: 10, duration: 300 }}>
      <button
        type="button"
        class="recall-btn"
        onclick={reopen}
        aria-label="Re-open workbench"
        title="You found me!"
      >
        <LoopImg
          imgs={[loop0, loop1]}
          alt="Click me to re-open main window"
          interval={1000}
          width="100%"
        />
      </button>
    </div>
  {/if}

  <aside class="controller" aria-label="Now showing">
    <div class="head">
      <span class="eyebrow">Now showing</span>
      <span class="count">{pad(getBg.index + 1)} / {pad(total)}</span>
    </div>

    <div class="ln" role="group" aria-label="Choose artwork">
      {#each siteconfig.profile.bg as bg, index (bg.title)}
        <button
          type="button"
          class="ln-bar"
          class:active={index === getBg.index}
          aria-label={`Show ${bg.title}`}
          aria-current={index === getBg.index ? 'true' : undefined}
          onclick={() => goToSlide(index)}
        ></button>
      {/each}
    </div>

    <div class="frame">
      <div class="embla__viewport" {@attach loadEmbla}>
        <div class="embla__container">
          {#each siteconfig.profile.bg as bg (bg.title)}
            <div class="embla__slide">
              <img src={bg.imgUrl} alt={bg.title} class="slide_img" />
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="caption">
      <div class="caption-text">
        <p class="ctl-title" title={currBg.title}>{currBg.title}</p>
        {#if currBg.date}
          <p class="ctl-date">{currBg.date}</p>
        {/if}
      </div>
      <div class="btns">
        <button type="button" class="nav-btn" onclick={goToPrev} aria-label="Previous Slide">
          <Icon icon={faAngleLeft} />
        </button>
        <button type="button" class="nav-btn" onclick={goToNext} aria-label="Next Slide">
          <Icon icon={faAngleRight} />
        </button>
      </div>
    </div>
  </aside>
</div>

<style>
  .dock {
    width: 100%;
    min-width: 0;
    margin-top: clamp(20px, 3vw, 28px);
  }

  .controller {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-width: 0;
  }

  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 8px;
    user-select: none;
  }

  .eyebrow {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.3;
    color: var(--paper-dim);
    text-shadow: 0 1px 10px rgba(10, 9, 8, 0.7);
  }

  .count {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.3;
    color: var(--paper-mute);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    text-shadow: 0 1px 10px rgba(10, 9, 8, 0.7);
  }

  .ln {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 22px;
    margin: 0 0 9px;
  }

  .ln-bar {
    position: relative;
    width: 4px;
    height: 9px;
    padding: 0;
    border: 0;
    border-radius: 1px;
    background-color: var(--line-strong);
    opacity: 0.7;
    cursor: pointer;
    transition:
      height 0.16s var(--ease),
      background-color 0.16s var(--ease),
      opacity 0.16s var(--ease);
  }

  /* the bars are only 4px wide; widen the pointer target without moving them */
  .ln-bar::before {
    content: '';
    position: absolute;
    inset: -6px -3px;
  }

  .ln-bar:hover,
  .ln-bar:focus-visible {
    height: 12px;
    background-color: var(--paper-mute);
    opacity: 1;
  }

  .ln-bar.active {
    /* the selected tick matches the hovered tick height */
    height: 12px;
    background-color: var(--accent);
    opacity: 1;
    cursor: default;
  }

  .ln-bar.active:hover {
    height: 12px;
    background-color: var(--accent);
  }

  .frame {
    overflow: hidden;
    background-color: #0c0b0a;
  }

  .embla__viewport {
    overflow: hidden;
    width: 100%;
  }

  .embla__container {
    display: flex;
  }

  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  }

  .slide_img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    max-height: 320px;
    object-fit: cover;
    object-position: center;
  }

  .caption {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding-top: 8px;
    text-shadow: 0 1px 10px rgba(10, 9, 8, 0.7);
  }

  .caption-text {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .ctl-title {
    margin: 0;
    overflow: hidden;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.35;
    color: var(--paper);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ctl-date {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.4;
    color: var(--paper-mute);
  }

  .btns {
    display: flex;
    flex-shrink: 0;
    gap: 2px;
    margin: -9px -9px 0 0;
  }

  .nav-btn {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--paper-dim);
    cursor: pointer;
    transition: color 0.15s var(--ease);
  }

  .nav-btn:hover,
  .nav-btn:focus-visible {
    color: var(--paper);
  }

  .nav-btn:active {
    color: var(--accent);
  }

  /* in-flow controller on tablets and small laptops */
  @media (min-width: 760px) and (max-width: 1199px) {
    .dock {
      max-width: 640px;
    }

    .controller {
      grid-template-columns: 230px minmax(0, 1fr);
      grid-template-areas:
        'head head'
        'ln ln'
        'frame caption';
      column-gap: 20px;
      align-items: start;
    }

    .head {
      grid-area: head;
    }

    .ln {
      grid-area: ln;
    }

    .frame {
      grid-area: frame;
    }

    .caption {
      grid-area: caption;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding-top: 16px;
    }

    .btns {
      margin: 0;
    }
  }

  /* persistent rail on desktop */
  @media (min-width: 1200px) {
    .dock {
      position: sticky;
      top: 24px;
      width: 100%;
      margin: 0;
      padding-top: clamp(14px, 2.4vw, 24px);
      padding-left: 18px;
      border-left: 1px solid var(--line);
    }

    .controller {
      grid-template-areas:
        'head'
        'ln'
        'frame'
        'caption';
    }

    .head {
      grid-area: head;
    }

    .ln {
      grid-area: ln;
    }

    .frame {
      grid-area: frame;
    }

    .caption {
      grid-area: caption;
      padding-top: 8px;
    }
  }

  /* pure artwork mode: the controller is anchored to the viewport corner, not to
     the document. A long closing workbench must not drag it below the fold. */
  .dock.is-closed {
    position: fixed;
    top: auto;
    right: var(--gutter);
    bottom: calc(92px + clamp(16px, 4vh, 28px));
    z-index: 3;
    width: min(360px, calc(100vw - 2 * var(--gutter)));
    max-width: none;
    margin: 0;
    padding: 0;
    border-left: 0;
  }

  .dock.is-closed .controller {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'head'
      'ln'
      'frame'
      'caption';
    padding: 14px 16px 12px;
    background-color: color-mix(in srgb, var(--ink) 64%, transparent);
    -webkit-backdrop-filter: blur(12px) saturate(1.05);
    backdrop-filter: blur(12px) saturate(1.05);
    border-radius: 2px;
  }

  .dock.is-closed .frame {
    height: 0;
    overflow: hidden;
    visibility: hidden;
    opacity: 0;
  }

  .dock.is-closed .head {
    padding-bottom: 7px;
  }

  .dock.is-closed .caption {
    padding-top: 7px;
    border-top: 1px solid var(--line);
  }

  .recall {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin: 0 0 -8px;
    line-height: 0;
  }

  .recall-btn {
    width: min(18rem, 100%);
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: filter 0.2s var(--ease);
  }

  .recall-btn:hover,
  .recall-btn:focus-visible {
    filter: brightness(1.08);
  }

  .recall-btn :global(img) {
    display: block;
    width: 100%;
    aspect-ratio: 1203 / 481;
    object-fit: contain;
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-btn,
    .recall-btn {
      transition: none;
    }
  }
</style>
