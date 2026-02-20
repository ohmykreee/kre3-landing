<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Article from '$lib/components/Article.svelte'
</script>

<Article title={siteconfig.about.title} html={siteconfig.about.content} />
