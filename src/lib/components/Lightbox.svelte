<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { getBg } from '$lib/utils/get-page-state.svelte'
  import type { ProtfolioCollectionConfig } from '$lib/config/_loader'
  import PhotoSwipeLightbox from 'photoswipe/lightbox'
  import 'photoswipe/style.css'
  import Icon from '$lib/components/Icon.svelte'
  import { faExpand } from '@fortawesome/free-solid-svg-icons'

  interface Props {
    collection: ProtfolioCollectionConfig
  }

  interface WorkSlide {
    src: string
    width: number
    height: number
    alt: string
    title: string
    date?: string
    description?: string
  }

  let { collection }: Props = $props()
  let currTheme = $derived(siteconfig.profile.bg[getBg.index].theme)
  let slides = $derived<WorkSlide[]>(
    collection.item.map((work) => ({
      src: work.imgUrl,
      width: work.width,
      height: work.height,
      alt: work.description ? `${work.title} — ${work.description}` : work.title,
      title: work.title,
      date: work.date,
      description: work.description
    }))
  )
  let lightbox: PhotoSwipeLightbox | undefined

  $effect(() => {
    if (slides.length === 0) {
      return
    }

    const gallery = new PhotoSwipeLightbox({
      pswpModule: () => import('photoswipe'),
      dataSource: slides
    })
    lightbox = gallery

    gallery.on('uiRegister', () => {
      const pswp = gallery.pswp
      if (!pswp) {
        return
      }

      function renderCaption(el: HTMLElement) {
        const data = pswp?.currSlide?.data as WorkSlide | undefined
        el.replaceChildren()
        if (!data) {
          return
        }

        const title = document.createElement('p')
        title.className = 'pswp__custom-caption-title'
        title.textContent = data.title
        el.append(title)

        if (data.date) {
          const date = document.createElement('p')
          date.className = 'pswp__custom-caption-date'
          date.textContent = data.date
          el.append(date)
        }

        if (data.description) {
          const description = document.createElement('p')
          description.className = 'pswp__custom-caption-description'
          description.textContent = data.description
          el.append(description)
        }
      }

      pswp.ui?.registerElement({
        name: 'custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        onInit: (el) => {
          if (currTheme) {
            /* lift the raw artwork hex until it is readable on the dark caption */
            el.style.setProperty(
              '--pswp-caption-accent',
              `color-mix(in oklab, ${currTheme} 55%, #f3ede3 45%)`
            )
          }
          const updateCaption = () => renderCaption(el)
          updateCaption()
          pswp.on('change', updateCaption)
        }
      })
    })

    gallery.init()

    return () => {
      gallery.destroy()
      if (lightbox === gallery) {
        lightbox = undefined
      }
    }
  })
</script>

<div class="lightbox">
  {#if collection.item.length === 0}
    <p class="empty">No works in this collection yet.</p>
  {:else}
    <ul class="works">
      {#each collection.item as work, index (work.imgUrl + index)}
        <li class="work_item">
          <button
            type="button"
            class="work"
            title={work.title}
            onclick={() => lightbox?.loadAndOpen(index)}
          >
            <span class="media">
              <img
                src={work.imgUrl}
                width={work.width}
                height={work.height}
                alt={work.description ? `${work.title} — ${work.description}` : work.title}
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </span>
            <span class="info">
              <span class="name-row">
                <span class="name">{work.title}</span>
                <span class="expand" aria-hidden="true">
                  <Icon icon={faExpand} size="0.7rem" />
                </span>
              </span>
              {#if work.date}
                <span class="date">{work.date}</span>
              {/if}
              {#if work.description}
                <span class="desc">{work.description}</span>
              {/if}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .lightbox {
    min-width: 0;
  }

  .works {
    column-count: 1;
    column-gap: clamp(1rem, 2vw, 1.375rem);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .work_item {
    min-width: 0;
    margin: 0;
    padding: 0 0 clamp(1.125rem, 2.4vw, 1.75rem);
    break-inside: avoid;
  }

  .work {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--paper);
    font: inherit;
    text-align: left;
    cursor: zoom-in;
    appearance: none;
    -webkit-appearance: none;
  }

  .media {
    display: block;
    overflow: hidden;
    background-color: #0c0b0a;
  }

  .media img {
    display: block;
    width: 100%;
    height: auto;
    transition:
      filter 0.28s var(--ease),
      opacity 0.28s var(--ease);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding-top: 0.44rem;
    min-width: 0;
  }

  .name-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    min-width: 0;
  }

  .name {
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: -0.01em;
    overflow-wrap: anywhere;
  }

  .expand {
    display: inline-flex;
    flex-shrink: 0;
    color: var(--paper-mute);
    opacity: 0;
    transition:
      color 0.18s var(--ease),
      opacity 0.18s var(--ease);
  }

  .date {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.4;
    color: var(--paper-mute);
    font-variant-numeric: tabular-nums;
  }

  .desc {
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--paper-dim);
    overflow-wrap: anywhere;
  }

  .empty {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--paper-dim);
  }

  @media (min-width: 801px) {
    .works {
      column-count: 2;
    }
  }

  @media (hover: hover) {
    .work:hover .media img {
      filter: brightness(1.045);
    }

    .work:hover .name {
      text-decoration: underline;
      text-decoration-color: var(--accent);
      text-decoration-thickness: 1px;
      text-underline-offset: 4px;
    }

    .work:hover .expand {
      color: var(--accent);
      opacity: 1;
    }
  }

  .work:focus-visible {
    outline-offset: 6px;
  }

  .work:focus-visible .name {
    text-decoration: underline;
    text-decoration-color: var(--accent);
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }

  .work:focus-visible .expand {
    color: var(--accent);
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .media img,
    .expand {
      transition: none;
    }
  }

  :global(.pswp__custom-caption) {
    position: absolute;
    left: 50%;
    bottom: max(1rem, env(safe-area-inset-bottom));
    box-sizing: border-box;
    width: max-content;
    max-width: min(38rem, calc(100% - 2rem));
    padding: 0.8rem 1rem;
    transform: translateX(-50%);
    background-color: rgba(10, 9, 8, 0.84);
    color: var(--paper);
    font-family: var(--font-sans);
    text-align: left;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  :global(.pswp__custom-caption-title) {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  :global(.pswp__custom-caption-date) {
    margin: 0.3rem 0 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.01em;
    line-height: 1.4;
    color: var(--pswp-caption-accent, var(--paper-dim));
  }

  :global(.pswp__custom-caption-description) {
    margin: 0.3rem 0 0;
    font-size: 0.875rem;
    line-height: 1.55;
    color: var(--paper-dim);
  }
</style>
