<script lang="ts">
  import {
    icon as faIcon,
    type IconDefinition,
    type AbstractElement
  } from '@fortawesome/fontawesome-svg-core'

  interface Props {
    icon: IconDefinition
    size?: string
    color?: string
    class?: string
  }

  let { icon, size = '1rem', color = 'currentColor', class: className = '' }: Props = $props()

  let renderedIcon = $derived<AbstractElement>(faIcon(icon).abstract[0])

  let viewBox = $derived<string>(
    `0 0 ${renderedIcon.attributes.viewBox?.split(' ').slice(2).join(' ')}`
  )

  let paths = $derived<AbstractElement[]>(
    (renderedIcon.children || []).filter((c) => c.tag === 'path')
  )
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {viewBox}
  width={size}
  height={size}
  fill={color}
  class={className}
>
  <!-- ugly fix to pass lint lol, DO NOT USE INDEX AS ID!!! -->
  {#each paths as path, i (i)}
    <path d={path.attributes.d} />
  {/each}
</svg>
