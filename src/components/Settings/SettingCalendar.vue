<template>
  <div class="uk-padding-large uk-padding-remove-top">
    <h2>Calendar 설정</h2>
    <span class="uk-text-muted">
      달력 높이 (0~1)
      <input class="uk-range uk-width-1-2" type="range" v-model="setting.calendarHeight" min="0" max="1" step="0.01" @input="changeHeight">
      <!-- <input type="text" v-model="setting.calendarHeight" class="uk-input uk-form-small uk-width-1-6" @input="changeHeight"> -->
      <p>
        <input type="radio" v-model="setting.calendarType" class="uk-radio" name="calendarType" value="week" @change="changeView"> 3주 보기 <br>
        <input type="radio" v-model="setting.calendarType" class="uk-radio" name="calendarType" value="month" @change="changeView"> 한달 보기
      </p>
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
      <vk-button type="primary" size="small" @click="deleteToken">
        다른 계정으로 로그인
      </vk-button>
      <div class="uk-width-1-1 uk-margin-top" v-if="calendarList.length">
        <h4>사용할 달력 <vk-button type="primary" size="small" @click="saveCalendar">적용</vk-button></h4>
        <ul class="uk-list uk-list-divider uk-width-1-1 uk-text-left itemlist">
          <li v-for="(key) in calendarList" :key="key">
            <input type="checkbox" class="uk-checkbox" v-model="key.checked" :disabled="key.isprimary">
            <span v-vk-tooltip="key.isprimary? '기본 달력입니다': null">{{key.summary}}</span>
          </li>
        </ul>
      </div>

  </div>
</template>

<script>
import fs from 'fs'
import { Chrome } from 'vue-color'
import api from './../Calendar/GoogleApi/api.js'

export default {
  data () {
    return {
      calendarList: []
    }
  },
  components: {
    'chrome-picker': Chrome
  },
  mounted () {
    fs.readFile(this.appdata + '/calendar.json', (err, res) => {
      if (err) return console.error(err)
      res = JSON.parse(res)
      this.calendarList = res
    })
  },
  name: 'setting-calendar',
  methods: {
    auth () {
      api.authorize(key => {
        this.isAuthed = true
        this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + key
        api.setAxios(this.$http)
        api.calendarList(res => {
          // console.log(res)
          this.calendarList = res.data.items.map(function (item) {
            var o = Object.assign({}, item)
            o.checked = true
            if (item.primary) o.isprimary = true
            return o
          })
        })
      })
    },
    saveCalendar () {
      fs.writeFile(this.appdata + '/calendar.json', JSON.stringify(this.calendarList), (err) => {
        if (err) console.error(err)
        this.parents.webContents.reload()
      })
    },
    deleteToken () {
      this.calendarList = []
      console.log(this.appdata);
      if (fs.existsSync(this.appdata + '/token.json')) {
        fs.unlink(this.appdata + '/token.json', (err) => {
          if (err) return console.error(err)
          this.auth()
        })
      } else {
        this.auth()
      }
    },
    save (key, value) {
      this.setting.changeOption(key, value)
    },
    updateColor (e) {
      this.save('calendar', this.setting.calendar)
    },
    changeButton (type) {
      // console.log(type)
      this.setting.calendar.buttonType = type
      this.save('calendar', this.setting.calendar)
    },
    changeView (e) {
      this.save('calendarType', e.target.value)
    },
    changeHeight (e) {
      this.save('calendarHeight', e.target.value)
    }
  },
  props: ['setting', 'parents']
}
</script>

<style>
.itemlist {
  height: 300px;
  overflow: auto;
}
</style>
