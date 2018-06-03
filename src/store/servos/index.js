const store = {
  state: {
    servos: []
  },
  mutations: {
    addServo (state, servo) {
      state.servos.push(servo)
    }
  }
}

export default store
