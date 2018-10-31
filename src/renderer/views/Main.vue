<template>
  <div>
    <timer />
    <calendar />
  </div>
</template>

<script>
import Timer from '../components/Status/Timer'
import calendar from '../components/Calendar'
import {ipcRenderer} from 'electron'
export default {
  name: 'Main-page',
  components: {
    Timer,
    calendar
  },
  mounted () {
    ipcRenderer.on('setOption', (event, message) => {
      // console.log('set Options')
      this.$store.commit('setOptions', message)
    })
    // $(document).on('mouseenter', 'button, a, textarea, .uk-input, .gcal-body, .event-add, .timeShow, .color-input', window.enableMouse)
    // $(document).on('mouseleave', 'button, a, textarea, .uk-input, .gcal-body, .event-add, .timeShow, .color-input', window.disableMouse)
  }
}
</script>

<style lang="scss">

</style>
