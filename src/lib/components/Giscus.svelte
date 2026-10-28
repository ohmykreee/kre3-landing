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

  const loadGiscus: Attachment<HTMLElement> = (element) => {
    const script = document.createElement('script')
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
      <p class="bone_label" aria-hidden="true">loading comments</p>
      <span class="bone_line" aria-hidden="true"></span>
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
    min-height: 12rem;
    padding: 0;
  }

  .bone_div {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: start center;
    gap: 0.625rem;
    padding-top: clamp(1.5rem, 4vw, 2.5rem);
    text-align: center;
  }

  .bone_label {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--paper-mute);
  }

  .bone_line {
    position: relative;
    display: block;
    overflow: hidden;
    width: 9rem;
    height: 1px;
    background-color: var(--line);
  }

  .bone_line::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 45%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in srgb, var(--accent) 70%, transparent) 50%,
      transparent 100%
    );
    animation: skeleton-sweep 1.6s var(--ease) infinite;
  }

  .noscript {
    max-width: 32ch;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--paper-mute);
  }

  @keyframes skeleton-sweep {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(230%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bone_line::after {
      animation: none;
      opacity: 0.5;
    }
  }
</style>
