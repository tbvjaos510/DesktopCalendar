export default {
  state: {
    gevents: []
  },
  getter: {
    getEvents (state) {
      return state.gevents
    }
  },
  mutations: {
    setEvents (state, payload) {
      return (state.gevents = payload)
    }
  },
  actions: {
    addEvents ({commit}) {

    }
  }
}
