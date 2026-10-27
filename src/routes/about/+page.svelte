<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Article from '$lib/components/Article.svelte'
  import Giscus from '$lib/components/Giscus.svelte'
</script>

<div class="about">
  <Article title={siteconfig.about.title} html={siteconfig.about.content} />

  {#if siteconfig.giscus}
    <div class="comments">
      <Giscus config={siteconfig.giscus} />
    </div>
  {/if}
</div>

<style>
  .about {
    min-width: 0;
    max-width: 40rem;
  }

  .comments {
    max-width: 40rem;
    margin-top: clamp(36px, 6vw, 60px);
    padding-top: clamp(18px, 2.6vw, 26px);
    border-top: 1px solid var(--line);
  }
</style>
