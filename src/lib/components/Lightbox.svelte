<script lang="ts">
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
  let { collection }: Props = $props()
  let lightbox: PhotoSwipeLightbox | undefined
  let images: Image[] = $derived(
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
>
  <div>
    <img alt={collection.description} src={collection.item[0].imgUrl} />
    <p>{collection.title}</p>
  </div>
</button>

<style>
  @import '$lib/styles/_variable.css';

  .gallery {
    display: block;
    box-sizing: border-box;
    background: transparent;
    position: relative;
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    color: inherit;
    text-align: inherit;
    z-index: 2;
  }

  .gallery img {
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0.375rem;
    filter: drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08));
  }

  .gallery::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-image: var(--back-img-url);
    background-size: cover;
    border-radius: 0.375rem;
    transform-origin: 10% 50%;
    transition: transform 0.4s ease-out;
  }

  .gallery:hover::after {
    transform: rotate(2deg);
  }

  .gallery p {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 10;
    background: linear-gradient(to top, rgb(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    margin: 0;
    padding: 1rem;
    border-radius: 0 0 0.375rem 0.375rem;
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
