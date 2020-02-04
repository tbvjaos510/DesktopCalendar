<template>
  <div class="uk-margin-large-top uk-text-center">
    <span class="uk-text-lead">테마 선택 </span>
    <br />
    <span class="uk-text-meta"
      >나중에 설정에서 세부적으로 설정할 수 있습니다.</span
    >
    <table class="uk-table uk-margin-remove-top">
      <thead>
        <tr>
          <th class="uk-text-center">
            <input
              type="radio"
              class="uk-radio"
              name="Designs"
              id="blackdesign"
              checked
              @click="setBlack"
            />
            <label for="blackdesign">Black</label>
          </th>
          <th class="uk-text-center">
            <input
              type="radio"
              class="uk-radio"
              name="Designs"
              id="whitedesign"
              @click="setWhite"
            />
            <label for="whitedesign">White</label>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <img class="uk-width-4-5" src="black.png" />
          </td>
          <td>
            <img class="uk-width-4-5" src="white.png" />
          </td>
        </tr>
      </tbody>
    </table>

    <vk-button
      class="uk-position-medium uk-position-top-right"
      type="primary"
      size="small"
      uk-slideshow-item="3"
      >다음</vk-button
    >
  </div>
</template>

<script>
export default {
  name: "start-design",
  components: {},
  methods: {
    setBlack() {
      this.$store.commit("setAll", {
        timeMoment: "LTS",
        timerStyle: {
          color: "black",
          weight: "600",
          size: "6em"
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
          buttonType: "secondary"
        },
        calendarType: "week",
        calendarHeight: "0.7",
        refreshTime: 600
      });
      console.log("setblack");
      return true;
    },
    setWhite() {
      this.$store.commit("setAll", {
        timeMoment: "LTS",
        timerStyle: {
          color: "white",
          weight: "600",
          size: "6em"
        },
        calendar: {
          background: {
            r: 0,
            g: 0,
            b: 0,
            a: 0.3
          },
          color: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          },
          buttonType: "primary"
        },
        calendarType: "week",
        calendarHeight: "0.7",
        refreshTime: 600
      });
      console.log("setwhite");
      return true;
    }
  },
  computed: {
    settings: {
      get() {
        return this.$store.getters.getAll;
      },
      set(value) {
        this.$store.commit("setAll", value);
      }
    }
  },
  mounted() {
    this.setBlack();
  }
};
</script>

<style></style>
