<template>
  <div class="uk-padding-large uk-padding-remove-top">
    <h2>Calendar 설정</h2>
    <span class="uk-text-muted">
      <vk-button type="primary" size="small" @click="deleteToken">
        다른 계정으로 로그인
      </vk-button>
      <!-- <p>
        <input type="text" class="uk-input uk-form-small uk-width-small" :value="setting.calendar.background" @focus="backColor = true" @blur="backColor = false" readonly>
          <chrome-picker v-model="setting.calendar.background" v-if="backColor" @focus="backColor = true"/>
        </input>
      </p> -->
    </span>
  </div>
</template>

<script>
import fs from 'fs'
import { Chrome } from 'vue-color'

export default {
  data () {
    return {
      backColor: false
    }
  },
  components: {
    'chrome-picker': Chrome
  },
  name: 'setting-calendar',
  methods: {
    deleteToken () {
      if (fs.existsSync('token.json')) {
        fs.unlink('token.json', (err) => {
          if (err) return console.error(err)
          this.parents.webContents.reload()
        })
      } else {
        this.parents.webContents.reload()
      }
    }
  },
  props: ['setting', 'parents']
}
</script>

<style>

</style>
