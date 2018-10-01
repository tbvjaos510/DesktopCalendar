<template>
  <vk-card class="uk-card-small" id="gcal-event" :style="{ borderTopColor: event.color, top: (event.top)+'px', left: (event.left)+'px' }" >
    <div slot="header" style="padding: 0">
     <vk-icon-link id="open-google-calendar" icon="google" 
     class="uk-position-top-right uk-padding-small uk-border-circle google-button" 
     title="Google Calendar에서 엽니다." v-on:click="openGCal()"/>
      <vk-card-title class="uk-margin-small-top gcal-title">{{event.title}}</vk-card-title>
      <p class="uk-text-meta uk-margin-remove" @mouseover="timeShow=true" @mouseout="timeShow=false" v-if="!timeShow">
        <vk-icon v-if="timePast" icon="history"></vk-icon>
        <vk-icon v-else icon="future"></vk-icon>
        <time>{{getFromNow()}}</time>
      </p>
      <p class="uk-text-meta uk-margin-remove" v-if="timeShow" @mouseout="timeShow=false"><time>{{event.start?event.start.locale('ko').format('YYYY-MM-DD A h:mm:ss'):''}}</time></p>
      <p class="uk-text-meta uk-margin-remove" v-if="timeShow"><time>~{{event.end?event.end.locale('ko').format('YYYY-MM-DD A h:mm:ss'):''}}</time></p>
    </div>
    <p class="gcal-body" v-html="event.description" v-linkified />
  </vk-card>
</template>

<script>
import * as auth from './api.js'
import { shell } from 'electron'
const api = auth.default
export default {
  name: 'event',
  data () {
    return {
      gcolor: null,
      timeShow: false,
      timePast: false
    }
  },
  methods: {
    addEvent (events, color) {
      var data = events.map(e => {
        return {
          e,
          id: e.id,
          title: e.summary,
          start: e.start.dateTime || e.start.date,
          end: e.end.dateTime || e.end.date,
          color: color.background,
          organizer: e.organizer,
          description: e.description || null,
          created: e.created
        }
      })
      this.Fcalendar.renderEvents(data)
    },
    getSunday (now) {
      now.setDate((now.getDate() - now.getDay()))
      now.setHours(0, 0, 0, 0)
      return now
    },
    openGCal () {
      this.openExternal(this.event.e.htmlLink)
    },
    openExternal (link) {
      shell.openExternal(link)
      return false
    },
    init () {
      var colors = {}
      api.setAxios(this.$http)
      api.authorize(key => {
        this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + key
        api.colors((res) => {
          this.gcolor = res.data
          api.calendarList((res) => {
            const calendars = res.data.items
            this.Fcalendar.removeEvents()
            for (const cal of calendars) {
              colors[cal.id] = this.gcolor.calendar[cal.colorId]
              api.events(cal.id, this.Fcalendar.view.start, this.Fcalendar.view.end, (events) => {
                if (!events) return console.log('not found')
                this.addEvent(events.data.items, colors[cal.id])
              })
            }
            // catch end
            this.$bus.$once('forceReload', () => {
              console.log('init start')
              this.init()
            })
            this.$bus.emit('reloadEnd')
          })
        })
      })
    },
    getFromNow () {
      const start = this.event.start
      const end = this.event.end
      const now = new Date()
      now.setHours(now.getHours() + 9)
      if (!start) return ''
      if (start.diff(now) > 0) {
        this.timePast = false
        return start.locale('ko').fromNow() + '에 시작'
      } else if (end.diff(now) > 0) {
        this.timePast = false
        return end.locale('ko').fromNow() + '에 종료'
      } else {
        this.timePast = true
        return end.locale('ko').fromNow() + '에 종료됨'
      }
    }
  },
  mounted () {
    this.init()
    this.$bus.$on('loadURL', (url) => {
      this.openExternal(url)
    })
  },
  props: ['Fcalendar', 'event']
}
</script>

<style lang="scss">
#gcal-event {
  position: fixed;
  display: inline-block;
  min-width:230px;
  max-width:400px;
  top: 50px;
  z-index: 10;
  border-top: 6px solid green;
}
.google-button:hover {
  background:lightgray;
}
.google-button {
  border-radius: 10px;
}
.gcal-body {
  word-wrap: break-word;
}
.gcal-title {
  max-width: 90%;
}
</style>

