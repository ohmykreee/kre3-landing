<script lang="ts">
  import { siteconfig } from "$lib/config/_loader"
</script>

<footer class="footer">
  <p>© 2021-{new Date().getFullYear()} {@html siteconfig.profile.name}. All rights reserved.<br />
  <a href="https://github.com/ohmykreee/kre3-landing" rel="noreferrer" target="_blank">Source Code</a>
  </p>
</footer>

<style>
	@import '$lib/styles/_variable.css';

  .footer {
    width: calc(100vw - 32px);
    font-size: 0.85rem;
    line-height: 1.5rem;
    text-align: center;
    color: var(--text-color);
    margin: 2rem auto;
  }

  @media (min-width: 800px) {
    .footer {
      width: calc(800px - 16px);
    }
  }
</style>