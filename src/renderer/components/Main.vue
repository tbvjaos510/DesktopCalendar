<template>
  <div>
    <timer />
    <calendar />
  </div>
</template>

<script>
import Timer from './Status/Timer'
import calendar from './Calendar'
export default {
  name: 'Main-page',
  components: {
    Timer,
    calendar
  }
}
</script>

<style lang="scss">

</style>
