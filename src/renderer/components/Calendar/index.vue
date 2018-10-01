<template>
  <div id='calendar'>
    <div class="uk-button-group calendar-head-left"> 
      <vk-button type="primary" class="uk-button-small" @click="reloadEvent" id="reload-btn">새로고침</vk-button>
      <vk-button type="primary" class="uk-button-small"><vk-icon icon="calendar" title="Google Calendar 열기" @click="$bus.emit('loadURL', 'https://calendar.google.com/')"/></vk-button>
    </div>
    <div class="uk-button-group calendar-head-right">
      <vk-button type="primary" class="uk-button-small" @click="Fcalendar.prev();reloadEvent();"><vk-icon icon="chevron-left"/></vk-button>
      <vk-button type="primary" class="uk-button-small" @click="Fcalendar.today();reloadEvent();"><vk-icon icon="clock"/></vk-button>
      <vk-button type="primary" class="uk-button-small" @click="Fcalendar.next();reloadEvent();"><vk-icon icon="chevron-right"/></vk-button>
    </div>
    <events v-show="show" :Fcalendar="Fcalendar" :event="eventValue"/>
  </div>
</template>

<script>
import 'fullcalendar'
import $ from 'jquery'
import events from './GoogleApi/event'
export default {
  name: 'calendar',
  data () {
    return {
      Fcalendar: null,
      show: false,
      eventValue: {}
    }
  },
  methods: {
    reloadEvent (event) {
      $('#reload-btn').prop('disabled', true)
      this.$bus.once('reloadEnd', () => {
        $('#reload-btn').prop('disabled', false)
      })
      this.$bus.$emit('forceReload')
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

$side-margin: 20%;
#calendar{
  position: relative;
  padding: 0 $side-margin;
  background-clip: content-box;
  height: 700px;
  .fc-view-container{
    // color:black;
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
</style>
