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
  }
}
</script>

<style>
  /* CSS */

</style>
