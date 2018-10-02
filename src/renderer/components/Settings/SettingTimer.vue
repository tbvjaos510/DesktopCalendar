<template>
  <div class="uk-padding-large uk-padding-remove-top">
    <h2>Time 설정</h2>
    <span class="uk-text-muted">
      표시되는 시간의 형식을 변경합니다. &nbsp;
      <input type="text" id="Timer" class="uk-input uk-width-1-5" :value="setting.timeMoment" @input="changeTime">
      미리보기: <span v-text="exampleMoment"></span>
      <div>
        <vk-button type="primary" size="small" @click="saveMoment">적용하기</vk-button>
        <vk-button type="secondary" size="small" @click="showHelp = !showHelp">문법 설명</vk-button>
        <transition name="fade">
          <table v-if="showHelp" class="uk-table uk-table-striped uk-overflow-auto uk-table-small uk-margin-remove-top time-example">
            <thead>
              <tr>
                <th width="13%">문법</th>
                <th width="18%">설명</th>
                <th width="18%">예시</th>
                <th width="15%">문법</th>
                <th width="15%">설명</th>
                <th width="*">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LT[S]</td>
                <td>로컬 타임 [초]</td>
                <td>{{ met('LTS') }}</td>
                <td>YYYY-MM/DD</td>
                <td>년-월/일</td>
                <td>{{ met('YYYY-MM/DD') }}</td>
              </tr>
              <tr>
                <td>LL</td>
                <td>년월일</td>
                <td>{{ met('LL') }}</td>
                <td>LLLL</td>
                <td>모든 시간</td>
                <td>{{ met('LLLL') }}</td>
              </tr>
              <tr>
                <td>hh:mm:ss</td>
                <td>시분초(24시)</td>
                <td>{{ met('hh:mm:ss') }}</td>
                <td>A h:mm:ss</td>
                <td>시분초(12시)</td>
                <td>{{ met('A h:mm:ss') }}</td>
              </tr>
            </tbody>
          </table>
        </transition>
      </div>
      <br>
      표시되는 시간의 텍스트 크기를 변경합니다. (css style) &nbsp; 
      <input type="text" class="uk-input uk-width-1-6" :value="setting.timerStyle.size || 'wait'" @input="updateSize">
      <br>
      표시되는 시간의 텍스트 굵기를 변경합니다. (css style) &nbsp; 
      <input type="text" class="uk-input uk-width-1-6" :value="setting.timerStyle.weight || 'wait'" @input="updateWeight">
      <br>
      표시되는 시간의 텍스트 색을 변경합니다. (css style) &nbsp; 
      <input type="text" class="uk-input uk-width-1-6" :value="setting.timerStyle.color || 'wait'" @input="updateColor">
     
    </span>
  </div>
</template>

<script>
import { moment } from 'fullcalendar'
// import SystemFonts from 'system-font-families'
// const systemFonts = new SystemFonts()

export default {
  name: 'setting-timer',
  data () {
    return {
      exampleTime: new Date(),
      exampleMoment: null,
      showHelp: false
    }
  },
  methods: {
    changeTime (e) {
      if (typeof e === 'object') {
        this.setting.timeMoment = e.target.value
        this.exampleMoment = moment(this.exampleTime).locale('ko').format(e.target.value)
      } else this.exampleMoment = moment(this.exampleTime).locale('ko').format(e)
    },
    time () {
      this.exampleTime = new Date()
      this.changeTime(document.getElementById('Timer').value)
    },
    met (format) {
      return moment(this.exampleTime).locale('ko').format(format)
    },
    save (key, value) {
      this.setting.changeOption(key, value)
    },
    saveMoment (e) {
      this.save('timeMoment', document.getElementById('Timer').value)
    },
    updateSize (e) {
      this.setting.timerStyle.size = e.target.value
      this.save('timerStyle', this.setting.timerStyle)
    },
    updateWeight (e) {
      this.setting.timerStyle.weight = e.target.value
      this.save('timerStyle', this.setting.timerStyle)
    },
    updateColor (e) {
      this.setting.timerStyle.color = e.target.value
      this.save('timerStyle', this.setting.timerStyle)
    }
  },
  props: ['setting'],
  mounted () {
    this.changeTime(this.setting.tiemMoment)
    setTimeout(() => {
      this.interval = setInterval(this.time, 1000)
    }, 1000 - new Date().getMilliseconds()) // Millisecond 맞춤
  }
}
</script>

<style lang="scss">
.time-example>tbody>tr>td {
  word-break: keep-all;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
