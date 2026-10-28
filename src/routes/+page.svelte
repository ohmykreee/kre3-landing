<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import Icon from '$lib/components/Icon.svelte'
  import { getBg } from '$lib/utils/get-page-state.svelte'

  let currTheme = $derived(siteconfig.profile.bg[getBg.index].theme)
</script>

<div class="container">
  <div class="terminal_prompt">
    <span class="terminal_domain">{siteconfig.profile.props}</span>
    :
    <span class="terminal_path">~</span>
    $ info
  </div>
  <div class="bio_container">
    <img
      src={siteconfig.profile.avatar}
      alt="Avatar"
      style:--curr-border-color={currTheme ?? 'initial'}
    />
    <div class="bio_info">
      <span>Brief Introduction</span>
      <br />
      ------------------
      <br />
      <div class="bio_line">
        <span>Name:</span>
        {@html siteconfig.profile.name}
      </div>
      <div class="bio_line">
        <span>Career:</span>
        {@html siteconfig.profile.career}
      </div>
      <div class="bio_line">
        <span>Species:</span>
        {@html siteconfig.profile.species}
      </div>
      <div class="bio_line">
        <span>Mail:</span>
        {@html siteconfig.profile.email}
      </div>
      <div class="bio_line">
        <span>CPU:</span>
        DoggoBrain KindaStupid @ unknown
      </div>
      <div class="bio_line">
        <span>GPU:</span>
        DoggoEyes NearSighted
      </div>
    </div>
  </div>
  <div class="terminal_prompt">
    <span class="terminal_domain">{siteconfig.profile.props}</span>
    :
    <span class="terminal_path">~</span>
    $ ls ./links
  </div>
  <div class="links_container">
    {#each siteconfig.profile.links as link (link.name)}
      <a href={link.url} rel="external" target="_blank"><Icon icon={link.icon} />{link.name}</a>
    {/each}
  </div>
</div>

<style>
  .container {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;
    overflow-wrap: normal;
    word-break: normal;
    margin: 1rem;
  }

  .terminal_prompt {
    display: flex;
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
  }

  .bio_info {
    flex-grow: 1;
    margin-top: 1rem;
  }

  .bio_line {
    display: flex;
  }

  .bio_line span {
    width: 6rem;
    font-weight: 600;
  }

  .links_container {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    margin: 0.25rem 0 1rem 0;
  }

  .links_container a {
    text-decoration: none;
    padding: 0.5rem;
  }

  .links_container a:hover {
    text-decoration: underline;
  }

  .links_container :global(svg) {
    margin-right: 0.5rem;
  }

  @media (min-width: 800px) {
    .bio_container {
      flex-direction: row;
    }

    .bio_container img {
      width: 13rem;
      height: 13rem;
      margin: 1.5rem 3rem 2.5rem 3rem;
    }
  }
</style>
