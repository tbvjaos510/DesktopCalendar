<template>
  <div>
    <timer />
    <calendar />
  </div>
</template>

<script>
import Timer from "../components/Status/Timer";
import calendar from "../components/Calendar";
import { ipcRenderer } from "electron";
// import $ from 'jquery'
export default {
  name: "Main-page",
  components: {
    Timer,
    calendar
  },
  mounted() {
    this.setIgnore();
    this.disableIgnore();
    ipcRenderer.on("setOption", (event, message) => {
      // console.log('set Options')
      this.$store.commit("setOptions", message);
    });
  }
};
</script>

<style lang="scss"></style>
