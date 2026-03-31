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
    /* 优化：flex-direction: row 是默认值，删除冗余 */
    width: 100%;
    height: 6.5rem;
    text-decoration: none;
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px var(--curr-border-color, var(--border-color));
    padding: 1rem;
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
    transition: transform 0.3s ease-out;
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
    margin-right: 1rem;
    /* 优化：删除 transform: scale(1) 和 opacity: 1，二者都是默认值，无需显式设置 */
    transform-origin: center left;
    transition:
      transform 0.4s ease-out,
      margin 0.4s ease-out,
      height 0.4s ease-out,
      opacity 0.3s ease-out;
  }
  .arrow {
    display: flex;
    /* 优化：删除 flex-direction: column，单个子元素垂直居中使用 align-items: center 更直观 */
    align-items: center;
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
    font-size: 1.25rem;
  }
  .description {
    font-size: 0.8rem;
    width: 100%;
    margin: 0.2rem 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    /* 优化：删除 box-orient: vertical，这是非标准属性且已被 -webkit-box-orient 覆盖 */
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    color: color-mix(in srgb, var(--text-color), black 30%);
  }
  @media (min-width: 800px) {
    .container {
      height: 5rem;
      padding: 0.5rem;
    }
    .avatar {
      margin-right: 0.5rem;
    }
    .name {
      font-size: 1rem;
    }
    .description {
      font-size: 0.75rem;
    }
  }
</style>
