<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Pal from '$lib/components/Pal.svelte'
</script>

<div class="pals">
  <header class="head">
    <h1 class="title">Pals</h1>
  </header>

  <ul class="list">
    {#each siteconfig.pals as pal (pal.name)}
      <li class="cell">
        <Pal name={pal.name} avatar={pal.avatar} description={pal.description} url={pal.url} />
      </li>
    {/each}
  </ul>
</div>

<style>
  .pals {
    min-width: 0;
    max-width: 53.75rem;
  }

  .head {
    margin-bottom: clamp(1rem, 2.4vw, 1.5rem);
  }

  .title {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 3.6vw, 3rem);
    font-weight: 650;
    line-height: 1.03;
    letter-spacing: -0.03em;
    color: var(--paper);
  }

  .list {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0 clamp(1.5rem, 4vw, 3rem);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .cell {
    min-width: 0;
  }

  @media (min-width: 801px) {
    .list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
