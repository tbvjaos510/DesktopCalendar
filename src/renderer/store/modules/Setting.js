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
        background: '#00000066'
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
