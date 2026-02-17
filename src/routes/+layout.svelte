<script lang="ts">
	import { siteconfig } from '$lib/config/_loader'
  import { fade } from 'svelte/transition'
  import { getBg, getTerminal } from '$lib/utils/get-page-state.svelte'

	import favicon from '$lib/assets/favicon.svg'
  import ogimage from '$lib/assets/cover.jpg'
  import '@fontsource-variable/ubuntu-sans-mono'
  
	import Controller from '$lib/components/Controller.svelte'
	import Terminal from '$lib/components/Terminal.svelte'
  import Footer from '$lib/components/Footer.svelte'

	let { children } = $props()
  let currBg = $derived(siteconfig.profile.bg[getBg.index])
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
  <meta 
    name="description" 
    content="Here is Kreee, a freelance artist and hobbyist frontend developer dedicated to merging artistic sensibility with technical rationality. Explore my latest works and get in touch." 
  />
  <link rel="canonical" href={siteconfig.baseurl} />
  <meta property="og:title" content="TurboKre - Turbo Energy Coyote" />
  <meta property="og:description" content="Discover a portfolio that blends creative soul with logical craft. View my latest artistic projects and creative coding works." />
  <meta property="og:image" content={ogimage} />
  <meta property="og:type" content="website" />
</svelte:head>

{#key currBg.title}
  <div class={["bg",getTerminal.isClosed? "nodim":""]} style='background-image: url("{currBg.imgUrl}");' transition:fade></div>
{/key}
  <Terminal children={children} />
  <Controller />
  <Footer />

<style>
  @import '$lib/styles/_variable.css';

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    display: flow-root;
    font-family: 'Ubuntu Sans Mono Variable', monospace;
    color: var(--text-color);
    overflow-x: hidden;
    padding: 0;
    margin: 0;
    background-color: var(--bg-color);
    min-height: 100vh;
    scroll-behavior: smooth;
  }

  :global(a) {
    color: inherit;
    text-decoration: underline;
  }

  :global(input, select, textarea, button){
    font-family:inherit;
    color: inherit;
  }

  .bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
    margin: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-position-x: 50%;
    background-position-y: 50%;
    z-index: -100;
  }

  .bg::after {
    content: "";
    display: block;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  .bg.nodim::after {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
  }
</style>