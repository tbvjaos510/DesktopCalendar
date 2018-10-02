<template>
  <div>
    <timer />
    <select class="uk-select uk-width-small uk-position-large uk-position-top-right">
      <option value="1">1</option>
      <option value="2">2</option>  
    </select>
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
      this.$store.commit('setOptions', message)
    })
  }
}
</script>

<style lang="scss">

</style>
