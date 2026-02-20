<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Icon from '$lib/components/Icon.svelte'
  import { getBg } from '$lib/utils/get-page-state.svelte'

  let currTheme: string | undefined = $derived(siteconfig.profile.bg[getBg.index].theme)
</script>

<div class="container">
  <div>
    <span class="terminal_domain">{siteconfig.profile.props}</span>:<span class="terminal_path"
      >~</span
    >$ info
  </div>
  <div class="bio_container">
    <img
      src={siteconfig.profile.avatar}
      alt="Avatar"
      style:--curr-border-color={currTheme ?? 'initial'}
    />
    <p class="bio_info">
      <span>Brief Introduction</span><br />
      ------------------<br />
      <span>Name:</span>
      {@html siteconfig.profile.name}<br />
      <span>Career:</span>
      {@html siteconfig.profile.career}<br />
      <span>Species:</span>
      {@html siteconfig.profile.species}<br />
      <span>Mail:</span>
      {@html siteconfig.profile.email}<br />
      <span>CPU:</span> DoggoBrain KindaStupid @ unknown<br />
      <span>GPU:</span> DoggoEyes NearSighted<br />
    </p>
  </div>
  <div>
    <span class="terminal_domain">{siteconfig.profile.props}</span>:<span class="terminal_path"
      >~</span
    >$ ls links
  </div>
  <div class="links_container">
    {#each siteconfig.profile.links as link (link.name)}
      <a href={link.url} rel="external" target="_blank"><Icon icon={link.icon} />{link.name}</a>
    {/each}
  </div>
</div>

<style>
  @import '$lib/styles/_variable.css';

  .container {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;
    overflow-wrap: normal;
    word-break: normal;
    margin: 0.25rem;
  }

  .terminal_domain {
    color: var(--terminal-domain);
  }
  .terminal_path {
    color: var(--terminal-path);
  }

  .bio_container {
    display: flex;
    flex-direction: column;
  }

  .bio_container span {
    color: var(--curr-border-color, var(--border-color));
  }

  .bio_container img {
    border-radius: 9999px;
    flex-shrink: 0;
    width: 30vw;
    height: 30vw;
    align-self: center;
    margin-top: 1rem;
    color: var(--curr-border-color, var(--border-color));
    box-shadow: 0 0 0 2px;
    line-height: 30vw;
  }

  .bio_info {
    flex-grow: 1;
  }

  .links_container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 1rem;
    margin-top: 0.25rem;
    margin-bottom: 1rem;
  }

  .links_container a {
    text-decoration: none;
    padding: 0.5rem 0.5rem;
  }

  .links_container a:hover {
    text-decoration: underline;
  }

  .links_container :global(svg) {
    margin-right: 0.25rem;
  }

  @media (min-width: 800px) {
    .bio_container {
      flex-direction: row;
    }
    .bio_container img {
      width: 13rem;
      height: 13rem;
      margin: 1.5rem 3rem 2.5rem 3rem;
      line-height: 13rem;
    }
    .links_container a {
      padding: 0.25rem 0;
    }
  }
</style>
