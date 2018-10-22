<template>
  <div id='calendar'>
    <div class="uk-button-group calendar-head-left"> 
      <vk-button type="primary" class="uk-button-small" @click="reloadEvent" v-vk-tooltip="'새로고침'" id="reload-btn">새로고침</vk-button>
      <vk-button type="primary" class="uk-button-small">
        <vk-icon icon="calendar" v-vk-tooltip="'Google Calendar 열기'" @click="$bus.emit('loadURL', 'https://calendar.google.com/')"/>
      </vk-button>
      <vk-button type="primary" class="uk-button-small" v-vk-tooltip="'설정을 엽니다.'" id="createOption" @click="loadSetting" >
        <vk-icon icon="settings"/>
      </vk-button>
      <vk-button type="primary" class="uk-button-small" v-vk-tooltip="'Event 추가'" @click="showAdd = true">
        <vk-icon icon="plus" />
      </vk-button>
      <vk-drop mode="click">
        <vk-card padding="small" class="event-add">
          <fieldset class="uk-fieldset">
            <input type="text" placeholder="제목 입력" class="uk-input">
            <p class="uk-margin-top">
              시작
              <datetime type="datetime" input-class="uk-width" use12-hour="true"/>
              <!-- <input type="datetime-local" :value="new Date().toISOString().split('.')[0]"> -->
            </p>
          </fieldset>
        </vk-card>
      </vk-drop>
      <vk-button type="primary" class="uk-button-small" v-vk-tooltip="'Calendar을 움직입니다.'">
        <vk-icon icon="move" style="-webkit-app-region: drag;" ></vk-icon>
      </vk-button>
    </div>
    
    <div class="uk-button-group calendar-head-right">
      <vk-button type="primary" class="uk-button-small" @click="Fcalendar.prev();reloadEvent();"><vk-icon icon="chevron-left"/></vk-button>
      <vk-button type="primary" class="uk-button-small" @click="Fcalendar.today();reloadEvent();"><vk-icon icon="clock"/></vk-button>
      <vk-button type="primary" class="uk-button-small" @click="Fcalendar.next();reloadEvent();"><vk-icon icon="chevron-right"/></vk-button>
    </div>
    <events v-show="show" :Fcalendar="Fcalendar" :event="eventValue" :show="show"/>
  </div>
</template>

<script>
import { moment } from 'fullcalendar'
import events from './GoogleApi/event'
const remote = require('electron').remote
const { BrowserWindow } = remote
const $ = window.$
window.moment = moment
export default {
  name: 'calendar',
  data () {
    return {
      Fcalendar: null,
      show: false,
      eventValue: {},
      notifys: [],
      showAdd: false
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
        ? `http://localhost:9080`
        : `file://${__dirname}/index.html`
      let settingWindow = new BrowserWindow({
        parent: remote.getCurrentWindow(),
        frame: true,
        focusable: true,
        title: 'Desktop Calendar 설정',
        skipTaskbar: false,
        webPreferences: { webSecurity: false },
        show: false
      })
      settingWindow.setIgnoreMouseEvents(false)
      settingWindow.setMenu(null)
      settingWindow.webContents.openDevTools({
        mode: 'undocked'
      })
      settingWindow.loadURL(mainPath)
      settingWindow.webContents.once('did-finish-load', () => {
        settingWindow.webContents.send('setting')
        settingWindow.webContents.send('init-options', (this.$store.getters.getAll))
      })
      settingWindow.on('close', (e) => {
        $('#createOption').prop('disabled', false)
        settingWindow = null
      })
    }
  },
  mounted () {
    $('#calendar').fullCalendar({
      defaultView: 'week',
      header: {
        left: '',
        center: 'title',
        right: ''
      },
      themeSystem: 'bootstrap4',
      locale: 'ko',
      height: 600,
      views: {
        week: {
          type: 'basic',
          duration: { weeks: 3 }
        }
      },
      eventMouseover: (event, jsevent) => {
        event.top = jsevent.currentTarget.getBoundingClientRect().top + jsevent.currentTarget.getBoundingClientRect().height
        event.left = jsevent.currentTarget.getBoundingClientRect().left
        this.eventValue = event
        this.show = true
      },
      eventMouseout: (event, jsevent) => {
        this.show = false
      },
      timeFormat: 'AH:mm'
    })
    window.Fcalendar = this.Fcalendar = $('#calendar').fullCalendar('getCalendar')
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
  },
  components: {
    events
  }

}
</script>

<style lang="scss">
@import url('lib/fullcalendar.css');
// @import url('lib/calendarTheme.scss');

$side-margin: 20%;
#calendar{
  position: relative;
  padding: 0 $side-margin;
  background-clip: content-box;
  height: 700px;
  .fc-view-container{
    background: rgba(255, 255, 255, 0.4);
  }
}
.fc-today{
    background: rgba(215, 240, 247, 0.6);
}

.calendar-head-left {
  position: absolute !important;
  top: 1%;
}

.calendar-head-right {
  @extend .calendar-head-left;
  right: $side-margin;
}

.event-add {
  
}
</style>
