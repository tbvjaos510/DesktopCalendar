<template>
  <div class="uk-padding-large uk-padding-remove-top">
    <h2>Calendar 설정</h2>
    <span class="uk-text-muted">
      <vk-button type="primary" size="small" @click="deleteToken">
        다른 계정으로 로그인
      </vk-button>
      
    </span>
  </div>
</template>

<script>
import fs from 'fs'
export default {
  name: 'setting-calendar',
  methods: {
    deleteToken () {
      fs.unlink('token.json', (err) => {
        if (err) return console.error(err)
        this.parents.webContents.reload()
      })
    }
  },
  props: ['setting', 'parents']
}
</script>

<style>

</style>
