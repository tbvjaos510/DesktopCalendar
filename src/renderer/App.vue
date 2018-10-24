<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import {ipcRenderer, remote} from 'electron'
export default {
  name: 'desktop-calendar',
  mounted () {
    const $ = window.$
    ipcRenderer.on('setting', () => {
      $(document).off('mouseenter', 'button, a, .gcal-body, .event-add, .timeShow', window.enableMouse)
      $(document).off('mouseleave', 'button, a, .gcal-body, .event-add, .timeShow', window.disableMouse)
      this.$router.push('setting')
      remote.BrowserWindow.getFocusedWindow().show()
    })
  }
}
</script>

<style>
  /* CSS */

</style>
