<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Pal from '$lib/components/Pal.svelte'
</script>

<div class="container">
  {#each siteconfig.pals as pal (pal.name)}
    <Pal name={pal.name} avatar={pal.avatar} description={pal.description} url={pal.url} />
  {/each}
</div>

<style>
  .container {
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 2rem 1rem;
  }

  @media (min-width: 800px) {
    .container {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
