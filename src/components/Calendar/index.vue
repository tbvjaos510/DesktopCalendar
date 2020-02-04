<template>
  <div id='calendar'>
    <div class='uk-button-group calendar-head-left'> 
      <vk-button :type='getCalendarOption.buttonType' class='uk-button-small' @click='reloadEvent' v-vk-tooltip="'새로고침'" id='reload-btn' @mouseover="setIgnore" @mouseout="disableIgnore">새로고침</vk-button>
      <vk-button :type='getCalendarOption.buttonType' class='uk-button-small' @mouseover="setIgnore" @mouseout="disableIgnore">
        <vk-icon icon='calendar' v-vk-tooltip="'Google Calendar 열기'" @click="$bus.emit('loadURL', 'https://calendar.google.com/')"/>
      </vk-button>
      <vk-button :type='getCalendarOption.buttonType' class='uk-button-small' v-vk-tooltip="'설정을 엽니다.'" id='createOption' @click='loadSetting'  @mouseover="setIgnore" @mouseout="disableIgnore" >
        <vk-icon icon='settings'/>
      </vk-button>
      <vk-button :type='getCalendarOption.buttonType' class='uk-button-small' v-vk-tooltip="'Event 추가'" ref="addEventBtn" @click='showAdd = true'  @mouseover="setIgnore" @mouseout="disableIgnore">
        <vk-icon icon='plus' />
      </vk-button>
      <vk-drop mode='click' ref="eventAddDrop">
        <vk-card padding='small' class='event-add' @mouseover="setIgnore" @mouseout="disableIgnore">
          <fieldset class='uk-fieldset'>
            달력
            <select v-model="calendarid" v-if="calendarids" class="uk-select uk-form-small">
              <option v-for="(data) in calendarids" :key="data" v-if="data.accessRole == 'owner' || data.accessRole == 'writer'" :value="data.id">
                {{ data.summary }}
              </option>
            </select>
            제목
            <input type='text' placeholder='제목 입력' class='uk-input' v-model='summary'>
            <p class='uk-margin-small-top'>
              설명
              <textarea class='uk-textarea uk-height-small uk-resize-vertical uk-height-max-medium' v-model='description'/>
              <a class="uk-text-muted uk-float-right uk-text-small" @click="$bus.emit('loadURL', 'https://gist.github.com/ihoneymon/652be052a0727ad59601#2-%EB%A7%88%ED%81%AC%EB%8B%A4%EC%9A%B4-%EC%82%AC%EC%9A%A9%EB%B2%95%EB%AC%B8%EB%B2%95')">Markdown 형식</a>
            </p>
            <p class='uk-margin-small-top'>
              시간 종류 <select class="uk-select uk-width-1-3 uk-form-small" v-model="timeType">
                <option>날짜</option>
                <option>날짜-시간</option>
              </select> <br>
              시작
              <datetime v-model='startTime' v-if="timeType == '날짜'" :phrases="{ok: '확인', cancel: '취소'}" type="date"  input-class='uk-width color-input' :use12-hour='true'/>
              <datetime v-model='startTime' v-else :phrases="{ok: '확인', cancel: '취소'}" type="datetime"  input-class='uk-width color-input' :use12-hour='true'/>
              
            </p>
            <p class='uk-margin-small-top'>
              종료
              <datetime v-model='endTime' v-if="timeType == '날짜'" :phrases="{ok: '확인', cancel: '취소'}" type="date"  input-class='uk-width' :use12-hour='true'/>
              <datetime v-model='endTime' v-else :phrases="{ok: '확인', cancel: '취소'}" type="datetime"  input-class='uk-width' :use12-hour='true'/>
            </p>
            <p class='uk-margin-small-top'>
              <div v-for="(color, i) in gcolor" v-bind:key="color" :style="{background : color.background}" class="event-color" :class="{eventcolorselect: colorid == i}" @click="colorid = i">
                <vk-icon v-if="colorid == i" ratio="1.3" icon="check" class="icon-custom" />
              </div>
            </p>
            <vk-button :type='getCalendarOption.buttonType' v-vk-tooltip="startTime ? '이벤트를 추가합니다.' : '시작 시간을 정해 주십시오.'" @click='insertEvent' :disabled="!startTime">추가</vk-button>
          </fieldset>
        </vk-card>
      </vk-drop>
      <vk-button :type='getCalendarOption.buttonType' class='uk-button-small' v-vk-tooltip="'Calendar을 움직입니다.'"  @mouseover="setIgnore" @mouseout="disableIgnore">
        <vk-icon icon='move' style='-webkit-app-region: drag;' />
      </vk-button>
    </div>
    
    <div class='uk-button-group calendar-head-right' @mouseover="setIgnore" @mouseout="disableIgnore">
      <vk-button :type='getCalendarOption.buttonType' class='uk-button-small' @click='Fcalendar.prev();reloadEvent();'><vk-icon icon='chevron-left'/></vk-button>
      <vk-button :type='getCalendarOption.buttonType' class='uk-button-small' @click='Fcalendar.today();reloadEvent();'><vk-icon icon='clock'/></vk-button>
      <vk-button :type='getCalendarOption.buttonType' class='uk-button-small' @click='Fcalendar.next();reloadEvent();'><vk-icon icon='chevron-right'/></vk-button>
    </div>
    <events v-show='show' :Fcalendar='Fcalendar' :event='eventValue' :show='show' ref='eventform'/>
  </div>
