export default {
  state: {
    options: {
      timeMoment: 'LTS',
      timerStyle: {
        color: 'black',
        weight: '600',
        size: '6em'
      },
      calendar: {
        background: {
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 0.3
          }
        },
        color: {
          rgba: {
            r: 0,
            g: 0,
            b: 0,
            a: 1
          }
        },
        buttonType: 'primary'
      }
    }
  },
  getters: {
    getOptions: state => index => state.options[index],
    getAll: state => state.options
  },
  mutations: {
    setOptions: (state, payload) => (state.options[payload.key] = payload.value)
  }
}
