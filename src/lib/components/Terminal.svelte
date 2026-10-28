<script lang="ts">
  import { page } from '$app/state'
  import { resolve } from '$app/paths'
  import type { Snippet } from 'svelte'

  import { genie } from '$lib/utils/genie-effect.svelte'
  import { createDrag } from '$lib/utils/use-drag.svelte'
  import { getTerminal } from '$lib/utils/get-page-state.svelte'
  import { sectionMeta, sections } from '$lib/utils/sections'

  interface Props {
    children: Snippet<[]>
  }

  let { children }: Props = $props()

  const drag = createDrag()
  const current = $derived(sectionMeta(page.url.pathname))
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
        <span class="wordmark">doggobench</span>
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
          <span class="nav-link" aria-current="page">{current.name}</span>
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
    --pad-x: clamp(0.875rem, 2.8vw, 2rem);
    --pad-y: clamp(0.75rem, 2.2vw, 1.125rem);

    position: relative;
    z-index: 999;
    min-width: 0;
    padding: 0 var(--pad-x) clamp(1.5rem, 3.2vw, 2.25rem);
    background-color: color-mix(in srgb, var(--panel) 95%, transparent);
  }

  /* OS titlebar: real route path, draggable surface, red close dot */
  .masthead {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 1.25rem;
    margin: 0 calc(-1 * var(--pad-x));
    padding: calc(var(--pad-y) - 0.625rem) var(--pad-x);
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
    gap: 0.75rem;
    min-width: 0;
    min-height: 2.75rem;
  }

  .wordmark {
    flex-shrink: 0;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 650;
    line-height: 1;
    letter-spacing: -0.025em;
    color: var(--paper);
    white-space: nowrap;
  }

  .route-path {
    overflow: hidden;
    font-family: var(--font-mono);
    font-size: 0.8rem;
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
    gap: 0 clamp(1rem, 3vw, 1.5rem);
    width: 100%;
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    padding: 0 1px;
    color: var(--paper-dim);
    font-family: var(--font-sans);
    font-size: 1rem;
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
    height: 2px;
    background-color: var(--paper-mute);
    clip-path: inset(0 100% 0 0);
    transition:
      clip-path 0.18s var(--ease),
      background-color 0.18s var(--ease);
  }

  .nav-link:hover,
  .nav-link:focus-visible {
    color: var(--paper);
  }

  .nav-link:hover::after,
  .nav-link:focus-visible::after {
    clip-path: inset(0 0 0 0);
  }

  .nav-link[aria-current='page'] {
    color: var(--paper);
  }

  .nav-link[aria-current='page']::after {
    background-color: var(--accent);
    clip-path: inset(0 0 0 0);
  }

  .close {
    display: none;
  }

  .close-dot {
    display: block;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background-color: var(--close);
    box-shadow: 0 0 0 1px rgba(10, 9, 8, 0.25);
    transition:
      box-shadow 0.15s var(--ease),
      transform 0.15s var(--ease);
  }

  .content {
    padding-top: clamp(1.25rem, 2.8vw, 1.875rem);
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
      width: 2.75rem;
      height: 2.75rem;
      margin-left: -0.375rem;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
    }

    .close:hover .close-dot,
    .close:focus-visible .close-dot {
      box-shadow:
        0 0 0 1px rgba(10, 9, 8, 0.25),
        0 0 0 3px color-mix(in srgb, var(--close) 30%, transparent);
      transform: scale(1.08);
    }
  }
</style>
