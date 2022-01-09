<template>
  <div class="teeter-totter">
    <div v-if="isEnded" class="teeter-totter__overlay">simulation is ended</div>
    <div class="teeter-totter__values">
      Left kgm: {{leftPower}} <br>
      Right kgm: {{rightPower}} <br>
      Diff (Left - Right): {{powerDiff}} <br>
      Bending percentage: {{bending}}
    </div>
    <div class="teeter-totter__actions">
      <button @click="restart">restart</button>
      <button @click="isPlaying ? pause() : play()" :disabled="isEnded">
        {{ isPaused ? 'continue' : isPlaying  ? 'pause' : 'play' }}
      </button>
    </div>
    <div class="teeter-totter__beam" :style="{transform: `rotate(${-angle}deg)`}">
      <div
          v-if="fallingObject"
          class="teeter-totter__falling-objects"
          :style="{
            transformOrigin: `${80 - (20 * (fallingObject.distance - 1))}% 50%`,
            transform: `rotate(${angle}deg)`,
          }"
      >
        <t-object
            :type="fallingObject.type"
            :weight="fallingObject.weight"
            :distance="fallingObject.distance"
            :style="{bottom: `${fallingPos}px`}"
            last
        />
      </div>
      <div class="teeter-totter__beam-measure">
        <div v-for="index in BEAM_LENGTH" :key="index"></div>
      </div>
      <div class="teeter-totter__beam-left">
        <t-object
            v-for="(object, index) in leftObjects"
            :key="index"
            :type="object.type"
            :weight="object.weight"
            :distance="object.distance"
        />
      </div>
      <div class="teeter-totter__beam-right">
        <t-object
            v-for="(object, index) in rightObjects"
            :key="index"
            :type="object.type"
            :weight="object.weight"
            :distance="object.distance"
            right-dir
            :last="index === rightObjects.length - 1"
        />
      </div>
    </div>
    <div class="teeter-totter__block"></div>
    <div class="teeter-totter__stage"></div>
  </div>
</template>

<script>
import {BEAM_LENGTH, MAX_PRESSURE} from "@/utils/constants";
import TObject from "@/components/TObject";
import {computed, onMounted, ref} from "vue";
import randomObject from "@/utils/randomObject";

const reducer = (prev, cur) => cur.weight * cur.distance + prev
export default {
  name: 'TeeterTotter',
  components: {TObject},
  setup () {
    // Flags
    const isPaused = ref(false)
    const isPlaying = ref(false)
    const isEnded = ref(false)

    // Objects
    const fallingObject = ref(null)
    const leftObjects = ref([])
    const rightObjects = ref([])

    // Computed Values
    const leftPower = computed(() => leftObjects.value.reduce(reducer, 0))
    const rightPower = computed(() => rightObjects.value.reduce(reducer, 0))
    const powerDiff = computed(() => leftPower.value - rightPower.value)
    const bending = computed(() => Math.round((powerDiff.value/MAX_PRESSURE) * 100))
    const angle = computed(() => 15 * bending.value/100)

    // Falling vars
    const fallingPos = ref(500)
    const interval = ref(null)
    const timesToRun = ref(5)

    const play = () => {
      if (isPaused.value) {
        isPlaying.value = true
        isPaused.value = false
      } else {
        isPlaying.value = true
        fallingPos.value = 500
        fallingObject.value = randomObject()
        rightObjects.value.push(randomObject())
        timesToRun.value = 5
      }
      interval.value = setInterval(() => {
        if (timesToRun.value) {
          fallingPos.value -= 100
        } else {
          leftObjects.value.push(fallingObject.value)
          fallingObject.value = null
          clearInterval(interval.value)
          if (Math.abs(powerDiff.value) < 20 && Math.abs(bending.value) < 30) {
            play()
          } else {
            isEnded.value = true
          }
        }
        timesToRun.value -= 1
      }, 1000)
    }

    const pause = () => {
      isPlaying.value = false
      isPaused.value = true
      clearInterval(interval.value)
    }

    const restart = () => {
      isEnded.value = false
      isPlaying.value = false
      clearInterval(interval.value)
      leftObjects.value = []
      rightObjects.value = []
      fallingObject.value = null
    }

    onMounted(() => {
      document.addEventListener("keydown", (e) => {
        if (fallingObject.value) {
          if (e.key === "ArrowLeft" && fallingObject.value.distance < BEAM_LENGTH/2) {
            fallingObject.value.distance += 1
          }
          if (e.key === "ArrowRight" && fallingObject.value.distance > 1) {
            fallingObject.value.distance -= 1
          }
        }
      })
    })

    return {
      BEAM_LENGTH,
      fallingObject,
      leftObjects,
      rightObjects,
      leftPower,
      rightPower,
      powerDiff,
      bending,
      angle,
      fallingPos,
      play,
      pause,
      isPlaying,
      isPaused,
      restart,
      isEnded
    }
  }
}
</script>

<style lang="sass">
.teeter-totter
  width: 1400px
  margin: 0 auto
  height: 100vh
  display: flex
  flex-direction: column
  align-items: center
  justify-content: flex-end
  &__falling-objects
    position: absolute
    top: 0
    left: 0
    width: 50%
    height: 0
    z-index: 3
  &__beam
    position: relative
    width: 1000px
    height: 10px
    background-color: saddlebrown
    transform-origin: center bottom
    transition: transform 0.3s ease-out
  &__beam-measure
    position: absolute
    top: 0
    left: 0
    height: 100%
    width: 100%
    display: flex
    div
      flex-grow: 1
      border: 1px solid black
  &__beam-left, &__beam-right
    width: 50%
    position: absolute
    top: 0
  &__beam-left
    left: 0
  &__beam-right
    right: 0
  &__stage
    height: 20px
    width: 100%
    border-radius: 10px 10px 0 0
    background-color: black
  &__block
    width: 0
    height: 0
    border-style: solid
    border-width: 0 50px 130px 50px
    border-color: transparent transparent gray transparent
    margin: 0 auto
  &__values
    position: fixed
    top: 0
    left: 0
    background-color: aliceblue
    padding: 10px
  &__actions
    z-index: 9
    position: fixed
    top: 0
    left: 50%
    transform: translateX(-50%)
    background-color: #0085ff
    padding: 10px
    button
      text-transform: uppercase
      padding: 3px
      margin: 5px
  &__overlay
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    display: flex
    justify-content: center
    align-items: center
    z-index: 4
    font-size: 30px
    background-color: rgba(255, 255, 255, 0.8)

</style>
