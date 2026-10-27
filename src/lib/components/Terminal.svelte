<script lang="ts">
  import { page } from '$app/state'
  import { resolve } from '$app/paths'
  import type { Snippet } from 'svelte'

  import { genie } from '$lib/utils/genie-effect.svelte'
  import { createDrag } from '$lib/utils/use-drag.svelte'
  import { getTerminal } from '$lib/utils/get-page-state.svelte'
  import { sectionMeta, sections } from '$lib/utils/sections'
  import { siteconfig } from '$lib/config/_loader'

  interface Props {
    children: Snippet<[]>
  }

  let { children }: Props = $props()

  const drag = createDrag()
  const current = $derived(sectionMeta(page.url.pathname))
  const brand = $derived(siteconfig.profile.name.replace(/\s*\([^)]*\)\s*$/, '').trim())
  const routePath = $derived(current.route === '/' ? '~' : `~${current.route}`)

  // closing is a desktop affordance, on the same boundary as createDrag
  function doCloseTerminal() {
    if (window.innerWidth > 800) {
      getTerminal.isClosed = true
    }
  }
</script>

<svelte:head>
  <title>{current.name} | Turbo Energy Canine</title>
</svelte:head>

{#if !getTerminal.isClosed}
  <div
    class="workbench"
    style:--offset-x="{drag.offsetX}px"
    style:--offset-y="{drag.offsetY}px"
    transition:genie={{ duration: 600 }}
  >
    <header class="masthead">
      <div class="titlebar-drag" {@attach drag.doDrag} title="Drag to move">
        <span class="wordmark">{brand}</span>
        <span class="route-path" aria-hidden="true">{routePath}</span>
      </div>

      <nav class="nav" aria-label="Sections">
        {#each sections as tab (tab.name)}
          {@const active = page.url.pathname === tab.route}
          <a href={resolve(tab.route)} class="nav-link" aria-current={active ? 'page' : undefined}>
            {tab.name}
          </a>
        {/each}
        {#if current.index === -1}
          <span class="nav-link" aria-current="page">404</span>
        {/if}
      </nav>

      <button
        class="close"
        type="button"
        onclick={doCloseTerminal}
        aria-label="Close workbench"
        title="Close workbench"
      >
        <span class="close-dot" aria-hidden="true"></span>
      </button>
    </header>

    <div class="content">
      {@render children?.()}
    </div>
  </div>
{/if}

<style>
  .workbench {
    --pad-x: clamp(14px, 2.8vw, 32px);
    --pad-y: clamp(12px, 2.2vw, 18px);

    position: relative;
    z-index: 999;
    min-width: 0;
    padding: 0 var(--pad-x) clamp(24px, 3.2vw, 36px);
    background-color: color-mix(in srgb, var(--panel) 95%, transparent);
  }

  /* OS titlebar: real route path, draggable surface, red close dot */
  .masthead {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 20px;
    margin: 0 calc(-1 * var(--pad-x));
    padding: var(--pad-y) var(--pad-x) 10px;
    background-color: rgba(11, 10, 9, 0.34);
    background-color: color-mix(in srgb, var(--ink) 34%, transparent);
  }

  /* solid accent judgement line instead of a segmented hairline */
  .masthead::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background-color: var(--accent);
  }

  .titlebar-drag {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: 12px;
    min-width: 0;
    min-height: 44px;
  }

  .wordmark {
    flex-shrink: 0;
    font-family: var(--font-display);
    font-size: 1.0625rem;
    font-weight: 650;
    line-height: 1;
    letter-spacing: -0.025em;
    color: var(--paper);
    white-space: nowrap;
  }

  .route-path {
    overflow: hidden;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.2;
    color: var(--term-path);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nav {
    order: 3;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 clamp(16px, 3vw, 24px);
    width: 100%;
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 1px;
    color: var(--paper-dim);
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 450;
    line-height: 1;
    white-space: nowrap;
    transition: color 0.16s var(--ease);
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    top: calc(50% + 0.6em);
    width: 0.9rem;
    height: 1px;
    background-color: var(--paper-mute);
    transform: scaleX(0);
    transform-origin: left center;
    transition:
      transform 0.18s var(--ease),
      background-color 0.18s var(--ease);
  }

  .nav-link:hover,
  .nav-link:focus-visible {
    color: var(--paper);
  }

  .nav-link:hover::after,
  .nav-link:focus-visible::after {
    transform: scaleX(1);
  }

  .nav-link[aria-current='page'] {
    color: var(--paper);
  }

  .nav-link[aria-current='page']::after {
    background-color: var(--accent);
    transform: scaleX(1);
  }

  .close {
    display: none;
  }

  .close-dot {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--close);
    box-shadow: 0 0 0 1px rgba(10, 9, 8, 0.25);
    transition:
      box-shadow 0.15s var(--ease),
      transform 0.15s var(--ease);
  }

  .content {
    padding-top: clamp(20px, 2.8vw, 30px);
  }

  @media (min-width: 560px) {
    .nav {
      order: 0;
      width: auto;
      margin-left: auto;
    }
  }

  @media (min-width: 801px) {
    .workbench {
      transform: translate(var(--offset-x, 0px), var(--offset-y, 0px));
    }

    .titlebar-drag {
      cursor: grab;
      touch-action: none;
      user-select: none;
    }

    .titlebar-drag:active {
      cursor: grabbing;
    }

    .close {
      display: grid;
      flex-shrink: 0;
      place-items: center;
      width: 44px;
      height: 44px;
      margin-left: -6px;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
    }

    .close:hover .close-dot,
    .close:focus-visible .close-dot {
      box-shadow:
        0 0 0 1px rgba(10, 9, 8, 0.25),
        0 0 0 5px color-mix(in srgb, var(--close) 18%, transparent);
      transform: scale(1.08);
    }
  }
</style>
