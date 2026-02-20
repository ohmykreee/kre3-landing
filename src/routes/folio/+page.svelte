<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Lightbox from '$lib/components/Lightbox.svelte'
</script>

<div class="container">
  {#each siteconfig.portfolio as item (item.title)}
    <Lightbox collection={item} />
  {/each}
</div>

<style>
  @import '$lib/styles/_variable.css';

  .container {
    padding: 3rem 2rem;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    row-gap: 2rem;
  }

  @media (min-width: 800px) {
    .container {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 3rem;
    }
  }
</style>
