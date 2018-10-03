<template>
  <vk-sticky>
    <vk-card class="setting-header" type="default" padding="small">
      <img src="static/icon.png" alt="Desktop Calendar" id="main-icon">
      <span class="uk-h3">Desktop Calendar 설정</span> 
    </vk-card>
  </vk-sticky>
</template>

<script>
export default {
  name: 'setting-header'
}
</script>

<style lang="scss">
#main-icon {
  width: 50px;
}
.setting-header {
  box-shadow:none !important;
}
</style>
