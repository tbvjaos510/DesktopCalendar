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
const $ = window.$
export default {
  name: 'Main-page',
  components: {
    Timer,
    calendar
  },
  mounted () {
    ipcRenderer.on('setOption', (event, message) => {
      this.$store.commit('setOptions', message)
    })
    $(document).on('mouseenter', 'button, a, .gcal-body, .event-add', window.enableMouse)
    $(document).on('mouseleave', 'button, a, .gcal-body, .event-add', window.disableMouse)
  }
}
</script>

<style lang="scss">

</style>
