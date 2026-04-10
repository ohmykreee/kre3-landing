<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
</script>

<footer class="footer">
  <p>
    © 2021-{new Date().getFullYear()}
    {@html siteconfig.profile.name}. All rights reserved.
    <br />
    <a href="https://github.com/ohmykreee/kre3-landing" rel="noreferrer" target="_blank">
      Source Code
    </a>
  </p>
</footer>

<style>
  .footer {
    width: 100%;
    font-size: 0.75rem;
    text-align: center;
    color: var(--text-color);
  }
</style>
