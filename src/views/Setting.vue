<template>
  <div class="uk-padding-small" id="setting-main">
    <setting-header />
    <setting-timer :setting="settings" />
    <setting-calendar :setting="settings" :parents="parents" />
    <setting-program :setting="settings" />
  </div>
</template>

<script>
import SettingHeader from "../components/Settings/Header";
import SettingTimer from "../components/Settings/SettingTimer";
import SettingCalendar from "../components/Settings/SettingCalendar";
import SettingProgram from "../components/Settings/SettingProgram";
import { ipcRenderer, remote } from "electron";
export default {
  name: "setting",
  data() {
    return {
      settings: this.$store.getters.getAll,
      parents: remote.getCurrentWindow().getParentWindow().webContents
    };
  },
  mounted() {
    ipcRenderer.on("init-options", (event, store) => {
      // console.log(store)
      this.settings = store;
      this.settings.changeOption = function(key, value) {
        remote
          .getCurrentWindow()
          .getParentWindow()
          .webContents.send("setOption", {
            key: key,
            value: value
          });
        this[key] = value;
      };
    });
  },
  components: {
    SettingHeader,
    SettingTimer,
    SettingCalendar,
    SettingProgram
  }
};
</script>

<style></style>
