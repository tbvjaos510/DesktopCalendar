<template>
  <div class="uk-margin-large-top uk-text-center">
    <p class="uk-text-lead">프로그램 세부 설정
    </p>
    
    <input type="checkbox" class="uk-checkbox" :value="autoStart" @change="changeMode"> 시작시 프로그램 자동 실행
    
    <vk-button class="uk-position-medium uk-position-top-right" type="primary" size="small" uk-slideshow-item="4">다음</vk-button>
  </div>
</template>

<script>
import Launch from 'auto-launch'
const startup = new Launch({
  name: 'Desktop Calendar'
})
export default {
  data () {
    return {
      autoStart: false
    }
  },
  name: 'start-option',
  methods: {
    changeMode (e) {
      if (e.target.checked) {
        startup.enable()
      } else {
        startup.disable()
      }
    }
  },
  mounted () {
    startup.isEnabled()
      .then((enabled) => {
        this.autoStart = enabled
      })
  }
}
</script>

<style>

</style>