</template>

<script>
import { moment } from 'fullcalendar'
import events from './GoogleApi/event'
import fs from 'fs'
const Showdown = require('showdown')
const remote = require('electron').remote
const { BrowserWindow } = remote
const $ = window.$
const converter = new Showdown.Converter()
window.moment = moment
export default {
  name: 'calendar',
  data () {
    return {
      Fcalendar: null,
      show: false,
      eventValue: {},
      notifys: [],
      showAdd: false,
      summary: '',
      description: '',
      calendarid: '',
      startTime: null,
      endTime: '',
      colorid: 1,
      timeType: '날짜',
      gcolor: [
        {
          'background': '#a4bdfc',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#7ae7bf',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#dbadff',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#ff887c',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#fbd75b',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#ffb878',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#46d6db',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#e1e1e1',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#5484ed',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#51b749',
          'foreground': '#1d1d1d'
        },
        {
          'background': '#dc2127',
          'foreground': '#1d1d1d'
        }
      ],
      calendarids: null
    }
  },
  methods: {
    reloadEvent (event) {
      $('#reload-btn').prop('disabled', true)
      this.$bus.once('reloadEnd', () => {
        $('#reload-btn').prop('disabled', false)
      })
      this.$bus.$emit('forceReload')
    },
    loadSetting (refreshBtn) {
      $('#createOption').prop('disabled', true)
      const mainPath = process.env.NODE_ENV === 'development'
        ? `http://localhost:9080/#/setting`
        : `file://${__dirname}/index.html#setting`
      let settingWindow = new BrowserWindow({
        parent: remote.getCurrentWindow(),
        frame: true,
        focusable: true,
        title: 'Desktop Calendar 설정',
        skipTaskbar: false,
        webPreferences: { webSecurity: false }
      })
      settingWindow.setSkipTaskbar(false)
      settingWindow.setMenu(null)
      if (this.DevMode()) {
        settingWindow.webContents.openDevTools({
          mode: 'undocked'
        })
      }
      settingWindow.loadURL(mainPath)
      settingWindow.webContents.once('did-finish-load', () => {
        settingWindow.webContents.send('init-options', (this.$store.getters.getAll))
        settingWindow.setIgnoreMouseEvents(false)
        settingWindow.focus()
      })
      settingWindow.on('close', (e) => {
        $('#createOption').prop('disabled', false)
        settingWindow = null
      })
    },
    insertEvent (e) {
      this.$refs.eventAddDrop.hide()
      let resultHtml = converter.makeHtml(this.description)
      this.$refs.eventform.insertEvent(this.calendarid, this.timeType === '날짜', this.startTime, this.endTime, this.summary, resultHtml, this.colorid + 1, (e) => {
        if (e) console.log(e)
      })
      this.startTime = this.endTime = this.summary = this.description = ''
      this.startType = this.endType = '날짜'
      this.colorid = 1
    },
    ignoreMouse () {
      window.disableMouse()
    },
    convertRGBA (rgba) {
      return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
    },
    addEventDate (e) {
      this.$refs.eventAddDrop.show()
      this.startTime = e
    },
    addPlusBtn () {
      const plusbtn = document.createElement('a')
      plusbtn.setAttribute('uk-icon', 'plus-circle')
      plusbtn.onmouseover = this.setIgnore
      plusbtn.onmouseout = this.disableIgnore
      plusbtn.style.marginLeft = '2px'

      $('.fc-day').hover((e) => {
        if (e.type === 'mouseleave') {
          e.currentTarget.removeChild(plusbtn)
        } else if (e.type === 'mouseenter') {
          plusbtn.onclick = () => this.addEventDate(e.currentTarget.getAttribute('data-date'))
          e.currentTarget.appendChild(plusbtn)
        }
      })
    },
    calendarList () {
      fs.readFile(this.appdata + '/calendar.json', (err, res) => {
        if (err) return console.error(err)
        res = JSON.parse(res)
        this.calendarids = res
        res.forEach((value) => {
          if (value.primary) this.calendarid = value.id
        })
      })
    }
  },
  mounted () {
    $('#calendar').fullCalendar({
      defaultView: this.$store.getters.getOptions('calendarType'),
      header: {
        left: '',
        center: 'title',
        right: ''
      },
      themeSystem: 'bootstrap4',
      locale: 'ko',
      height: window.outerHeight * this.getCalendarHeight,
      eventLimit: false,
      views: {
        week: {
          type: 'basic',
          duration: { weeks: 3 }
        }
      },
      viewRender: (view) => {
        this.addPlusBtn()
      },
      eventMouseover: (event, jsevent) => {
        if (this.$refs.eventform.isDelete) {
          return 0
        }
        event.top = jsevent.currentTarget.getBoundingClientRect().top + jsevent.currentTarget.getBoundingClientRect().height
        event.left = jsevent.currentTarget.getBoundingClientRect().left
        this.eventValue = event
        this.show = true
        // console.log(event)
      },
      eventMouseout: (event, jsevent) => {
        this.show = false
      },
      timeFormat: 'AH:mm',
      dayPopoverFormat: 'MM월 DD일 dddd',
      eventLimitText: '더보기'
    })
    window.Fcalendar = this.Fcalendar = $('#calendar').fullCalendar('getCalendar')
    window.onresize = (e) => {
      $('#calendar').fullCalendar('option', 'height', window.outerHeight * 0.7)
    }
    $('#gcal-event').on('mouseover', () => {
      this.show = true
    })
    $('#gcal-event').on('mouseleave', () => {
      this.show = false
    })
    $(document).on('click', '.gcal-body a', (e) => {
      e.preventDefault()
      this.$bus.$emit('loadURL', e.currentTarget.href)
      return false
    })
    $('#calendar, .fc-center>h2').css('color', this.convertRGBA(this.getCalendarOption.color.rgba || this.getCalendarOption.color))
    $('#calendar ').css('background-color', this.convertRGBA(this.getCalendarOption.background.rgba || this.getCalendarOption.background))

    this.calendarList()
  },
  computed: {
    getCalendarOption () {
      return this.$store.getters.getOptions('calendar')
    },
    getCalendarType () {
      return this.$store.getters.getOptions('calendarType')
    },
    getCalendarHeight () {
      return this.$store.getters.getOptions('calendarHeight')
    }
  },
  components: {
    events
  },
  watch: {
    'startTime': function (newval, old) {
      this.endTime = newval
    },
    getCalendarOption (newval, old) {
      $('#calendar, .fc-center>h2').css('color', this.convertRGBA(newval.color.rgba || newval.color))
      $('#calendar').css('background-color', this.convertRGBA(newval.background.rgba || newval.background))
    },
    getCalendarType (newval, old) {
      $('#calendar').fullCalendar('changeView', newval)
      this.$bus.$emit('forceReload')
    },
    getCalendarHeight (newval, old) {
      $('#calendar').fullCalendar('option', 'height', window.outerHeight * newval)
    }
  }
}
</script>

