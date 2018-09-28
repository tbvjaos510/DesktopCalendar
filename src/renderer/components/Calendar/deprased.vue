<template>

  <v-app id="dayspan" v-cloak>
    <ds-calendar :calendar="calendar"></ds-calendar>
  </v-app>
</template>

<script>
import { Calendar } from 'dayspan'
global.Calendar = Calendar
const monthView = Calendar.months()
// monthView.size = 50
// console.log(monthView.days)
export default {
  name: 'calendar',
  data () {
    return {
      calendar: monthView
    }
  }
}
</script>

<style lang="scss">

</style>
