<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Article from '$lib/components/Article.svelte'
  import Giscus from '$lib/components/Giscus.svelte'
</script>

<Article title={siteconfig.about.title} html={siteconfig.about.content} />

{#if siteconfig.giscus}
  <Giscus config={siteconfig.giscus} />
{/if}
