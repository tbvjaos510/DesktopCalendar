<template>
  <vk-card
    class="uk-card-small"
    id="gcal-event"
    :style="{
      borderTopColor: event.color,
      top: event.top + 'px',
      left: event.left + 'px'
    }"
    @mouseover="setIgnore"
    @mouseout="disableIgnore"
  >
    <div slot="header" style="padding: 0">
      <vk-icon-link
        id="open-google-calendar"
        icon="google"
        class="uk-position-top-right uk-padding-small uk-border-circle google-button"
        v-vk-tooltip="'Google Calendar에서 엽니다.'"
        v-on:click="openGCal()"
      />
      <vk-card-title
        class="uk-margin-small-top gcal-title uk-margin-remove-bottom"
        >{{ event.title }}</vk-card-title
      >
      <p class="uk-text-meta uk-margin-remove-top">
        {{
          event.organizer
            ? event.organizer.displayName || event.organizer.email
            : ""
        }}
      </p>
      <p
        class="uk-text-meta uk-margin-remove timeShow"
        v-vk-tooltip="'클릭으로 보기 변경'"
        @click="timeShow = true"
        v-if="!timeShow"
      >
        <vk-icon v-if="timePast" icon="history"></vk-icon>
        <vk-icon v-else icon="future"></vk-icon>
        <time>{{ getFromNow() }}</time>
      </p>
      <div
        v-vk-tooltip="'클릭으로 보기 변경'"
        v-if="timeShow"
        @click="timeShow = false"
      >
        <p class="uk-text-meta uk-margin-remove timeShow">
          <time>{{
            event.start ? event.start.format("YYYY-MM-DD A h:mm:ss") : ""
          }}</time>
        </p>
        <p class="uk-text-meta uk-margin-remove timeShow">
          <time
            >~
            {{
              event.end ? event.end.format("YYYY-MM-DD A h:mm:ss") : ""
            }}</time
          >
        </p>
      </div>
    </div>
    <vk-icon-link
      v-if="!isDelete"
      icon="trash"
      class="uk-float-right"
      v-vk-tooltip="'이벤트 삭제'"
      @click="deleteEvent"
    ></vk-icon-link>
    <vk-spinner v-else ratio="0.7" class="uk-float-right"></vk-spinner>
    <div
      v-if="deleteError"
      class="uk-alert uk-alert-danger uk-padding-small"
      uk-alert
    >
      <p>삭제에 실패하였습니다.</p>
    </div>
    <p class="gcal-body markdown-body" v-html="getDescription" v-linkified />
  </vk-card>
</template>

<script>
import * as auth from "./api.js";
import fs from "fs";
import { shell } from "electron";
const api = auth.default;
export default {
  name: "event",
  data() {
    return {
      gcolor: null,
      timeShow: false,
      timePast: false,
      isDelete: false,
      deleteError: false,
      isUpdate: false,
      refreshInterval: null
    };
  },
  methods: {
    addEvent(events, color) {
      var data = events.map(e => {
        return {
          e,
          id: e.id,
          title: e.summary,
          start: e.start.dateTime || e.start.date,
          end: e.end.dateTime || e.end.date,
          color: e.colorId
            ? this.gcolor.event[e.colorId].background
            : color.background,
          organizer: e.organizer,
          description: e.description || null,
          created: e.created
        };
      });
      this.Fcalendar.renderEvents(data);
    },
    openGCal() {
      this.openExternal(this.event.e.htmlLink);
    },
    openExternal(link) {
      shell.openExternal(link);
      return false;
    },
    init() {
      var colors = {};
      api.setAxios(this.$http);
      api.authorize(key => {
        this.$http.defaults.headers.common["Authorization"] = "Bearer " + key;
        api.colors(color => {
          this.gcolor = color.data;
          fs.readFile(this.appdata + "/calendar.json", (err, res) => {
            if (err) return console.error(err);
            const calendars = JSON.parse(res);
            // console.log(calendars)
            this.Fcalendar.removeEvents();
            for (const cal of calendars) {
              if (!cal.checked) continue;
              // console.log(cal)
              colors[cal.id] = this.gcolor.calendar[cal.colorId];
              api.events(
                cal.id,
                this.Fcalendar.view.start,
                this.Fcalendar.view.end,
                events => {
                  if (!events) return 0;
                  this.addEvent(events.data.items, colors[cal.id]);
                }
              );
            }
            this.$bus.emit("reloadEnd");
          });
        });
      });
    },
    getFromNow() {
      const start = this.event.start;
      const end = this.event.end;
      const now = new Date();
      now.setHours(now.getHours() + 9);
      if (!start) return "";
      if (start.diff(now) > 0 || !end) {
        this.timePast = false;
        return start.locale("ko").fromNow() + "에 시작";
      } else if (end.diff(now) > 0) {
        this.timePast = false;
        return end.locale("ko").fromNow() + "에 종료";
      } else {
        this.timePast = true;
        return end.locale("ko").fromNow() + "에 종료됨";
      }
    },
    deleteEvent() {
      this.isDelete = true;
      api.deleteEvent(this.event.organizer.email, this.event.id, req => {
        this.isDelete = false;
        if (req && req.status === 204) {
          this.$parent.show = false;
          this.Fcalendar.removeEvents(this.event.id);
        } else {
          this.deleteError = true;
          setTimeout(() => {
            this.deleteError = false;
          }, 2000);
        }
      });
    },
    insertEvent(calendarid, timeType, start, end, title, content, colorid, cb) {
      api.insertEvent(
        calendarid,
        timeType,
        start,
        end,
        title,
        content,
        colorid,
        req => {
          if (req) {
            this.addEvent([req], { background: "#FFFFFF" });
            cb(req);
          }
        }
      );
    }
  },
  mounted() {
    this.init();
    this.$bus.$on("loadURL", url => {
      this.openExternal(url);
    });
    this.refreshInterval = setInterval(this.init, this.getRefresh * 1000);
    this.$bus.$on("forceReload", () => {
      this.init();
    });
  },
  computed: {
    getDescription() {
      return (
        this.event.description &&
        this.event.description.replace("&lt;", "<").replace("&gt;", ">")
      );
    },
    getRefresh() {
      return this.$store.getters.getOptions("refreshTime");
    }
  },
  watch: {
    getRefresh(oldValue, newValue) {
      if (oldValue !== newValue) {
        clearInterval(this.refreshInterval);
        setInterval(this.init, newValue * 1000);
        // console.log('refresh Interval')
      }
    }
  },
  props: ["Fcalendar", "event"]
};
</script>

<style lang="scss">
#gcal-event {
  position: fixed;
  display: inline-block;
  min-width: 230px;
  max-width: 400px;
  top: 50px;
  z-index: 10;
  border-top: 6px solid green;
}
.google-button:hover {
  background: lightgray;
}
.google-button {
  border-radius: 30px;
}
.gcal-body {
  word-wrap: break-word;
}
.gcal-title {
  max-width: 90%;
}
</style>
