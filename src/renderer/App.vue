<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import $ from 'jquery'
var win = require('electron').remote.getCurrentWindow()

let urlParams = new URLSearchParams(window.location.search)
let mode = urlParams.get('mode')

export default {
  name: 'desktop-calendar',
  beforeCreate () {
    if (mode === 'setting') {
      this.$router.push('setting')
    } else {
      $(document).on('mouseenter', 'button, a, .gcal-body', function (e) {
        win.setIgnoreMouseEvents(false)
      })
      $(document).on('mouseleave', 'button, a, .gcal-body', function (e) {
        const pos = e.currentTarget.getBoundingClientRect()
        if ((e.clientX > pos.left && e.clientY > pos.top) && (e.clientX < pos.left + pos.width && e.clientY < pos.top + pos.height)) return true
        win.setIgnoreMouseEvents(true, { forward: true })
      })
      // $(document).on('click', 'button, a', function (e) {
      //   win.setIgnoreMouseEvents(true, { forward: true })
      // })
    }
  }
}
</script>

<style>
  /* CSS */

</style>
