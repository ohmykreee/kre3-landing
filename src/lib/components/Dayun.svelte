<script lang="ts">
  import defaultImage from '$lib/assets/dayun.webp'
  import defaultAudio from '$lib/assets/dayun16.webm'
  import { untrack } from 'svelte'
  import { scale } from 'svelte/transition'
  import { backOut } from 'svelte/easing'

  interface Props {
    image?: string
    audio?: string
  }
  let { image = defaultImage, audio = defaultAudio }: Props = $props()
  let isOpen: boolean = $state(false)
  let isDisabled: boolean = $state(false)

  function portal(node: HTMLElement) {
    const target = document.body
    target.appendChild(node)

    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node)
        }
      }
    }
  }

  $effect(() => {
    if (isOpen) {
      isDisabled = true
      const audioPlay = new Audio(audio)
      audioPlay.load()
      audioPlay.play()
      const id = setTimeout(() => {
        untrack(() => {
          isOpen = false
          isDisabled = false
        })
      }, 1000)
      return () => {
        clearTimeout(id)
      }
    }
  })
</script>

<label class="switch">
  <input type="checkbox" bind:checked={isOpen} disabled={isDisabled} />
  <div class="button">
    <div class="light"></div>
    <div class="dots"></div>
    <div class="characters"></div>
    <div class="shine"></div>
    <div class="shadow"></div>
  </div>
</label>
{#if isOpen}
  <div
    class="dayun_img"
    use:portal
    style:--dayun-bg="url({image})"
    in:scale={{
      duration: 300,
      easing: backOut
    }}
  ></div>
{/if}

<style>
  .dayun_img {
    position: fixed;
    background-image: var(--dayun-bg);
    z-index: 100;
    inset: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  /* from https://uiverse.io/Nawsome/empty-snail-69 */
  .switch {
    display: block;
    background-color: black;
    width: 150px;
    height: 195px;
    box-shadow:
      0 0 10px 2px rgba(0, 0, 0, 0.2),
      0 0 1px 2px black,
      inset 0 2px 2px -2px white,
      inset 0 0 2px 15px #47434c,
      inset 0 0 2px 22px black;
    border-radius: 5px;
    padding: 20px;
    perspective: 700px;
  }

  .switch input {
    display: none;
  }

  .switch input:checked + .button {
    transform: translateZ(20px) rotateX(25deg);
    box-shadow: 0 -10px 20px #ff1818;
  }

  .switch input:checked + .button .light {
    animation: flicker 0.2s infinite 0.3s;
  }

  .switch input:checked + .button .shine {
    opacity: 1;
  }

  .switch input:checked + .button .shadow {
    opacity: 0;
  }

  .switch .button {
    display: block;
    transition: all 0.3s cubic-bezier(1, 0, 1, 1);
    transform-origin: center center -20px;
    transform: translateZ(20px) rotateX(-25deg);
    transform-style: preserve-3d;
    background-color: #9b0621;
    height: 100%;
    position: relative;
    cursor: pointer;
    background: linear-gradient(#980000 0%, #6f0000 30%, #6f0000 70%, #980000 100%);
    background-repeat: no-repeat;
  }

  .switch .button::before {
    content: '';
    background:
      linear-gradient(
          rgba(255, 255, 255, 0.8) 10%,
          rgba(255, 255, 255, 0.3) 30%,
          #650000 75%,
          #320000
        )
        50% 50%/97% 97%,
      #b10000;
    background-repeat: no-repeat;
    width: 100%;
    height: 50px;
    transform-origin: top;
    transform: rotateX(-90deg);
    position: absolute;
    top: 0;
  }

  .switch .button::after {
    content: '';
    background-image: linear-gradient(#650000, #320000);
    width: 100%;
    height: 50px;
    transform-origin: top;
    transform: translateY(50px) rotateX(-90deg);
    position: absolute;
    bottom: 0;
    box-shadow:
      0 50px 8px 0px black,
      0 80px 20px 0px rgba(0, 0, 0, 0.5);
  }

  .switch .light {
    opacity: 0;
    animation: light-off 1s;
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(#ffc97e, #ff1818 40%, transparent 70%);
  }

  .switch .dots {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(transparent 30%, rgba(101, 0, 0, 0.7) 70%);
    background-size: 10px 10px;
  }

  .switch .characters {
    position: absolute;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(white, white) 50% 20%/5% 20%,
      radial-gradient(circle, transparent 50%, white 52%, white 70%, transparent 72%) 50% 80%/33%
        25%;
    background-repeat: no-repeat;
  }

  .switch .shine {
    transition: all 0.3s cubic-bezier(1, 0, 1, 1);
    opacity: 0.3;
    position: absolute;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(white, transparent 3%) 50% 50%/97% 97%,
      linear-gradient(
          rgba(255, 255, 255, 0.5),
          transparent 50%,
          transparent 80%,
          rgba(255, 255, 255, 0.5)
        )
        50% 50%/97% 97%;
    background-repeat: no-repeat;
  }

  .switch .shadow {
    transition: all 0.3s cubic-bezier(1, 0, 1, 1);
    opacity: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent 70%, rgba(0, 0, 0, 0.8));
    background-repeat: no-repeat;
  }

  @keyframes flicker {
    0% {
      opacity: 1;
    }

    80% {
      opacity: 0.8;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes light-off {
    0% {
      opacity: 1;
    }

    80% {
      opacity: 0;
    }
  }
</style>
