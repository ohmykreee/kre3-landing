<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Lightbox from '$lib/components/Lightbox.svelte'
  import { getBg } from '$lib/utils/get-page-state.svelte'

  let currTheme = $derived(siteconfig.profile.bg[getBg.index].theme)
  let activeIndex = $state(0)
  let activeCollection = $derived(siteconfig.portfolio[activeIndex])
  let collectionCount = $derived(siteconfig.portfolio.length)
  let totalWorks = $derived(
    siteconfig.portfolio.reduce((total, collection) => total + collection.item.length, 0)
  )

  function selectCollection(index: number) {
    activeIndex = index
  }

  function formatIndex(index: number) {
    return String(index + 1).padStart(2, '0')
  }
</script>

<div class="folio" style:--curr-theme-color={currTheme}>
  <header class="page_header">
    <h2 class="page_title">Work Archive</h2>
    <p class="page_stats">
      {totalWorks}
      {totalWorks === 1 ? 'work' : 'works'} · {collectionCount}
      {collectionCount === 1 ? 'collection' : 'collections'}
    </p>
  </header>

  {#if collectionCount === 0}
    <p class="empty_state">No work collections found.</p>
  {:else}
    <div class="workspace">
      <nav class="collection_index" aria-label="Collections">
        {#each siteconfig.portfolio as collection, index (collection.title + index)}
          <button
            type="button"
            class="collection_button"
            aria-pressed={index === activeIndex}
            title={collection.title}
            onclick={() => selectCollection(index)}
          >
            <span class="collection_number">[{formatIndex(index)}]</span>
            <span class="collection_name">{collection.title}</span>
          </button>
        {/each}
      </nav>

      {#if activeCollection}
        <section class="collection_view" aria-label={activeCollection.title}>
          <header class="collection_heading">
            <p class="collection_label">Collection {formatIndex(activeIndex)}</p>
            <h3 class="collection_title">{activeCollection.title}</h3>
            {#if activeCollection.description}
              <p class="collection_description">{activeCollection.description}</p>
            {/if}
            <p class="collection_meta">
              {activeCollection.item.length}
              {activeCollection.item.length === 1 ? 'work' : 'works'}
            </p>
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
    padding: 1.25rem;
    overflow-wrap: anywhere;
  }

  .page_header {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 1rem;
    row-gap: 0.25rem;
    min-width: 0;
    margin-bottom: 1.5rem;
  }

  .page_title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.01em;
  }

  .page_stats {
    margin: 0;
    font-size: 0.75rem;
    line-height: 1.4;
    color: color-mix(in srgb, var(--text-color), transparent 38%);
  }

  .workspace {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    row-gap: 1.25rem;
    min-width: 0;
  }

  .collection_index {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.25rem;
    min-width: 0;
    max-width: 100%;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding-bottom: 0.25rem;
    scrollbar-width: thin;
    scrollbar-color: color-mix(
        in srgb,
        var(--curr-theme-color, var(--border-color)),
        transparent 55%
      )
      transparent;
  }

  .collection_index::-webkit-scrollbar {
    height: 4px;
  }

  .collection_index::-webkit-scrollbar-button {
    display: none;
  }

  .collection_index::-webkit-scrollbar-track {
    background: transparent;
  }

  .collection_index::-webkit-scrollbar-thumb {
    border-radius: 9999px;
    background-color: color-mix(
      in srgb,
      var(--curr-theme-color, var(--border-color)),
      transparent 45%
    );
  }

  .collection_button {
    display: grid;
    flex: 0 0 auto;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: start;
    column-gap: 0.375rem;
    max-width: 14rem;
    margin: 0;
    padding: 0.4rem 0.5rem;
    border: 0;
    border-left: 2px solid transparent;
    border-radius: 0.125rem;
    background: transparent;
    color: color-mix(in srgb, var(--text-color), transparent 45%);
    font: inherit;
    font-size: 0.78rem;
    line-height: 1.35;
    text-align: left;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    transition:
      color 0.15s ease,
      background-color 0.15s ease,
      border-color 0.15s ease;
  }

  .collection_button:hover {
    color: var(--text-color);
    background-color: color-mix(
      in srgb,
      var(--curr-theme-color, var(--border-color)),
      transparent 94%
    );
  }

  .collection_button[aria-pressed='true'] {
    color: var(--text-color);
    border-left-color: var(--curr-theme-color, var(--border-color));
    background-color: color-mix(
      in srgb,
      var(--curr-theme-color, var(--border-color)),
      transparent 90%
    );
  }

  .collection_number {
    font-size: 0.7rem;
    color: var(--curr-theme-color, var(--border-color));
  }

  .collection_name {
    display: -webkit-box;
    min-width: 0;
    overflow: hidden;
    font-weight: 600;
    line-height: 1.3;
    overflow-wrap: anywhere;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .collection_view {
    min-width: 0;
  }

  .collection_heading {
    min-width: 0;
    margin-bottom: 1rem;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid
      color-mix(in srgb, var(--curr-theme-color, var(--border-color)), transparent 78%);
  }

  .collection_label {
    margin: 0 0 0.3rem;
    font-size: 0.68rem;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--curr-theme-color, var(--border-color));
  }

  .collection_title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .collection_description {
    margin: 0.35rem 0 0;
    font-size: 0.8rem;
    line-height: 1.5;
    color: color-mix(in srgb, var(--text-color), transparent 30%);
    overflow-wrap: anywhere;
  }

  .collection_meta {
    margin: 0.35rem 0 0;
    font-size: 0.7rem;
    line-height: 1.4;
    color: color-mix(in srgb, var(--text-color), transparent 48%);
  }

  .empty_state {
    margin: 0;
    padding: 0.75rem 1rem;
    border: 1px dashed
      color-mix(in srgb, var(--curr-theme-color, var(--border-color)), transparent 65%);
    border-radius: 0.375rem;
    background-color: rgba(0, 0, 0, 0.22);
    font-size: 0.8rem;
    line-height: 1.5;
    color: color-mix(in srgb, var(--text-color), transparent 28%);
  }

  @media (min-width: 800px) {
    .folio {
      padding: 2rem;
    }

    .page_header {
      flex-direction: row;
    }

    .page_stats {
      margin: 0 0 0 auto;
    }

    .page_title {
      font-size: 1.75rem;
    }

    .workspace {
      grid-template-columns: 12.5rem minmax(0, 1fr);
      column-gap: 1.5rem;
      align-items: start;
    }

    .collection_index {
      flex-direction: column;
      gap: 0.125rem;
      overflow: visible;
      padding-bottom: 0;
    }

    .collection_button {
      width: 100%;
      max-width: none;
      font-size: 0.8rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .collection_button {
      transition: none;
    }
  }
</style>
