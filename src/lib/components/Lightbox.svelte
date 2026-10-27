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
            el.style.setProperty('--pswp-caption-accent', currTheme)
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

<div class="lightbox" style:--curr-theme-color={currTheme}>
  {#if collection.item.length === 0}
    <p class="empty_collection">No works in this collection yet.</p>
  {:else}
    <ul class="works">
      {#each collection.item as work, index (work.imgUrl + index)}
        <li class="work_item">
          <button
            type="button"
            class="work_card"
            title={work.title}
            onclick={() => lightbox?.loadAndOpen(index)}
          >
            <img
              class="work_image"
              src={work.imgUrl}
              width={work.width}
              height={work.height}
              alt={work.description ? `${work.title} — ${work.description}` : work.title}
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <span class="work_body">
              <span class="work_heading">
                <span class="work_index">{String(index + 1).padStart(2, '0')}</span>
                <span class="work_title">{work.title}</span>
                <span class="work_icon" aria-hidden="true">
                  <Icon icon={faExpand} size="0.7rem" />
                </span>
              </span>
              {#if work.date}
                <span class="work_date">{work.date}</span>
              {/if}
              {#if work.description}
                <span class="work_description">{work.description}</span>
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
    margin: 0;
    padding: 0;
    list-style: none;
    column-count: 1;
    column-gap: 0.75rem;
    min-width: 0;
  }

  .work_item {
    break-inside: avoid;
    min-width: 0;
    margin: 0 0 0.75rem;
  }

  .work_card {
    display: block;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
    border: 2px solid
      color-mix(in srgb, var(--curr-theme-color, var(--border-color)), transparent 72%);
    border-radius: 0.375rem;
    background-color: rgba(0, 0, 0, 0.28);
    color: var(--text-color);
    font: inherit;
    text-align: left;
    cursor: zoom-in;
    appearance: none;
    -webkit-appearance: none;
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background-color 0.18s ease;
  }

  .work_image {
    display: block;
    width: 100%;
    height: auto;
    background-color: rgba(255, 255, 255, 0.02);
  }

  .work_body {
    display: block;
    min-width: 0;
    padding: 0.5rem 0.625rem 0.625rem;
    border-top: 1px solid
      color-mix(in srgb, var(--curr-theme-color, var(--border-color)), transparent 86%);
  }

  .work_heading {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    min-width: 0;
  }

  .work_index {
    flex: 0 0 auto;
    font-size: 0.7rem;
    color: var(--curr-theme-color, var(--border-color));
  }

  .work_title {
    min-width: 0;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .work_icon {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    align-self: center;
    margin-left: auto;
    color: color-mix(in srgb, var(--text-color), transparent 40%);
  }

  .work_date {
    display: block;
    margin-top: 0.15rem;
    font-size: 0.7rem;
    line-height: 1.3;
    letter-spacing: 0.02em;
    color: color-mix(in srgb, var(--text-color), transparent 45%);
  }

  .work_description {
    display: -webkit-box;
    margin-top: 0.3rem;
    overflow: hidden;
    font-size: 0.75rem;
    line-height: 1.45;
    color: color-mix(in srgb, var(--text-color), transparent 28%);
    overflow-wrap: anywhere;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .empty_collection {
    margin: 0;
    padding: 0.75rem 1rem;
    border: 1px dashed
      color-mix(in srgb, var(--curr-theme-color, var(--border-color)), transparent 65%);
    border-radius: 0.375rem;
    background-color: rgba(0, 0, 0, 0.22);
    font-size: 0.8rem;
    line-height: 1.5;
    color: color-mix(in srgb, var(--text-color), transparent 28%);
  }

  @media (hover: hover) {
    .work_card:hover {
      transform: translateY(-2px);
      border-color: color-mix(
        in srgb,
        var(--curr-theme-color, var(--border-color)),
        transparent 40%
      );
      background-color: rgba(0, 0, 0, 0.4);
    }
  }

  .work_card:active {
    transform: none;
  }

  @media (min-width: 800px) {
    .works {
      column-count: 2;
      column-gap: 1rem;
    }

    .work_item {
      margin-bottom: 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .work_card {
      transition: none;
    }

    .work_card:hover {
      transform: none;
    }
  }

  :global(.pswp__custom-caption) {
    position: absolute;
    left: 50%;
    bottom: max(1rem, env(safe-area-inset-bottom));
    box-sizing: border-box;
    width: max-content;
    max-width: min(38rem, calc(100% - 2rem));
    padding: 0.5rem 1rem;
    transform: translateX(-50%);
    border: 1px solid
      color-mix(in srgb, var(--pswp-caption-accent, var(--border-color)), transparent 55%);
    border-radius: 0.375rem;
    background-color: rgba(0, 0, 0, 0.65);
    color: var(--text-color);
    text-align: center;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  :global(.pswp__custom-caption-title) {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.35;
  }

  :global(.pswp__custom-caption-date) {
    margin: 0.2rem 0 0;
    font-size: 0.72rem;
    line-height: 1.3;
    opacity: 0.72;
  }

  :global(.pswp__custom-caption-description) {
    margin: 0.25rem 0 0;
    font-size: 0.78rem;
    line-height: 1.45;
    opacity: 0.88;
    overflow-wrap: anywhere;
  }
</style>
