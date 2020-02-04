<template>
  <h1
    class="uk-text-center uk-margin-large-top"
    :style="{
      'font-size': timeStyle.size,
      'font-weight': timeStyle.weight,
      color: timeStyle.color
    }"
    style="user-select:none"
  >
    {{ datenow }}
  </h1>
</template>

<script>
import { moment } from "fullcalendar";
export default {
  name: "timer",
  data() {
    return {
      datenow: "wait.."
    };
  },
  methods: {
    time() {
      // 현재 시간 반환
      this.datenow = moment(new Date())
        .locale("ko")
        .format(this.timeMoment);
    }
  },
  mounted() {
    // 마운트 됐을 때
    this.time();
    setTimeout(() => {
      this.interval = setInterval(this.time, 1000);
    }, 1000 - new Date().getMilliseconds()); // Millisecond 맞춤
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    timeMoment() {
      return this.$store.getters.getOptions("timeMoment");
    },
    timeStyle() {
      return this.$store.getters.getOptions("timerStyle");
    }
  }
};
</script>

<style lang="scss"></style>
