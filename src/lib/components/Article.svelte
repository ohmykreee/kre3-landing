<script lang="ts">
  import { siteconfig } from '$lib/config/_loader'
  import { getBg } from '$lib/utils/get-page-state.svelte'

  export interface Props {
    title: string
    html: string
  }

  let { title, html }: Props = $props()
  let currTheme: string | undefined = $derived(siteconfig.profile.bg[getBg.index].theme)
</script>

<div class="container" style:--curr-border-color={currTheme ?? 'initial'}>
  <h2>{title}</h2>
  {@html html}
</div>

<style>
  @import '$lib/styles/_variable.css';

  .container {
    padding: 2rem;
    font-size: 1rem;
    line-height: 1.75rem;
    overflow-wrap: normal;
    word-break: normal;
  }
  .container h2 {
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: 700;
    text-transform: capitalize;
  }
  .container :global(h3) {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
  }
  .container :global(h3::before) {
    content: '> ';
  }
  .container :global(h4) {
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 700;
  }
  .container :global(a) {
    font-weight: 600;
    color: var(--curr-border-color, var(--border-color));
  }

  .container :global(span) {
    font-weight: 600;
    color: var(--curr-border-color, var(--border-color));
  }
</style>
