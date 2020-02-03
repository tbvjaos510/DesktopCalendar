export default {
  state: {
    options: {
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
        buttonType: "primary"
      },
      calendarType: "week",
      calendarHeight: "0.7",
      refreshTime: 600
    }
  },
  getters: {
    getOptions: state => index => state.options[index],
    getAll: state => state.options
  },
  mutations: {
    setOptions: (state, payload) =>
      (state.options[payload.key] = payload.value),
    setAll: (state, payload) => (state.options = payload)
  }
};
