// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueProgressBar from 'vue-progressbar'

import App from './App'

import store from '@/store'
import router from './router'

// https://github.com/FortAwesome/vue-fontawesome
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import fontawesome from '@fortawesome/fontawesome'

import faChevronUp from '@fortawesome/fontawesome-free-solid/faChevronUp'
import faChevronDown from '@fortawesome/fontawesome-free-solid/faChevronDown'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faExclamation from '@fortawesome/fontawesome-free-solid/faExclamationCircle'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'

import promiseFinally from 'promise.prototype.finally'
promiseFinally.shim()

fontawesome.library.add(faChevronUp)
fontawesome.library.add(faChevronDown)
fontawesome.library.add(faEdit)
fontawesome.library.add(faExclamation)
fontawesome.library.add(faSpinner)
fontawesome.library.add(faTrashAlt)

Vue.use(BootstrapVue)
Vue.use(VueProgressBar)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App, FontAwesomeIcon},
  template: '<App/>'
})
