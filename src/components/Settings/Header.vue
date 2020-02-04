<template>
  <vk-sticky>
    <vk-card class="setting-header" type="default" padding="small">
      <img src="icon.png" alt="Desktop Calendar" id="main-icon" />
      <span class="uk-h3"
        >Desktop Calendar 설정
        <span class="uk-h4">{{ currentVersion }}</span></span
      >
    </vk-card>
  </vk-sticky>
</template>

<script>
import { remote } from "electron";
export default {
  data() {
    return {
      currentVersion: remote.app.getVersion()
    };
  },
  name: "setting-header"
};
</script>

<style lang="scss">
#main-icon {
  width: 50px;
}
.setting-header {
  box-shadow: none !important;
}
</style>
