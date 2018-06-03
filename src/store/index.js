import Vue from 'vue'
import Vuex from 'vuex'
import servosModule from './servos'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    servos: servosModule
  }
})
