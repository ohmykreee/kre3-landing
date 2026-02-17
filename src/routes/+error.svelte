<script lang="ts">
  import { page } from '$app/state'
  import { siteconfig } from '$lib/config/_loader'
  import { getBg } from '$lib/utils/get-page-state.svelte'
  import avatar from '$lib/assets/avatar.jpg'

  let currTheme :string | undefined = $derived(siteconfig.profile.bg[getBg.index].theme)
</script>

<div class="error_container" style:--curr-border-color={currTheme ?? "initial"}>
  <a href="/"><img src={avatar} alt="Click to return main page" /></a>
  <p>{page.status} | {page.error?.message}<br />
  You can use the navigation above to go back to Home.
  </p>
</div>

<style>
	@import '$lib/styles/_variable.css';

  .error_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem;
  }

  .error_container img {
    border-radius: 9999px;
    flex-shrink: 0;
    width: 30vw;
    margin: 1.5rem 1rem;
    color: var(--curr-border-color, var(--border-color));
    box-shadow: 0 0 0 2px;
  }

  .error_container p {
    font-size: 1rem;
    line-height: 1.75rem;
    text-align: center;
  }

  @media (min-width: 800px) {
    .error_container img {
        width: 13rem;
    }

    .error_container p {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
  }
</style>