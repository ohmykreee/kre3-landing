<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { getBg } from '$lib/utils/get-page-state.svelte'
  import type { ProtfolioCollectionConfig } from '$lib/config/_loader'
  import PhotoSwipeLightbox from 'photoswipe/lightbox'
  import 'photoswipe/style.css'

  interface Props {
    collection: ProtfolioCollectionConfig
  }
  interface Image {
    src: string
    width: number
    height: number
    alt: string
  }
  let currTheme = $derived(siteconfig.profile.bg[getBg.index].theme)
  let { collection }: Props = $props()
  let lightbox: InstanceType<typeof PhotoSwipeLightbox> | undefined
  let images = $derived<Image[]>(
    collection.item.map((image) => ({
      src: image.imgUrl,
      width: image.width,
      height: image.height,
      alt: image.description ?? ''
    }))
  )

  $effect(() => {
    lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery--with-custom-caption',
      pswpModule: () => import('photoswipe'),
      dataSource: images
    })
    // implementation copyed from official example https://photoswipe.com/caption/
    lightbox.on('uiRegister', function () {
      lightbox?.pswp?.ui?.registerElement({
        name: 'custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: 'Caption text',
        onInit: (el, pswp) => {
          lightbox?.pswp?.on('change', () => {
            const currSlideData = pswp.currSlide?.data as Image | undefined
            el.innerHTML = currSlideData?.alt || ''
          })
        }
      })
    })
    lightbox.init()
    return () => {
      lightbox?.destroy()
      lightbox = undefined
    }
  })
</script>

<button
  class="gallery"
  onclick={(e) => {
    e.preventDefault()
    lightbox?.loadAndOpen(0)
  }}
  style:--back-img-url="url({collection.item[1].imgUrl})"
  style:--curr-theme-color={currTheme}
  title={collection.title}
  aria-label={`Collection name: ${collection.title}, description: ${collection.description}`}
>
  <div class="folder_back"></div>
  <div class="thumbnail_wrapper">
    <img class="thumbnail" alt={collection.description} src={collection.item[0].imgUrl} />
  </div>
  <div class="folder_front">
    <p class="p_title">{collection.title}</p>
    <p class="p_details" title={collection.description}>{collection.description}</p>
  </div>
</button>

<style>
  .gallery {
    display: block;
    box-sizing: border-box;
    background: transparent;
    position: relative;
    border: none;
    padding: 0;
    margin: 0;
    aspect-ratio: 3 / 2;
    height: auto;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    color: inherit;
    text-align: inherit;
    cursor: pointer;
    z-index: 1;
    transition: transform 0.1s ease-out;
  }

  .gallery:hover {
    transform: translateY(-1%);
  }

  .thumbnail_wrapper {
    position: relative;
    width: 90%;
    margin: 0 auto;
  }

  .thumbnail {
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
    width: 100%;
    height: auto;
    border: 0.25rem solid rgb(230, 230, 230);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin: -5% auto 0 auto;
    transition: transform 0.1s ease-out;
  }

  .thumbnail_wrapper::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: var(--back-img-url);
    background-size: cover;
    border: 0.25rem solid rgb(230, 230, 230);
    transform-origin: bottom right;
    transform: rotate(3deg);
    transition: transform 0.1s ease-out;
    z-index: -1;
  }

  .gallery:hover .thumbnail_wrapper::after {
    transform: rotate(8deg);
  }

  .gallery:hover .thumbnail {
    transform: translateY(-2%);
  }

  .folder_back {
    position: absolute;
    inset: 0;
    z-index: -2;
    border-radius: 0.5rem;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--curr-theme-color, var(--border-color)), black 50%),
      color-mix(in srgb, var(--curr-theme-color, var(--border-color)), black 55%)
    );
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  .folder_front {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40%;
    background-image: linear-gradient(
      135deg,
      color-mix(in srgb, var(--curr-theme-color, var(--border-color)), black 15%) 0%,
      color-mix(in srgb, var(--curr-theme-color, var(--border-color)), black 30%) 100%
    );
    filter: drop-shadow(0 -4px 8px rgba(0, 0, 0, 0.25));
    border-radius: 0.5rem;
    clip-path: polygon(0 0, 30% 0, 40% 20%, 100% 20%, 100% 100%, 0 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
  }

  .p_title {
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    overflow: hidden;
  }

  .p_details {
    font-size: 0.75rem;
    margin: 0.25rem 0 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: color-mix(in srgb, var(--text-color), black 30%);
  }

  :global(.pswp__custom-caption) {
    background: rgba(0, 0, 0, 0.6);
    font-size: 1rem;
    color: var(--text-color);
    padding: 0.5rem 2rem;
    border-radius: 0.375rem;
    position: absolute;
    left: 50%;
    bottom: 1rem;
    transform: translateX(-50%);
  }
</style>
