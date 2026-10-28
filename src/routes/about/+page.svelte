<script lang="ts">
  import Article from '$lib/components/Article.svelte'
  import Giscus from '$lib/components/Giscus.svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
</script>

<div class="about">
  <Article title={data.title} html={data.html} headings={data.headings} />

  {#if data.giscus}
    <div class="comments">
      <Giscus config={data.giscus} />
    </div>
  {/if}
</div>

<style>
  .about {
    min-width: 0;
    max-width: 48rem;
  }

  .comments {
    max-width: 40rem;
    margin-top: clamp(2.25rem, 6vw, 3.75rem);
    padding-top: clamp(1.125rem, 2.6vw, 1.625rem);
    border-top: 1px solid var(--line);
  }
</style>
