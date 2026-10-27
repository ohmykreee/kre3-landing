<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Icon from '$lib/components/Icon.svelte'
</script>

<div class="home">
  <header class="intro">
    <p class="prompt">
      <span class="prompt-host">{siteconfig.profile.props}</span>
      <span class="prompt-colon">:</span>
      <span class="prompt-path">~</span>
      <span class="prompt-dollar">$</span>
      <span class="prompt-cmd">info</span>
    </p>

    <h1 class="name">{@html siteconfig.profile.name}</h1>

    <figure class="portrait">
      <img src={siteconfig.profile.avatar} alt="Portrait" />
    </figure>

    <dl class="facts">
      <div class="fact">
        <dt>career</dt>
        <dd>{@html siteconfig.profile.career}</dd>
      </div>
      <div class="fact">
        <dt>species</dt>
        <dd>{@html siteconfig.profile.species}</dd>
      </div>
      <div class="fact">
        <dt>mail</dt>
        <dd>{@html siteconfig.profile.email}</dd>
      </div>
    </dl>
  </header>

  <div class="specs" aria-label="System specs">
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
            <span class="link-prefix" aria-hidden="true">./</span>
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
    font-size: 0.75rem;
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
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(112px, 16vw, 168px);
    grid-template-areas:
      'prompt portrait'
      'name portrait'
      'facts portrait';
    column-gap: clamp(18px, 3vw, 28px);
    align-items: start;
  }

  .intro .prompt {
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
    font-size: 0.38em;
    line-height: 0;
    letter-spacing: -0.01em;
    vertical-align: super;
    color: var(--accent);
  }

  .portrait {
    position: relative;
    z-index: 1;
    isolation: isolate;
    grid-area: portrait;
    justify-self: end;
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

  .facts {
    grid-area: facts;
    display: grid;
    gap: 2px;
    margin: 18px 0 0;
  }

  .fact {
    display: grid;
    grid-template-columns: 4.75rem minmax(0, 1fr);
    gap: 12px;
    align-items: baseline;
  }

  .fact dt {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.7;
    color: var(--term-domain);
  }

  .fact dd {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--paper);
    overflow-wrap: anywhere;
  }

  .fact dd :global(a) {
    text-decoration: underline;
    text-decoration-color: var(--line-strong);
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    transition:
      color 0.15s var(--ease),
      text-decoration-color 0.15s var(--ease);
  }

  .fact dd :global(a:hover),
  .fact dd :global(a:focus-visible) {
    color: var(--accent);
    text-decoration-color: var(--accent);
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
    width: 2.5rem;
    flex-shrink: 0;
    color: var(--accent);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .spec-val {
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
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    color: var(--paper-mute);
    transition: color 0.16s var(--ease);
  }

  .link-prefix {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--paper-mute);
  }

  .link-name {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .link-arrow {
    margin-left: auto;
    font-size: 0.75rem;
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

  @media (min-width: 680px) {
    .link-list {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (min-width: 1200px) {
    .home {
      max-width: none;
    }

    .intro {
      grid-template-columns: minmax(0, 1fr) clamp(170px, 13vw, 190px);
    }

    .portrait {
      transform: translate(calc(var(--pad-x, 32px) + 12px), -8px) rotate(3.5deg);
    }

    .portrait::before {
      transform: translate(6px, 10px);
    }

    .name {
      font-size: clamp(4.5rem, 6vw, 5.5rem);
    }
  }

  @media (max-width: 679px) {
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
    .link-arrow,
    .fact dd :global(a) {
      transition: none;
    }
  }
</style>
