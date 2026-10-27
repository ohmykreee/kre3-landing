<script lang="ts">
  import { page } from '$app/state'
  import { resolve } from '$app/paths'
  import avatar from '$lib/assets/avatar.jpg'
</script>

<div class="error_container">
  <a class="portrait" href={resolve('/')} aria-label="Back to Home">
    <img src={avatar} alt="Avatar" />
  </a>

  <div class="text">
    <h1 class="status">{page.status}</h1>
    <p class="message">{page.error?.message}</p>
    <p class="hint">You can use the navigation above to go back to Home.</p>
  </div>
</div>

<style>
  .error_container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: clamp(18px, 3vw, 32px);
    padding: clamp(4px, 2vw, 16px) 0;
  }

  .portrait {
    flex-shrink: 0;
    width: clamp(72px, 12vw, 96px);
    border-radius: 50%;
  }

  .portrait img {
    display: block;
    width: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .text {
    flex: 1 1 18rem;
    min-width: 0;
  }

  .status {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 4.5vw, 3.25rem);
    font-weight: 650;
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--paper);
  }

  .message {
    margin: 8px 0 0;
    font-family: var(--font-sans);
    font-size: 1rem;
    line-height: 1.5;
    color: var(--paper-dim);
    overflow-wrap: anywhere;
  }

  .hint {
    max-width: 40ch;
    margin: 14px 0 0;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--paper-mute);
  }
</style>
