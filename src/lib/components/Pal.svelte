<script lang="ts">
  import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
  import Icon from '$lib/components/Icon.svelte'

  interface Props {
    name: string
    description: string
    url: string
    avatar: string
  }

  let { name, description, url, avatar }: Props = $props()
</script>

<a href={url} rel="external" target="_blank" class="pal" title={name}>
  <img
    src={avatar}
    alt={name + "'s home page"}
    class="avatar"
    width="40"
    height="40"
    loading="lazy"
    decoding="async"
  />

  <span class="text">
    <span class="name">{name}</span>
    <span class="desc">{description}</span>
  </span>

  <span class="arrow" aria-hidden="true"><Icon icon={faAngleRight} size="0.7rem" /></span>
</a>

<style>
  .pal {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 4rem;
    margin-inline: -0.5rem;
    padding: 0.5rem;
    color: inherit;
    text-decoration: none;
    isolation: isolate;
  }

  .pal::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: color-mix(in srgb, var(--accent) 7%, transparent);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.22s var(--ease);
  }

  .avatar {
    width: 2.75rem;
    height: 2.75rem;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
    background-color: color-mix(in srgb, var(--paper) 8%, transparent);
    box-shadow: 0 0 0 1px var(--line);
    transition: box-shadow 0.18s var(--ease);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  .name {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: -0.005em;
    color: var(--paper);
    overflow-wrap: anywhere;
  }

  .desc {
    display: -webkit-box;
    overflow: hidden;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    line-height: 1.45;
    color: var(--paper-dim);
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .arrow {
    display: inline-flex;
    flex-shrink: 0;
    margin-left: auto;
    color: var(--paper-mute);
    opacity: 0.4;
    transition:
      color 0.18s var(--ease),
      opacity 0.18s var(--ease),
      transform 0.18s var(--ease);
  }

  .pal:hover::before,
  .pal:focus-visible::before {
    transform: scaleX(1);
  }

  .pal:hover .avatar,
  .pal:focus-visible .avatar {
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent);
  }

  .pal:hover .name,
  .pal:focus-visible .name {
    text-decoration: underline;
    text-decoration-color: var(--accent);
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .pal:hover .arrow,
  .pal:focus-visible .arrow {
    color: var(--accent);
    opacity: 1;
    transform: translateX(0.125rem);
  }

  @media (prefers-reduced-motion: reduce) {
    .pal::before,
    .avatar,
    .arrow {
      transition: none;
    }

    .pal:hover .arrow {
      transform: none;
    }
  }
</style>