<style lang='scss'>
@import url('lib/fullcalendar.css');
// Use Github Markdown Style Sheet
@import url('lib/github-markdown.css');
// @import url('lib/calendarTheme.scss');

$side-margin: 20%;
#calendar{
  position: relative;
  padding: 0 $side-margin;
  background-clip: content-box;
  height: 65%;
}
.fc-today{
    background: rgba(215, 240, 247, 0.6);
}

.calendar-head-left {
  position: absolute !important;
  top: 0%;
}

.calendar-head-right {
  @extend .calendar-head-left;
  right: $side-margin;
}

.event-color {
  width:40px;
  height:40px;
  border-radius: 30px;
  margin: 3px 5.5px;
  text-align: center;
  display:inline-block !important;
}

.event-color:hover {
  box-shadow: 0 0 3px 1px #a8a8a8;
}

.colorhighlighted {
  border: 1px black solid;
}

.icon-custom {
  transform: translate(-12px, 7px);
  position:absolute;
  color:black;
}
.fc-more-popover {
  background:white;
}
/*Allow pointer-events through*/
.fc-slats, /*horizontals*/
.fc-content-skeleton, /*day numbers*/
.fc-bgevent-skeleton /*events container*/{
    pointer-events:none
}
/*Turn pointer events back on*/
.fc-bgevent,
.fc-event-container{
    pointer-events:auto; /*events*/
}
.fc-center, .fc-day-header > span, .fc-day-number, #reload-btn{
  user-select: none;
}
.fc-scroller {
   overflow-y: visible !important;
}
</style>
