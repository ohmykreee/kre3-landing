<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { getBg } from '$lib/utils/get-page-state.svelte'
  import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
  import Icon from './Icon.svelte'

  interface Props {
    name: string
    description: string
    url: string
    avatar: string
  }

  let currTheme: string | undefined = $derived(siteconfig.profile.bg[getBg.index].theme)
  let { name, description, url, avatar }: Props = $props()
</script>

<a
  href={url}
  rel="external"
  target="_blank"
  class="container"
  style:--curr-border-color={currTheme ?? 'initial'}
>
  <img src={avatar} alt={name + "'s avatar"} class="avatar" />
  <div class="info">
    <p class="name">{name}</p>
    <p class="description">{description}</p>
  </div>
  <div class="arrow"><Icon icon={faAngleRight} size="1rem" /></div>
</a>

<style>
  .container {
    display: flex;
    position: relative;
    overflow: hidden;
    flex-direction: row;
    aspect-ratio: 3 / 1;
    width: 100%;
    height: auto;
    text-decoration: none;
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px var(--curr-border-color, var(--border-color));
    padding: 0.5rem 0 0.5rem 0.5rem;
    box-sizing: border-box;
    z-index: 1;
  }
  .container::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: color-mix(in srgb, var(--curr-border-color, var(--border-color)), black 50%);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s ease-out;
  }
  .container:hover::before {
    transform: scaleX(1);
    transform-origin: right;
  }
  .container:hover .avatar {
    transform: scale(0);
    margin-right: 0;
    height: 0;
    opacity: 0;
  }
  .container:hover .arrow {
    visibility: visible;
  }
  .avatar {
    height: 100%;
    aspect-ratio: 1;
    width: auto;
    object-fit: cover;
    display: block;
    border-radius: 9999px;
    flex-shrink: 0;
    align-self: center;
    margin-right: 0.5rem;
    transform: scale(1);
    transform-origin: center left;
    opacity: 1;
    transition:
      transform 0.2s ease-out,
      margin 0.2s ease-out,
      height 0.2s ease-out,
      opacity 0.1s ease-out;
  }
  .arrow {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    visibility: hidden;
  }
  .info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
  }
  .name {
    margin: 0;
    width: 100%;
    font-size: 1rem;
  }
  .description {
    font-size: 0.75rem;
    width: 100%;
    margin: 0.25rem 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    color: color-mix(in srgb, var(--text-color), black 30%);
  }
</style>
