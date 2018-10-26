<template>
  <div class="uk-padding-large uk-padding-remove-top">
    <h2>Calendar 설정</h2>
    <span class="uk-text-muted">
      <vk-button type="primary" size="small" @click="deleteToken">
        다른 계정으로 로그인
      </vk-button>
      <p>
        <table>
          <tr class="uk-text-center">
            <td>캘린더 색 설정</td>
            <td>배경 색 설정</td>
          </tr>
          <tr>
            <td>
              <chrome-picker v-model="setting.calendar.color" @input="updateColor" />
            </td>
            <td>
              <chrome-picker v-model="setting.calendar.background" @input="updateColor" />
            </td>
          </tr>
        </table>
      </p>
      <p>
        <h4>버튼 색 설정</h4>
        <vk-button type="primary" size="small" @click="changeButton('primary')">파랑</vk-button>
        <vk-button type="secondary" size="small" @click="changeButton('secondary')">검정</vk-button>
        <vk-button type="danger" size="small" @click="changeButton('danger')">빨강</vk-button>
      </p>
    </span>
  </div>
</template>

<script>
import fs from 'fs'
import { Chrome } from 'vue-color'

export default {
  data () {
    return {
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
    },
    save (key, value) {
      this.setting.changeOption(key, value)
    },
    updateColor (e) {
      this.save('calendar', this.setting.calendar)
    },
    changeButton (type) {
      console.log(type)
      this.setting.calendar.buttonType = type
      this.save('calendar', this.setting.calendar)
    }
  },
  props: ['setting', 'parents']
}
</script>

<style>

</style>
