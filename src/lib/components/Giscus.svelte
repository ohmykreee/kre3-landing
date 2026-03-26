<script lang="ts">
  import type { Attachment } from 'svelte/attachments'
  import type { GiscusConfig } from '$lib/config/_loader'

  interface Props {
    host?: string
    loading?: 'lazy' | 'eager'
    config: GiscusConfig
  }

  let { host, loading, config }: Props = $props()
  let attrs = $derived({
    src: host || 'https://giscus.app' + '/client.js',
    crossorigin: 'anonymous',
    async: 'true',
    'data-repo': config.repo,
    'data-repo-id': config.repoId,
    'data-category': config.category,
    'data-category-id': config.categoryId,
    'data-mapping': config.mapping,
    'data-term': config.term || '',
    'data-strict': config.strict || '0',
    'data-reactions-enabled': config.reactionsEnabled || '1',
    'data-emit-metadata': config.emitMetadata || '0',
    'data-input-position': config.inputPosition || 'top',
    'data-theme': config.theme || 'preferred_color_scheme',
    'data-lang': config.lang || 'en',
    'data-loading': loading || 'eager'
  })

  const loadGiscus: Attachment = (element) => {
    const script: HTMLElement = document.createElement('script')
    Object.entries(attrs).forEach(([key, value]) => {
      script.setAttribute(key, value)
    })
    element.appendChild(script)
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }
</script>

<div class="giscus_container" {@attach loadGiscus}></div>

<style>
  .giscus_container {
    padding: 2rem;
  }
</style>
