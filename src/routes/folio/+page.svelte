<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Lightbox from '$lib/components/Lightbox.svelte'

  let activeIndex = $state(0)
  let activeCollection = $derived(siteconfig.portfolio[activeIndex])
  let collectionCount = $derived(siteconfig.portfolio.length)
  let totalWorks = $derived(
    siteconfig.portfolio.reduce((total, collection) => total + collection.item.length, 0)
  )

  function selectCollection(index: number) {
    activeIndex = index
  }
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
          <button
            type="button"
            class="collection-link"
            aria-pressed={index === activeIndex}
            title={collection.title}
            onclick={() => selectCollection(index)}
          >
            <span class="collection-label">{collection.title}</span>
          </button>
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
    gap: 6px 24px;
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
    margin-top: clamp(20px, 3vw, 28px);
  }

  .index {
    display: flex;
    flex-wrap: wrap;
    gap: 0 clamp(16px, 2.6vw, 24px);
    min-width: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--line);
  }

  .collection-link {
    position: relative;
    display: block;
    width: auto;
    max-width: 100%;
    min-height: 44px;
    margin: 0;
    padding: 4px 0 10px;
    border: 0;
    background: transparent;
    color: var(--paper-dim);
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.35;
    text-align: left;
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
    bottom: -4px;
    width: 16px;
    height: 1px;
    background-color: var(--accent);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.18s var(--ease);
  }

  .collection-link:hover,
  .collection-link:focus-visible {
    color: var(--paper);
  }

  .collection-link[aria-pressed='true'] {
    color: var(--paper);
  }

  .collection-link[aria-pressed='true'] .collection-label::after {
    transform: scaleX(1);
  }

  .collection {
    min-width: 0;
    margin-top: clamp(16px, 2.4vw, 22px);
  }

  .collection-head {
    margin-bottom: clamp(12px, 2vw, 18px);
  }

  .collection-title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 14px;
  }

  .collection-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 650;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--paper);
    overflow-wrap: anywhere;
  }

  .collection-count {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.4;
    color: var(--paper-mute);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .collection-desc {
    max-width: 54ch;
    margin: 4px 0 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--paper-dim);
  }

  .empty {
    margin: clamp(24px, 3vw, 32px) 0 0;
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
