<template>
  <div class="uk-margin-large-top uk-text-center">
    <span class="uk-text-lead">달력 종류 선택 </span>
    <br />
    <table class="uk-table uk-margin-remove-top">
      <thead>
        <tr>
          <th class="uk-text-center">
            <input
              type="radio"
              v-model="types"
              class="uk-radio"
              name="Views"
              id="monthView"
              value="month"
            />
            <label for="monthView">한 달</label>
          </th>
          <th class="uk-text-center">
            <input
              type="radio"
              v-model="types"
              class="uk-radio"
              name="Views"
              id="weekView"
              value="week"
            />
            <label for="weekView">3주</label>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <img class="uk-width-4-5" src="month.png" />
          </td>
          <td>
            <img class="uk-width-4-5" src="black.png" />
          </td>
        </tr>
      </tbody>
    </table>

    <vk-button
      class="uk-position-medium uk-position-top-right"
      type="primary"
      size="small"
      uk-slideshow-item="4"
      >다음</vk-button
    >
  </div>
</template>

<script>
export default {
  name: "start-type",
  data() {
    return {
      types: ""
    };
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
    this.types = this.settings.calendarType;
  },
  watch: {
    types(newval, old) {
      this.$store.commit("setOptions", {
        key: "calendarType",
        value: newval
      });
    }
  }
};
</script>

<style></style>
