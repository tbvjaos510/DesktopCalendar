<template>
  <div class="uk-padding-large uk-padding-remove-top">
    <h2>프로그램 설정</h2>
    시작 시 프로그램 실행
    <input
      type="checkbox"
      v-model="onstartup"
      class="uk-checkbox"
      @change="changeMode"
    />
    <p>
      달력 갱신 시간
      <select
        class="uk-select uk-width-1-6"
        v-model="setting.refreshTime"
        @change="setTime"
      >
        <option value="60">1분</option>
        <option value="300">5분</option>
        <option value="600" selected="selected">10분</option>
        <option value="1800">30분</option>
        <option value="3600">1시간</option>
        <option value="10800">3시간</option>
      </select>
    </p>
    <p>
      <vk-button type="danger" size="small" @click="restartApp"
        >초기화</vk-button
      >
    </p>
  </div>
</template>

<script>
import Launch from "auto-launch";
import { remote } from "electron";
import fs from "fs";
const start = new Launch({
  name: "Desktop Calendar"
});
export default {
  data() {
    return {
      onstartup: false
    };
  },
  name: "setting-program",
  mounted() {
    start.isEnabled().then(enabled => {
      this.onstartup = enabled;
    });
  },
  methods: {
    changeMode(e) {
      if (e.target.checked) {
        start.enable();
      } else {
        start.disable();
      }
    },
    restartApp() {
      localStorage.clear();
      fs.unlink(this.appdata + "/calendar.json", e => {
        if (e) console.log(e);
        fs.unlink(this.appdata + "/token.json", e => {
          if (e) console.log(e);
          remote.app.relaunch();
          remote.app.exit(0);
        });
      });
    },
    setTime(e) {
      this.setting.changeOption("refreshTime", e.target.value);
    }
  },
  props: ["setting"]
};
</script>

<style></style>
