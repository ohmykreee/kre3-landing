<script lang="ts">
  import type { Attachment } from 'svelte/attachments'
  import type { GiscusConfig } from '$lib/config/_loader'

  interface Props {
    host?: string
    loading?: 'lazy' | 'eager'
    config: GiscusConfig
  }

  let isLoaded = $state(false)

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

    const giscusOrigin = host ? new URL(host).origin : 'https://giscus.app'
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== giscusOrigin) return

      if (typeof event.data === 'object' && event.data.giscus) {
        isLoaded = true
      }
    }
    window.addEventListener('message', handleMessage)

    element.appendChild(script)
    return () => {
      window.removeEventListener('message', handleMessage)
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }
</script>

<div class="giscus_container" {@attach loadGiscus}>
  {#if !isLoaded}
    <div class="bone_div">
      <noscript>
        <p class="noscript">
          Please enable Javascript to use comments (powered by <a
            href="https://giscus.app/"
            rel="external"
          >
            Giscus
          </a>
          )
        </p>
      </noscript>
    </div>
  {/if}
</div>

<style>
  .giscus_container {
    position: relative;
    padding: 2rem;
    min-height: 350px;
  }

  .bone_div {
    position: absolute;
    inset: 2rem;
    height: 250px;
    border-radius: 0.5rem;
    background: linear-gradient(
      90deg,
      rgba(42, 42, 42, 50%) 25%,
      rgba(58, 58, 58, 50%) 50%,
      rgba(42, 42, 42, 50%) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-pulse 1.5s infinite;
  }

  .noscript {
    width: 100%;
    text-align: center;
    opacity: 0.7;
  }

  @keyframes skeleton-pulse {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>
