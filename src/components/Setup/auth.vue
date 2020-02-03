<template>
  <div>
    <div class="uk-margin-large-top uk-text-center">
      <div v-if="!isAuthed">
        <p class="uk-text-lead">
          동기화하려면 Google 계정 로그인이 필요합니다.
        </p>
        <vk-button type="primary" size="small" @click="auth">로그인</vk-button>
      </div>
      <div v-else-if="!calendarList.length">
        목록 불러오는 중 <vk-spinner />
      </div>
      <div class="uk-width-large uk-align-center" v-else>
        <p class="uk-text-lead">
          사용할 달력을 선택하세요.
          <vk-button
            class="uk-position-medium uk-position-top-right"
            type="primary"
            size="small"
            uk-slideshow-item="2"
            @click="save"
            >다음</vk-button
          >
        </p>
        <ul class="uk-list uk-list-divider uk-width-1-1 uk-text-left itemlist">
          <li v-for="key in calendarList" :key="key">
            <input
              type="checkbox"
              class="uk-checkbox"
              v-model="key.checked"
              :disabled="key.isprimary"
            />
            <span v-vk-tooltip="key.isprimary ? '기본 달력입니다' : null">{{
              key.summary
            }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../Calendar/GoogleApi/api.js";
import fs from "fs";
export default {
  name: "start-auth",
  data() {
    return {
      isAuthed: false,
      calendarList: []
    };
  },
  methods: {
    auth() {
      api.authorize(key => {
        this.isAuthed = true;
        this.$http.defaults.headers.common["Authorization"] = "Bearer " + key;
        api.setAxios(this.$http);
        api.calendarList(res => {
          // console.log(res)
          this.calendarList = res.data.items.map(function(item) {
            var o = Object.assign({}, item);
            o.checked = true;
            if (item.primary) o.isprimary = true;
            return o;
          });
        });
      });
    },
    save() {
      fs.writeFile(
        this.appdata + "/calendar.json",
        JSON.stringify(this.calendarList),
        function(err) {
          if (err) console.error(err);
          // console.log('calendar save success')
        }
      );
    }
  }
};
</script>

<style lang="scss">
.itemlist {
  height: 300px;
  overflow: scroll;
}
</style>
