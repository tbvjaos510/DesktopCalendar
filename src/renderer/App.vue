<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import $ from 'jquery'
var win = require('electron').remote.getCurrentWindow()
$(document).on('mouseover', 'button, a, input', function () {
  win.setIgnoreMouseEvents(false)
})
$(document).on('mouseleave', 'button, a, input', function () {
  win.setIgnoreMouseEvents(true, { forward: true })
})
export default {
  name: 'desktop-calendar'
}
</script>

<style>
  /* CSS */

</style>
