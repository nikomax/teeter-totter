<template>
  <div
      class="object"
      :class="[
          {
            'object_right': rightDir,
            'object_last': last,
          },
          type ? `object_${OBJECT_TYPES[type]}` : ''
      ]"
      :style="{
        fontSize: `${weight}px`,
        '--distance': `${distance}`
      }"
  >
    <span>{{weight}}</span>
  </div>
</template>

<script>
import { OBJECT_TYPES } from "@/utils/constants";

export default {
  name: 'TObject',
  props: {
    weight: {
      type: Number,
      default: 1
    },
    rightDir: Boolean,
    last: Boolean,
    type: {
      type: Number,
      default: 1
    },
    distance: {
      type: Number,
      default: 1
    }
  },
  setup() {

    return {
      OBJECT_TYPES
    }
  }
}
</script>

<style lang="sass">
.object
  --color: rgba(0, 128, 0, 0.5)
  height: 10em
  width: 10em
  background-color: var(--color)
  position: absolute
  bottom: 0
  right: calc(var(--distance)*100px - 50px)
  transform: translateX(50%)
  display: flex
  justify-content: center
  align-items: center
  span
    font-size: 14px
    font-weight: bold
  &_right
    right: auto
    left: calc(var(--distance)*100px - 50px)
    transform: translateX(-50%)
  &_circle
    border-radius: 50%
  &_triangle
    background-color: transparent
    span
      margin-top: 60%
    &:before
      z-index: -1
      content: ''
      position: absolute
      bottom: 0
      width: 0
      height: 0
      border-style: solid
      border-width: 0 5em 5em 5em
      border-color: transparent transparent var(--color) transparent
  &_last
    z-index: 2
    --color: rgba(255, 252, 2, 0.8)

</style>
