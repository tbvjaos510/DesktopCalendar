<template>
  <div class="uk-margin-large-top uk-text-center">
    <p class="uk-text-lead">프로그램 세부 설정</p>
    <p>
      시작시 프로그램 자동 실행
      <input
        type="checkbox"
        class="uk-checkbox"
        :value="autoStart"
        @change="changeMode"
      />
    </p>
    <p>
      달력 갱신 시간
      <select class="uk-select uk-width-1-6" @change="setTime">
        <option value="60">1분</option>
        <option value="300">5분</option>
        <option value="600" selected="selected">10분</option>
        <option value="1800">30분</option>
        <option value="3600">1시간</option>
        <option value="10800">3시간</option>
      </select>
    </p>
    <vk-button
      class="uk-position-medium uk-position-top-right"
      type="primary"
      size="small"
      uk-slideshow-item="5"
      >다음</vk-button
    >
  </div>
</template>

<script>
import Launch from "auto-launch";
const startup = new Launch({
  name: "Desktop Calendar"
});
export default {
  data() {
    return {
      autoStart: false
    };
  },
  name: "start-option",
  methods: {
    changeMode(e) {
      if (e.target.checked) {
        startup.enable();
      } else {
        startup.disable();
      }
    },
    setTime(e) {
      this.$store.commit("setOptions", {
        key: "refreshTime",
        value: e.target.value
      });
    }
  },
  mounted() {
    startup.isEnabled().then(enabled => {
      this.autoStart = enabled;
    });
  }
};
</script>

<style></style>
