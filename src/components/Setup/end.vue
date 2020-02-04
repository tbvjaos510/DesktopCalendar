<template>
  <div class="uk-margin-large-top uk-text-center">
    <p class="uk-text-large">
      이제 모두 끝났습니다. <br />
      <span class="uk-text-small">
        혹시 다시 설정하고 싶으면 뒤로 드래그 해주세요.
      </span>
    </p>
    <vk-button
      class="uk-margin-large-top"
      size="small"
      type="primary"
      @click="start"
      >시작하기</vk-button
    >
  </div>
</template>

<script>
import { remote } from "electron";
export default {
  name: "start-end",
  methods: {
    start() {
      remote.ipcMain.emit("settingend");
    }
  }
};
</script>

<style></style>
