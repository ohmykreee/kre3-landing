<script lang="ts">
  import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
  import Icon from './Icon.svelte'

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
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 60px;
    padding: 8px 0;
    color: inherit;
    text-decoration: none;
  }

  .avatar {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
    background-color: color-mix(in srgb, var(--paper) 8%, transparent);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .name {
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.35;
    color: var(--paper);
    overflow-wrap: anywhere;
  }

  .desc {
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.8125rem;
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
    transform: translateX(2px);
  }

  @media (prefers-reduced-motion: reduce) {
    .arrow {
      transition: none;
    }

    .pal:hover .arrow {
      transform: none;
    }
  }
</style>
