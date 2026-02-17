<script lang='ts'>
	import { siteconfig } from "$lib/config/_loader"
	import { getBg, getTerminal } from "$lib/utils/get-page-state.svelte"
	import Icon from "./Icon.svelte"
	import { fly } from "svelte/transition"
	import { faXmark } from "@fortawesome/free-solid-svg-icons"
	import { page } from "$app/state"

	let { children } = $props()
	let currBg = $derived(siteconfig.profile.bg[getBg.index])
	const pinnedTab :{name :string, route :string}[] = [
		{name: "Home", route: "/"},
		{name: "Folio", route: "/folio"},
		{name: "About", route: "/about"},
	]

	// do drag init
  let offsetX :number = $state(0)
  let offsetY :number = $state(0)
  const dragState :{startX: number, startY: number, initialX :number, initialY :number, isDrag :boolean} = {
    startX: 0, // startX, startY is used to calculate mouse move distance
    startY: 0,
    initialX: 0, // initialX, initialY is used to store last window offset
    initialY: 0,
    isDrag: false
  }

  function handlePointerDown(e :PointerEvent) {
    if (window.innerWidth > 800) {
      dragState.isDrag = true
      dragState.startX = e.clientX
      dragState.startY = e.clientY
      const target = e.target as HTMLElement
      target.setPointerCapture(e.pointerId)
    }
  }

  function handlePointerMove(e :PointerEvent) {
    if (!dragState.isDrag) return
    const dx = e.clientX - dragState.startX
    const dy = e.clientY - dragState.startY
    offsetX = dragState.initialX + dx
    offsetY = dragState.initialY + dy
  }

  function handlePointerUp(e :PointerEvent) {
    if (!dragState.isDrag) return
    dragState.isDrag = false
    dragState.initialX = $state.snapshot(offsetX)
    dragState.initialY = $state.snapshot(offsetY)
    const target = e.target as HTMLElement
    target.releasePointerCapture(e.pointerId)
  }

	// do Terminal close function
	function doCloseTerminal() {
		if (window.innerWidth > 800) {
			getTerminal.isClosed = true
		}
	}
</script>

<svelte:head>
	<title>{pinnedTab.find(t => t.route === page.url.pathname)?.name ?? "Err"} | Turbo Energy Coyote</title>
</svelte:head>

{#if getTerminal.isClosed === false}
<div class="terminal_container" style:--curr-border-color={currBg.theme ?? "initial"} style:--offset-x="{offsetX}px" style:--offset-y="{offsetY}px" transition:fly={{ y: 10, duration: 300 }}>
	<div class="terminal_title">
		<div class="title_container" role="none" onpointerdown={handlePointerDown} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerUp}>
			{#if !pinnedTab.some(item => item.route === page.url.pathname)}
				<h1 class="title_btn_pressed">Err</h1>
			{/if}
			{#each pinnedTab as tab}
				{#if page.url.pathname === tab.route}
				<h1 class="title_btn_pressed">{tab.name}</h1>
				{:else}
				<a href={tab.route} class="title_btn">{tab.name}</a>
				{/if}
			{/each}
		</div>
		<div class="close_btn" onclick={doCloseTerminal} role="none"><Icon icon={faXmark} size="0.6rem" color="#ffff" /></div>
	</div>
	<div class="terminal_window">{@render children?.()}</div>
</div>
{/if}

<style>
	@import '$lib/styles/_variable.css';

	.terminal_container {
		display: flex;
		flex-direction: column;
		width: calc(100vw - 32px);
		min-height: 30rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
		margin-left: auto;
		margin-right: auto;
		color: var(--curr-border-color, var(--border-color));
		border-radius: 0.375rem;
		filter: drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08));
		box-shadow: 0 0 0 0.75px;
	}

	.terminal_title {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		height: 3rem;
		background-color: var(--title-bg-color);
		border-radius: 0.375rem 0.375rem 0 0;
		box-shadow: inset 0 2px 10px 0 rgba(110, 116, 113, 0.05);
		color: var(--text-color);
	}

	.title_container {
		height: inherit;
		overflow-x: auto;
		overflow-y: hidden;
		flex-grow: 1;
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		align-items: flex-end;
	}

	.title_btn {
		font-size: 1rem;
		line-height: 1.75rem;
		text-decoration: none;
		color: rgb(154, 154, 154);
		margin: 0 0 0 0.5rem;
		padding: 0.4rem 1rem 0.25rem 1rem;
		border-radius: 0.125rem 0.125rem 0 0;
	}

	.title_btn_pressed {
		white-space: nowrap;
		font-size: 1rem;
		line-height: 1.75rem;
		font-weight: inherit;
		text-decoration: none;
		font-weight: 500;
		margin: 0 0 0 0.5rem;
		padding: 0.4rem 1rem 0.25rem 1rem;
		border-radius: 0.125rem 0.125rem 0 0;
		background-color: var(--title-btn-activate);
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}

	.title_btn:hover {
		background-color: var(--title-btn-hover);
		transition: 0.1s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.close_btn {
		display: flex;
		flex-shrink: 0;
		background-color: rgb(138, 138, 138);
		border-radius: 9999px;
		height: 1.35rem;
		width: 1.35rem;
		margin: 0 1rem;
		justify-content: center;
		align-items: center;
		cursor: not-allowed;
	}

	.terminal_window {
		width: 100%;
		flex-grow: 1;
		background-color: var(--terminal-color);
		border-radius: 0 0 0.375rem 0.375rem;
		color: var(--text-color);
	}

	@media (min-width: 800px) {
		.terminal_container {
			width: calc(800px - 16px);
			margin-top: 15dvh;
			transform: translate(var(--offset-x, 0px), var(--offset-y, 0px));
		}

		.title_btn, .title_btn_pressed{
			margin: 0 0 0 1rem;
			padding: 0.4rem 3rem 0.25rem 3rem;
		}

		.title_container {
			cursor: grab;
      user-select: none;
      touch-action: none;
		}

		.title_container:active {
			cursor: grabbing;
		}

		.close_btn {
			background-color: var(--close-btn);
			cursor: pointer;
		}
	}
</style>