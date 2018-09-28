<template>
  
</template>

<script>
import storage from 'electron-json-storage'
// import private File (google calendar api key)
import credentials from './../../../../private/credentials.json'
export default {
  name: 'auth',
  methods: {
    getToken () {
      storage.get('auth', (err, data) => {
        if (err) return console.error(err)
        if (Object.keys(data).length) return data
        else {
          if (!credentials.installed) {
            return console.error('Credentials not found')
          }
        }
      })
    }
  },
  mounted () {
    this.getToken()
  }
}
</script>

<style>

</style>
