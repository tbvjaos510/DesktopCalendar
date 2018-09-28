<template>
  <div id='calendar'>
    <auth />
  </div>
</template>

<script>
import 'fullcalendar'
import $ from 'jquery'
import Auth from './GoogleApi/Auth'
export default {
  name: 'calendar',
  mounted () {
    $('#calendar').fullCalendar({
      defaultView: 'week',
      header: {
        left: '',
        center: 'title',
        right: ''
      },
      events: [
        {
          title: 'My Event',
          start: '2018-09-30',
          descriptiion: 'Good!'
        }
      ],
      themeSystem: 'bootstrap4',
      locale: 'ko',
      height: 600,
      views: {
        week: {
          type: 'basic',
          duration: { weeks: 3 }
        }
      }
    })
    window.Fcalendar = $('#calendar').fullCalendar('getCalendar')
  },
  components: {
    Auth
  }

}
</script>

<style lang="scss">
@import url('lib/fullcalendar.css');

#calendar{
  padding: 0 20%;
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
</style>
