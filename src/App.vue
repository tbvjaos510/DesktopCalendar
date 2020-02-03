<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// Use UIkit
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
UIkit.use(Icons);
export default {
  name: "desktop-calendar",
  mounted() {}
};
</script>

<style>
/* CSS */
</style>
