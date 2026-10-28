<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Icon from '$lib/components/Icon.svelte'
</script>

<div class="home">
  <p class="prompt">
    <span class="prompt-host">{siteconfig.profile.props}</span>
    <span class="prompt-colon">:</span>
    <span class="prompt-path">~</span>
    <span class="prompt-dollar">$</span>
    <span class="prompt-cmd">info</span>
  </p>
  <header class="intro">
    <h1 class="name">{@html siteconfig.profile.name}</h1>

    <figure class="portrait">
      <img src={siteconfig.profile.avatar} alt="Portrait" />
    </figure>
  </header>

  <div class="specs" aria-label="Personal specs">
    <p class="spec-row">
      <span class="spec-key">Career</span>
      <span class="spec-val">{@html siteconfig.profile.career}</span>
    </p>
    <p class="spec-row">
      <span class="spec-key">Species</span>
      <span class="spec-val">{@html siteconfig.profile.species}</span>
    </p>
    <p class="spec-row">
      <span class="spec-key">Mail</span>
      <span class="spec-val">{@html siteconfig.profile.email}</span>
    </p>
    <p class="spec-row">
      <span class="spec-key">CPU</span>
      <span class="spec-val">DoggoBrain KindaStupid @ unknown</span>
    </p>
    <p class="spec-row">
      <span class="spec-key">GPU</span>
      <span class="spec-val">DoggoEyes NearSighted</span>
    </p>
  </div>

  <section class="links-block" aria-label="Social links">
    <p class="prompt links-prompt">
      <span class="prompt-host">{siteconfig.profile.props}</span>
      <span class="prompt-colon">:</span>
      <span class="prompt-path">~</span>
      <span class="prompt-dollar">$</span>
      <span class="prompt-cmd">ls ./links</span>
    </p>

    <ul class="link-list">
      {#each siteconfig.profile.links as link (link.name)}
        <li>
          <a href={link.url} rel="external" target="_blank">
            <span class="link-icon"><Icon icon={link.icon} size="0.875rem" /></span>
            <span class="link-name">{link.name}</span>
            <span class="link-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .home {
    min-width: 0;
    max-width: 860px;
  }

  .prompt {
    display: flex;
    flex-wrap: wrap;
    gap: 0 0.35ch;
    margin: 0;
    font-family: var(--font-mono);
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
    color: var(--paper-mute);
  }

  .prompt-host {
    color: var(--term-domain);
  }

  .prompt-colon,
  .prompt-dollar {
    color: var(--paper-mute);
  }

  .prompt-path {
    color: var(--term-path);
  }

  .prompt-cmd {
    color: var(--paper-dim);
  }

  .intro {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: 24px;
  }

  .prompt {
    grid-area: prompt;
    margin-bottom: 14px;
  }

  .name {
    grid-area: name;
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.75rem, 5.2vw, 4.5rem);
    font-weight: 700;
    line-height: 0.93;
    letter-spacing: -0.04em;
    color: var(--paper);
    text-wrap: balance;
    overflow-wrap: break-word;
  }

  .name :global(sup) {
    font-size: 0.5em;
    line-height: 0;
    letter-spacing: -0.01em;
    vertical-align: super;
    color: var(--accent);
  }

  .portrait {
    position: relative;
    z-index: 1;
    isolation: isolate;
    width: 100%;
    margin: 0;
    transform: rotate(3.5deg);
  }

  .portrait::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 6px;
    background-color: color-mix(in srgb, var(--accent) 24%, transparent);
    transform: translate(10px, 9px);
  }

  .portrait img {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 6px;
    object-fit: cover;
    background-color: color-mix(in srgb, var(--paper) 8%, transparent);
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--panel) 92%, transparent),
      0 0 0 4px color-mix(in srgb, var(--accent) 54%, transparent);
  }

  .specs {
    display: grid;
    gap: 2px;
    margin-top: clamp(20px, 2.8vw, 28px);
  }

  .spec-row {
    display: flex;
    gap: 14px;
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.7;
    color: var(--paper);
  }

  .spec-key {
    font-size: 1rem;
    width: 5rem;
    flex-shrink: 0;
    color: var(--accent);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .spec-val {
    font-size: 1rem;
    color: var(--paper);
    overflow-wrap: anywhere;
  }

  .links-block {
    margin-top: clamp(22px, 3.2vw, 30px);
  }

  .links-prompt {
    margin-bottom: 4px;
  }

  .link-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 16px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .link-list a {
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 44px;
    padding: 6px 0;
    color: var(--paper-dim);
    font-size: 0.875rem;
    line-height: 1.3;
    transition: color 0.16s var(--ease);
  }

  .link-icon {
    font-size: 1.125rem;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    color: var(--paper-mute);
    transition: color 0.16s var(--ease);
  }

  .link-name {
    font-size: 1rem;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .link-arrow {
    margin-left: auto;
    font-size: 1rem;
    line-height: 1;
    color: var(--paper-mute);
    opacity: 0;
    transform: translate(-2px, 2px);
    transition:
      opacity 0.16s var(--ease),
      transform 0.16s var(--ease),
      color 0.16s var(--ease);
  }

  .link-list a:hover,
  .link-list a:focus-visible {
    color: var(--paper);
  }

  .link-list a:hover .link-name,
  .link-list a:focus-visible .link-name {
    text-decoration: underline;
    text-decoration-color: var(--accent);
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .link-list a:hover .link-icon,
  .link-list a:focus-visible .link-icon,
  .link-list a:hover .link-arrow,
  .link-list a:focus-visible .link-arrow {
    color: var(--accent);
  }

  .link-list a:hover .link-arrow,
  .link-list a:focus-visible .link-arrow {
    opacity: 1;
    transform: translate(0, 0);
  }

  @media (min-width: 801px) {
    .link-list {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .intro {
      flex-direction: row;
    }

    .name {
      flex-grow: 1;
      min-width: 0;
    }

    .portrait {
      flex: 0 0 20%;
      transform: translate(calc(var(--pad-x, 32px) - 48px), -8px) rotate(3.5deg);
    }

    .portrait::before {
      transform: translate(6px, 10px);
    }
    .home {
      max-width: none;
    }

    .name {
      font-size: clamp(3.5rem, 4.5vw, 5.5rem);
    }
  }

  @media (max-width: 801px) {
    .intro {
      grid-template-areas:
        'prompt portrait'
        'name name'
        'facts facts';
    }

    .portrait {
      width: clamp(96px, 16vw, 112px);
      margin-bottom: 10px;
      transform: rotate(2.5deg);
    }

    .portrait::before {
      transform: translate(7px, 7px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .link-list a,
    .link-icon,
    .link-arrow{
      transition: none;
    }
  }
</style>
