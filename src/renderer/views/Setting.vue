<template>
  <div class="uk-padding-small" id="setting-main">
    <setting-header />
    <setting-timer :setting="settings"/>
    <setting-calendar :setting="settings" :parents="parents"/>
  </div>
</template>

<script>
import SettingHeader from '../components/Settings/Header'
import SettingTimer from '../components/Settings/SettingTimer'
import SettingCalendar from '../components/Settings/SettingCalendar'
import { ipcRenderer, remote } from 'electron'
var settings = {
  timeMoment: 'LTS',
  timerStyle: {
    color: 'black',
    weight: '600',
    size: '6em'
  },
  calendar: {
    background: 'rgba(255, 255, 255, 0.4)'
  },
  changeOption (key, value) {
    remote.getCurrentWindow().getParentWindow().webContents.send('setOption', {
      key: key,
      value: value
    })
    this[key] = value
  }
}
export default {
  name: 'setting',
  data () {
    return {
      settings: settings,
      parents: remote.getCurrentWindow().getParentWindow().webContents
    }
  },
  mounted () {
    ipcRenderer.on('init-options', (event, store) => {
      console.log(store)
      this.settings = store
      this.settings.changeOption = function (key, value) {
        remote.getCurrentWindow().getParentWindow().webContents.send('setOption', {
          key: key,
          value: value
        })
        this[key] = value
      }
    })
  },
  components: {
    SettingHeader,
    SettingTimer,
    SettingCalendar
  }
}
</script>

<style>

</style>
