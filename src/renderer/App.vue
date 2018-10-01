<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import $ from 'jquery'
var win = require('electron').remote.getCurrentWindow()
$(document).on('mouseenter', 'button, a, input, .gcal-body', function () {
  win.setIgnoreMouseEvents(false)
})
$(document).on('mouseleave', 'button, a, input, .gcal-body', function () {
  win.setIgnoreMouseEvents(true, { forward: true })
})
export default {
  name: 'desktop-calendar'
}
</script>

<style>
  /* CSS */

</style>
