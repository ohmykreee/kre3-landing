<script lang="ts">
  import { resolve } from '$app/paths'
  import { siteconfig } from '$lib/config/_loader'
  import Lightbox from '$lib/components/Lightbox.svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  let activeIndex = $derived(data.activeIndex)
  let activeCollection = $derived(siteconfig.portfolio[activeIndex])
  let collectionCount = $derived(siteconfig.portfolio.length)
  let totalWorks = $derived(
    siteconfig.portfolio.reduce((total, collection) => total + collection.item.length, 0)
  )
</script>

<div class="folio">
  <header class="head">
    <h1 class="title">Work Archive</h1>
    <p class="stats">
      {totalWorks}
      {totalWorks === 1 ? 'work' : 'works'}
      <span class="stat-sep" aria-hidden="true">·</span>
      {collectionCount}
      {collectionCount === 1 ? 'collection' : 'collections'}
    </p>
  </header>

  {#if collectionCount === 0}
    <p class="empty">No work collections found.</p>
  {:else}
    <div class="workspace">
      <nav class="index" aria-label="Collections">
        {#each siteconfig.portfolio as collection, index (collection.title + index)}
          <a
            href={resolve('/folio/[[collection]]', { collection: String(index + 1) })}
            class="collection-link"
            aria-current={index === activeIndex ? 'page' : undefined}
            title={collection.title}
          >
            <span class="collection-label">{collection.title}</span>
          </a>
        {/each}
      </nav>

      {#if activeCollection}
        <section class="collection" aria-label={activeCollection.title}>
          <header class="collection-head">
            <div class="collection-title-row">
              <h2 class="collection-title">{activeCollection.title}</h2>
              <span class="collection-count">
                {activeCollection.item.length}
                {activeCollection.item.length === 1 ? 'work' : 'works'}
              </span>
            </div>
            {#if activeCollection.description}
              <p class="collection-desc">{activeCollection.description}</p>
            {/if}
          </header>

          {#key activeIndex}
            <Lightbox collection={activeCollection} />
          {/key}
        </section>
      {/if}
    </div>
  {/if}
</div>

<style>
  .folio {
    min-width: 0;
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.375rem 1.5rem;
  }

  .title {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 3.6vw, 3rem);
    font-weight: 650;
    line-height: 1.02;
    letter-spacing: -0.03em;
    color: var(--paper);
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0 0.5ch;
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--paper-mute);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .stat-sep {
    color: var(--line-strong);
  }

  .workspace {
    display: block;
    margin-top: clamp(1.25rem, 3vw, 1.75rem);
  }

  .index {
    display: flex;
    flex-wrap: wrap;
    gap: 0 clamp(1rem, 2.6vw, 1.5rem);
    min-width: 0;
    padding-bottom: 0.625rem;
    border-bottom: 1px solid var(--line);
  }

  .collection-link {
    position: relative;
    display: block;
    width: auto;
    max-width: 100%;
    min-height: 2.75rem;
    margin: 0;
    padding: 0.25rem 0 0.625rem;
    border: 0;
    background: transparent;
    color: var(--paper-dim);
    font-family: var(--font-sans);
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 1.35;
    text-align: left;
    text-decoration: none;
    overflow-wrap: anywhere;
    cursor: pointer;
    transition: color 0.16s var(--ease);
  }

  .collection-label {
    position: relative;
    display: inline-block;
    max-width: 100%;
  }

  .collection-label::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.25rem;
    width: 100%;
    height: 2px;
    background-color: var(--accent);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.18s var(--ease);
  }

  .collection-link:hover,
  .collection-link:focus-visible {
    color: var(--paper);
  }

  .collection-link[aria-current='page'] {
    color: var(--paper);
  }

  .collection-link[aria-current='page'] .collection-label::after {
    transform: scaleX(1);
  }

  .collection {
    min-width: 0;
    margin-top: clamp(1rem, 2.4vw, 1.375rem);
  }

  .collection-head {
    margin-bottom: clamp(0.75rem, 2vw, 1.125rem);
  }

  .collection-title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
  }

  .collection-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 650;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--paper);
    overflow-wrap: anywhere;
  }

  .collection-count {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.4;
    color: var(--paper-mute);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .collection-desc {
    max-width: 54ch;
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--paper-dim);
  }

  .empty {
    margin: clamp(1.5rem, 3vw, 2rem) 0 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--paper-dim);
  }

  @media (prefers-reduced-motion: reduce) {
    .collection-link,
    .collection-label::after {
      transition: none;
    }
  }
</style>
