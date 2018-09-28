<template>
  <h1 class="uk-text-center uk-margin-large-top timer-number">{{ datenow }}</h1>
</template>

<script>
export default {
  name: 'timer',
  data () {
    return {
      datenow: 'wait..'
    }
  },
  methods: {
    time () { // 현재 시간 반환
      this.datenow = new Date().toLocaleTimeString()
    }
  },
  mounted () { // 마운트 됐을 때
    this.time()
    setTimeout(() => {
      this.interval = setInterval(this.time, 1000)
    }, 1000 - new Date().getMilliseconds()) // Millisecond 맞춤
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss">
.timer-number {
  font-weight: 500;
  font-size: 6rem; 
}
</style>
