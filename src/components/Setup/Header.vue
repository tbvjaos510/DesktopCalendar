<template>
  <vk-sticky>
    <vk-card class="setting-header" type="default" padding="small">
      <img src="icon.png" alt="Desktop Calendar" id="top-icon" />
      <span class="uk-h3">Desktop Calendar</span>
    </vk-card>
  </vk-sticky>
</template>

<script>
export default {
  name: "start-header"
};
</script>

<style lang="scss">
#top-icon {
  width: 50px;
}
.start-header {
  box-shadow: none !important;
}
</style>
