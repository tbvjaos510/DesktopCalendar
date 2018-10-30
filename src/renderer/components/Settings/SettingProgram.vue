<template>
  <div class="uk-padding-large uk-padding-remove-top">
    <h2>프로그램 설정</h2>
    <input type="checkbox" v-model="onstartup" class="uk-checkbox" @change="changeMode"> 시작 시 프로그램 실행
    <p>
      <vk-button type="danger" size="small" @click="restartApp">초기화</vk-button>
    </p>
  </div>
</template>

<script>
import Launch from 'auto-launch'
import { remote } from 'electron'
import fs from 'fs'
const start = new Launch({
  name: 'Desktop Calendar'
})
export default {
  data () {
    return {
      onstartup: false
    }
  },
  name: 'setting-program',
  mounted () {
    start.isEnabled()
      .then(enabled => {
        console.log(enabled)
        this.onstartup = enabled
      })
  },
  methods: {
    changeMode (e) {
      if (e.target.checked) {
        start.enable()
      } else {
        start.disable()
      }
    },
    restartApp () {
      fs.unlink(this.appdata + '/calendar.json', (e) => {
        if (e) console.log(e)
        fs.unlink(this.appdata + '/token.json', (e) => {
          if (e) console.log(e)
          remote.app.relaunch()
          remote.app.exit(0)
        })
      })
    }
  }
}
</script>

<style>

</style>
