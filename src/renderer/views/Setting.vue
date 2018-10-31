<template>
  <div class="uk-padding-small" id="setting-main">
    <setting-header />
    <setting-timer :setting="settings"/>
    <setting-calendar :setting="settings" :parents="parents"/>
    <setting-program :setting="settings"/>
  </div>
</template>

<script>
import SettingHeader from '../components/Settings/Header'
import SettingTimer from '../components/Settings/SettingTimer'
import SettingCalendar from '../components/Settings/SettingCalendar'
import SettingProgram from '../components/Settings/SettingProgram'
import { ipcRenderer, remote } from 'electron'
var settings = {
  timeMoment: 'LTS',
  timerStyle: {
    color: 'black',
    weight: '600',
    size: '6em'
  },
  calendar: {
    background: {
      r: 255,
      g: 255,
      b: 255,
      a: 0.3
    },
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    },
    buttonType: 'primary'
  },
  refreshTime: 600,
  changeOption (key, value) {
    // console.log('changed')
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
      // console.log(store)
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
    SettingCalendar,
    SettingProgram
  }
}
</script>

<style>

</style>
